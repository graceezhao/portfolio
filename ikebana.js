document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.ikebana-container');
  const hero = document.querySelector('.home-hero');
  const interactionGroups = document.querySelectorAll('.ikebana-interaction-group');

  // Reveal animation on load
  setTimeout(() => {
    if (container) {
      container.classList.add('is-visible');
    }
  }, 500);

  // Subtle mouse interaction (Parallax & Lean)
  if (hero && interactionGroups.length > 0) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = hero.getBoundingClientRect();
      
      // Calculate normalized mouse position (-0.5 to 0.5)
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      interactionGroups.forEach((group, index) => {
        // Depth factor based on index
        const factor = (index + 1) * 12; 
        const moveX = x * factor;
        const moveY = y * (factor / 2);
        
        // Gentle rotation towards mouse position
        const rotate = x * 2.5;
        
        group.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
      });
    });

    // Reset on mouse leave with smooth transition
    hero.addEventListener('mouseleave', () => {
      interactionGroups.forEach(group => {
        group.style.transform = `translate(0, 0) rotate(0deg)`;
      });
    });
  }
});
