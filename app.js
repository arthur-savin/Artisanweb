// ============================================
// WEB ARTISANT - Script principal amélioré
// ============================================

// Utilitaires
function ready(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

// Année automatique
ready(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

// ============================================
// HEADER VISIBILITY
// ============================================
function initHeaderVisibility() {
  const header = document.querySelector(".site-header");
  const whySection = document.querySelector("#why");
  
  if (!header || !whySection) return;

  header.classList.remove("header-visible");

  function updateHeaderVisibility() {
    const whyRect = whySection.getBoundingClientRect();
    const shouldShow = whyRect.top <= window.innerHeight * 0.3;
    
    if (shouldShow) {
      header.classList.add("header-visible");
    } else {
      header.classList.remove("header-visible");
    }
  }

  updateHeaderVisibility();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      () => updateHeaderVisibility(),
      {
        root: null,
        rootMargin: "-30% 0px -70% 0px",
        threshold: [0, 0.1, 0.2, 0.3],
      }
    );
    observer.observe(whySection);
  } else {
    window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
    window.addEventListener("resize", updateHeaderVisibility, { passive: true });
  }
}

ready(initHeaderVisibility);

// ============================================
// MENU HAMBURGER MOBILE
// ============================================
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const header = document.querySelector('.site-header');
  
  if (!menuToggle || !mainNav) return;

  function toggleMenu() {
    const isActive = menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
    mainNav.classList.toggle('nav-open');
    
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  menuToggle.addEventListener('click', toggleMenu);

  // Fermer le menu au clic sur un lien
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuToggle.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Fermer le menu au resize si on passe en desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menuToggle.classList.contains('active')) {
      toggleMenu();
    }
  }, { passive: true });
}

ready(initMobileMenu);

// ============================================
// CARROUSEL PORTFOLIO (avec bouton précédent et swipe)
// ============================================
function initPortfolioCarousel() {
  const carouselTrack = document.getElementById('portfolioCarousel');
  const nextButton = document.getElementById('carouselNext');
  const carouselContainer = carouselTrack?.closest('.portfolio-carousel');
  
  if (!carouselTrack || !nextButton || !carouselContainer) return;

  const originalItems = carouselTrack.querySelectorAll('.portfolio-item');
  const totalItems = originalItems.length;
  
  if (totalItems === 0) return;

  // Dupliquer les éléments pour créer une boucle infinie
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    carouselTrack.appendChild(clone);
  });

  const allItems = carouselTrack.querySelectorAll('.portfolio-item');
  let currentIndex = 0;
  let isTransitioning = false;

  // Créer le bouton précédent
  const prevButton = document.createElement('button');
  prevButton.className = 'hero-arrow hero-arrow-left';
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', 'Précédent');
  prevButton.innerHTML = '←';
  carouselContainer.appendChild(prevButton);

  function getItemsPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function updateCarousel(instant = false) {
    if (isTransitioning && !instant) return;
    
    const itemsPerView = getItemsPerView();
    const itemWidth = allItems[0] ? allItems[0].offsetWidth + 22 : 0;
    
    if (currentIndex >= totalItems) {
      currentIndex = 0;
      carouselTrack.style.transition = 'none';
      carouselTrack.style.transform = `translateX(0px)`;
      void carouselTrack.offsetWidth;
      carouselTrack.style.transition = '';
    }
    
    if (currentIndex < 0) {
      currentIndex = totalItems - 1;
      carouselTrack.style.transition = 'none';
      const translateX = -currentIndex * itemWidth;
      carouselTrack.style.transform = `translateX(${translateX}px)`;
      void carouselTrack.offsetWidth;
      carouselTrack.style.transition = '';
    }

    const translateX = -currentIndex * itemWidth;
    carouselTrack.style.transform = `translateX(${translateX}px)`;
  }

  function goToNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateCarousel();
    setTimeout(() => { isTransitioning = false; }, 500);
  }

  function goToPrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateCarousel();
    setTimeout(() => { isTransitioning = false; }, 500);
  }

  nextButton.addEventListener('click', goToNext);
  prevButton.addEventListener('click', goToPrev);

  // Support swipe mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }

  // Gestion du redimensionnement
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => updateCarousel(true), 250);
  }, { passive: true });

  updateCarousel(true);
}

ready(initPortfolioCarousel);

// ============================================
// MODAL avec focus trap et accessibilité
// ============================================
function initModal() {
  const modal = document.getElementById("contactModal");
  const closeBtn = document.getElementById("closeModal");
  const openButtons = document.querySelectorAll(".open-modal");
  const modalTitle = document.getElementById("modalTitle");
  const form = document.getElementById("contactForm");
  const overlay = modal?.querySelector(".modal-overlay");

  if (!modal || !closeBtn || !form) return;

  let previousActiveElement = null;
  let focusableElements = null;

  function getFocusableElements() {
    return modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function trapFocus(e) {
    if (!modal.classList.contains("active")) return;
    
    if (e.key !== 'Tab') return;

    if (!focusableElements) {
      focusableElements = getFocusableElements();
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  function openModal(modalType) {
    previousActiveElement = document.activeElement;
    
    if (modalType === "devis") {
      modalTitle.textContent = "Demander un devis";
      // Afficher tous les champs
      document.querySelectorAll('.form-group-devis').forEach(el => {
        el.style.display = 'block';
      });
      document.getElementById('lastName').required = true;
      document.getElementById('email').required = true;
      document.querySelectorAll('.required-devis').forEach(el => {
        el.style.display = 'inline';
      });
    } else {
      modalTitle.textContent = "Réserver un appel";
      // Masquer les champs devis
      document.querySelectorAll('.form-group-devis').forEach(el => {
        el.style.display = 'none';
      });
      document.getElementById('lastName').required = false;
      document.getElementById('email').required = false;
      document.querySelectorAll('.required-devis').forEach(el => {
        el.style.display = 'none';
      });
    }
    
    modal.classList.add("active");
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = "hidden";
    
    // Focus trap
    focusableElements = getFocusableElements();
    const firstInput = form.querySelector('input[type="text"], input[type="email"], input[type="tel"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
    
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = "";
    form.reset();
    
    // Retourner le focus à l'élément précédent
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
    
    document.removeEventListener('keydown', trapFocus);
    focusableElements = null;
  }

  openButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const modalType = button.getAttribute("data-modal-type") || "appel";
      openModal(modalType);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Gestion de la soumission du formulaire avec améliorations
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Vérification honeypot anti-spam
    const honeypot = document.getElementById("website").value;
    if (honeypot) {
      console.warn("Spam détecté via honeypot");
      return;
    }
    
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours...";
    
    const isDevis = modalTitle.textContent.includes("devis");
    const formData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      job: document.getElementById("job")?.value.trim() || '',
      city: document.getElementById("city")?.value.trim() || '',
      type: isDevis ? "devis" : "appel"
    };

    // Validation côté client
    if (!formData.firstName || !formData.phone) {
      alert("❌ Veuillez remplir au minimum le prénom et le téléphone.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    if (isDevis && (!formData.lastName || !formData.email)) {
      alert("❌ Pour un devis, veuillez remplir tous les champs obligatoires.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Vérifier si c'est du JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Réponse non-JSON du serveur");
      }

      const data = await response.json();

      if (data.success) {
        alert("✅ Merci ! Votre demande a été enregistrée avec succès. Nous vous contacterons bientôt.");
        closeModal();
      } else {
        alert("❌ " + (data.message || "Une erreur est survenue. Veuillez réessayer."));
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("❌ Erreur de connexion. Veuillez vérifier que le serveur est démarré et réessayer.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

ready(initModal);

// ============================================
// ANIMATIONS AU SCROLL
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.offer-card, .faq-item, .benefit-card'
  );

  animatedElements.forEach((el, index) => {
    if (el.classList.contains('benefit-card')) {
      const delay = parseInt(el.getAttribute('data-benefit')) * 0.1;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`;
    } else {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    }
    observer.observe(el);
  });
}

ready(initScrollAnimations);

// ============================================
// PROCESS CARDS REVEAL
// ============================================
function initProcessCardsReveal() {
  const processSection = document.querySelector('#process');
  if (!processSection) return;

  const cards = document.querySelectorAll('.process-card');
  const progressDots = document.querySelectorAll('.progress-dot');
  const progressLine = document.querySelector('#processProgressLine');
  const scrollHint = document.querySelector('#processScrollHint');
  
  if (cards.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealedCount = 1;
  
  function updateProgress(step) {
    progressDots.forEach((dot) => {
      const dotStep = parseInt(dot.getAttribute('data-step'), 10);
      if (dotStep <= step) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (progressLine) {
      const percentage = ((step - 1) / (cards.length - 1)) * 100;
      progressLine.style.setProperty('--progress-height', `${Math.max(0, percentage)}%`);
    }
  }
  
  updateProgress(1);

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const stepNumber = parseInt(card.getAttribute('data-step'), 10);

      if (entry.isIntersecting && !card.classList.contains('revealed')) {
        if (stepNumber <= revealedCount + 1) {
          revealCard(card, stepNumber, prefersReducedMotion);
          revealedCount = Math.max(revealedCount, stepNumber);
          updateProgress(revealedCount);
          
          if (revealedCount >= cards.length && scrollHint) {
            scrollHint.classList.add('hidden');
          }
        }
      }
    });
  }, observerOptions);

  cards.forEach((card, index) => {
    if (index > 0) {
      cardObserver.observe(card);
    }
  });

  function revealCard(card, stepNumber, reducedMotion) {
    if (reducedMotion) {
      card.classList.add('revealed');
      return;
    }

    card.classList.add('revealing');
    
    setTimeout(() => {
      card.classList.remove('revealing');
      card.classList.add('revealed');
    }, 900);
  }
}

ready(initProcessCardsReveal);

// ============================================
// PARALLAXE (désactivé sur mobile et prefers-reduced-motion)
// ============================================
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 640;

  if (prefersReducedMotion || isMobile) {
    return; // Désactiver le parallaxe
  }

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  }, { passive: true });
}

ready(initParallax);

