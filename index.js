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

  // Handle carousel slide hover for caption cursor
  const updateCarouselSlideListeners = () => {
    const carouselSlides = document.querySelectorAll('.hero-carousel__slide');
    carouselSlides.forEach(slide => {
      slide.removeEventListener('mouseenter', onSlideEnter);
      slide.removeEventListener('mouseleave', onSlideLeave);
      slide.addEventListener('mouseenter', onSlideEnter);
      slide.addEventListener('mouseleave', onSlideLeave);
    });
  };

  const onSlideEnter = (e) => {
    cursor.classList.add('caption');
    cursor.textContent = e.target.getAttribute('alt') || 'View Project';
  };

  const onSlideLeave = () => {
    cursor.classList.remove('caption');
    cursor.textContent = '';
  };

  updateInteractiveListeners();
  updateCarouselSlideListeners();
  
  // Optional: re-run if content changes
  const observer = new MutationObserver(() => {
    updateInteractiveListeners();
    updateCarouselSlideListeners();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Hero Carousel
const heroCarousel = document.querySelector('.hero-carousel');

if (heroCarousel) {
  const track = heroCarousel.querySelector('.hero-carousel__track');
  const originalSlides = Array.from(heroCarousel.querySelectorAll('.hero-carousel__slide'));
  const prevBtn = heroCarousel.querySelector('.hero-carousel__btn--prev');
  const nextBtn = heroCarousel.querySelector('.hero-carousel__btn--next');
  const dotsContainer = heroCarousel.querySelector('.hero-carousel__dots');
  
  const totalOriginalSlides = originalSlides.length;
  
  // Clone slides for infinite loop
  // We clone all slides once to the beginning and once to the end
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('hero-carousel__slide--clone');
    track.appendChild(clone);
  });
  
  originalSlides.reverse().forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('hero-carousel__slide--clone');
    track.insertBefore(clone, track.firstChild);
  });
  // Restore order for reference if needed
  originalSlides.reverse();

  const allSlides = Array.from(heroCarousel.querySelectorAll('.hero-carousel__slide'));
  let currentIndex = totalOriginalSlides; // Start at the first original slide
  let isTransitioning = false;

  // Create dots based on original slides only
  originalSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('hero-carousel__dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      if (isTransitioning) return;
      goToSlide(i + totalOriginalSlides);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.hero-carousel__dot');

  function updateCarousel(withTransition = true) {
    const slideWidth = 45; // percent
    const offset = 27.5; // percent to center
    
    if (withTransition) {
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
      track.style.transition = 'none';
    }

    const translateValue = offset - (currentIndex * (slideWidth + 1)); 
    track.style.transform = `translateX(${translateValue}%)`;
    
    allSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    // Update dots based on equivalent original index
    const dotIndex = (currentIndex - totalOriginalSlides + totalOriginalSlides) % totalOriginalSlides;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === dotIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateCarousel();
  }

  function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateCarousel();
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    
    // Check if we are on a clone and jump to the real slide
    if (currentIndex >= totalOriginalSlides * 2) {
      currentIndex = totalOriginalSlides;
      updateCarousel(false);
    } else if (currentIndex < totalOriginalSlides) {
      currentIndex = totalOriginalSlides * 2 - 1;
      updateCarousel(false);
    }
  });

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Simplified Mouse Dragging for Infinite Loop
  let isMouseDown = false;
  let mouseStartX = 0;

  heroCarousel.addEventListener('mousedown', (e) => {
    if (isTransitioning) return;
    isMouseDown = true;
    mouseStartX = e.pageX;
  });

  heroCarousel.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
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
    if (isTransitioning) return;
    touchStartX = e.changedTouches[0].screenX;
  });

  heroCarousel.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
  });

  // Initialize without transition to set initial position
  updateCarousel(false);
}