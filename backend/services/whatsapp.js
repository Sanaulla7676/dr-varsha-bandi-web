const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let isReady = false;

const initializeWhatsApp = () => {
  // WhatsApp Web requires a display/Chromium - only enable in local environments
  // or on servers where ENABLE_WHATSAPP=true is explicitly set
  if (!process.env.ENABLE_WHATSAPP) {
    console.log('ℹ️  WhatsApp service disabled. Set ENABLE_WHATSAPP=true to enable.');
    return;
  }

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
  });

  client.on('qr', (qr) => {
    console.log('\n======================================================');
    console.log('📱 WHATSAPP QR CODE: Scan this with your phone to link');
    console.log('======================================================\n');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('✅ WhatsApp Web Client is READY!');
    isReady = true;
  });

  client.on('auth_failure', msg => {
    console.error('❌ WhatsApp Authentication failure:', msg);
  });

  client.on('disconnected', (reason) => {
    console.log('❌ WhatsApp Client was disconnected:', reason);
    isReady = false;
  });

  try {
    client.initialize();
  } catch (err) {
    console.error('Failed to initialize WhatsApp client:', err);
  }
};

/**
 * Send an automated follow-up WhatsApp message.
 * @param {string} phone - The patient's phone number (must include country code, e.g., '919876543210')
 * @param {string} patientName - The patient's full name
 * @param {string} customMessage - Optional custom message body
 */
const sendWhatsAppMessage = async (phone, patientName, customMessage = null) => {
  if (!isReady || !client) {
    console.warn('[WhatsApp] Cannot send message, client not ready.');
    return false;
  }

  if (!phone) return false;

  // Clean phone number (remove spaces, +, etc.)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  // Format for whatsapp-web.js (requires country code + @c.us)
  const chatId = `${cleanPhone}@c.us`;

  const defaultMessage = `*Hello ${patientName}*, \n\nDr. Bandi from Homeopathway Clinic is checking in on your progress. How have you been feeling since your last visit? \n\nIf you need to schedule another consultation, please reply to this message.`;
  const textBody = customMessage || defaultMessage;

  try {
    const isRegistered = await client.isRegisteredUser(chatId);
    if (!isRegistered) {
      console.warn(`[WhatsApp] Number ${cleanPhone} is not registered on WhatsApp.`);
      return false;
    }

    await client.sendMessage(chatId, textBody);
    console.log(`[WhatsApp] Follow-up sent to ${cleanPhone}`);
    return true;
  } catch (error) {
    console.error(`[WhatsApp Error] Failed to send message to ${cleanPhone}:`, error.message);
    return false;
  }
};

module.exports = {
  initializeWhatsApp,
  sendWhatsAppMessage,
};
