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
  const slides = Array.from(heroCarousel.querySelectorAll('.hero-carousel__slide'));
  const prevBtn = heroCarousel.querySelector('.hero-carousel__btn--prev');
  const nextBtn = heroCarousel.querySelector('.hero-carousel__btn--next');
  const dotsContainer = heroCarousel.querySelector('.hero-carousel__dots');
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('hero-carousel__dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.hero-carousel__dot');

    function updateCarousel() {
      // Calculate centering offset
      // Slide width is 45%, container is 100%. 
      // To center: (100% - 45%) / 2 = 27.5%
      const slideWidth = 45; // percent
      const offset = 27.5; // percent to center
      
      // We also have 0.4rem margin on each side of the slide.
      // 0.8rem total margin per slide. In % this is roughly 1%
      const translateValue = offset - (currentIndex * (slideWidth + 1)); 
      track.style.transform = `translateX(${translateValue}%)`;
    
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

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

  // Mouse / Touch Dragging logic
  function touchStart(index) {
    return function(event) {
      isDragging = true;
      startX = getPositionX(event);
      animationID = requestAnimationFrame(animation);
      track.style.transition = 'none';
    }
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < totalSlides - 1) currentIndex += 1;
    if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

    updateCarousel();
  }

  function touchMove(event) {
    if (isDragging) {
      const currentX = getPositionX(event);
      currentTranslate = prevTranslate + currentX - startX;
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    if (isDragging) {
      // Manual drag is a bit complex with the centering logic.
      // For now, let's keep it simple: use the standard buttons/dots for main navigation
      // and support basic swipe.
      requestAnimationFrame(animation);
    }
  }

  // Simplified Mouse Dragging
  let isMouseDown = false;
  let mouseStartX = 0;

  heroCarousel.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    mouseStartX = e.pageX;
    track.style.transition = 'none';
  });

  heroCarousel.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const x = e.pageX;
    const walk = x - mouseStartX;
    // We could visually move the track here, but it conflicts with the percentage-based centering.
    // Let's implement a threshold-based slide change.
  });

  heroCarousel.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    const x = e.pageX;
    const dist = x - mouseStartX;
    if (dist < -50) nextSlide();
    else if (dist > 50) prevSlide();
    else updateCarousel();
  });

  heroCarousel.addEventListener('mouseleave', () => {
    if (isMouseDown) {
      isMouseDown = false;
      updateCarousel();
    }
  });

  // Touch support
  let touchStartX = 0;
  heroCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  heroCarousel.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
  });

  // Initialize
  updateCarousel();
}