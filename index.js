document.addEventListener('DOMContentLoaded', () => {
  fetch('videos.json')
    .then((response) => response.json())
    .then((data) => {
      // Store videos in a variable for later use
      const videos = data;

      // Function to render videos into a specified list
      function renderVideos(listId, videoList) {
        const listElement = document.querySelector(`#${listId}`);
        listElement.innerHTML = ''; // Clear existing content
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

      // Render all videos into the "New" list initially, sorted by dateAdded (newest first)
      const sortedNewVideos = [...videos].sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );
      renderVideos('new', sortedNewVideos);

      // Toggle selection menu and render filtered videos
      const selectionMenu = document.querySelector('.js-selection');
      selectionMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          selectionMenu.querySelectorAll('a').forEach((item) => {
            item.classList.remove('selected');
          });
          link.classList.add('selected');
          const targetId = link.getAttribute('href').substring(1);

          // Filter and sort videos based on the target list and current filters
          let filteredVideos = videos;
          if (currentCategory) {
            filteredVideos = filteredVideos.filter(
              (video) => video.category === currentCategory
            );
          }
          if (currentSearchQuery) {
            filteredVideos = filteredVideos.filter(
              (video) =>
                video.title.toLowerCase().includes(currentSearchQuery) ||
                video.description.toLowerCase().includes(currentSearchQuery)
            );
          }
          if (targetId === 'popular') {
            filteredVideos = filteredVideos.filter((video) => video.isPopular);
          } else if (targetId === 'trending') {
            filteredVideos = filteredVideos.filter((video) => video.isTrending);
          } else if (targetId === 'new') {
            filteredVideos = [...filteredVideos].sort(
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

      // Expand/collapse video descriptions
      const sectionMedia = document.querySelector('.section-media');
      sectionMedia.addEventListener('click', (e) => {
        const videoArticle = e.target.closest('.video-article');
        if (!videoArticle) return;
        const expandButton = videoArticle.querySelector('.js-elipsis');
        const collapseButton = videoArticle.querySelector('.js-collapse');
        const description = videoArticle.querySelector('.js-video-description');
        if (e.target.closest('.js-elipsis')) {
          description.classList.remove('hidden');
          collapseButton.classList.remove('hidden');
          expandButton.classList.add('hidden');
        }
        if (e.target.closest('.js-collapse')) {
          description.classList.add('hidden');
          collapseButton.classList.add('hidden');
          expandButton.classList.remove('hidden');
        }
      });

      // Track the current category filter and search query
      let currentCategory = null;
      let currentSearchQuery = '';

      // Toggle filter list visibility
      const filterButton = document.querySelector('.filter-button');
      const filterList = document.querySelector('#filter-list');
      filterButton.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = filterList.classList.contains('hidden');
        filterList.classList.toggle('hidden');
        filterButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        filterButton.focus();
      });

      // Handle category filter changes
      const categoryRadios = document.querySelectorAll(
        'input[name="category"]'
      );
      categoryRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
          currentCategory = radio.checked ? radio.value : null;
          // Get the currently visible list
          const visibleList = document.querySelector(
            'ul[id="new"]:not(.list-hidden), ul[id="popular"]:not(.list-hidden), ul[id="trending"]:not(.list-hidden)'
          );
          const targetId = visibleList ? visibleList.id : 'new';
          // Filter and sort videos based on the current list, category, and search query
          let filteredVideos = videos;
          if (currentSearchQuery) {
            filteredVideos = filteredVideos.filter(
              (video) =>
                video.title.toLowerCase().includes(currentSearchQuery) ||
                video.description.toLowerCase().includes(currentSearchQuery)
            );
          }
          if (currentCategory) {
            filteredVideos = filteredVideos.filter(
              (video) => video.category === currentCategory
            );
          }
          if (targetId === 'popular') {
            filteredVideos = filteredVideos.filter((video) => video.isPopular);
          } else if (targetId === 'trending') {
            filteredVideos = filteredVideos.filter((video) => video.isTrending);
          } else if (targetId === 'new') {
            filteredVideos = [...filteredVideos].sort(
              (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
            );
          }
          // Clear and render videos to the current list
          const lists = document.querySelectorAll(
            'ul[id="new"], ul[id="popular"], ul[id="trending"]'
          );
          lists.forEach((list) => {
            list.innerHTML = '';
            if (list.id !== targetId) {
              list.classList.add('list-hidden');
            }
          });
          renderVideos(targetId, filteredVideos);
          document
            .querySelector(`#${targetId}`)
            .classList.remove('list-hidden');
          // Close the filter list and update aria-expanded
          filterList.classList.add('hidden');
          filterButton.setAttribute('aria-expanded', 'false');
          filterButton.focus();
        });
      });

      // Handle real-time search input
      const searchInput = document.querySelector('#search-input');
      searchInput.addEventListener('input', () => {
        currentSearchQuery = searchInput.value.trim().toLowerCase();
        // Get the currently visible list
        const visibleList = document.querySelector(
          'ul[id="new"]:not(.list-hidden), ul[id="popular"]:not(.list-hidden), ul[id="trending"]:not(.list-hidden)'
        );
        const targetId = visibleList ? visibleList.id : 'new';
        // Filter and sort videos based on the current list, category, and search query
        let filteredVideos = videos;
        if (currentSearchQuery) {
          filteredVideos = filteredVideos.filter(
            (video) =>
              video.title.toLowerCase().includes(currentSearchQuery) ||
              video.description.toLowerCase().includes(currentSearchQuery)
          );
        }
        if (currentCategory) {
          filteredVideos = filteredVideos.filter(
            (video) => video.category === currentCategory
          );
        }
        if (targetId === 'popular') {
          filteredVideos = filteredVideos.filter((video) => video.isPopular);
        } else if (targetId === 'trending') {
          filteredVideos = filteredVideos.filter((video) => video.isTrending);
        } else if (targetId === 'new') {
          filteredVideos = [...filteredVideos].sort(
            (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
          );
        }
        // Clear and render videos to the current list
        const lists = document.querySelectorAll(
          'ul[id="new"], ul[id="popular"], ul[id="trending"]'
        );
        lists.forEach((list) => {
          list.innerHTML = '';
          if (list.id !== targetId) {
            list.classList.add('list-hidden');
          }
        });
        renderVideos(targetId, filteredVideos);
        document.querySelector(`#${targetId}`).classList.remove('list-hidden');
      });
    })
    .catch((error) => {
      console.error('Error loading videos:', error);
    });
});
