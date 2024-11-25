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
    let narrationEnabled = true;
    let bgMusic = null; // Background music instance
    let narration = null; // Narration instance

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const audioToggleBtn = document.getElementById("audio-toggle-btn");

    // Initialize page loading
    loadPage(currentPage, data);

    // Button event listeners for page transitions
    prevBtn.addEventListener("click", () => handlePageTurn(-1));
    nextBtn.addEventListener("click", () => handlePageTurn(1));

    audioToggleBtn.addEventListener("click", () => {
      narrationEnabled = !narrationEnabled;
      updateAudioToggleButton();
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
  if (page.bgMusic) {
    const delay = page.bgMusicDelay || 0; // Default to no delay
    bgMusic = new Howl({
      src: [page.bgMusic],
      volume: page.bgMusicVolume || 0.5,
      loop: true
    });

    // Log audio loading
    console.log('Loading background music for page', pageIndex + 1); 

    // Start background music with a delay (if any)
    setTimeout(() => {
      bgMusic.play();
      console.log('Background music playing for page', pageIndex + 1);
    }, delay * 1000);
  }

  // Handle narration
  if (page.narration && narrationEnabled) {
    narration = new Howl({
      src: [page.narration],
      volume: page.narrationVolume || 1
    });

    // Log narration loading
    console.log('Loading narration for page', pageIndex + 1);
    
    narration.play();
  }

  updateButtonStates();
}

    // Update initial state of the narration toggle button
    function updateAudioToggleButton() {
      audioToggleBtn.textContent = narrationEnabled ?
        "Disable Narration" :
        "Enable Narration";
    }
  })
  .catch((error) => {
    console.error("Error loading story:", error);
  });