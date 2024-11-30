// Grab storyId from URL, default to 1 if not provided
const urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get("storyId") || 1; // Default to story1 if no storyId is provided
const storyFile = `stories/story${storyId}.json`;

fetch(storyFile)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Story file not found");
    }
    return response.json();
  })
  .then((data) => {
    const totalPages = data.pages.length;
    document.getElementById("total-pages").textContent = totalPages;

    let currentPage = 0;
    let narrationEnabled = true; // This flag is now automatically controlled
    let readOnlyMode = false; // Added read-only mode flag
    let bgMusic = null; // Background music instance
    let narration = null; // Narration instance

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const readOnlyBtn = document.getElementById("read-only-btn");

    // Initialize page loading
    loadPage(currentPage, data);

    // Button event listeners for page transitions
    prevBtn.addEventListener("click", () => handlePageTurn(-1));
    nextBtn.addEventListener("click", () => handlePageTurn(1));

    // Toggle read-only mode
    readOnlyBtn.addEventListener("click", () => {
      readOnlyMode = !readOnlyMode;
      if (readOnlyMode) {
        // Stop any audio when in read-only mode
        if (narration) narration.stop();
        if (bgMusic) bgMusic.stop();
      }
      updateButtonStates();
    });

    // Handle page turn with sound
    function handlePageTurn(direction) {
      const pageTurnSound = new Howl({
        src: ["audios/pageturn.mp3"], // Replace with actual sound file path
        volume: 1
      });

      // Disable buttons temporarily to avoid accidental multiple clicks
      prevBtn.disabled = true;
      nextBtn.disabled = true;

      // Immediately load the next or previous page
      currentPage += direction;

      // Ensure the page doesn't go out of bounds
      if (currentPage < 0) currentPage = 0;
      if (currentPage >= totalPages) currentPage = totalPages - 1;

      // Load the new page
      loadPage(currentPage, data);

      // Play the page turn sound
      pageTurnSound.play();

      // Re-enable buttons after page load
      updateButtonStates();
    }

    // Function to update button states
    function updateButtonStates() {
      prevBtn.disabled = currentPage === 0; // Disable "Previous" button on the first page
      nextBtn.disabled = currentPage === totalPages - 1; // Disable "Next" button on the last page
    }

   // Function to load a page
function loadPage(pageIndex, storyData) {
  const page = storyData.pages[pageIndex];
  document.getElementById("page-image").src = page.image;
  document.getElementById("page-text").textContent = page.text || "";
  document.getElementById("current-page").textContent = pageIndex + 1;

  // Stop any currently playing audio
  if (bgMusic) bgMusic.stop();
  if (narration) narration.stop();

  console.log('Loading page', pageIndex + 1); // Log page load to debug

  // Handle background music with delay
  if (page.bgMusic && !readOnlyMode) { // Only play BG music if not in read-only mode
    const delay = page.bgMusicDelay || 0; // Default to no delay
    bgMusic = new Howl({
      src: [page.bgMusic],
      volume: page.bgMusicVolume || 0.5,
      loop: true,
      onend: () => {
        console.log('Background music ended.');
      }
    });

    // Log audio loading
    console.log('Loading background music for page', pageIndex + 1);

    // Start background music with a delay (if any)
    setTimeout(() => {
      bgMusic.play();
      console.log('Background music playing for page', pageIndex + 1);
    }, delay * 1000);
  }

  // Handle narration with delay
  if (page.narration && narrationEnabled && !readOnlyMode) {
    const narrationDelay = page.narrationDelay || 0; // Default to no delay
    narration = new Howl({
      src: [page.narration],
      volume: page.narrationVolume || 1,
      onend: () => {
        console.log('Narration ended.');
        // Optionally stop BG music when narration ends
        if (bgMusic) bgMusic.stop();
      }
    });

    // Log narration loading
    console.log('Loading narration for page', pageIndex + 1);

    // Start narration with delay (if any)
    setTimeout(() => {
      narration.play();
      console.log('Narration playing for page', pageIndex + 1);
    }, narrationDelay * 1000);
  }

  // If in read-only mode, don't load narration or music, only page turn sound
  if (readOnlyMode) {
    const pageTurnSound = new Howl({
      src: ["audios/pageturn.mp3"], // Replace with actual sound file path
      volume: 1
    });
    pageTurnSound.play();
  }

  // Check if user has finished reading the last page
  if (pageIndex === totalPages - 1) {
    showSuggestionModal(); // Trigger suggestion modal when the last page is reached
  }

  updateButtonStates();
}


    // Function to show the suggestion modal when story is finished
    function showSuggestionModal() {
      document.getElementById('suggestion-modal').classList.remove('hidden');
    }

    // Function to close the suggestion modal
    function closeSuggestionModal() {
      document.getElementById('suggestion-modal').classList.add('hidden');
    }

    // Function to handle "Yes, Show me more books"
    function suggestAnotherStory() {
      // Redirect to the homepage or show a list of suggested stories
      window.location.href = "index.html";  // Redirecting to home page. You can customize this to load another page with book suggestions.
    }

    // Adding event listeners for the modal buttons
    document.querySelector(".close-modal").addEventListener("click", closeSuggestionModal);
    document.querySelector(".suggest-more-books").addEventListener("click", suggestAnotherStory);

  })
  .catch((error) => {
    console.error("Error loading story:", error);
  });
