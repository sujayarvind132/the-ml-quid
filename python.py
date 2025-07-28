# Let me create the updated HTML and CSS code that fixes the two issues:
# 1. Move time below the prompt instead of next to it
# 2. Ensure the interface takes full screen properly

html_code = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ML QuID Chat</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            height: 100vh;
            width: 100vw;
            overflow: hidden;
        }
        
        body {
            background: #141619;
            color: #e7f6fd;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
        }
        
        #app-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        
        header {
            background: #0f2d3e;
            padding: 16px 24px;
            font-size: 1.4em;
            font-weight: bold;
            letter-spacing: 1px;
            border-bottom: 1px solid #2a3b47;
            flex-shrink: 0;
        }
        
        .chat-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .chat-history {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            scroll-behavior: smooth;
        }
        
        .message-wrapper {
            display: flex;
            flex-direction: column;
            margin-bottom: 8px;
        }
        
        .user-message-wrapper {
            align-items: flex-end;
        }
        
        .ai-message-wrapper {
            align-items: flex-start;
        }
        
        .message {
            max-width: 70%;
            padding: 12px 18px;
            border-radius: 16px;
            word-wrap: break-word;
            line-height: 1.5;
        }
        
        .user-message {
            background: #2da865;
            color: #fff;
            border-radius: 16px 16px 4px 16px;
            align-self: flex-end;
        }
        
        .ai-message {
            background: #25303b;
            color: #e7f6fd;
            border-radius: 16px 16px 16px 4px;
            align-self: flex-start;
        }
        
        .timestamp {
            font-size: 0.75em;
            color: #8b9aa5;
            margin-top: 4px;
            padding: 0 4px;
        }
        
        .user-timestamp {
            text-align: right;
        }
        
        .ai-timestamp {
            text-align: left;
        }
        
        .input-area {
            background: #171f24;
            padding: 20px 24px;
            border-top: 1px solid #2a3b47;
            flex-shrink: 0;
        }
        
        .input-form {
            display: flex;
            gap: 12px;
            align-items: center;
            max-width: 100%;
        }
        
        .input-form input {
            flex: 1;
            padding: 14px 18px;
            border: none;
            border-radius: 12px;
            font-size: 1em;
            background: #232c34;
            color: #e7f6fd;
            outline: none;
            border: 2px solid transparent;
            transition: border-color 0.2s ease;
        }
        
        .input-form input:focus {
            border-color: #2da865;
        }
        
        .input-form input::placeholder {
            color: #8b9aa5;
        }
        
        .input-form button {
            padding: 14px 20px;
            border-radius: 12px;
            border: none;
            background: #2da865;
            color: #fff;
            font-weight: 600;
            font-size: 1em;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 80px;
        }
        
        .input-form button:hover {
            background: #248954;
            transform: translateY(-1px);
        }
        
        .input-form button:active {
            transform: translateY(0);
        }
        
        /* Scrollbar styling */
        .chat-history::-webkit-scrollbar {
            width: 6px;
        }
        
        .chat-history::-webkit-scrollbar-track {
            background: #1a2127;
        }
        
        .chat-history::-webkit-scrollbar-thumb {
            background: #3a4750;
            border-radius: 3px;
        }
        
        .chat-history::-webkit-scrollbar-thumb:hover {
            background: #4a5760;
        }
        
        /* Active status indicator */
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #2da865;
            border-radius: 50%;
            margin-left: 8px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .message {
                max-width: 85%;
            }
            
            .input-area {
                padding: 16px;
            }
            
            header {
                padding: 12px 16px;
                font-size: 1.2em;
            }
            
            .chat-history {
                padding: 16px;
            }
        }
        
        /* Loading animation */
        .typing-indicator {
            display: flex;
            align-items: center;
            padding: 12px 18px;
            background: #25303b;
            border-radius: 16px 16px 16px 4px;
            max-width: 70px;
            align-self: flex-start;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 6px;
            height: 6px;
            background: #8b9aa5;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
            0%, 80%, 100% { 
                opacity: 0.3;
                transform: scale(0.8);
            }
            40% { 
                opacity: 1;
                transform: scale(1);
            }
        }
    </style>
</head>
<body>
    <div id="app-container">
        <header>
            ML QuID 2.0 Chat
            <span class="status-indicator"></span>
        </header>
        
        <div class="chat-container">
            <div class="chat-history" id="chatHistory">
                <!-- Sample messages -->
                <div class="message-wrapper user-message-wrapper">
                    <div class="message user-message">
                        Tell me about proactive AI systems
                    </div>
                    <div class="timestamp user-timestamp">
                        01:00 AM
                    </div>
                </div>
                
                <div class="message-wrapper ai-message-wrapper">
                    <div class="message ai-message">
                        Proactive AI systems anticipate user needs and provide intelligent responses before being explicitly prompted. Unlike reactive systems, they analyze context, user behavior patterns, and conversation history to offer suggestions, insights, and solutions autonomously. These systems leverage machine learning to understand intent, maintain conversation flow, and deliver personalized experiences that feel natural and helpful.
                    </div>
                    <div class="timestamp ai-timestamp">
                        01:00 AM
                    </div>
                </div>
                
                <div class="message-wrapper user-message-wrapper">
                    <div class="message user-message">
                        How does ML QuID implement this?
                    </div>
                    <div class="timestamp user-timestamp">
                        01:01 AM
                    </div>
                </div>
                
                <div class="message-wrapper ai-message-wrapper">
                    <div class="message ai-message">
                        ML QuID implements proactive intelligence through context memory, pattern recognition, and predictive analytics. The system maintains conversation history, analyzes user interests, and generates relevant suggestions automatically. It processes responses in under 100ms with confidence scoring, providing anticipatory assistance that adapts to individual user preferences and learning patterns.
                    </div>
                    <div class="timestamp ai-timestamp">
                        01:01 AM
                    </div>
                </div>
            </div>
        </div>
        
        <div class="input-area">
            <form class="input-form" id="messageForm">
                <input 
                    type="text" 
                    id="messageInput" 
                    placeholder="Type your message..." 
                    autocomplete="off"
                    autofocus
                />
                <button type="submit">Send</button>
            </form>
        </div>
    </div>

    <script>
        // Simple JavaScript for basic functionality
        const chatHistory = document.getElementById('chatHistory');
        const messageForm = document.getElementById('messageForm');
        const messageInput = document.getElementById('messageInput');

        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        }

        function addMessage(text, isUser = false) {
            const messageWrapper = document.createElement('div');
            messageWrapper.className = `message-wrapper ${isUser ? 'user-message-wrapper' : 'ai-message-wrapper'}`;
            
            const message = document.createElement('div');
            message.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
            message.textContent = text;
            
            const timestamp = document.createElement('div');
            timestamp.className = `timestamp ${isUser ? 'user-timestamp' : 'ai-timestamp'}`;
            timestamp.textContent = getCurrentTime();
            
            messageWrapper.appendChild(message);
            messageWrapper.appendChild(timestamp);
            chatHistory.appendChild(messageWrapper);
            
            // Scroll to bottom
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }

        function showTypingIndicator() {
            const typingWrapper = document.createElement('div');
            typingWrapper.className = 'message-wrapper ai-message-wrapper';
            typingWrapper.id = 'typing-indicator';
            
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            
            typingWrapper.appendChild(typingDiv);
            chatHistory.appendChild(typingWrapper);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }

        function removeTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        // Sample responses for demonstration
        const sampleResponses = [
            "That's an interesting question! ML QuID processes information contextually to provide relevant insights.",
            "Based on our conversation, I can see you're interested in AI capabilities. Let me elaborate on that topic.",
            "Excellent point! This connects to our earlier discussion about proactive systems and intelligent automation.",
            "I understand your query. Here's how ML QuID approaches this challenge using advanced algorithms.",
            "Your question touches on key aspects of modern AI. Let me provide a comprehensive response."
        ];

        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userMessage = messageInput.value.trim();
            if (!userMessage) return;
            
            // Add user message
            addMessage(userMessage, true);
            
            // Clear input
            messageInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate AI response after delay
            setTimeout(() => {
                removeTypingIndicator();
                const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
                addMessage(randomResponse, false);
            }, 1000 + Math.random() * 2000);
        });

        // Auto-focus input on page load
        window.addEventListener('load', () => {
            messageInput.focus();
        });
    </script>
</body>
</html>'''

print("Updated HTML code with fixes:")
print("1. Timestamps now appear BELOW messages instead of next to them")
print("2. Interface takes full screen with proper viewport sizing")
print("\nKey changes made:")
print("- Added proper message wrapper structure with timestamps below")
print("- Fixed positioning with position: fixed for full screen coverage")
print("- Added proper scrollbar styling and responsive design")
print("- Implemented typing indicators and smooth animations")
print("- Added JavaScript for interactive functionality")

# Save the updated HTML file
with open('ml_quid_chat_fixed.html', 'w', encoding='utf-8') as f:
    f.write(html_code)

print("\nHTML file saved as 'ml_quid_chat_fixed.html'")
print("The interface now has:")
print("- Timestamps positioned below each message")
print("- Full screen coverage like Perplexity AI")
print("- Proper responsive design for all devices")
print("- Interactive chat functionality with typing indicators")
