/* ================================================
   app.js — Shared JS for Dr. Varsha Bandi Website
   ================================================ */

// ─── CONFIG ──────────────────────────────────────
// Auto-detects the backend URL:
//   • File served by backend at /site/ → same origin
//   • Opened directly from localhost   → localhost:5000
//   • Any other origin (deployed site) → Render backend
const API_BASE = (() => {
  const { hostname, port, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // If backend is serving this file (port 5000), use same origin
    if (port === '5000') return `${protocol}//${hostname}:5000/api`;
    // Opened directly (e.g., file:// or dev server) → point at backend
    return 'http://localhost:5000/api';
  }
  // Production / Render deployment
  return 'https://homeopathway-backend.onrender.com/api';
})();

// ─── NAVBAR SCROLL EFFECT ─────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ─── MOBILE HAMBURGER ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ─── ACTIVE NAV LINK (scroll spy for homepage) ────
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;
  const links = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });
  sections.forEach(s => observer.observe(s));
})();

// ─── TOAST ────────────────────────────────────────
function showToast(msg, type = 'default', duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast show${type !== 'default' ? ' ' + type : ''}`;
  setTimeout(() => { toast.classList.remove('show'); }, duration);
}

// ─── CALENDAR ENGINE ──────────────────────────────
/**
 * Creates a fully reusable calendar.
 * @param {object} cfg - configuration object
 */
function createCalendar(cfg) {
  const {
    gridId,
    labelId,
    yearSelectId,
    monthSelectId,
    onDateSelect,
    minDate = new Date()
  } = cfg;

  const now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();
  let selectedDate = null;

  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  // Populate year select (current year → current year + 2)
  const yearSelect = document.getElementById(yearSelectId);
  if (yearSelect) {
    yearSelect.innerHTML = '';
    for (let y = now.getFullYear(); y <= now.getFullYear() + 2; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      if (y === viewYear) opt.selected = true;
      yearSelect.appendChild(opt);
    }
    yearSelect.addEventListener('change', () => {
      viewYear = parseInt(yearSelect.value);
      render();
    });
  }

  const monthSelect = document.getElementById(monthSelectId);
  if (monthSelect) {
    monthSelect.value = viewMonth;
    monthSelect.addEventListener('change', () => {
      viewMonth = parseInt(monthSelect.value);
      render();
    });
  }

  function render() {
    const grid = document.getElementById(gridId);
    const label = document.getElementById(labelId);
    if (!grid) return;

    if (label) label.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
    if (monthSelect) monthSelect.value = viewMonth;
    if (yearSelect) yearSelect.value = viewYear;

    grid.innerHTML = '';

    // Day headers
    DAYS.forEach(d => {
      const h = document.createElement('div');
      h.className = 'cal-day-header';
      h.textContent = d;
      grid.appendChild(h);
    });

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(viewYear, viewMonth, d);
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day';
      dayEl.textContent = d;

      const isPast = cellDate < today;
      const isToday = cellDate.getTime() === today.getTime();
      const isSelected = selectedDate &&
        cellDate.toDateString() === selectedDate.toDateString();

      if (isPast) {
        dayEl.classList.add('past');
      } else if (isSelected) {
        dayEl.classList.add('selected');
      } else if (isToday) {
        dayEl.classList.add('today');
      }

      if (!isPast) {
        dayEl.addEventListener('click', () => {
          selectedDate = cellDate;
          render();
          if (onDateSelect) onDateSelect(cellDate);
        });
      }
      grid.appendChild(dayEl);
    }
  }

  function changeMonth(delta) {
    viewMonth += delta;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render();
  }

  function getSelected() { return selectedDate; }
  function reset() { selectedDate = null; render(); }

  render();
  return { changeMonth, getSelected, reset, render };
}

// ─── TIME SLOTS ENGINE ────────────────────────────
function renderTimeSlots(containerId, slots, onSelect, currentSelected) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  slots.forEach(slot => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-slot' + (slot === currentSelected ? ' selected' : '');
    btn.textContent = slot;
    btn.addEventListener('click', () => {
      if (onSelect) onSelect(slot);
    });
    container.appendChild(btn);
  });
}

const MORNING_SLOTS   = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
const AFTERNOON_SLOTS = ['12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];
const EVENING_SLOTS   = ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

// ─── FORMAT HELPERS ───────────────────────────────
function formatDate(dateObj) {
  if (!dateObj) return 'Not selected';
  return dateObj.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ─── API CALL: BOOK APPOINTMENT ───────────────────
async function bookAppointment(payload) {
  const response = await fetch(`${API_BASE}/public/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Booking failed. Please try again.');
  }
  return data;
}

// ─── MODAL HELPERS ────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('show');
}
function closeModalById(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('show');
  window.location.reload();
}

// ─── SMOOTH SCROLL (for anchor links on homepage) ─
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── ENTRANCE ANIMATIONS (IntersectionObserver) ───
(function initAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    .animate-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .animate-in.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const animatables = document.querySelectorAll(
    '.spec-card, .why-card, .testimonial-card, .step, .cred-item, .contact-item, .tip-item'
  );
  animatables.forEach((el, i) => {
    el.classList.add('animate-in');
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px' });

  animatables.forEach(el => obs.observe(el));
})();
