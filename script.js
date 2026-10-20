/**
 * ==========================================================================
 * ANURAG DUTTA — PERSONAL PORTFOLIO SCRIPT
 * Theme & Font switcher, navigation, and contact form validation.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. THEME & FONT STYLE SWITCHER
  // ------------------------------------------------------------------------
  const themeButtons = document.querySelectorAll('[data-set-theme]');
  const savedTheme = localStorage.getItem('anurag_portfolio_theme') || 'emerald';

  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('anurag_portfolio_theme', themeName);

    themeButtons.forEach(btn => {
      if (btn.getAttribute('data-set-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // Set initial theme
  applyTheme(savedTheme);

  // Attach click listener to all switcher buttons (desktop + mobile)
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-set-theme');
      if (selected) {
        applyTheme(selected);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 2. CURRENT YEAR IN FOOTER
  // ------------------------------------------------------------------------
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 3. MOBILE MENU TOGGLE
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. SCROLL PROGRESS BAR & ACTIVE NAV
  // ------------------------------------------------------------------------
  const progressBar = document.getElementById('scrollProgressBar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item:not(.nav-contact)');

  const onScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    const scrollPos = scrollTop + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ------------------------------------------------------------------------
  // 5. SCROLL-TRIGGERED REVEAL ANIMATIONS
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // ------------------------------------------------------------------------
  // 6. CONTACT FORM VALIDATION & HANDLING
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  const nameGroup = document.getElementById('nameGroup');
  const emailGroup = document.getElementById('emailGroup');
  const messageGroup = document.getElementById('messageGroup');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checkField = (input, group, condition) => {
    if (!condition) {
      group.classList.add('has-error');
      return false;
    }
    group.classList.remove('has-error');
    return true;
  };

  if (nameInput && emailInput && messageInput) {
    nameInput.addEventListener('input', () => {
      checkField(nameInput, nameGroup, nameInput.value.trim().length >= 2);
    });

    emailInput.addEventListener('input', () => {
      checkField(emailInput, emailGroup, emailRegex.test(emailInput.value.trim()));
    });

    messageInput.addEventListener('input', () => {
      checkField(messageInput, messageGroup, messageInput.value.trim().length >= 10);
    });
  }

  
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validName = checkField(
      nameInput,
      nameGroup,
      nameInput.value.trim().length >= 2
    );

    const validEmail = checkField(
      emailInput,
      emailGroup,
      emailRegex.test(emailInput.value.trim())
    );

    const validMsg = checkField(
      messageInput,
      messageGroup,
      messageInput.value.trim().length >= 10
    );

    if (!validName || !validEmail || !validMsg) {
      showFeedback('Please correct the highlighted fields.', 'error');
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);

      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      showFeedback('Thank you! Your message was sent.', 'success');
      contactForm.reset();

    } catch (error) {
      showFeedback(
        'Could not send your message. Please try again.',
        'error'
      );
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}


  function showFeedback(text, type) {
    if (!formFeedback) return;
    formFeedback.textContent = text;
    formFeedback.className = `form-feedback ${type}`;
  }

  // ------------------------------------------------------------------------
  // 6. BACK TO TOP BUTTON
  // ------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 7. INTERACTIVE CURSOR AMBIENT GLOW
  // ------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        cursorGlow.style.opacity = '0.14';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      isMoving = false;
    });

    const animateGlow = () => {
      // Smooth linear interpolation (lerp)
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;

      requestAnimationFrame(animateGlow);
    };

    requestAnimationFrame(animateGlow);
  }

  // ------------------------------------------------------------------------
  // 8. INTERACTIVE PARALLAX & TOUCH FEEDBACK ON HERO FLOATING CLUSTER
  // ------------------------------------------------------------------------
  const heroSection = document.getElementById('home');
  const floatingTags = document.querySelectorAll('.float-tag');

  if (floatingTags.length > 0) {
    // Touch feedback on mobile devices
    floatingTags.forEach(tag => {
      tag.addEventListener('touchstart', () => {
        tag.classList.add('touch-active');
      }, { passive: true });

      tag.addEventListener('touchend', () => {
        setTimeout(() => tag.classList.remove('touch-active'), 250);
      }, { passive: true });
    });

    // Mouse parallax for precision desktop pointers
    if (heroSection && window.matchMedia('(pointer: fine)').matches) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        floatingTags.forEach((tag, idx) => {
          const factor = (idx + 1) * 8;
          tag.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        floatingTags.forEach(tag => {
          tag.style.transform = '';
        });
      });
    }
  }
});


