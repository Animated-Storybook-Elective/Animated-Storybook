document.addEventListener('DOMContentLoaded', function () {
    // Fetch the storybook JSON data
    fetch('storybooks.json')
        .then(response => response.json())
        .then(data => {
            const sections = document.getElementById('storybook-sections');
            const searchInput = document.getElementById('searchInput');
            const categoryFilter = document.getElementById('categoryFilter');
            const modal = document.getElementById('noResultsModal');
            const closeModal = document.getElementById('closeModal');
            const retryButton = document.getElementById('retryButton');

            // Function to render sections based on filters and search query
            function renderSections(filter = "", query = "") {
                sections.innerHTML = ""; // Clear previous results

                // Mapping object for section titles
                const sectionTitles = {
                    featuredBooks: "Featured Stories",
                    plainStorybooks: "Plain Storybooks",
                    audiobooks: "Audiobooks",
                    readWithMe: "Read With Me",
                    videoStorybooks: "Video Storybooks",
                    tagalogVideoStorybooks: "Tagalog Video Storybooks"
                };

                // Define the categories from the fetched data
                const categories = {
                    featuredBooks: data.featuredBooks,
                    plainStorybooks: data.plainStorybooks,
                    audiobooks: data.audiobooks,
                    readWithMe: data.readWithMe,
                    videoStorybooks: data.videoStorybooks,
                    tagalogVideoStorybooks: data.tagalogVideoStorybooks
                };

                let found = false; // Track if any story matches the filter

                // Loop through categories and render them
                for (const [key, value] of Object.entries(categories)) {
                    // Skip section if it doesn't match the filter
                    if (filter && key !== filter && filter !== "all") continue;

                    const filteredBooks = query
                        ? value.filter(book => book.title.toLowerCase().includes(query))
                        : value;

                    // Render filtered books if any are found
                    if (filteredBooks.length) {
                        found = true;
                        sections.innerHTML += `
                            <section class="py-12 bg-gradient-to-r from-purple-50 via-pink-100 to-red-100">
                                <div class="container mx-auto text-center">
                                    <h2 class="text-3xl font-bold mb-8 text-purple-700">${sectionTitles[key]}</h2>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        ${filteredBooks.map(book => `
                                            <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 duration-300 flex flex-col h-full">
                                                <img src="${book.image}" alt="${book.title}" class="w-full h-48 object-cover rounded-lg mb-4">
                                                <div class="flex-1">
                                                    <h3 class="text-xl font-bold mb-2">${book.title}</h3>
                                                    <p class="text-gray-600 mb-4">${book.description}</p>
                                                </div>
                                                <a href="storybook-detail.html?book=${encodeURIComponent(JSON.stringify(book))}">
                                                    <button class="read-now-btn py-2 px-6 text-lg font-bold mt-auto">
                                                        Start Adventure
                                                    </button>
                                                </a>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </section>
                        `;
                    }
                }

                // Show modal if no stories are found
                if (!found) {
                    modal.classList.remove('hidden');
                }
            }

            // Initial rendering
            renderSections();

            // Debounce search functionality
            let debounceTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    const query = searchInput.value.toLowerCase();
                    const filter = categoryFilter.value;
                    renderSections(filter, query);
                }, 300); // Adjust the timeout as needed
            });

            // Add filter functionality
            categoryFilter.addEventListener('change', () => {
                const query = searchInput.value.toLowerCase();
                renderSections(categoryFilter.value, query);
            });

            // Close modal and reset inputs when modal is closed
            closeModal.addEventListener('click', () => {
                modal.classList.add('hidden');
                searchInput.value = ""; // Reset search input
                categoryFilter.value = "all"; // Reset category filter
                renderSections(); // Re-render all sections
            });

            // Retry button inside modal
            retryButton.addEventListener('click', () => {
                modal.classList.add('hidden');
                searchInput.value = ""; // Reset search input
                categoryFilter.value = "all"; // Reset category filter
                renderSections(); // Re-render all sections
            });

            // Close modal if clicked outside of it
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    searchInput.value = ""; // Reset search input
                    categoryFilter.value = "all"; // Reset category filter
                    renderSections(); // Re-render all sections
                }
            });
        });
});
