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

// Scroll animations for project detail pages
const projectDetailsContent = document.querySelector('.project-details__content-main');
if (projectDetailsContent) {
  // Select ONLY top-level sections to avoid double-hiding parents and children
  const projectDetailSections = document.querySelectorAll('.project-details-overview__row, .project-details__desc, .project__row, .project-details__showcase-img-cont:not(.uipathimage):not(.healthcareimage)');

  const projectObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        entry.target.classList.remove('scroll-hidden');
        projectObserver.unobserve(entry.target);
      }
    });
  }, projectObserverOptions);

  projectDetailSections.forEach((section, index) => {
    if (section) {
      // Check if already in viewport to avoid abrupt hiding
      const rect = section.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isInViewport) {
        section.classList.add('scroll-hidden');
      } else {
        // If in viewport, maybe add a slight fade in anyway but don't start at 0 opacity
        section.classList.add('scroll-visible');
      }
      
      // Add slight delay based on index for staggered effect
      section.style.transitionDelay = `${(index % 3) * 0.1}s`;
      projectObserver.observe(section);
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