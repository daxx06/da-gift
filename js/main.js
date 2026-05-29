/* ============================================
   da_gift_s — Main JavaScript
   Interactions, Lightbox, Gallery, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // NAVBAR — Scroll effect & Mobile menu
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  // Scroll effect
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Initial check

  // Mobile toggle
  const toggleMobileNav = () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  };

  navToggle.addEventListener('click', toggleMobileNav);
  navOverlay.addEventListener('click', toggleMobileNav);

  // Close mobile nav on link click
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  });

  // Active nav highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navItems.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ==========================================
  // GALLERY — Category Filtering
  // ==========================================
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      // Filter items with animation
      galleryItems.forEach((item, index) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.transitionDelay = `${index * 0.05}s`;
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // LIGHTBOX
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentIndex = 0;
  let visibleItems = [];

  const getVisibleItems = () => {
    return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
  };

  const openLightbox = (index) => {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const updateLightbox = () => {
    const item = visibleItems[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.dataset.title;
    const category = item.dataset.categoryLabel;
    const description = item.dataset.description;

    lightboxImage.src = img.src;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;
    lightboxDescription.textContent = description;
  };

  const navigateLightbox = (direction) => {
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    updateLightbox();
  };

  // Event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const visibleIndex = getVisibleItems().indexOf(item);
      openLightbox(visibleIndex);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('inquiry-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = contactForm.querySelector('#form-name').value.trim();
      const contact = contactForm.querySelector('#form-contact').value.trim();

      if (!name || !contact) {
        alert('Please fill in your name and contact details.');
        return;
      }

      // Simulate form submission
      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1200);
    });
  }

  // ==========================================
  // SMOOTH SCROLL for anchor links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 72; // nav height
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // WHATSAPP BUTTON — Show after scroll
  // ==========================================
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.transform = 'scale(0.8)';
    whatsappFloat.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    const showWhatsApp = () => {
      if (window.scrollY > 300) {
        whatsappFloat.style.opacity = '1';
        whatsappFloat.style.transform = 'scale(1)';
      } else {
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.transform = 'scale(0.8)';
      }
    };

    window.addEventListener('scroll', showWhatsApp, { passive: true });
  }

});
