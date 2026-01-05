// ---
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont')
const smallMenu = document.querySelector('.header__sm-menu')
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu')
const headerHamMenuCloseBtn = document.querySelector(
  '.header__main-ham-menu-close'
)
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

hamMenuBtn.addEventListener('click', () => {
  if (smallMenu.classList.contains('header__sm-menu--active')) {
    smallMenu.classList.remove('header__sm-menu--active')
  } else {
    smallMenu.classList.add('header__sm-menu--active')
  }
  if (headerHamMenuBtn.classList.contains('d-none')) {
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  } else {
    headerHamMenuBtn.classList.add('d-none')
    headerHamMenuCloseBtn.classList.remove('d-none')
  }
})

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
  headerSmallMenuLinks[i].addEventListener('click', () => {
    smallMenu.classList.remove('header__sm-menu--active')
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  })
}

// ---
const headerLogoConatiner = document.querySelector('.header__logo-container')

headerLogoConatiner.addEventListener('click', () => {
  location.href = 'index.html'
})

// Scroll Visibility & Focus Logic
function initScrollAnimations() {
  const middleOfViewport = window.innerHeight / 2;

  // Elements to observe for initial fade-in and focus
  const selectors = [
    '.projects__row',
    '.project-cs-hero__content',
    '.project-details-overview__row',
    '.project-details__desc',
    '.project__row',
    '.project-details__showcase-img-cont',
    '.project-details__content-title',
    '.main-footer__lower',
    '.project-details__desc-para.bolded'
  ];

  const elements = document.querySelectorAll(selectors.join(', '));

  // Intersection Observer for initial fade-in
  const appearanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        entry.target.classList.remove('scroll-hidden');
      } else {
        // Optional: remove scroll-visible when out of view if you want them to fade out
        // entry.target.classList.remove('scroll-visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.classList.add('scroll-hidden');
    appearanceObserver.observe(el);
  });

  // Scroll function for "Focus" effect
  function updateFocus() {
    const vh = window.innerHeight;
    const center = vh / 2;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      
      // Calculate how close the element's center is to the viewport's center
      const distanceToCenter = Math.abs(center - elCenter);
      
      // If the element is near the center, or if it's a large section currently occupying the center
      const isLargeAndSpanning = rect.top < center && rect.bottom > center;
      const isCloseToCenter = distanceToCenter < vh * 0.35;

      if (isCloseToCenter || isLargeAndSpanning) {
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateFocus);
  window.addEventListener('resize', () => {
    // Update middle of viewport on resize
    updateFocus();
  });
  
  // Initial check
  updateFocus();
}

// Run on load
window.addEventListener('DOMContentLoaded', initScrollAnimations);

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';
  });

  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));

  const interactiveElements = document.querySelectorAll('a, button');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}
