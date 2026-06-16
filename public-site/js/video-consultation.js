/* ====================================================
   video-consultation.js — Video Booking Logic
   ==================================================== */

// ─── STATE ────────────────────────────────────────
let videoSelectedDate     = null;
let videoSelectedTimeSlot = null;
let videoCalendar         = null;

// ─── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  videoCalendar = createCalendar({
    gridId:        'videoCalendarGrid',
    labelId:       'videoCalMonthLabel',
    yearSelectId:  'videoYearSelect',
    monthSelectId: 'videoMonthSelect',
    onDateSelect:  onVideoDateSelected
  });

  renderVideoTimeSlots();

  // Show summary bar initially hidden — will show when date selected
  const bar = document.getElementById('videoSummaryBar');
  if (bar) bar.style.display = 'none';
});

// ─── CALENDAR GLOBAL WRAPPERS ─────────────────────
function onVideoYearChange() { if (videoCalendar) videoCalendar.render(); }
function onVideoMonthChange() { if (videoCalendar) videoCalendar.render(); }
function changeVideoMonth(delta) { if (videoCalendar) videoCalendar.changeMonth(delta); }

// ─── DATE SELECTED ────────────────────────────────
function onVideoDateSelected(date) {
  videoSelectedDate     = date;
  videoSelectedTimeSlot = null;
  renderVideoTimeSlots();
  updateVideoSummaryBar();
}

// ─── TIME SLOTS ───────────────────────────────────
function renderVideoTimeSlots() {
  renderTimeSlots('video-morning-slots',   MORNING_SLOTS,   onVideoSlotSelected, videoSelectedTimeSlot);
  renderTimeSlots('video-afternoon-slots', AFTERNOON_SLOTS, onVideoSlotSelected, videoSelectedTimeSlot);
  renderTimeSlots('video-evening-slots',   EVENING_SLOTS,   onVideoSlotSelected, videoSelectedTimeSlot);
}

function onVideoSlotSelected(slot) {
  videoSelectedTimeSlot = slot;
  renderVideoTimeSlots();
  updateVideoSummaryBar();
}

// ─── SUMMARY BAR ──────────────────────────────────
function updateVideoSummaryBar() {
  const bar     = document.getElementById('videoSummaryBar');
  const sumText = document.getElementById('videoSumText');
  if (!bar || !sumText) return;

  if (videoSelectedDate || videoSelectedTimeSlot) {
    bar.style.display = 'flex';
    const datePart = videoSelectedDate ? formatDate(videoSelectedDate) : 'Date not selected';
    const timePart = videoSelectedTimeSlot || 'Time not selected';
    sumText.textContent = `${datePart} at ${timePart}`;
  } else {
    bar.style.display = 'none';
  }
}

// ─── FORM SUBMISSION ──────────────────────────────
async function submitVideoBooking(e) {
  if (e) e.preventDefault();

  // Validate patient info
  const name  = document.getElementById('vName')?.value.trim();
  const phone = document.getElementById('vPhone')?.value.trim();
  const email = document.getElementById('vEmail')?.value.trim();

  if (!name || !phone || !email) {
    showToast('Please fill in your name, phone number, and email.', 'error');
    document.getElementById('vName')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (!videoSelectedDate) {
    showToast('Please select a date for your video consultation.', 'error');
    document.getElementById('videoCalendarGrid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (!videoSelectedTimeSlot) {
    showToast('Please select a time slot.', 'error');
    document.getElementById('video-morning-slots')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const btn = document.getElementById('videoConfirmBtn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span> Booking...';
  btn.disabled = true;

  try {
    const yyyy = videoSelectedDate.getFullYear();
    const mm   = String(videoSelectedDate.getMonth() + 1).padStart(2, '0');
    const dd   = String(videoSelectedDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const complaint = document.getElementById('vComplaint')?.value.trim() || '';

    const result = await bookAppointment({
      name,
      phone,
      email,
      service:  'Video Consultation',
      date:     dateStr,
      timeSlot: videoSelectedTimeSlot,
      fee:      '₹400',
      notes:    complaint
    });

    // Success — show modal
    const shortId = result.appointmentId
      ? String(result.appointmentId).slice(-6).toUpperCase()
      : Math.random().toString(36).slice(-6).toUpperCase();

    document.getElementById('modalId').textContent = `VID-${shortId}`;
    document.getElementById('modalDetails').textContent =
      `Video Consultation on ${formatDate(videoSelectedDate)} at ${videoSelectedTimeSlot}`;

    openModal('successModal');

  } catch (err) {
    console.error('Video booking error:', err);
    showToast(err.message || 'Something went wrong. Please try again.', 'error');
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled  = false;
  }
}

// ─── MODAL CLOSE ──────────────────────────────────
function closeVideoModal() {
  closeModalById('successModal');
}
