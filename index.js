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

if (ikebanaInteractive && hero) {
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = hero.getBoundingClientRect();
    
    // Normalized position (-0.5 to 0.5)
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    // Group movement
    const moveX = x * 20;
    const moveY = y * 15;
    const rotate = x * 2;
    
    ikebanaInteractive.style.transition = 'transform 0.5s cubic-bezier(0.1, 0.5, 0.2, 1)';
    ikebanaInteractive.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;

    // Individual leaf "parallax" for more life
    ikebanaLeaves.forEach((leaf, index) => {
      const depth = (index + 1) * 0.5;
      const lx = x * 15 * depth;
      const ly = y * 10 * depth;
      const lr = x * 5 * depth;
      leaf.style.transform = `translate(${lx}px, ${ly}px) rotate(${lr}deg)`;
    });
  });

  // Reset on mouse leave
  hero.addEventListener('mouseleave', () => {
    ikebanaInteractive.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    ikebanaInteractive.style.transform = 'translate(0, 0) rotate(0)';
    
    ikebanaLeaves.forEach((leaf) => {
      leaf.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      leaf.style.transform = 'translate(0, 0) rotate(0)';
    });
  });
}
