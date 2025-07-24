document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const selectionMenu = document.querySelector('.js-selection');

  // Toggle the navigation menu when the hamburger icon is clicked
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
  });

  // Close the navigation menu when a link is clicked
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Toggle selection menu when the selection is clicked
  selectionMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      // Prevent default link behavior if needed
      e.preventDefault();

      // Remove 'selected' class from all links
      selectionMenu.querySelectorAll('a').forEach((item) => {
        item.classList.remove('selected');
      });

      // Add 'selected' class to clicked link
      link.classList.add('selected');
    });
  });
});
