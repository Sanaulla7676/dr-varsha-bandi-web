const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];

/**
 * Creates an OAuth2 client with the given credentials.
 * Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI in .env
 */
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/google/callback'
  );
}

/**
 * Generate the Google OAuth consent URL
 */
function getAuthUrl(state) {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state: state,
  });
}

/**
 * Exchange authorization code for tokens
 */
async function getTokensFromCode(code) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Create an authenticated Calendar client using stored tokens
 */
function getCalendarClient(tokens) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);

  // Auto-refresh: when access_token expires, googleapis refreshes it automatically
  // if refresh_token is set
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Create a Google Calendar event with a Google Meet link
 */
async function createMeetEvent(tokens, { patientName, appointmentDate, appointmentTime, duration = 30, notes = '' }) {
  const calendar = getCalendarClient(tokens);

  // Parse date and time into a proper ISO datetime
  const startDateTime = parseAppointmentDateTime(appointmentDate, appointmentTime);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

  const event = {
    summary: `Consultation: ${patientName}`,
    description: `Homeopathway Clinical Consultation\nPatient: ${patientName}\n${notes ? `Notes: ${notes}` : ''}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    conferenceData: {
      createRequest: {
        requestId: `hp-meet-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  const result = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
  });

  return {
    eventId: result.data.id,
    htmlLink: result.data.htmlLink,
    meetLink: result.data.hangoutLink || result.data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || null,
    start: result.data.start,
    end: result.data.end,
  };
}

/**
 * Delete a Google Calendar event
 */
async function deleteMeetEvent(tokens, eventId) {
  const calendar = getCalendarClient(tokens);
  try {
    await calendar.events.delete({ calendarId: 'primary', eventId });
    return true;
  } catch (err) {
    console.error('Failed to delete calendar event:', err.message);
    return false;
  }
}

/**
 * Parse "2025-05-17" + "10:30 AM" into a Date object
 */
function parseAppointmentDateTime(dateStr, timeStr) {
  const date = new Date(dateStr);
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    date.setHours(hours, minutes, 0, 0);
  } else {
    // Try 24h format "14:30"
    const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      date.setHours(parseInt(match24[1]), parseInt(match24[2]), 0, 0);
    }
  }
  return date;
}

module.exports = {
  getOAuth2Client,
  getAuthUrl,
  getTokensFromCode,
  getCalendarClient,
  createMeetEvent,
  deleteMeetEvent,
};
