/**
 * Romantic Proposal Website - Interaction Logic
 * Developed with Love for Siyam & His Girlfriend
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Navigation & Core App
  const heartsContainer = document.getElementById("hearts-container");
  const proposalCard = document.getElementById("proposal-card");
  const loveQuoteElement = document.getElementById("love-quote");
  const body = document.body;

  // Wizard Steps
  const stepWelcome = document.getElementById("step-welcome");
  const stepDate = document.getElementById("step-date");
  const stepLocation = document.getElementById("step-location");
  const stepSuccess = document.getElementById("step-success");

  // Inputs & Form Controls
  const dateInput = document.getElementById("date-input");
  const locationSelect = document.getElementById("location-select");
  const locationEmoji = document.getElementById("location-emoji");
  const locationTitle = document.getElementById("location-title");
  const locationSubtitle = document.getElementById("location-subtitle");

  // Display Fields
  const finalDate = document.getElementById("final-date");
  const finalLocation = document.getElementById("final-location");
  const confirmationMsg = document.getElementById("confirmation-msg");
  const noMeetCountDisplay = document.getElementById("no-meet-count");
  const memoriesContainer = document.getElementById("memories-container");

  // Buttons
  const btnStart = document.getElementById("btn-start");
  const btnNextLocation = document.getElementById("btn-next-location");
  const btnSubmitProposal = document.getElementById("btn-submit-proposal");
  const btnBackToWelcome = document.getElementById("btn-back-to-welcome");
  const btnBackToDate = document.getElementById("btn-back-to-date");
  const btnRestart = document.getElementById("btn-restart");
  
  // Memories Panel Control Elements
  const btnToggleMemories = document.getElementById("btn-toggle-memories");
  const btnCloseMemories = document.getElementById("btn-close-memories");
  const memoryOverlay = document.getElementById("memory-overlay");

  // App State Variables
  let isSadMode = false;
  let noMeetCount = parseInt(localStorage.getItem("siyam_proposal_no_meets")) || 0;
  let memories = JSON.parse(localStorage.getItem("siyam_proposal_memories")) || [];

  // Romantic Love Quotes Playlist
  const romanticQuotes = [
    "“Every moment with you is my favorite 💖”",
    "“I love you to the moon and back, and then some more 💕”",
    "“In a sea of people, my eyes always search for you 🌹”",
    "“You are my today and all of my tomorrows ✨”",
    "“My favorite place in the world is next to you 🥰”",
    "“If I had a flower for every time I thought of you... 🌸”"
  ];

  // Playful Sad Teasing Quotes Playlist
  const sadTeasingQuotes = [
    "“No escape! Siyam is already on his way... 😂”",
    "“You broke Siyam's heart! Just kidding, pick a spot! 🥺”",
    "“Broken hearts are rain-proof, but date-proof? No! 💔”",
    "“Please choose DIU or Diabari, pretty please? 🥺”"
  ];

  // Teasing messages when she selects 'No meet'
  const teasingMessages = [
    {
      title: "No escape, my love! 🤫💔",
      subtitle: "Siyam is waiting! 'No meet' is not a valid option. Please pick a real spot! 💕",
      emoji: "😭"
    },
    {
      title: "Nice try, but no! 😤",
      subtitle: "Error 404: The 'No-meet' option was deleted from Siyam's heart database. 💻💔",
      emoji: "🥺"
    },
    {
      title: "Siyam is crying now... 💔",
      subtitle: "How could you say no to that cute face? Pick a real location right now! 🥺",
      emoji: "😡"
    },
    {
      title: "No escape, you must meet Siyam 💕",
      subtitle: "You can teasingly try, but destiny (and this website) says you must meet him! 🥰",
      emoji: "🥀"
    }
  ];

  // Initialize Date Input with Tomorrow's Date as Minimum
  const setMinimumDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
    dateInput.value = `${year}-${month}-${day}`;
  };
  setMinimumDate();

  // Load Initial Memory Stats
  noMeetCountDisplay.textContent = noMeetCount;
  renderMemories();

  /* ==========================================================================
     Floating Hearts System
     ========================================================================== */
  const happyHearts = ["💖", "❤️", "💕", "💗", "🌸", "🌹", "✨"];
  const sadHearts = ["💔", "🥺", "😭", "🥀", "🌧️", "💧"];

  function createHeartParticle() {
    const particle = document.createElement("div");
    particle.classList.add("heart-particle");
    
    // Choose symbol based on mode
    const symbols = isSadMode ? sadHearts : happyHearts;
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Random styling
    const startX = Math.random() * 100; // Left offset
    const size = Math.random() * 1.5 + 1; // Size in rem (1rem to 2.5rem)
    const duration = Math.random() * 3 + 4; // Duration 4s to 7s
    const driftX = (Math.random() * 150 - 75) + "px"; // Drift X
    const rotation = (Math.random() * 360) + "deg"; // End rotation
    
    particle.style.left = `${startX}%`;
    particle.style.fontSize = `${size}rem`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.setProperty("--drift-x", driftX);
    particle.style.setProperty("--rotation", rotation);
    
    heartsContainer.appendChild(particle);
    
    // Cleanup
    particle.addEventListener("animationend", () => {
      particle.remove();
    });
  }

  // Continuously spawn hearts
  setInterval(createHeartParticle, 350);

  /* ==========================================================================
     Navigation & Wizard Controller
     ========================================================================== */
  function showStep(stepToShow) {
    // Hide all steps
    [stepWelcome, stepDate, stepLocation, stepSuccess].forEach(step => {
      step.classList.remove("active");
    });
    
    // Show target step
    stepToShow.classList.add("active");
  }

  // Step 1 -> Step 2
  btnStart.addEventListener("click", () => {
    showStep(stepDate);
  });

  // Step 2 -> Step 3
  btnNextLocation.addEventListener("click", () => {
    if (!dateInput.value) {
      triggerShake();
      dateInput.focus();
      return;
    }
    showStep(stepLocation);
  });

  // Step 2 <- Step 3
  btnBackToDate.addEventListener("click", () => {
    showStep(stepDate);
  });

  // Step 1 <- Step 2
  btnBackToWelcome.addEventListener("click", () => {
    showStep(stepWelcome);
  });

  // Helper: Card Shake Effect
  function triggerShake() {
    proposalCard.classList.add("shake-element");
    setTimeout(() => {
      proposalCard.classList.remove("shake-element");
    }, 500);
  }

  /* ==========================================================================
     "No Meet" Logic & Form Submission
     ========================================================================== */
  
  // Listen for changes in dropdown to tease on selecting 'No meet'
  locationSelect.addEventListener("change", () => {
    if (locationSelect.value === "No meet") {
      enterSadMode();
    } else if (isSadMode) {
      exitSadMode();
    }
  });

  function enterSadMode() {
    isSadMode = true;
    body.classList.add("sad-mode");
    triggerShake();
    
    // Select a random teasing text bundle
    const message = teasingMessages[Math.floor(Math.random() * teasingMessages.length)];
    
    locationEmoji.textContent = message.emoji;
    locationEmoji.classList.remove("heart-pulse");
    locationTitle.textContent = message.title;
    locationSubtitle.textContent = message.subtitle;
    
    // Dynamic background quotes
    rotateQuote();
  }

  function exitSadMode() {
    isSadMode = false;
    body.classList.remove("sad-mode");
    
    // Restore default text
    locationEmoji.textContent = "📍";
    locationTitle.textContent = "Where shall we go?";
    locationSubtitle.textContent = "Every place in Dhaka becomes magical with you by my side.";
    
    rotateQuote();
  }

  btnSubmitProposal.addEventListener("click", () => {
    const selectedDate = dateInput.value;
    const selectedLocation = locationSelect.value;

    // Validation
    if (!selectedDate) {
      showStep(stepDate);
      triggerShake();
      return;
    }

    if (!selectedLocation) {
      triggerShake();
      locationSelect.focus();
      return;
    }

    // Check if 'No Meet' is selected
    if (selectedLocation === "No meet") {
      // Increment teased count
      noMeetCount++;
      localStorage.setItem("siyam_proposal_no_meets", noMeetCount);
      noMeetCountDisplay.textContent = noMeetCount;
      
      // Make it dynamic and stay locked in sad mode
      enterSadMode();
      
      // Reset dropdown so she has to pick again
      locationSelect.value = "";
      return;
    }

    // Success flow - Save memory
    const newMemory = {
      date: selectedDate,
      location: selectedLocation,
      timestamp: new Date().toLocaleString()
    };

    memories.unshift(newMemory); // Add to the top
    localStorage.setItem("siyam_proposal_memories", JSON.stringify(memories));
    
    // Format Display Date nicely (e.g. July 25, 2026)
    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Populate confirmation screen details
    finalDate.textContent = formattedDate;
    finalLocation.textContent = getFriendlyLocationName(selectedLocation);
    confirmationMsg.innerHTML = `Yay! Can’t wait to meet you at <strong>${getFriendlyLocationName(selectedLocation)}</strong> on <strong>${formattedDate}</strong> 💕`;

    // Ensure we clear sad mode styles
    exitSadMode();
    
    // Show success view
    showStep(stepSuccess);
    renderMemories();

    // Trigger full happiness explosion of hearts
    for (let i = 0; i < 30; i++) {
      setTimeout(createHeartParticle, i * 50);
    }
  });

  // Re-plan / Restart button
  btnRestart.addEventListener("click", () => {
    locationSelect.value = "";
    setMinimumDate();
    showStep(stepWelcome);
  });

  // Helper to translate key to label name
  function getFriendlyLocationName(key) {
    const locations = {
      "DIU": "Daffodil International University (DIU) 🏫",
      "Diabari": "Diabari (Uttara) 🌾",
      "Dhanmondi Lake": "Dhanmondi Lake 🌳",
      "Hatirjheel": "Hatirjheel Lakefront 🌉",
      "Puran Dhaka": "Puran Dhaka (Food Tour) 🍲",
      "Lalbagh Fort": "Lalbagh Fort 🏰"
    };
    return locations[key] || key;
  }

  /* ==========================================================================
     Memories Panel & Persistence
     ========================================================================== */
  
  // Toggle Memories Overlay
  btnToggleMemories.addEventListener("click", () => {
    memoryOverlay.classList.add("active");
  });

  // Close Memories
  btnCloseMemories.addEventListener("click", () => {
    memoryOverlay.classList.remove("active");
  });

  memoryOverlay.addEventListener("click", (e) => {
    if (e.target === memoryOverlay) {
      memoryOverlay.classList.remove("active");
    }
  });

  // Render List of Memories
  function renderMemories() {
    memoriesContainer.innerHTML = "";
    
    if (memories.length === 0) {
      memoriesContainer.innerHTML = `
        <div class="empty-state">
          No memories saved yet. <br>Go plan your first date! 🥰
        </div>
      `;
      return;
    }

    memories.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("memory-item-card");
      
      const memoryNumber = memories.length - index;
      
      card.innerHTML = `
        <div class="memory-item-header">
          <span class="memory-item-num">Date Plan #${memoryNumber}</span>
          <span class="memory-item-time">${item.timestamp}</span>
        </div>
        <div class="memory-item-detail">
          📅 Date: <strong>${item.date}</strong>
        </div>
        <div class="memory-item-detail">
          📍 Spot: <strong>${getFriendlyLocationName(item.location)}</strong>
        </div>
      `;
      
      memoriesContainer.appendChild(card);
    });
  }

  /* ==========================================================================
     Love Quote Rotator
     ========================================================================== */
  function rotateQuote() {
    const list = isSadMode ? sadTeasingQuotes : romanticQuotes;
    const currentQuote = loveQuoteElement.textContent;
    let nextQuote = currentQuote;
    
    // Make sure we pick a different quote
    while (nextQuote === currentQuote && list.length > 1) {
      nextQuote = list[Math.floor(Math.random() * list.length)];
    }
    
    // Smooth transition
    loveQuoteElement.style.opacity = 0;
    setTimeout(() => {
      loveQuoteElement.textContent = nextQuote;
      loveQuoteElement.style.opacity = 1;
    }, 300);
  }

  // Setup transitions for loveQuote element
  loveQuoteElement.style.transition = "opacity 0.3s ease";
  
  // Rotate quote every 8 seconds
  setInterval(() => {
    rotateQuote();
  }, 8000);
});