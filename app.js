// Sample data for mock search functionality
const sampleData = {
  questions: [
    {
      query: "What is artificial intelligence?",
      answer: "Artificial Intelligence (AI) refers to computer systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, problem-solving, and decision-making. AI includes machine learning, neural networks, and deep learning algorithms that analyze data patterns."
    },
    {
      query: "How does climate change work?",
      answer: "Climate change occurs when greenhouse gases trap heat in Earth's atmosphere, causing global temperatures to rise. Human activities like burning fossil fuels increase carbon dioxide levels, leading to melting ice caps, rising sea levels, and extreme weather patterns."
    },
    {
      query: "What is cryptocurrency?",
      answer: "Cryptocurrency is digital currency secured by cryptography and built on blockchain technology. Unlike traditional currencies, it's decentralized, meaning no central authority controls it. Bitcoin, Ethereum, and other cryptocurrencies enable peer-to-peer transactions without banks or intermediaries."
    },
    {
      query: "How do vaccines work?",
      answer: "Vaccines train your immune system to recognize and fight specific diseases by introducing weakened or inactive pathogens. This creates antibodies and immune memory, so if exposed to the actual disease, your body can quickly respond and prevent illness."
    },
    {
      query: "What is machine learning?",
      answer: "Machine learning is a subset of AI where algorithms learn patterns from data without explicit programming. Systems improve performance through experience, making predictions or decisions. Types include supervised, unsupervised, and reinforcement learning, powering applications like recommendation systems and image recognition."
    },
    {
      query: "How does the internet work?",
      answer: "The internet is a global network of interconnected computers communicating through standardized protocols like TCP/IP. Data travels through routers, switches, and cables, allowing devices worldwide to share information. Internet Service Providers connect users to this vast network infrastructure."
    },
    {
      query: "What is quantum computing?",
      answer: "Quantum computing uses quantum mechanical phenomena like superposition and entanglement to process information. Unlike classical bits, quantum bits (qubits) can exist in multiple states simultaneously, potentially solving complex problems exponentially faster than traditional computers for specific applications."
    },
    {
      query: "How does photosynthesis work?",
      answer: "Photosynthesis is the process where plants convert sunlight, carbon dioxide, and water into glucose and oxygen. Chlorophyll in plant cells captures light energy, driving chemical reactions that produce food for the plant while releasing oxygen as a byproduct."
    },
    {
      query: "What is blockchain technology?",
      answer: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) linked and secured using cryptography. Each block contains transaction data, timestamps, and cryptographic hashes, creating an immutable, transparent, and decentralized record-keeping system."
    },
    {
      query: "How do neural networks work?",
      answer: "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process and transmit information through weighted connections. Through training, these networks learn to recognize patterns, make predictions, and solve complex problems."
    }
  ],
  fallbackAnswers: [
    "This is a complex topic that involves multiple interconnected factors and systems. Current research and expert analysis suggest various approaches and solutions are being developed and implemented worldwide to address the challenges and opportunities in this field.",
    "Based on current scientific understanding and research, this subject encompasses various theories, methodologies, and practical applications. Experts continue to study and develop new insights, with ongoing debates and discoveries shaping our knowledge in this area.",
    "This topic represents an important area of study and development with significant implications for society, technology, and human progress. Multiple perspectives and approaches exist, with continued research and innovation driving new understanding and practical solutions.",
    "Current evidence and expert analysis indicate this is a multifaceted subject with various contributing factors and potential outcomes. Ongoing research and technological advances continue to expand our understanding and provide new insights into effective approaches.",
    "This subject involves complex systems and processes that researchers and practitioners continue to study and refine. Multiple factors contribute to the outcomes, and evolving methodologies and technologies are helping to advance our knowledge and capabilities."
  ]
};

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');
const resultCard = document.getElementById('resultCard');
const resultQuestion = document.getElementById('resultQuestion');
const resultAnswer = document.getElementById('resultAnswer');
const wordCount = document.getElementById('wordCount');
const copyBtn = document.getElementById('copyBtn');
const errorMessage = document.getElementById('errorMessage');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const instructionsToggle = document.getElementById('instructionsToggle');
const instructionsContent = document.getElementById('instructionsContent');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Application State
let searchHistory = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  loadSearchHistory();
  setupEventListeners();
  displaySearchHistory();
});

// Event Listeners
function setupEventListeners() {
  // Search form submission
  searchForm.addEventListener('submit', handleSearch);
  
  // Copy button
  copyBtn.addEventListener('copy-button', copyToClipboard);
  
  // Clear history button
  clearHistoryBtn.addEventListener('click', clearSearchHistory);
  
  // Instructions toggle
  instructionsToggle.addEventListener('click', toggleInstructions);
  
  // Enter key support for search
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  });
  
  // Copy button click
  copyBtn.addEventListener('click', copyToClipboard);
}

// Search Handler
async function handleSearch(e) {
  e.preventDefault();
  
  const query = searchInput.value.trim();
  if (!query) {
    showError('Please enter a question to search.');
    return;
  }
  
  setLoadingState(true);
  hideError();
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const result = await mockSearch(query);
    displayResult(query, result);
    addToHistory(query, result);
    displaySearchHistory();
    
  } catch (error) {
    showError('Sorry, something went wrong. Please try again.');
    console.error('Search error:', error);
  } finally {
    setLoadingState(false);
  }
}

// Mock Search Function
async function mockSearch(query) {
  // Try to find exact or similar match
  const normalizedQuery = query.toLowerCase();
  
  // Check for exact matches first
  const exactMatch = sampleData.questions.find(item => 
    item.query.toLowerCase() === normalizedQuery
  );
  
  if (exactMatch) {
    return exactMatch.answer;
  }
  
  // Check for partial matches
  const partialMatch = sampleData.questions.find(item => {
    const queryWords = normalizedQuery.split(' ');
    const itemWords = item.query.toLowerCase().split(' ');
    
    return queryWords.some(word => 
      itemWords.some(itemWord => 
        itemWord.includes(word) || word.includes(itemWord)
      )
    );
  });
  
  if (partialMatch) {
    return partialMatch.answer;
  }
  
  // Use fallback answer
  const randomIndex = Math.floor(Math.random() * sampleData.fallbackAnswers.length);
  return sampleData.fallbackAnswers[randomIndex];
}

// Display Result
function displayResult(query, answer) {
  resultQuestion.textContent = query;
  resultAnswer.textContent = answer;
  
  const words = countWords(answer);
  wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  
  // Show result card
  resultCard.classList.remove('hidden');
  hideError();
  
  // Scroll to results
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Word Counter
function countWords(text) {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Loading State Management
function setLoadingState(isLoading) {
  if (isLoading) {
    searchBtn.classList.add('loading');
    searchBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');
  } else {
    searchBtn.classList.remove('loading');
    searchBtn.disabled = false;
    loadingSpinner.classList.add('hidden');
  }
}

// Error Handling
function showError(message) {
  errorMessage.querySelector('span').textContent = message;
  errorMessage.classList.remove('hidden');
  resultCard.classList.add('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

// Copy to Clipboard
async function copyToClipboard() {
  try {
    const text = resultAnswer.textContent;
    await navigator.clipboard.writeText(text);
    showToast('Answer copied to clipboard!');
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = resultAnswer.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('Answer copied to clipboard!');
  }
}

// Toast Notifications
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 3000);
}

// Search History Management
function addToHistory(query, answer) {
  const historyItem = {
    query,
    answer,
    timestamp: Date.now()
  };
  
  // Remove duplicates
  searchHistory = searchHistory.filter(item => 
    item.query.toLowerCase() !== query.toLowerCase()
  );
  
  // Add to beginning
  searchHistory.unshift(historyItem);
  
  // Keep only last 5 searches
  searchHistory = searchHistory.slice(0, 5);
  
  // Save to localStorage (note: this is just for demo, localStorage may not work in all deployment scenarios)
  try {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  } catch (error) {
    // Ignore localStorage errors in sandbox environments
    console.log('LocalStorage not available');
  }
}

function loadSearchHistory() {
  try {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      searchHistory = JSON.parse(saved);
    }
  } catch (error) {
    // Ignore localStorage errors in sandbox environments
    searchHistory = [];
  }
}

function displaySearchHistory() {
  if (searchHistory.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No searches yet. Start by asking a question above!</p>';
    return;
  }
  
  historyList.innerHTML = searchHistory.map(item => `
    <div class="history-item" onclick="selectHistoryItem('${item.query.replace(/'/g, "\\'")}')">
      <div class="history-question">${escapeHtml(item.query)}</div>
      <div class="history-answer">${escapeHtml(item.answer)}</div>
    </div>
  `).join('');
}

function selectHistoryItem(query) {
  searchInput.value = query;
  searchInput.focus();
  
  // Find the answer from history
  const historyItem = searchHistory.find(item => item.query === query);
  if (historyItem) {
    displayResult(query, historyItem.answer);
  }
}

function clearSearchHistory() {
  searchHistory = [];
  try {
    localStorage.removeItem('searchHistory');
  } catch (error) {
    // Ignore localStorage errors
  }
  displaySearchHistory();
  showToast('Search history cleared!');
}

// Instructions Toggle
function toggleInstructions() {
  const isActive = instructionsToggle.classList.contains('active');
  
  if (isActive) {
    instructionsToggle.classList.remove('active');
    instructionsContent.classList.add('hidden');
  } else {
    instructionsToggle.classList.add('active');
    instructionsContent.classList.remove('hidden');
  }
}

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
  // Focus search input with Ctrl/Cmd + K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
  }
  
  // Copy answer with Ctrl/Cmd + C when result is visible
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !resultCard.classList.contains('hidden')) {
    if (document.activeElement !== searchInput) {
      e.preventDefault();
      copyToClipboard();
    }
  }
});

// Add some sample searches for demonstration
setTimeout(() => {
  if (searchHistory.length === 0) {
    // Add a sample search to show functionality
    addToHistory(
      "What is artificial intelligence?",
      "Artificial Intelligence (AI) refers to computer systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, problem-solving, and decision-making. AI includes machine learning, neural networks, and deep learning algorithms that analyze data patterns."
    );
    displaySearchHistory();
  }
}, 500);
