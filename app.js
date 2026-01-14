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

// Throttle pour optimiser les événements scroll/resize (60fps = ~16ms)
function throttle(func, wait = 16) {
  let timeout;
  let previous = 0;
  return function(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
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
  if (!header) return;

  // Vérifier si on est sur une page de blog ou d'article
  const isBlogPage = document.querySelector("body.blog-page") || 
                     window.location.pathname.includes("blog") || 
                     window.location.pathname.includes("article-");
  const isArticlePage = document.querySelector("body.article-page") || 
                        document.querySelector(".article-page") ||
                        document.querySelector("#article-content");

  // Si on est sur une page de blog ou d'article, rendre le header toujours visible
  if (isBlogPage || isArticlePage) {
    header.classList.add("header-always-visible");
    return; // Ne pas appliquer la logique de visibilité conditionnelle
  }

  // Sur la page principale, rendre le header toujours visible (sticky)
  header.classList.add("header-visible");
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

  // Fermer le menu au resize si on passe en desktop (throttlé)
  window.addEventListener('resize', throttle(() => {
    if (window.innerWidth > 768 && menuToggle.classList.contains('active')) {
      toggleMenu();
    }
  }, 100), { passive: true });
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

  // Dupliquer les éléments une fois pour créer une boucle infinie fluide
  // On duplique 1 fois pour avoir exactement 2 sets (original + copie)
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    carouselTrack.appendChild(clone);
  });

  // Créer le bouton précédent (même s'il est masqué)
  const prevButton = document.createElement('button');
  prevButton.className = 'hero-arrow hero-arrow-left';
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', 'Précédent');
  prevButton.innerHTML = '←';
  carouselContainer.appendChild(prevButton);

  // L'animation CSS déplace de -50% ce qui correspond exactement à la moitié
  // des éléments (le set original), créant une boucle infinie fluide

  // Pause au survol pour permettre de regarder les éléments
  carouselContainer.addEventListener('mouseenter', () => {
    carouselTrack.classList.add('paused');
  });

  carouselContainer.addEventListener('mouseleave', () => {
    carouselTrack.classList.remove('paused');
  });
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

  window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  }, 16), { passive: true });
}

ready(initParallax);

// ============================================
// FILTRAGE PAR CATÉGORIES BLOG
// ============================================
function initBlogCategories() {
  const categoryButtons = document.querySelectorAll('.blog-category-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  
  if (categoryButtons.length === 0 || blogCards.length === 0) return;
  
  let filterTimeout = null;
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      
      // Annuler les timeouts précédents si l'utilisateur clique rapidement
      if (filterTimeout) {
        clearTimeout(filterTimeout);
      }
      
      // Mettre à jour les boutons actifs
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filtrer les articles avec animation fluide
      let visibleIndex = 0;
      blogCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        // Support des catégories multiples (séparées par des espaces) et de 'all'
        const cardCategories = cardCategory ? cardCategory.split(' ') : [];
        const shouldShow = category === 'all' || cardCategories.includes(category);
        
        if (shouldShow) {
          // Afficher la carte immédiatement
          card.style.display = '';
          // Retirer la classe hidden
          card.classList.remove('blog-card-hidden');
          // Réinitialiser le délai d'animation pour effet cascade
          card.style.animationDelay = `${visibleIndex * 0.1}s`;
          // Forcer le reflow pour déclencher l'animation
          void card.offsetHeight;
          card.classList.add('blog-card-visible');
          visibleIndex++;
        } else {
          // Masquer la carte avec transition
          card.classList.remove('blog-card-visible');
          card.classList.add('blog-card-hidden');
        }
      });
      
      // Après la transition, cacher complètement les cartes masquées
      filterTimeout = setTimeout(() => {
        blogCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          // Support des catégories multiples (séparées par des espaces) et de 'all'
          const cardCategories = cardCategory ? cardCategory.split(' ') : [];
          const shouldShow = category === 'all' || cardCategories.includes(category);
          if (!shouldShow && card.classList.contains('blog-card-hidden')) {
            card.style.display = 'none';
          }
        });
      }, 300);
    });
  });
  
  // Initialiser avec la catégorie "all" active par défaut
  const allButton = Array.from(categoryButtons).find(btn => btn.getAttribute('data-category') === 'all');
  if (allButton) {
    allButton.click();
  }
}

ready(initBlogCategories);

