document.addEventListener('DOMContentLoaded', function() {
    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Send message when button is clicked
    sendBtn.addEventListener('click', function() {
        sendUserMessage();
    });

    // Send message when Enter key is pressed
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    // Quick question buttons
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            userInput.value = question;
            sendUserMessage();
        });
    });

    // Function to send user message
    async function sendUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessageToChat('user', message);

        // Clear input field and disable send button
        userInput.value = '';
        sendBtn.disabled = true;

        // Show typing indicator
        showTypingIndicator();

        try {
            const response = await fetch('/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error('Server error: ' + response.status);
            }

            const result = await response.json();

            // Remove typing indicator
            removeTypingIndicator();

            // Add bot response to chat
            addMessageToChat('bot', result.en, result.ta);

        } catch (error) {
            console.error('Error:', error);

            // Remove typing indicator
            removeTypingIndicator();

            // Show error message
            addMessageToChat('bot', 'Sorry, I encountered an error. Please try again later.');
        } finally {
            sendBtn.disabled = false;
        }
    }

    // Function to add message to chat
    function addMessageToChat(sender, message, tamilText = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';

        // Create avatar
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        const icon = document.createElement('i');
        icon.className = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        avatar.appendChild(icon);

        // Create message content container
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        // Add message text
        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageContent.appendChild(messageText);

        // Add Tamil text if available
        if (tamilText && sender === 'bot') {
            const tamilPara = document.createElement('p');
            tamilPara.className = 'tamil-text';
            tamilPara.textContent = tamilText;
            messageContent.appendChild(tamilPara);
        }

        // Add timestamp
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = getCurrentTime();
        messageContent.appendChild(timestamp);

        // Assemble message
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        // Add to chatbox
        chatbox.appendChild(messageDiv);

        // Scroll to bottom
        scrollToBottom();
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';

        // Create avatar
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        avatar.appendChild(icon);

        // Create typing animation
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        const dots = document.createElement('div');
        dots.className = 'typing-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        messageContent.appendChild(dots);

        // Assemble typing indicator
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(messageContent);

        // Add to chatbox
        chatbox.appendChild(typingDiv);

        // Scroll to bottom
        scrollToBottom();
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typingIndicator');
        if (typingDiv) {
            chatbox.removeChild(typingDiv);
        }
    }

    // Function to get current time as HH:MM
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Function to scroll chatbox to bottom
    function scrollToBottom() {
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});