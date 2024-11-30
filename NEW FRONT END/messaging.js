// Selectors
const sendMessageButton = document.getElementById('sendMessage');
const newMessageInput = document.getElementById('newMessage');
const conversationContainer = document.querySelector('.conversation .messages');
const contactList = document.querySelector('.contact-list');
const header = document.querySelector('header h1');

// Sample static data (replace with API calls to fetch dynamic data)
const contacts = [
    { name: 'Buddy' },
    { name: 'Alex' },
    { name: 'Charlie' },
    { name: 'Jordan' }
];

const conversations = {
    "Buddy": [
        { sender: "You", content: "Hey, how's it going?" },
        { sender: "Buddy", content: "I'm doing great! What about you?" },
        { sender: "You", content: "I'm good too, just relaxing." },
        { sender: "Buddy", content: "Nice, want to hang out?" }
    ],
    "Alex": [
        { sender: "You", content: "Yo! Long time no see!" },
        { sender: "Alex", content: "Hey! How have you been?" }
    ],
    "Charlie": [
        { sender: "You", content: "What's up, Charlie?" },
        { sender: "Charlie", content: "All good, how about you?" }
    ],
    "Jordan": [
        { sender: "You", content: "Hey Jordan, how are you?" },
        { sender: "Jordan", content: "Doing well! You?" }
    ]
};

// Function to dynamically load contacts
function loadContacts() {
    contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.classList.add('contact-item');
        contactItem.textContent = contact.name;
        contactItem.setAttribute('data-contact', contact.name);
        contactItem.addEventListener('click', () => loadConversation(contact.name));
        contactList.appendChild(contactItem);
    });
}

// Function to create a message bubble
function createMessageBubble(sender, content) {
    const message = document.createElement('div');
    message.classList.add('message', sender === 'You' ? 'sender' : 'receiver');
    message.textContent = content;
    return message;
}

// Function to load a conversation
function loadConversation(contactName) {
    const messages = conversations[contactName];
    conversationContainer.innerHTML = ''; // Clear current messages

    if (messages) {
        messages.forEach(message => {
            const messageBubble = createMessageBubble(message.sender, message.content);
            conversationContainer.appendChild(messageBubble);
        });

        // Update the header with the contact's name
        header.textContent = `Chat with ${contactName}`;

        // Ensure the conversation container scrolls to the bottom
        conversationContainer.scrollTop = conversationContainer.scrollHeight;
    }
}

// Send new message (either via button or Enter key)
function sendMessage() {
    const newMessage = newMessageInput.value.trim();

    if (newMessage) {
        const messageBubble = createMessageBubble("You", newMessage);
        conversationContainer.appendChild(messageBubble);
        newMessageInput.value = ""; // Clear input field

        // Scroll to the bottom of the conversation (keeping input box fixed)
        conversationContainer.scrollTop = conversationContainer.scrollHeight;

        // Here you would normally send the new message to the server using an API
        // Example: sendMessageToServer(newMessage);
    }
}

// Button click event listener
sendMessageButton.addEventListener('click', sendMessage);

// Enter key event listener
newMessageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Initialize the app
loadContacts(); // Load contacts dynamically
loadConversation('Buddy'); // Load initial conversation with Buddy
