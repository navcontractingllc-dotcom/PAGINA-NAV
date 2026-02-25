/* ══════════════════════════════════════
   NAV CONTRACTING LLC — main.js
   Optimized: event delegation, no inline handlers
   ══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── MOBILE MENU ── */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu   = document.getElementById('mobileMenu');

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  // Close on any menu link click
  mobileMenu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });

  /* ── CAROUSEL ── */
  const track = document.getElementById('carouselTrack');
  const slides = track.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.carousel-dot');
  let current  = 0;
  let autoSlide;

  function getPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function updateCarousel() {
    const gap    = window.innerWidth <= 600 ? 10 : 16;
    const slideW = slides[0].offsetWidth + gap;
    track.style.transform = `translateX(-${current * slideW}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function nextSlide() {
    const max = slides.length - getPerView();
    current = current >= max ? 0 : current + 1;
    updateCarousel();
  }

  function prevSlide() {
    const max = slides.length - getPerView();
    current = current <= 0 ? max : current - 1;
    updateCarousel();
  }

  function goToSlide(i) {
    current = i;
    updateCarousel();
  }

  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  // Carousel controls (event delegation)
  document.querySelector('.carousel-controls').addEventListener('click', function (e) {
    const btn = e.target.closest('.carousel-btn, .carousel-dot');
    if (!btn) return;
    stopAutoSlide();
    if (btn.classList.contains('carousel-dot')) {
      goToSlide([...dots].indexOf(btn));
    } else if (btn.getAttribute('aria-label') === 'Next slide') {
      nextSlide();
    } else {
      prevSlide();
    }
    startAutoSlide();
  });

  window.addEventListener('resize', updateCarousel);
  startAutoSlide();

  /* ── GALLERY FILTER ── */
  const galleryFilters = document.getElementById('galleryFilters');
  const galleryItems   = document.querySelectorAll('.gallery-item');

  galleryFilters.addEventListener('click', function (e) {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    galleryItems.forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
  });

  /* ── JUMP TO GALLERY (from services) ── */
  function jumpToGallery(cat) {
    document.getElementById('galeria').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const btn = galleryFilters.querySelector(`[data-cat="${cat}"]`);
      if (btn) btn.click();
    }, 600);
  }

  // Wire up circle service cards via event delegation
  const circleServices = document.querySelector('.circle-services');
  if (circleServices) {
    circleServices.addEventListener('click', function (e) {
      const card = e.target.closest('.circle-card');
      if (!card) return;
      jumpToGallery(card.dataset.gallery);
    });
    circleServices.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.circle-card');
      if (!card) return;
      e.preventDefault();
      jumpToGallery(card.dataset.gallery);
    });
  }

  /* ── LIGHTBOX ── */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  function openLightbox(el) {
    const img = el.querySelector('img');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Lightbox close button
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

  // Close on backdrop click (not on the image itself)
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  // Gallery & carousel click-to-lightbox (event delegation)
  document.getElementById('galleryGrid').addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(item);
  });

  track.addEventListener('click', function (e) {
    const slide = e.target.closest('.carousel-slide');
    if (slide) openLightbox(slide);
  });

})();