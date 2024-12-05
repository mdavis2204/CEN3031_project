// Selectors
const cardContainer = document.querySelector('.card-container');
const dislikeButton = document.querySelector('.button.dislike');
const likeButton = document.querySelector('.button.like');
const editButton = document.querySelector('.circle-button.edit');
const messageButton = document.querySelector('.circle-button.message');
const closeButton = document.querySelector('.close-button');
const logoutButton = document.getElementById('logoutButton');

// Function to Create Card Element
function createCard(data) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${data.image}" alt="${data.name}">
    <h3>${data.name}</h3>
    <p>${data.description}</p>
  `;
  return card;
}

// Fetch Data from MongoDB via Backend API and Load Cards
async function loadCards() {
  try {
    const response = await fetch('http://localhost:4000/api/cards/random'); 
    if (!response.ok) {
      throw new Error(`Failed to fetch cards: ${response.statusText}`);
    }

    const cardData = await response.json(); // Fetch a single card (not an array)

    // Create and append the card
    const card = createCard(cardData);
    cardContainer.appendChild(card);
  } catch (error) {
    console.error("Error loading cards:", error);
  }
}


// Initialize by Loading Cards
loadCards();
loadCards();
loadCards();

// Swipe Logic
function handleSwipe(direction) {
  const activeCard = cardContainer.querySelector('.card:nth-child(1)');
  if (!activeCard) return;

  // Add swipe animation
  activeCard.classList.add(direction === "like" ? "swipe-right" : "swipe-left");

  // Remove the card after animation
  setTimeout(() => {
    activeCard.remove();
    // Optionally load new cards or perform other actions
    loadCards();
  }, 500);
}

// Button Event Listeners
likeButton.addEventListener('click', () => {
  console.log("Like button pressed");
  handleSwipe("like");
});

dislikeButton.addEventListener('click', () => handleSwipe("dislike"));

// Messaging Button Event Listener
messageButton.addEventListener('click', () => {
  console.log("Messages clicked");
  window.location.href = "/messaging";
});

// Event Listener for Edit Profile Button
editButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/getUserInfo');
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await response.json();
    console.log("User data fetched:", userData);

    // Populate the user-info section
    document.getElementById('user-name').textContent = userData.userName;

    // Display the user-info section
    const userInfoSection = document.querySelector('.user-info');
    userInfoSection.style.display = 'block'; // Make it visible
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});

closeButton.addEventListener('click', () => {
  const userInfoSection = document.querySelector('.user-info');
  userInfoSection.style.display = 'none'; // Hide the user info section
  console.log("Close button clicked");
});

logoutButton.addEventListener('click', () => {
  console.log("Logout button clicked");
  window.location.href = '/'; // Redirect to the home page
});
