document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.ikebana-container');
  const hero = document.querySelector('.home-hero');
  const interactionGroups = document.querySelectorAll('.ikebana-interaction-group');

  // Reveal animation on load
  setTimeout(() => {
    if (container) {
      container.classList.add('is-visible');
    }
  }, 300);

  // Subtle mouse interaction
  if (hero && interactionGroups.length > 0) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = hero.getBoundingClientRect();
      
      // Calculate normalized mouse position (-0.5 to 0.5)
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      interactionGroups.forEach((group, index) => {
        // Different intensity for each group to create depth
        const factor = (index + 1) * 8; 
        const moveX = x * factor;
        const moveY = y * factor;
        
        group.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
      interactionGroups.forEach(group => {
        group.style.transform = `translate(0, 0)`;
      });
    });
  }
});
