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
likeButton.addEventListener('click', () => handleSwipe("like"));
dislikeButton.addEventListener('click', () => handleSwipe("dislike"));

// Edit Profile Button Event Listener
editButton.addEventListener('click', () => {
  alert("Edit Profile clicked");
  // You can add the functionality for profile editing here
});

// Messaging Button Event Listener
messageButton.addEventListener('click', () => {
  alert("Messages clicked");
  // You can add the functionality for messaging here
});
