document.addEventListener('DOMContentLoaded', function() {
  fetch('storybooks.json')
    .then(response => response.json())
    .then(data => {
      const sections = document.getElementById('storybook-sections');
      const searchInput = document.getElementById('searchInput');
      const categoryFilter = document.getElementById('categoryFilter');
      const modal = document.getElementById('noResultsModal');
      const closeModal = document.getElementById('closeModal');
      const retryButton = document.getElementById('retryButton');

      // Function to render Featured Stories
      function renderFeaturedStories() {
        const featuredBooks = data.featuredBooks; // Get featured stories
        const featuredSection = document.createElement('section');
        featuredSection.classList.add('py-12', 'bg-gradient-to-r', 'from-purple-50', 'via-pink-100', 'to-red-100');
        featuredSection.innerHTML = `
                    <div class="container mx-auto text-center">
                        <h2 class="text-3xl font-bold mb-8 text-purple-700">Featured Stories</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            ${featuredBooks.map(book => `
                                <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 duration-300 flex flex-col h-full" data-book='${JSON.stringify(book)}'>
                                    <img src="${book.image}" alt="${book.title}" class="w-full h-48 object-cover rounded-lg mb-4">
                                    <div class="flex-1">
                                        <h3 class="text-xl font-bold mb-2">${book.title}</h3>
                                        <p class="text-gray-600 mb-4">${book.description}</p>
                                    </div>
                                    <button class="read-now-btn py-2 px-6 text-lg font-bold mt-auto">
                                        Start Adventure
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
        sections.appendChild(featuredSection);
      }

      // Function to render other categories
      function renderOtherCategories(filter = "all", query = "") {
        const categories = {
          plainStorybooks: "Plain Storybooks",
          featuredBooks : "Storybook Narration",
          readWithMe: "Read Along Storybooks",
          audiobooks: "Audiobooks",
          videoStorybooks: "English Video Storybooks",
          tagalogVideoStorybooks: "Tagalog Video Storybooks"
        };

        let found = false; // Track if any stories are found
        let contentHtml = ""; // Holds content to be added after filtering

        // Clear the previous content inside the sections container
        sections.innerHTML = ''; // This will remove all previous content from the container

        // Loop through each category
        Object.keys(categories).forEach(categoryKey => {
          if (filter !== "all" && categoryKey !== filter) return; // Skip if category doesn't match filter

          const books = data[categoryKey]; // Get books for the category
          const filteredBooks = query ?
            books.filter(book => book.title.toLowerCase().includes(query)) :
            books;

          if (filteredBooks.length > 0) {
            found = true;
            contentHtml += `
                            <section class="py-12 bg-gradient-to-r from-purple-50 via-pink-100 to-red-100">
                                <div class="container mx-auto text-center">
                                    <h2 class="text-3xl font-bold mb-8 text-purple-700">${categories[categoryKey]}</h2>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        ${filteredBooks.map(book => `
                                            <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 duration-300 flex flex-col h-full" data-book='${JSON.stringify(book)}'>
                                                <img src="${book.image}" alt="${book.title}" class="w-full h-48 object-cover rounded-lg mb-4">
                                                <div class="flex-1">
                                                    <h3 class="text-xl font-bold mb-2">${book.title}</h3>
                                                    <p class="text-gray-600 mb-4">${book.description}</p>
                                                </div>
                                                <button class="read-now-btn py-2 px-6 text-lg font-bold mt-auto">
                                                    Start Adventure
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </section>
                        `;
          }
        });

        // If no books are found after filtering, show a "No results" message
        if (!found) {
          modal.classList.remove('hidden');
        }

        // Append the filtered categories content to the sections container
        const contentSection = document.createElement('div');
        contentSection.innerHTML = contentHtml;
        sections.appendChild(contentSection);
      }

      // Add click event for "Start Adventure" button
      sections.addEventListener('click', function(event) {
        const bookElement = event.target.closest('[data-book]');
        if (bookElement) {
          const book = JSON.parse(bookElement.getAttribute('data-book'));
          const bookData = encodeURIComponent(JSON.stringify(book)); // Encode the book data

          // Redirect to the detail page with the book data as a query parameter
          window.location.href = `storybook-detail.html?book=${bookData}`;
        }
      });

      // Initial rendering: load featured stories first, then load other categories
      renderFeaturedStories();
      renderOtherCategories();

      // Debounce search functionality
      let debounceTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const query = searchInput.value.toLowerCase();
          const filter = categoryFilter.value;
          renderOtherCategories(filter, query); // Render filtered categories
        }, 300); // Adjust the timeout as needed
      });

      // Filter stories by category
      categoryFilter.addEventListener('change', () => {
        const query = searchInput.value.toLowerCase();
        renderOtherCategories(categoryFilter.value, query); // Render selected category
      });

      // Close modal and reset inputs when modal is closed
      closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        searchInput.value = ""; // Reset search input
        categoryFilter.value = "all"; // Reset category filter
        renderFeaturedStories(); // Re-render featured stories
        renderOtherCategories(); // Re-render all categories
      });

      // Retry button inside modal
      retryButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        searchInput.value = ""; // Reset search input
        categoryFilter.value = "all"; // Reset category filter
        renderFeaturedStories(); // Re-render featured stories
        renderOtherCategories(); // Re-render all categories
      });

      // Close modal if clicked outside of it
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          searchInput.value = ""; // Reset search input
          categoryFilter.value = "all"; // Reset category filter
          renderFeaturedStories(); // Re-render featured stories
          renderOtherCategories(); // Re-render all categories
        }
      });
    });
});
