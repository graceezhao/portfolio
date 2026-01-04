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

// function FadeInSection(props) {
//   const [isVisible, setVisible] = React.useState(true);
//   const domRef = React.useRef();
//   React.useEffect(() => {
//     const observer = new IntersectionObserver(entries => {
//       entries.forEach(entry => setVisible(entry.isIntersecting));
//     });
//     observer.observe(domRef.current);
//     return () => observer.unobserve(domRef.current);
//   }, []);
//   return (
//     <div
//       className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
//       ref={domRef}
//     >
//       {props.children}
//     </div>
//   );
// }

// $('input').on('change', function() {
//   $('body').toggleClass('blue');
// });

const projects = document.querySelector('.projects');

const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    projects.classList.add('is-visible');
  }
}, { threshold: 0.2 });

observer.observe(projects);

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

// run on scroll + load
window.addEventListener('scroll', updateActiveProject);
window.addEventListener('load', updateActiveProject);

// Scroll animations for project detail pages
const projectDetailsContent = document.querySelector('.project-details__content-main');
if (projectDetailsContent) {
  // Select all major content sections that should animate
  const projectDetailSections = document.querySelectorAll('.project-details-overview__row, .project-details-overview__column, .project-details__desc, .project__row, .project__column, .project-details__showcase-img-cont:not(.uipathimage):not(.healthcareimage), .project-details__desc-para.bolded, .project-details__showcase-img-cont.yxbtimeline, .project-details__showcase-img-cont.yxbinterviewing, .project-details__showcase-img-cont.uipathresearch, .project-details__showcase-img-cont.uipathtesting, .project-details__showcase-img-cont.uipath-prototyping, .project-details__showcase-img-cont.uipath-final-prototype, .project-details__showcase-img-cont.visitsummaries-final-prototype, .project-details__content-title');

  const projectObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
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
    if (section && section.offsetParent !== null) {
      section.classList.add('scroll-hidden');
      // Add slight delay based on index for staggered effect
      section.style.transitionDelay = `${(index % 3) * 0.1}s`;
      projectObserver.observe(section);
    }
  });
}


// Ikebana Interaction
const ikebanaInteractive = document.querySelector('.ikebana-interactive-wrapper');
const hero = document.querySelector('.home-hero');
const ikebanaLeaves = document.querySelectorAll('.ikebana-leaf');
const ikebanaStems = document.querySelectorAll('.ikebana-stem');
const ikebanaAccents = document.querySelectorAll('.ikebana-accent');

if (ikebanaInteractive && hero) {
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function animateIkebana() {
    currentX = lerp(currentX, targetX, 0.06);
    currentY = lerp(currentY, targetY, 0.06);

    const moveX = currentX * 30;
    const moveY = currentY * 22;
    const rotate = currentX * 3;

    ikebanaInteractive.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;

    ikebanaLeaves.forEach((leaf, index) => {
      const depth = 0.5 + (index * 0.3);
      const lx = currentX * 25 * depth;
      const ly = currentY * 18 * depth;
      const lr = currentX * 10 * depth;
      const scale = 1 + Math.abs(currentX) * 0.05 * depth;
      leaf.style.transform = `translate(${lx}px, ${ly}px) rotate(${lr}deg) scale(${scale})`;
    });

    ikebanaStems.forEach((stem, index) => {
      const depth = 0.2 + (index * 0.15);
      const opacity = 0.5 + Math.abs(currentX) * 0.4 * depth;
      stem.style.opacity = Math.min(opacity, 1);
    });

    ikebanaAccents.forEach((accent, index) => {
      const depth = 0.6 + (index * 0.2);
      const ax = currentX * 18 * depth;
      const ay = currentY * 12 * depth;
      accent.style.transform = `translate(${ax}px, ${ay}px)`;
    });

    requestAnimationFrame(animateIkebana);
  }

  animateIkebana();

  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = hero.getBoundingClientRect();
    
    targetX = (clientX - left) / width - 0.5;
    targetY = (clientY - top) / height - 0.5;
  });

    hero.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });
  }
}

// About Page Ikebana Interaction
const aboutIkebanaInteractive = document.querySelector('.ikebana-about-interactive-wrapper');
const aboutHero = document.querySelector('.about-hero');
const aboutLeaves = document.querySelectorAll('.ikebana-about-leaf');
const aboutStems = document.querySelectorAll('.ikebana-about-stem');
const aboutAccents = document.querySelectorAll('.ikebana-about-accent');

if (aboutIkebanaInteractive && aboutHero) {
  let aTargetX = 0, aTargetY = 0;
  let aCurrentX = 0, aCurrentY = 0;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function animateAboutIkebana() {
    aCurrentX = lerp(aCurrentX, aTargetX, 0.04); // Slower, more fluid lerp
    aCurrentY = lerp(aCurrentY, aTargetY, 0.04);

    const moveX = aCurrentX * 45; // Wider movement range
    const moveY = aCurrentY * 30;
    const rotate = aCurrentX * 4;

    aboutIkebanaInteractive.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;

    aboutLeaves.forEach((leaf, index) => {
      const depth = 0.4 + (index * 0.25);
      const lx = aCurrentX * 35 * depth;
      const ly = aCurrentY * 25 * depth;
      const lr = aCurrentX * 12 * depth;
      const scale = 1 + Math.abs(aCurrentX) * 0.08 * depth;
      leaf.style.transform = `translate(${lx}px, ${ly}px) rotate(${lr}deg) scale(${scale})`;
      leaf.style.opacity = 0.5 + Math.abs(aCurrentX) * 0.3; // Responsive opacity
    });

    aboutStems.forEach((stem, index) => {
      const depth = 0.3 + (index * 0.2);
      const strokeWidth = 1.2 + Math.abs(aCurrentX) * 0.5 * depth;
      stem.style.strokeWidth = strokeWidth;
    });

    aboutAccents.forEach((accent, index) => {
      const depth = 0.7 + (index * 0.15);
      const ax = aCurrentX * 22 * depth;
      const ay = aCurrentY * 15 * depth;
      accent.style.transform = `translate(${ax}px, ${ay}px)`;
    });

    requestAnimationFrame(animateAboutIkebana);
  }

  animateAboutIkebana();

  aboutHero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = aboutHero.getBoundingClientRect();
    
    aTargetX = (clientX - left) / width - 0.5;
    aTargetY = (clientY - top) / height - 0.5;
  });

  aboutHero.addEventListener('mouseleave', () => {
    aTargetX = 0;
    aTargetY = 0;
  });
}

