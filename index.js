document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const selectionMenu = document.querySelector('.js-selection');
  const moreButton = document.querySelector('.js-elipsis');
  const videoDescription = document.querySelector('.js-video-description');
  const collapseButton = document.querySelector('.js-collapse');

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

      // Get the href attribute (e.g., "#new") and remove the "#" to match the list ID
      const targetId = link.getAttribute('href').substring(1);

      // Get all lists
      const lists = document.querySelectorAll(
        'ul[id="new"], ul[id="popular"], ul[id="trending"]'
      );

      // Hide all lists and show the target list
      lists.forEach((list) => {
        if (list.id === targetId) {
          list.classList.remove('list-hidden');
        } else {
          list.classList.add('list-hidden');
        }
      });
    });
  });

  // Toggle video description visibility when the more icon is clicked
  moreButton.addEventListener('click', () => {
    videoDescription.classList.toggle('hidden');
    collapseButton.classList.remove('hidden');
    moreButton.classList.toggle('hidden');
  });

  // Collapse video description when the collapse icon is clicked
  collapseButton.addEventListener('click', () => {
    videoDescription.classList.add('hidden');
    collapseButton.classList.add('hidden');
    moreButton.classList.remove('hidden');
  });
});
