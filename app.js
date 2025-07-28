// Application Data
const appData = {
  "systemInfo": {
    "name": "ML QuID",
    "version": "2.0 Chat",
    "description": "Active AI Chat System with Advanced Understanding",
    "features": ["Conversational Interface", "Context Awareness", "Proactive Suggestions", "Real-time Responses"]
  },
  "welcomeMessage": {
    "content": "Hello! I'm ML QuID, your active AI assistant. I'm designed to understand context and provide proactive responses. I can help you explore topics about AI, machine learning, and active response systems. What would you like to know?",
    "suggestions": [
      "What makes you different from other AI assistants?",
      "How do you understand context in conversations?",
      "Tell me about proactive AI systems",
      "What are your key capabilities?"
    ]
  },
  "knowledgeBase": [
    {
      "category": "About ML QuID",
      "topics": [
        {
          "keywords": ["different", "unique", "special", "capabilities"],
          "answer": "I'm designed to be proactive rather than just reactive. While traditional AI assistants wait for specific commands, I continuously analyze our conversation context, anticipate your needs, and provide relevant suggestions before you even ask. I maintain conversation memory and adapt my responses based on your interests and previous interactions.",
          "confidence": 0.94,
          "followUp": ["How does proactive AI work?", "What is context awareness?", "Show me an example of proactive behavior"]
        },
        {
          "keywords": ["context", "understanding", "conversation", "memory"],
          "answer": "I understand context by maintaining a memory of our entire conversation, analyzing the relationships between topics we discuss, and recognizing patterns in your questions. This allows me to provide more relevant responses and anticipate what information might be helpful next, rather than treating each question in isolation.",
          "confidence": 0.91,
          "followUp": ["How do you maintain conversation memory?", "What are the benefits of context awareness?", "Can you give me a practical example?"]
        }
      ]
    },
    {
      "category": "Proactive AI Systems", 
      "topics": [
        {
          "keywords": ["proactive", "active", "anticipate", "predict"],
          "answer": "Proactive AI systems are designed to take initiative by analyzing patterns, predicting user needs, and providing value before being asked. Unlike reactive systems that only respond to direct commands, proactive AI continuously processes information, learns from interactions, and suggests relevant actions or information. This creates a more intuitive and helpful user experience.",
          "confidence": 0.96,
          "followUp": ["How is this different from reactive AI?", "What are the benefits of proactive systems?", "Give me examples of proactive AI in action"]
        }
      ]
    },
    {
      "category": "Technical Capabilities",
      "topics": [
        {
          "keywords": ["how", "work", "technology", "implementation"],
          "answer": "I use advanced natural language processing to understand your questions, context memory to maintain conversation history, pattern recognition to identify your interests, and predictive algorithms to generate relevant suggestions. My responses are generated in real-time with confidence scoring to ensure accuracy.",
          "confidence": 0.88,
          "followUp": ["Tell me more about your NLP capabilities", "How do you score confidence?", "What is pattern recognition in AI?"]
        }
      ]
    }
  ],
  "conversationStarters": [
    "What makes AI systems 'active' vs 'passive'?",
    "How do you process and understand natural language?",
    "Explain your learning and adaptation process",
    "What is the future of proactive AI?",
    "How do you maintain context across conversations?",
    "Show me examples of your proactive capabilities"
  ]
};

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const typingIndicator = document.getElementById('typingIndicator');

// Application State
let conversationContext = [];
let currentSuggestions = [];
let isProcessing = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeChat();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // Message input events
  messageInput.addEventListener('input', handleInputChange);
  messageInput.addEventListener('keydown', handleKeyDown);
  
  // Send button
  sendButton.addEventListener('click', handleSendMessage);
  
  // Auto-resize textarea
  messageInput.addEventListener('input', autoResizeTextarea);
}

// Initialize Chat
function initializeChat() {
  displayWelcomeMessage();
  updateSuggestions(appData.welcomeMessage.suggestions);
  
  // Focus on input after initialization
  setTimeout(() => {
    messageInput.focus();
  }, 500);
}

// Display Welcome Message
function displayWelcomeMessage() {
  const welcomeElement = document.createElement('div');
  welcomeElement.className = 'welcome-message';
  welcomeElement.innerHTML = `
    <h2>Welcome to ${appData.systemInfo.name}</h2>
    <p>${appData.welcomeMessage.content}</p>
    <div class="welcome-features">
      ${appData.systemInfo.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
    </div>
  `;
  
  messagesContainer.appendChild(welcomeElement);
  scrollToBottom();
}

// Handle Input Change
function handleInputChange() {
  const hasContent = messageInput.value.trim().length > 0;
  sendButton.disabled = !hasContent || isProcessing;
}

// Handle Key Down
function handleKeyDown(e) {
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      // Allow new line with Shift+Enter
      return;
    } else {
      e.preventDefault();
      if (!isProcessing && messageInput.value.trim()) {
        handleSendMessage();
      }
    }
  }
}

// Auto Resize Textarea
function autoResizeTextarea() {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// Handle Send Message
async function handleSendMessage() {
  const message = messageInput.value.trim();
  if (!message || isProcessing) return;
  
  isProcessing = true;
  
  // Clear input and disable send button
  messageInput.value = '';
  sendButton.disabled = true;
  autoResizeTextarea();
  
  // Add user message to conversation
  addMessage('user', message);
  conversationContext.push({ role: 'user', content: message });
  
  // Show typing indicator
  showTypingIndicator();
  
  // Generate AI response
  try {
    const response = await generateAIResponse(message);
    hideTypingIndicator();
    
    // Add AI response
    addMessage('ai', response.answer, response.confidence);
    conversationContext.push({ role: 'ai', content: response.answer });
    
    // Update suggestions based on response
    updateSuggestions(response.followUp || generateContextualSuggestions());
    
  } catch (error) {
    console.error('Error generating response:', error);
    hideTypingIndicator();
    addMessage('ai', "I apologize, but I'm experiencing some technical difficulties. Please try asking your question again.", 0.5);
    updateSuggestions(["Try asking again", "Ask a different question", "What can you help me with?"]);
  } finally {
    isProcessing = false;
    handleInputChange(); // Re-enable send button if there's content
  }
}

// Add Message to Chat
function addMessage(role, content, confidence = null) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${role}`;
  
  const avatar = role === 'ai' ? 'ML' : 'You';
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  let confidenceHtml = '';
  if (confidence !== null && role === 'ai') {
    const confidenceClass = confidence >= 0.9 ? 'confidence-high' : 
                           confidence >= 0.7 ? 'confidence-medium' : 'confidence-low';
    const confidencePercent = Math.round(confidence * 100);
    confidenceHtml = `
      <div class="message-meta">
        <span class="timestamp">${timestamp}</span>
        <span class="confidence-score ${confidenceClass}">Confidence: ${confidencePercent}%</span>
      </div>
    `;
  } else if (role === 'user') {
    confidenceHtml = `
      <div class="message-meta">
        <span class="timestamp">${timestamp}</span>
      </div>
    `;
  }
  
  messageElement.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-bubble">${escapeHtml(content)}</div>
      ${confidenceHtml}
    </div>
  `;
  
  messagesContainer.appendChild(messageElement);
  scrollToBottom();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Generate AI Response
async function generateAIResponse(userMessage) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
  
  const normalizedMessage = userMessage.toLowerCase();
  
  // Find matching response from knowledge base
  for (const category of appData.knowledgeBase) {
    for (const topic of category.topics) {
      const hasKeyword = topic.keywords.some(keyword => 
        normalizedMessage.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        return {
          answer: topic.answer,
          confidence: topic.confidence,
          followUp: topic.followUp
        };
      }
    }
  }
  
  // Generate contextual response based on conversation
  return generateContextualResponse(userMessage);
}

// Generate Contextual Response
function generateContextualResponse(userMessage) {
  const contextualResponses = [
    {
      answer: "That's an interesting question! Based on our conversation, I can see you're curious about AI systems and their capabilities. Let me explain how I approach this topic by analyzing the context of what we've discussed and providing insights that build on our previous exchanges.",
      confidence: 0.85,
      followUp: ["Can you elaborate on that topic?", "How does this relate to what we discussed?", "Tell me more about the technical aspects"]
    },
    {
      answer: "I notice you're exploring topics related to AI and machine learning. This connects well with my proactive capabilities - I'm designed to not just answer questions, but to understand the deeper context of what you're trying to learn and suggest related areas that might interest you.",
      confidence: 0.87,
      followUp: ["What other related topics should I explore?", "How do you determine what's relevant?", "Show me more examples"]
    },
    {
      answer: "Great question! This touches on one of my core strengths - context awareness. I maintain a memory of our entire conversation and use that to provide more nuanced, relevant responses. Unlike traditional AI that treats each question in isolation, I consider how this fits into the broader discussion we're having.",
      confidence: 0.92,
      followUp: ["How is this different from other AI systems?", "Can you give me a practical example?", "What are the benefits of context awareness?"]
    }
  ];
  
  const randomResponse = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  return randomResponse;
}

// Generate Contextual Suggestions
function generateContextualSuggestions() {
  const recentTopics = conversationContext.slice(-4).map(msg => msg.content.toLowerCase());
  const hasAITopic = recentTopics.some(topic => topic.includes('ai') || topic.includes('artificial'));
  const hasContextTopic = recentTopics.some(topic => topic.includes('context') || topic.includes('memory'));
  const hasProactiveTopic = recentTopics.some(topic => topic.includes('proactive') || topic.includes('active'));
  
  let suggestions = [];
  
  if (hasAITopic) {
    suggestions.push("How do you learn from our conversations?", "What makes AI truly intelligent?");
  }
  
  if (hasContextTopic) {
    suggestions.push("Show me how context awareness works", "Can you remember everything we've discussed?");
  }
  
  if (hasProactiveTopic) {
    suggestions.push("Give me an example of proactive behavior", "How do you anticipate user needs?");
  }
  
  // Add some general suggestions
  suggestions.push(...appData.conversationStarters.slice(0, 2));
  
  // Return up to 4 unique suggestions
  return [...new Set(suggestions)].slice(0, 4);
}

// Update Suggestions
function updateSuggestions(suggestions) {
  currentSuggestions = suggestions;
  suggestionsContainer.innerHTML = '';
  
  suggestions.forEach(suggestion => {
    const suggestionElement = document.createElement('button');
    suggestionElement.className = 'suggestion-pill';
    suggestionElement.textContent = suggestion;
    suggestionElement.addEventListener('click', (e) => {
      e.preventDefault();
      selectSuggestion(suggestion);
    });
    suggestionsContainer.appendChild(suggestionElement);
  });
}

// Select Suggestion
function selectSuggestion(suggestion) {
  if (isProcessing) return;
  
  messageInput.value = suggestion;
  messageInput.focus();
  handleInputChange();
  autoResizeTextarea();
  
  // Optional: Auto-send the suggestion after a brief delay
  setTimeout(() => {
    if (messageInput.value === suggestion) {
      handleSendMessage();
    }
  }, 300);
}

// Show Typing Indicator
function showTypingIndicator() {
  typingIndicator.classList.remove('hidden');
  scrollToBottom();
}

// Hide Typing Indicator
function hideTypingIndicator() {
  typingIndicator.classList.add('hidden');
}

// Scroll to Bottom
function scrollToBottom() {
  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 100);
}

// Handle browser back/forward
window.addEventListener('popstate', function() {
  // Maintain state if needed
});

// Accessibility improvements
messageInput.addEventListener('focus', function() {
  this.setAttribute('aria-expanded', 'true');
});

messageInput.addEventListener('blur', function() {
  this.setAttribute('aria-expanded', 'false');
});

// Handle mobile viewport
function handleMobileViewport() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', handleMobileViewport);
window.addEventListener('orientationchange', handleMobileViewport);
handleMobileViewport();

// Prevent zoom on iOS when focusing input
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  messageInput.addEventListener('focus', function() {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  });
  
  messageInput.addEventListener('blur', function() {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0');
    }
  });
}

// ML QuID - Simplified JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeContactForm();
    initializeMobileMenu();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Set active navigation link based on scroll position
    function setActiveNavLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', debounce(setActiveNavLink, 100));

    // Set initial active link
    setActiveNavLink();
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.nav-menu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('mobile-menu-open');
                }
            }
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form-element');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(formData.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            submitContactForm(formData);
        });
    }
}

// Submit contact form (placeholder functionality)
function submitContactForm(formData) {
    const submitButton = document.querySelector('.contact-form-element button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset form
        document.querySelector('.contact-form-element').reset();

        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');

        console.log('Form submitted:', formData);
    }, 2000);
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-menu-open');
            this.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('mobile-menu-open');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('mobile-menu-open');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
}

// Initialize scroll animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .tech-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '400px',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
    });

    // Set background color based on type
    const colors = {
        success: '#21808d',
        error: '#dc3545',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Page became visible - could refresh data if needed
        console.log('Page is now visible');
    }
});

// Handle errors gracefully
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error to logging service in production
});

// Performance monitoring
window.addEventListener('load', function() {
    // Page fully loaded
    console.log('Page loaded successfully');

    // Add loaded class to body for any CSS animations
    document.body.classList.add('page-loaded');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        debounce
    };
}
