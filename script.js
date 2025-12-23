// ============================================
// CODITAS SECRET SANTA 2025
// JavaScript functionality
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  // Check if user is coming from email link to see their assignment
  const urlParams = new URLSearchParams(window.location.search);
  const revealData = urlParams.get("reveal");

  if (revealData) {
    // Show only the assignment reveal page
    showAssignmentReveal(revealData);
    return;
  }

  // Normal mode - show full website
  initCountdown();
  initParticipantForm();
  initModals();
  addInitialParticipants();
  initScrollAnimations();
  initNavbarScroll();
}

// ============================================
// ASSIGNMENT REVEAL (from email link)
// ============================================
function showAssignmentReveal(encodedData) {
  try {
    // Decode the assignment data
    const decoded = atob(encodedData);
    const [giverName, receiverName] = decoded.split("|||");

    if (!giverName || !receiverName) {
      throw new Error("Invalid data");
    }

    // Initialize the normal page first
    initCountdown();
    initScrollAnimations();
    initNavbarScroll();

    // Hide elements that participants shouldn't see
    const elementsToHide = [
      ".form-card", // The participant form
      ".shuffle-btn", // Shuffle button
      "#signup .section-header", // The signup section header
      ".hero-cta", // Start Secret Santa button in hero
      ".event-card", // Event date card
      ".scroll-hint", // Scroll to explore hint (we have scroll to reveal instead)
    ];

    elementsToHide.forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) el.style.display = "none";
    });

    // Add simple suspense teaser in hero!
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      const teaserCard = document.createElement("div");
      teaserCard.className = "suspense-teaser-simple";
      teaserCard.innerHTML = `
        <p class="teaser-welcome">Welcome <span class="teaser-name">${escapeHtml(
          giverName
        )}</span>,</p>
        <p class="teaser-message">✨ Your Secret Santa assignment awaits below ✨</p>
        <p class="teaser-scroll">scroll to reveal <span class="bounce-arrow">↓</span></p>
      `;
      heroContent.appendChild(teaserCard);
    }

    // Replace the signup section content with assignment reveal
    const signupSection = document.getElementById("signup");
    if (signupSection) {
      signupSection.innerHTML = `
        <div class="assignment-reveal-card">
          <div class="assignment-reveal-header">
            <span class="assignment-stars">✦ ✦ ✦</span>
            <h2 class="assignment-title">🎁 The Moment of Truth!</h2>
            <p class="assignment-greeting">Ready, <span class="highlight-name">${escapeHtml(
              giverName
            )}</span>?</p>
          </div>
          
          <div class="assignment-main">
            <p class="assignment-label">You are the Secret Santa for</p>
            <div class="assignment-name-reveal">
              <span class="receiver-name">${escapeHtml(receiverName)}</span>
            </div>
            <div class="assignment-decoration">❖ ─── 🎁 ─── ❖</div>
          </div>
          
          <div class="assignment-reminder">
            <span class="shh-emoji">🤫</span>
            <p>Remember, it's a secret!</p>
          </div>
        </div>
      `;
    }

    // Add confetti effect
    setTimeout(() => createConfetti(), 800);
  } catch (error) {
    // Invalid link - redirect to homepage
    window.location.href = window.location.origin + window.location.pathname;
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function createConfetti() {
  const colors = [
    "#ffd700",
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#ffffff",
  ];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      opacity: ${Math.random() * 0.7 + 0.3};
      border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
      animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
      z-index: 9999;
    `;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
  }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(12, 25, 41, 0.95)";
    } else {
      navbar.style.background = "rgba(12, 25, 41, 0.8)";
    }
  });
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown() {
  const targetDate = new Date("January 5, 2026 10:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = String(days).padStart(
        2,
        "0"
      );
      document.getElementById("hours").textContent = String(hours).padStart(
        2,
        "0"
      );
      document.getElementById("minutes").textContent = String(minutes).padStart(
        2,
        "0"
      );
      document.getElementById("seconds").textContent = String(seconds).padStart(
        2,
        "0"
      );
    } else {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============================================
// PARTICIPANT FORM
// ============================================
let participantCount = 0;

function initParticipantForm() {
  const addBtn = document.getElementById("addParticipantBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");

  addBtn.addEventListener("click", addParticipant);
  shuffleBtn.addEventListener("click", openEmailConfigModal);
}

function addInitialParticipants() {
  // Add 3 empty participant slots initially (without scrolling)
  for (let i = 0; i < 3; i++) {
    addParticipant(false);
  }
}

function addParticipant(shouldScroll = true) {
  const container = document.getElementById("participantsContainer");
  participantCount++;

  const entry = document.createElement("div");
  entry.className = "participant-entry";
  entry.dataset.id = participantCount;
  entry.innerHTML = `
    <input type="text" placeholder="Name" class="participant-name" required>
    <input type="email" placeholder="Email" class="participant-email" required>
    <button type="button" class="remove-participant-btn" onclick="removeParticipant(${participantCount})">×</button>
  `;

  container.appendChild(entry);
  updateParticipantCount();

  if (shouldScroll) {
    // Focus on the new name input
    entry.querySelector(".participant-name").focus();
    // Scroll to the new entry
    entry.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function removeParticipant(id) {
  const entry = document.querySelector(`.participant-entry[data-id="${id}"]`);
  if (entry) {
    entry.style.animation = "slideOut 0.3s ease forwards";
    setTimeout(() => {
      entry.remove();
      updateParticipantCount();
    }, 300);
  }
}

function updateParticipantCount() {
  const count = document.querySelectorAll(".participant-entry").length;
  document.getElementById("participantCount").textContent = count;

  // Enable shuffle button only if there are at least 3 participants
  const shuffleBtn = document.getElementById("shuffleBtn");
  shuffleBtn.disabled = count < 3;
}

function getParticipants() {
  const entries = document.querySelectorAll(".participant-entry");
  const participants = [];

  entries.forEach((entry) => {
    const name = entry.querySelector(".participant-name").value.trim();
    const email = entry.querySelector(".participant-email").value.trim();

    if (name && email) {
      participants.push({ name, email });
    }
  });

  return participants;
}

function validateParticipants(participants) {
  if (participants.length < 3) {
    alert(
      "🎅 Please add at least 3 participants!\n\nWith only 2 people, you'd both know who your Secret Santa is 😅"
    );
    return false;
  }

  // Check for duplicate emails
  const emails = participants.map((p) => p.email.toLowerCase());
  const uniqueEmails = new Set(emails);
  if (uniqueEmails.size !== emails.length) {
    alert("Each participant must have a unique email address.");
    return false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const participant of participants) {
    if (!emailRegex.test(participant.email)) {
      alert(`Invalid email format: ${participant.email}`);
      return false;
    }
  }

  return true;
}

// ============================================
// SECRET SANTA ALGORITHM
// ============================================
function shuffleSecretSanta(participants) {
  // Fisher-Yates shuffle for assignments
  // Ensures no one gets themselves

  const givers = [...participants];
  let receivers = [...participants];
  const assignments = [];

  // Keep trying until we get a valid assignment
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    receivers = [...participants];
    shuffleArray(receivers);

    let valid = true;
    for (let i = 0; i < givers.length; i++) {
      if (givers[i].email === receivers[i].email) {
        valid = false;
        break;
      }
    }

    if (valid) {
      for (let i = 0; i < givers.length; i++) {
        assignments.push({
          giver: givers[i],
          receiver: receivers[i],
        });
      }
      return assignments;
    }

    attempts++;
  }

  // Fallback: manual derangement
  return createDerangement(participants);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createDerangement(participants) {
  const n = participants.length;
  const assignments = [];

  // Simple rotation-based derangement
  for (let i = 0; i < n; i++) {
    assignments.push({
      giver: participants[i],
      receiver: participants[(i + 1) % n],
    });
  }

  return assignments;
}

// ============================================
// MODALS
// ============================================
function initModals() {
  const successModal = document.getElementById("successModal");
  const emailConfigModal = document.getElementById("emailConfigModal");

  document.getElementById("modalCloseBtn").addEventListener("click", () => {
    successModal.classList.remove("active");
  });

  document.getElementById("configCancelBtn").addEventListener("click", () => {
    emailConfigModal.classList.remove("active");
  });

  document
    .getElementById("configProceedBtn")
    .addEventListener("click", proceedWithShuffle);

  document
    .getElementById("configTestBtn")
    .addEventListener("click", testModeShowLinks);

  // Close modals when clicking outside
  [successModal, emailConfigModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
}

function openEmailConfigModal() {
  const participants = getParticipants();

  if (!validateParticipants(participants)) {
    return;
  }

  // Update participant summary in modal
  document.getElementById(
    "participantSummary"
  ).textContent = `${participants.length} participants ready`;

  document.getElementById("emailConfigModal").classList.add("active");
}

async function proceedWithShuffle() {
  const participants = getParticipants();

  const assignments = shuffleSecretSanta(participants);

  document.getElementById("emailConfigModal").classList.remove("active");

  // Only send emails - no one can see the assignments!
  await sendEmailsWithGoogleScript(assignments);
}

// ============================================
// TEST MODE - Show links without sending emails
// ============================================
function testModeShowLinks() {
  const participants = getParticipants();
  const assignments = shuffleSecretSanta(participants);

  document.getElementById("emailConfigModal").classList.remove("active");

  const baseUrl = window.location.origin + window.location.pathname;

  // Create test links display
  let linksHtml = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 99999; overflow-y: auto; padding: 40px 20px;">
      <div style="max-width: 700px; margin: 0 auto; background: #162a4a; border-radius: 20px; padding: 30px; border: 1px solid rgba(255,215,0,0.3);">
        <h2 style="color: #ffd700; text-align: center; margin: 0 0 10px 0;">🧪 Test Mode - Generated Links</h2>
        <p style="color: rgba(255,255,255,0.6); text-align: center; margin: 0 0 30px 0; font-size: 14px;">Copy any link to test the reveal page (these would be sent via email in production)</p>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
  `;

  for (const assignment of assignments) {
    const encodedData = btoa(
      `${assignment.giver.name}|||${assignment.receiver.name}`
    );
    const revealLink = `${baseUrl}?reveal=${encodedData}`;

    linksHtml += `
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 15px; border-left: 3px solid #ffd700;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="color: #fff; font-weight: 600;">${assignment.giver.name}</span>
          <span style="color: rgba(255,255,255,0.5);">→</span>
          <span style="color: #ffd700; font-weight: 600;">${assignment.receiver.name}</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <input type="text" value="${revealLink}" readonly style="flex: 1; padding: 10px; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(0,0,0,0.3); color: #fff; font-size: 12px;">
          <button onclick="navigator.clipboard.writeText('${revealLink}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 1500);" style="padding: 10px 15px; background: #ffd700; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Copy</button>
          <a href="${revealLink}" target="_blank" style="padding: 10px 15px; background: #c41e3a; color: #fff; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; font-weight: 600;">Open</a>
        </div>
      </div>
    `;
  }

  linksHtml += `
        </div>
        <button onclick="this.parentElement.parentElement.remove();" style="display: block; width: 100%; margin-top: 25px; padding: 15px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; cursor: pointer; font-size: 16px;">Close Test Mode</button>
      </div>
    </div>
  `;

  const testPanel = document.createElement("div");
  testPanel.innerHTML = linksHtml;
  document.body.appendChild(testPanel.firstElementChild);
}

async function sendEmailsWithGoogleScript(assignments) {
  // Hardcoded Google Apps Script URL for Coditas Secret Santa
  const scriptUrl =
    "https://script.google.com/macros/s/AKfycbzIwzm8Vq4GsH2MWfvL9r2-VDtbP65erYng5-2m-WP77SO1r9XNC_tjuOzsEgMlvanzOQ/exec";

  const shuffleBtn = document.getElementById("shuffleBtn");
  shuffleBtn.disabled = true;
  shuffleBtn.querySelector(".btn-text").innerHTML = `
    <span class="btn-icon">⏳</span>
    Sending Emails...
  `;

  // Get the base URL for reveal links
  const baseUrl = window.location.origin + window.location.pathname;

  let successCount = 0;
  let failedEmails = [];

  for (const assignment of assignments) {
    try {
      // Create unique encoded link for this person
      const encodedData = btoa(
        `${assignment.giver.name}|||${assignment.receiver.name}`
      );
      const revealLink = `${baseUrl}?reveal=${encodedData}`;

      // Send to Google Apps Script
      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // Required for Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to_name: assignment.giver.name,
          to_email: assignment.giver.email,
          reveal_link: revealLink,
        }),
      });

      // With no-cors, we can't read the response, so we assume success
      successCount++;
    } catch (error) {
      console.error("Email failed:", error);
      failedEmails.push(assignment.giver.email);
    }
  }

  // Reset button
  shuffleBtn.disabled = false;
  shuffleBtn.querySelector(".btn-text").innerHTML = `
    <span class="btn-icon">🎲</span>
    Shuffle & Send Emails
  `;

  if (failedEmails.length === 0) {
    document.getElementById("successModal").classList.add("active");
  } else {
    alert(
      `Emails sent: ${successCount}/${
        assignments.length
      }\n\nFailed emails:\n${failedEmails.join("\n")}`
    );
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  // Add slide out animation to head
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateY(0) translateX(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px) translateX(-20px);
      }
    }
    
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Apply fade-in class to sections (except hero)
  document.querySelectorAll("section").forEach((section) => {
    if (!section.classList.contains("hero")) {
      section.classList.add("fade-in");
      observer.observe(section);
    }
  });

  // Also animate cards with stagger
  document.querySelectorAll(".step-card, .rule-card").forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    card.classList.add("fade-in");
    observer.observe(card);
  });
}
