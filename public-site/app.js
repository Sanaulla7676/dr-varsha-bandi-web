/* Global Website Logic & Appointment Scheduler State Manager */

// Socket Connection to Doctor Dashboard Backend
let socket;
const LIVE_BACKEND_URL = 'https://homeopathway-backend.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:5000';
const SOCKET_URL = (window.location.hostname.includes('vercel.app') ? LIVE_BACKEND_URL : LOCAL_BACKEND_URL);

try {
  socket = io(SOCKET_URL);
  console.log(`Connected to consultation notification bridge at ${SOCKET_URL}`);
} catch (e) {
  console.warn('Socket.io not found or server offline, continuing in offline mode');
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollReveal();
  initMobileMenu();
  initTestimonialSlider();
  initBookingFlow();
  initConsentModal();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode Toggle)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme');
  
  // Set initial state
  if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark-mode');
    updateToggleButtons(true);
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark-mode');
    updateToggleButtons(false);
  }

  // Bind click handlers
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      if (isCurrentlyDark) {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateToggleButtons(false);
      } else {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateToggleButtons(true);
      }
    });
  });
}

function updateToggleButtons(isDark) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(icon => {
    if (isDark) {
      icon.innerHTML = 'light_mode';
    } else {
      icon.innerHTML = 'dark_mode';
    }
  });
}

/* ==========================================================================
   2. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep animations clean
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => {
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   3. Responsive Mobile Menu Sidebar
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const drawer = document.querySelector('.mobile-menu-drawer');
  const links = document.querySelectorAll('.mobile-menu-drawer a');

  if (!menuBtn || !drawer) return;

  const toggleDrawer = (open) => {
    if (open) {
      drawer.classList.remove('translate-x-full');
    } else {
      drawer.classList.add('translate-x-full');
    }
  };

  menuBtn.addEventListener('click', () => toggleDrawer(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));

  links.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });
}

/* ==========================================================================
   4. Testimonials Slider
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const nextBtn = document.querySelector('.testimonial-next');
  const prevBtn = document.querySelector('.testimonial-prev');
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;
  let autoSlideTimer;

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('button');
      dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-primary-teal w-6' : 'bg-gray-300'}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-primary-teal w-6';
      } else {
        dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-gray-300';
      }
    });
  };

  const goToSlide = (index) => {
    currentIndex = (index + slideCount) % slideCount;
    const amountToMove = -currentIndex * 100;
    track.style.transform = `translateX(${amountToMove}%)`;
    updateDots();
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    });
  }

  const startAutoSlide = () => {
    autoSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  };

  startAutoSlide();
}

/* ==========================================================================
   5. Interactive Appointment Booking State & Step Manager
   ========================================================================== */
function initBookingFlow() {
  const steps = ['step-1', 'step-2', 'step-3'];
  const stepContainers = steps.map(id => document.getElementById(id));
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const summaryService = document.getElementById('summary-service');
  const summaryDateTime = document.getElementById('summary-date-time');
  const summaryFee = document.getElementById('summary-fee');
  const summaryContainer = document.getElementById('summary-card');
  const confirmBtn = document.getElementById('btn-confirm-appointment');

  // Check if we are on the appointment page
  if (!stepContainers[0]) return;

  // Initial Form State
  const bookingState = {
    service: 'Video Consultation',
    fee: '₹1,000',
    date: 'Dec 15, 2026',
    timeSlot: '06:00 PM',
    name: '',
    phone: '',
    email: '',
    concern: '',
    currentStep: 1,
    viewDate: new Date(2026, 11, 1) // Start with December 2026 as per design
  };

  // 5.1 Service Selection Handles
  const serviceCards = document.querySelectorAll('.service-selection-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('border-primary-teal', 'bg-accent-teal', 'dark:bg-[#00201e]'));
      card.classList.add('border-primary-teal', 'bg-accent-teal', 'dark:bg-[#00201e]');
      
      const isVideo = card.getAttribute('data-service') === 'video';
      bookingState.service = isVideo ? 'Video Consultation' : 'In-Clinic Consultation';
      bookingState.fee = isVideo ? '₹1,000' : '₹800';
      
      updateSummary();
    });
  });

  // 5.2 Dynamic Calendar Logic
  function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    if (!calendarGrid || !monthYearDisplay) return;

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const viewDate = bookingState.viewDate;
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    // Clear grid
    calendarGrid.innerHTML = '';

    // Add day headers
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayLabels.forEach(day => {
      const header = document.createElement('div');
      header.className = 'font-extrabold text-teal-primary dark:text-teal-400 py-1';
      header.textContent = day;
      calendarGrid.appendChild(header);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Previous month days (padding)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = document.createElement('div');
      day.className = 'py-2 text-gray-300 dark:text-gray-700';
      day.textContent = prevMonthLastDay - i;
      calendarGrid.appendChild(day);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'calendar-day-btn w-8 h-8 flex items-center justify-center hover:bg-primary-teal/10 text-gray-700 dark:text-gray-300 rounded-full font-bold mx-auto transition-all';
        btn.textContent = i;
        btn.setAttribute('data-day', i);
        
        // Check if this date matches the currently selected date in bookingState
        // We parse the current bookingState.date which is in "MMM D, YYYY" format
        const selectedParts = bookingState.date.replace(/,/g, '').split(' ');
        const selMonth = selectedParts[0];
        const selDay = parseInt(selectedParts[1]);
        const selYear = parseInt(selectedParts[2]);
        
        const monthShort = monthNames[month].substring(0, 3);
        if (selYear === year && selMonth === monthShort && selDay === i) {
            btn.classList.add('bg-primary-teal', 'text-white', 'scale-110');
            btn.classList.remove('hover:bg-primary-teal/10', 'text-gray-700', 'dark:text-gray-300');
        }

        btn.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day-btn').forEach(d => {
                d.classList.remove('bg-primary-teal', 'text-white', 'scale-110');
                d.classList.add('hover:bg-primary-teal/10', 'text-gray-700', 'dark:text-gray-300');
            });
            btn.classList.add('bg-primary-teal', 'text-white', 'scale-110');
            btn.classList.remove('hover:bg-primary-teal/10', 'text-gray-700', 'dark:text-gray-300');
            
            bookingState.date = `${monthShort} ${i}, ${year}`;
            updateSummary();
        });
        calendarGrid.appendChild(btn);
    }
  }

  // Handle Month Navigation
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      bookingState.viewDate.setMonth(bookingState.viewDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      bookingState.viewDate.setMonth(bookingState.viewDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // Initial Calendar Render
  renderCalendar();

  // 5.3 Time Slot Click Handles
  const slotButtons = document.querySelectorAll('.time-slot-btn');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => {
        b.classList.remove('bg-primary-teal', 'text-white', 'border-transparent');
        b.classList.add('border-gray-300', 'text-gray-700', 'dark:text-gray-300', 'dark:border-gray-600');
      });
      btn.classList.add('bg-primary-teal', 'text-white', 'border-transparent');
      btn.classList.remove('border-gray-300', 'text-gray-700', 'dark:text-gray-300', 'dark:border-gray-600');
      
      bookingState.timeSlot = btn.textContent.trim();
      updateSummary();
    });
  });

  // 5.4 Patient Info Sync
  const nameInput = document.getElementById('input-name');
  const phoneInput = document.getElementById('input-phone');
  const emailInput = document.getElementById('input-email');
  const concernInput = document.getElementById('input-concern');

  const syncInputs = () => {
    if (nameInput) bookingState.name = nameInput.value;
    if (phoneInput) bookingState.phone = phoneInput.value;
    if (emailInput) bookingState.email = emailInput.value;
    if (concernInput) bookingState.concern = concernInput.value;
  };

  if (nameInput) nameInput.addEventListener('input', syncInputs);
  if (phoneInput) phoneInput.addEventListener('input', syncInputs);
  if (emailInput) emailInput.addEventListener('input', syncInputs);
  if (concernInput) concernInput.addEventListener('input', syncInputs);

  // 5.5 Step Routing Controls
  const nextStepBtns = document.querySelectorAll('.btn-next-step');
  const prevStepBtns = document.querySelectorAll('.btn-prev-step');

  nextStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(bookingState.currentStep)) {
        goToStep(bookingState.currentStep + 1);
      }
    });
  });

  prevStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(bookingState.currentStep - 1);
    });
  });

  function validateStep(step) {
    if (step === 1) {
      if (!bookingState.service) {
        alert('Please select a service type.');
        return false;
      }
    } else if (step === 2) {
      if (!bookingState.date || !bookingState.timeSlot) {
        alert('Please select both a date and a time slot.');
        return false;
      }
    } else if (step === 3) {
      syncInputs();
      if (!bookingState.name || !bookingState.phone || !bookingState.email) {
        alert('Please complete all required fields (Name, Phone, and Email).');
        return false;
      }
    }
    return true;
  }

  function goToStep(nextStep) {
    if (nextStep < 1 || nextStep > 3) return;
    
    // Animate fade-out current step container
    const currentContainer = stepContainers[bookingState.currentStep - 1];
    const targetContainer = stepContainers[nextStep - 1];

    currentContainer.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => {
      currentContainer.classList.add('hidden');
      targetContainer.classList.remove('hidden');
      
      // Force repaint then animate in
      setTimeout(() => {
        targetContainer.classList.remove('opacity-0', 'translate-y-4');
      }, 50);
    }, 200);

    // Update progress markers
    bookingState.currentStep = nextStep;
    stepIndicators.forEach((ind, index) => {
      if (index + 1 <= nextStep) {
        ind.classList.remove('bg-gray-200', 'text-gray-400', 'dark:bg-gray-800');
        ind.classList.add('bg-primary-teal', 'text-white');
      } else {
        ind.classList.remove('bg-primary-teal', 'text-white');
        ind.classList.add('bg-gray-200', 'text-gray-400', 'dark:bg-gray-800');
      }
    });

    // Scroll to top of scheduler smoothly
    document.getElementById('booking-flow-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateSummary() {
    if (summaryService) summaryService.textContent = bookingState.service;
    if (summaryDateTime) summaryDateTime.textContent = `${bookingState.date} at ${bookingState.timeSlot}`;
    if (summaryFee) summaryFee.textContent = bookingState.fee;
    
    // Add dynamic animation to the summary card to signal values updated
    if (summaryContainer) {
      summaryContainer.classList.add('scale-105', 'shadow-2xl');
      setTimeout(() => {
        summaryContainer.classList.remove('scale-105', 'shadow-2xl');
      }, 300);
    }
  }

  // 5.6 Final Appointment Confirmation Handle
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (!validateStep(3)) return;
      
      // Dynamic Backend Configuration
      const LIVE_BACKEND_URL = 'https://homeopathway-backend.onrender.com';
      const LOCAL_BACKEND_URL = 'http://localhost:5000';
      
      // Determine which API to use (prefer live if on vercel, otherwise local)
      const API_URL = window.location.hostname.includes('vercel.app') 
        ? LIVE_BACKEND_URL 
        : LOCAL_BACKEND_URL;

      // Send appointment to Backend DB
      fetch(`${API_URL}/api/public/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingState.name,
          email: bookingState.email,
          phone: bookingState.phone,
          service: bookingState.service,
          date: bookingState.date,
          timeSlot: bookingState.timeSlot,
          fee: bookingState.fee
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Appointment successfully recorded in dashboard:', data.appointmentId);
          // Notify doctor via existing socket connection if available
          if (socket && socket.connected) {
            socket.emit('patient-request-consultation', {
              name: bookingState.name,
              requestedAt: new Date().toLocaleTimeString()
            });
          }
        } else {
          console.error('Failed to record appointment:', data.message);
        }
      })
      .catch(error => {
        console.error('Error booking appointment:', error);
      });

      // Trigger a gorgeous success modal overlay
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300';
      modal.innerHTML = `
        <div class="bg-white dark:bg-[#111f1e] p-8 rounded-3xl max-w-md w-full text-center shadow-2xl border border-primary-teal/20 transform translate-y-8 transition-transform duration-300 scale-95 opacity-0" id="success-modal-card">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
            <span class="material-symbols-outlined text-5xl font-bold">check_circle</span>
          </div>
          <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Appointment Scheduled!</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Thank you, <span class="font-bold text-primary-teal dark:text-primary-fixed">${bookingState.name}</span>. Your <span class="font-semibold">${bookingState.service}</span> has been booked for <span class="font-semibold">${bookingState.date}</span> at <span class="font-semibold">${bookingState.timeSlot}</span>.
          </p>
          <div class="bg-accent-teal dark:bg-teal-950/30 p-4 rounded-xl mb-6 text-left text-xs border border-primary-teal/10">
            <p class="mb-1"><span class="font-bold text-gray-700 dark:text-gray-300">Email:</span> ${bookingState.email}</p>
            <p class="mb-1"><span class="font-bold text-gray-700 dark:text-gray-300">Phone:</span> ${bookingState.phone}</p>
            <p><span class="font-bold text-gray-700 dark:text-gray-300">Fee Mode:</span> ${bookingState.fee} (Payable at visit / link)</p>
          </div>
          <button class="w-full bg-primary-teal text-white py-3 rounded-xl font-bold hover:bg-secondary-teal transition" id="success-modal-close">
            Done
          </button>
        </div>
      `;
      document.body.appendChild(modal);

      // Force fade in transition
      setTimeout(() => {
        modal.querySelector('#success-modal-card').classList.remove('opacity-0', 'scale-95', 'translate-y-8');
        modal.querySelector('#success-modal-card').classList.add('opacity-100', 'scale-100', 'translate-y-0');
      }, 50);

      modal.querySelector('#success-modal-close').addEventListener('click', () => {
        // Fade out
        modal.querySelector('#success-modal-card').classList.add('opacity-0', 'scale-95', 'translate-y-8');
        setTimeout(() => {
          document.body.removeChild(modal);
          // Redirect or reload
          window.location.href = 'index.html';
        }, 300);
      });
    });
  }

  // Set initial text values in summary
  updateSummary();
}

/* ==========================================================================
   6. Video Consultation Consent Modal
   ========================================================================== */
function initConsentModal() {
  const modal = document.getElementById('consent-modal');
  const modalContent = document.getElementById('consent-modal-content');
  const openBtns = document.querySelectorAll('#start-video-consult');
  const closeBtn = document.getElementById('close-consent-modal');
  const checkbox = document.getElementById('consent-checkbox');
  const proceedBtn = document.getElementById('proceed-to-consult');

  if (!modal || !checkbox || !proceedBtn) return;

  const toggleModal = (show) => {
    if (show) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      setTimeout(() => {
        if (modalContent) {
          modalContent.classList.remove('scale-95');
          modalContent.classList.add('scale-100');
        }
      }, 10);
    } else {
      if (modalContent) {
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
      }
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }, 300);
    }
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleModal(true);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleModal(false));
  }

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) toggleModal(false);
  });

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      proceedBtn.removeAttribute('disabled');
      proceedBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      proceedBtn.classList.add('hover:bg-teal-secondary', 'hover:-translate-y-0.5');
    } else {
      proceedBtn.setAttribute('disabled', 'true');
      proceedBtn.classList.add('opacity-50', 'cursor-not-allowed');
      proceedBtn.classList.remove('hover:bg-teal-secondary', 'hover:-translate-y-0.5');
    }
  });

  proceedBtn.addEventListener('click', () => {
    if (checkbox.checked) {
      // Notify doctor's dashboard via socket
      if (socket && socket.connected) {
        socket.emit('patient-request-consultation', {
          name: 'Patient Viewing Site', // Ideally we'd have a name from a form here
          requestedAt: new Date().toLocaleTimeString()
        });
      }
      window.location.href = 'appointment.html';
    }
  });
}
