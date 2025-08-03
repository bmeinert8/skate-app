document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const selectionMenu = document.querySelector('.js-selection');

  // Load videos from JSON
  fetch('videos.json')
    .then((response) => response.json())
    .then((data) => {
      // Store videos in a variable for later use
      const videos = data;

      // Function to render videos into a specified list
      function renderVideos(listId, videoList) {
        const listElement = document.querySelector(`#${listId}`);
        listElement.innerHTML = '';
        videoList.forEach((video) => {
          const videoArticle = `
          <li class="video-article">
            <img class="video-thumbnail" src="${video.thumbnailUrl}" alt="${video.title} thumbnail">
            <h3 class="video-title">${video.title}</h3>
            <button class="more-icon js-elipsis" aria-label="Expand video description">
              <img src="./images/more.png" alt="Expand icon">
            </button>
            <button class="collapse-icon js-collapse hidden" aria-label="Collapse video description">
              <img src="./images/collapse.png" alt="Collapse icon">
            </button>
            <p class="video-description js-video-description hidden">${video.description}</p>
          </li>
          `;
          listElement.insertAdjacentHTML('beforeend', videoArticle);
        });
      }

      // Render all videos into the "New" list initially
      const sortedNewVideos = [...videos].sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );
      renderVideos('new', sortedNewVideos);

      // Toggle selection menu and render filtered videos
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

          // Filter videos based on the target list
          let filteredVideos = videos;
          if (targetId === 'popular') {
            filteredVideos = videos.filter((video) => video.isPopular);
          } else if (targetId === 'trending') {
            filteredVideos = videos.filter((video) => video.isTrending);
          } else if (targetId === 'new') {
            filteredVideos = [...videos].sort(
              (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
            );
          }

          // Clear all lists
          const lists = document.querySelectorAll(
            'ul[id="new"], ul[id="popular"], ul[id="trending"]'
          );
          lists.forEach((list) => {
            list.innerHTML = '';
            list.classList.add('list-hidden');
          });

          // Render filtered videos to the target list and show it
          renderVideos(targetId, filteredVideos);
          document
            .querySelector(`#${targetId}`)
            .classList.remove('list-hidden');
        });
      });

      //Toggle filter list visibility
      const filterButton = document.querySelector('.filter-button');
      const filterList = document.querySelector('#filter-list');
      filterButton.addEventListener('click', (e) => {
        e.preventDefault(); //Preven form submission from default behavior (had unexpected scrolling on click)
        const isHidden = filterList.classList.contains('hidden');
        filterList.classList.toggle('hidden');
        filterButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        // Revent scrolling by restoring focus to the button
        filterButton.focus();
      });
    })
    .catch((error) => {
      console.error('Error loading videos:', error);
    });

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

  // Event delegation for expand/collapse buttons
  const sectionMedia = document.querySelector('.section-media');
  sectionMedia.addEventListener('click', (e) => {
    // Find the closest video article to the clicked button
    const videoArticle = e.target.closest('.video-article');
    if (!videoArticle) return; // Exit if no video article found

    // Get the elements within this video article
    const expandButton = videoArticle.querySelector('.js-elipsis');
    const collapseButton = videoArticle.querySelector('.js-collapse');
    const description = videoArticle.querySelector('.js-video-description');

    // Handle expand button click
    if (e.target.closest('.js-elipsis')) {
      description.classList.remove('hidden');
      collapseButton.classList.remove('hidden');
      expandButton.classList.add('hidden');
    }

    // Handle collapse button click
    if (e.target.closest('.js-collapse')) {
      description.classList.add('hidden');
      collapseButton.classList.add('hidden');
      expandButton.classList.remove('hidden');
    }
  });
});
