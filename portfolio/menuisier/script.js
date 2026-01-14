// Script pour le site menuisier
// Navigation mobile
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('is-open'));
  });
}

// Slider réalisations
const sliderDots = document.querySelectorAll('.slider-dot');
const sliderPrev = document.querySelector('.slider-btn--prev');
const sliderNext = document.querySelector('.slider-btn--next');
const realisationSlides = document.querySelectorAll('.realisation-slide');
let currentSlide = 0;

function showSlide(index) {
  realisationSlides.forEach((slide, i) => {
    slide.style.display = i === index ? 'grid' : 'none';
  });
  
  sliderDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

if (sliderDots.length > 0) {
  sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });
}

if (sliderPrev) {
  sliderPrev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + realisationSlides.length) % realisationSlides.length;
    showSlide(currentSlide);
  });
}

if (sliderNext) {
  sliderNext.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % realisationSlides.length;
    showSlide(currentSlide);
  });
}

// Initialiser le slider
if (realisationSlides.length > 0) {
  showSlide(0);
}

// FAQ accordéon
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-item__question');
  if (question) {
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      } else {
        question.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// Formulaire de contact
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique d'envoi du formulaire
    alert('Merci pour votre demande ! Nous vous recontacterons sous 48h.');
    contactForm.reset();
  });
}

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

