/* ================================================
   appointment.js — Appointment Booking Logic
   ================================================ */

// ─── STATE ────────────────────────────────────────
let selectedService  = 'In-Person';
let selectedFee      = '₹500';
let selectedDate     = null;
let selectedTimeSlot = null;
let apptCalendar     = null;

// ─── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Wire calendar
  apptCalendar = createCalendar({
    gridId:        'calendarGrid',
    labelId:       'calMonthLabel',
    yearSelectId:  'yearSelect',
    monthSelectId: 'monthSelect',
    onDateSelect:  onDateSelected
  });

  // Wire month nav buttons
  document.getElementById('prevMonth').addEventListener('click', () => apptCalendar.changeMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => apptCalendar.changeMonth(1));

  // Render all time-slot groups (empty selection at start)
  refreshTimeSlots();
});

// ─── CALENDAR GLOBAL WRAPPERS ─────────────────────
// Called from inline onchange on select elements
function onYearChange() {
  if (apptCalendar) apptCalendar.render();
}
function onMonthChange() {
  if (apptCalendar) apptCalendar.render();
}
function changeMonth(delta) {
  if (apptCalendar) apptCalendar.changeMonth(delta);
}

// ─── DATE SELECTED ────────────────────────────────
function onDateSelected(date) {
  selectedDate     = date;
  selectedTimeSlot = null;  // reset time when date changes
  refreshTimeSlots();
  updateSummary();
}

// ─── SERVICE SELECTION ────────────────────────────
function selectService(card) {
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedService = card.dataset.service;
  selectedFee     = card.dataset.fee;
  updateSummary();
}

// ─── TIME SLOTS ───────────────────────────────────
function refreshTimeSlots() {
  renderTimeSlots('morning-slots',   MORNING_SLOTS,   onSlotSelected, selectedTimeSlot);
  renderTimeSlots('afternoon-slots', AFTERNOON_SLOTS, onSlotSelected, selectedTimeSlot);
  renderTimeSlots('evening-slots',   EVENING_SLOTS,   onSlotSelected, selectedTimeSlot);
}

function onSlotSelected(slot) {
  selectedTimeSlot = slot;
  refreshTimeSlots();
  updateSummary();
}

// ─── SUMMARY PANEL ────────────────────────────────
function updateSummary() {
  const sumService = document.getElementById('sum-service');
  const sumDate    = document.getElementById('sum-date');
  const sumTime    = document.getElementById('sum-time');
  const sumFee     = document.getElementById('sum-fee');

  if (sumService) sumService.textContent = selectedService === 'Video' ? 'Video Consultation' : 'In-Person Visit';
  if (sumDate)    sumDate.textContent    = selectedDate ? formatDate(selectedDate) : 'Not selected';
  if (sumTime)    sumTime.textContent    = selectedTimeSlot || 'Not selected';
  if (sumFee)     sumFee.textContent     = selectedFee;
}

// ─── FORM SUBMISSION ──────────────────────────────
async function submitBooking(e) {
  e.preventDefault();

  // Validate
  const name  = document.getElementById('patientName')?.value.trim();
  const phone = document.getElementById('patientPhone')?.value.trim();
  const email = document.getElementById('patientEmail')?.value.trim();

  if (!name || !phone || !email) {
    showToast('Please fill in your name, phone, and email.', 'error');
    document.getElementById('step-patient')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (!selectedDate) {
    showToast('Please select a date for your appointment.', 'error');
    document.getElementById('step-datetime')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (!selectedTimeSlot) {
    showToast('Please select a time slot.', 'error');
    document.getElementById('step-datetime')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const btn = document.getElementById('confirmBtn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span> Booking...';
  btn.disabled = true;

  try {
    // Format date as YYYY-MM-DD for consistent parsing in backend
    const yyyy = selectedDate.getFullYear();
    const mm   = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd   = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const complaint = document.getElementById('chiefComplaint')?.value.trim() || '';

    const result = await bookAppointment({
      name,
      phone,
      email,
      service: selectedService === 'Video' ? 'Video Consultation' : 'In-Person Visit',
      date:     dateStr,
      timeSlot: selectedTimeSlot,
      fee:      selectedFee,
      notes:    complaint
    });

    // Success
    const shortId = result.appointmentId
      ? String(result.appointmentId).slice(-6).toUpperCase()
      : Math.random().toString(36).slice(-6).toUpperCase();

    document.getElementById('modalId').textContent      = `APT-${shortId}`;
    document.getElementById('modalDetails').textContent =
      `${selectedService === 'Video' ? 'Video Consultation' : 'In-Person Visit'} on ${formatDate(selectedDate)} at ${selectedTimeSlot}`;

    openModal('successModal');

  } catch (err) {
    console.error('Booking error:', err);
    showToast(err.message || 'Something went wrong. Please try again.', 'error');
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled  = false;
  }
}

// ─── MODAL CLOSE ──────────────────────────────────
function closeModal() {
  closeModalById('successModal');
}
