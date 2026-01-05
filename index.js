// ---
// Page Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-reveal');
});

// Identify if we are on the index page
const isIndexPage = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname === '/' || 
                    window.location.pathname.endsWith('/') ||
                    (!window.location.pathname.includes('.html') && !window.location.pathname.includes('/projects/') && !window.location.pathname.includes('/about'));

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

// Index Page Specific Animations
if (isIndexPage) {
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
}

// Scroll Reveal Animations for all pages EXCEPT index.html
if (!isIndexPage) {
  // Select major sections and content blocks to reveal on scroll
  const revealSelectors = [
    '.project-details-overview__row',
    '.project-details__desc',
    '.project__row',
    '.project-details__showcase-img-cont:not(.uipathimage):not(.healthcareimage)',
    '.about__content-title',
    '.about__content-details-para',
    '.project-cs-hero__content > *',
    '.main-footer'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(', '));

  const revealObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        entry.target.classList.remove('scroll-hidden');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach((el, index) => {
    if (el) {
      // Check if already in viewport to avoid abrupt hiding on load
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isInViewport) {
        el.classList.add('scroll-hidden');
      } else {
        el.classList.add('scroll-visible');
      }
      
      // Add slight delay for staggered effect
      el.style.transitionDelay = `${(index % 3) * 0.1}s`;
      revealObserver.observe(el);
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