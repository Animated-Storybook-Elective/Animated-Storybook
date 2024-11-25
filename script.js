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

    // Handle page turn with sound (but without delay)
    function handlePageTurn(direction) {
      const pageSound = document.getElementById("page-sound");

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

      // Play the page turn sound in the background
      pageSound.src = "audios/pageturn.mp3"; // Replace with actual sound file path
      pageSound.volume = 1; // Normal volume
      pageSound.muted = false;
      pageSound.loop = false;

      pageSound.play().catch((error) => {
        console.warn("Page turn sound playback blocked:", error);
      });

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

      const bgMusic = document.getElementById("bg-music");
      const narration = document.getElementById("narration");

      // Stop current audio if any
      bgMusic.pause();
      narration.pause();

      // Set and play background music if available
      if (page.bgMusic) {
        bgMusic.src = page.bgMusic;
        bgMusic.volume = page.bgMusicVolume || 0.5;
        bgMusic.play().catch((error) =>
          console.warn("Background music playback blocked:", error)
        );
      }

      // Play narration with a delay if narration is enabled
      if (page.narration && narrationEnabled) {
        setTimeout(() => {
          narration.src = page.narration;
          narration.volume = page.narrationVolume || 1;
          narration.play().catch((error) =>
            console.warn("Narration playback blocked:", error)
          );
        }, 1000); // 1000 milliseconds = 1 second delay
      }

      updateButtonStates();
    }

    // Update initial state of the narration toggle button
    updateAudioToggleButton();
  })
  .catch((error) => {
    console.error("Error loading story:", error);
  });