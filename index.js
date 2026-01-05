// ---
// Page Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-reveal');
});

const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont')
const smallMenu = document.querySelector('.header__sm-menu')
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu')
const headerHamMenuCloseBtn = document.querySelector(
  '.header__main-ham-menu-close'
)
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

if (hamMenuBtn && smallMenu && headerHamMenuBtn && headerHamMenuCloseBtn) {
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
}

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
  headerSmallMenuLinks[i].addEventListener('click', () => {
    if (smallMenu) smallMenu.classList.remove('header__sm-menu--active')
    if (headerHamMenuBtn) headerHamMenuBtn.classList.remove('d-none')
    if (headerHamMenuCloseBtn) headerHamMenuCloseBtn.classList.add('d-none')
  })
}

// ---
const headerLogoConatiner = document.querySelector('.header__logo-container')

if (headerLogoConatiner) {
  headerLogoConatiner.addEventListener('click', () => {
    // Check if we are in a subdirectory
    const isInProjects = window.location.pathname.includes('/projects/')
    location.href = isInProjects ? '../index.html' : 'index.html'
  })
}

const projects = document.querySelector('.projects');

if (projects) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      projects.classList.add('is-visible');
    }
  }, { threshold: 0.2 });

  observer.observe(projects);
}

const rows = document.querySelectorAll('.projects__row');

function updateActiveProject() {
  const middleOfViewport = window.innerHeight / 2;

  rows.forEach(row => {
    const rect = row.getBoundingClientRect();
    const rowMiddle = rect.top + rect.height / 2;

    // distance from viewport center
    const distance = Math.abs(middleOfViewport - rowMiddle);

    if (distance < rect.height / 2) {  // close enough to center
      row.classList.add('is-active');
    } else {
      row.classList.remove('is-active');
    }
  });
}

if (rows.length > 0) {
  // run on scroll + load
  window.addEventListener('scroll', updateActiveProject);
  window.addEventListener('load', updateActiveProject);
}

// Scroll animations for all pages except index.html
const isIndexPage = window.location.pathname.endsWith('index.html') || 
                   window.location.pathname.endsWith('/') || 
                   window.location.pathname === '' ||
                   (!window.location.pathname.includes('about.html') && !window.location.pathname.includes('/projects/'));

if (!isIndexPage) {
  // Select sections to animate on about.html and project pages
  const sectionsToAnimate = document.querySelectorAll(
    '.about__content, .project-details-overview__row, .project-details__desc, .project__row, .project-details__showcase-img-cont:not(.uipathimage):not(.healthcareimage)'
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        entry.target.classList.remove('scroll-hidden');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sectionsToAnimate.forEach((section, index) => {
    if (section) {
      const rect = section.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isInViewport) {
        section.classList.add('scroll-hidden');
      } else {
        section.classList.add('scroll-visible');
      }
      
      section.style.transitionDelay = `${(index % 3) * 0.1}s`;
      scrollObserver.observe(section);
    }
  });
}

const cursor = document.querySelector('.custom-cursor');

if (cursor) {
  // Move cursor
  document.addEventListener('mousemove', e => {
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';
  });

  // Shrink/Bounce on click
  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
  });

  // Expand / color when hovering interactive elements
  const updateInteractiveListeners = () => {
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    
    interactiveElements.forEach(el => {
      // Avoid duplicate listeners if this is called multiple times
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });
  };

  const onMouseEnter = () => cursor.classList.add('hover');
  const onMouseLeave = () => cursor.classList.remove('hover');

  updateInteractiveListeners();
  
  // Optional: re-run if content changes
  const observer = new MutationObserver(updateInteractiveListeners);
  observer.observe(document.body, { childList: true, subtree: true });
}

// Hero Carousel
const heroCarousel = document.querySelector('.hero-carousel');

if (heroCarousel) {
  const track = heroCarousel.querySelector('.hero-carousel__track');
  const slides = heroCarousel.querySelectorAll('.hero-carousel__slide');
  const prevBtn = heroCarousel.querySelector('.hero-carousel__btn--prev');
  const nextBtn = heroCarousel.querySelector('.hero-carousel__btn--next');
  const dotsContainer = heroCarousel.querySelector('.hero-carousel__dots');
  
  let currentIndex = 0;
  const totalSlides = slides.length;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('hero-carousel__dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.hero-carousel__dot');

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  let touchStartX = 0;
  let touchEndX = 0;

  heroCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  heroCarousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
  });
}