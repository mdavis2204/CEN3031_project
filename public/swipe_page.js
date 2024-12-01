// Sample Data for Cards
const cardsData = [
    { image: "dog1.jpg", name: "Buddy", description: "Playful and energetic!" },
    { image: "dog2.jpg", name: "Milo", description: "Loves cuddles and treats." },
    { image: "dog3.jpg", name: "Daisy", description: "A quiet and friendly pup." }
];

// Selectors
const cardContainer = document.querySelector('.card-container');
const dislikeButton = document.querySelector('.button.dislike');
const likeButton = document.querySelector('.button.like');
const editButton = document.querySelector('.circle-button.edit');
const messageButton = document.querySelector('.circle-button.message');
const closeButton = document.querySelector('.close-button');
const logoutButton = document.getElementById('logoutButton');


// Populate Cards
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

// Load Cards into the Container
function loadCards() {
  cardsData.forEach(data => {
    const card = createCard(data);
    cardContainer.appendChild(card);
  });
}
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