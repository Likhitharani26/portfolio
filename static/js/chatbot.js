// === OFFLINE Q&A ===
const qaPairs = {
  "greeting": "Hello! I'm Sameer’s assistant. Ask me anything about his skills or experience.",
  "projects": "Sameer built a Facial Recognition System, Disease Prediction App, personal portfolio, and IoT Gas Leak Detection System.",
  "skills": "Sameer is skilled in Python, Flask, Streamlit, OpenCV, Pandas, NumPy, Power BI, and more.",
  "technologies": "Python, Flask, OpenCV, Streamlit, MySQL, Power BI, Git, GitHub, and more.",
  "education": "He is a B.Tech AI & Data Science graduate from Aditya College of Engineering (2021–2026). Completed his Intermediate in Maths, Physics, Chemistry at Vidyanikethan Junior College (2020–2022), and his Secondary School at Kothaindlu MPL High School (2019–2020).",
  "linkedin": "Here’s Sameer’s LinkedIn: https://www.linkedin.com/in/shaik-sameer-69a3422a8",
  "github": "GitHub: https://github.com/Smr2005",
  "email": "You can email Likhitharani at likhitharani62@gmail.com",
  "internships": "He interned as AI Intern at TechSaksham Edunet Foundation (Microsoft & SAP CSR), Data Science Intern at SkillDzire Technologies, and is currently a Data Analytics Intern at APSCHE x SmartBridge Virtual Internship.",
  "strengths": "Sameer is dedicated, innovative, a fast learner, and detail-oriented.",
  "weakness": "He tends to hyper-focus on solving problems, but is improving his time management.",
  "why should we hire you": "Because Sameer brings strong technical skills, creativity, and a drive to grow.",
  "bye": "Thanks for chatting! Feel free to explore more of Sameer’s portfolio."
};

// === KEYWORD MAP FOR QUERY VARIATIONS ===
const keywordMap = {
  "greeting": ["hi", "hello", "hey", "hai", "hii", "heyy", "yo", "namaste", "salaam"],
  "projects": ["projects", "project list", "what has he built", "apps", "iot", "websites", "what did he make"],
  "skills": ["skills", "coding", "expertise", "what can he do", "technical skills", "programming"],
  "technologies": ["technologies", "tools", "stack", "frameworks", "platforms", "languages"],
  "education": ["education", "study", "college", "school", "academics", "qualification"],
  "linkedin": ["linkedin", "linkedin profile", "connect"],
  "github": ["github", "code", "repo", "git"],
  "email": ["email", "mail", "contact", "email id", "gmail"],
  "internships": ["intern", "internship", "experience", "work experience", "training"],
  "strengths": ["strengths", "positive", "strong points", "good at"],
  "weakness": ["weakness", "negative", "area to improve"],
  "why should we hire you": ["why hire", "hire him", "why sameer", "select him", "why choose"],
  "bye": ["bye", "goodbye", "exit", "thank you", "see you", "done"]
};

// === FUNCTION TO MATCH USER INPUT TO A RESPONSE KEY ===
function getResponseKey(userMessage) {
  const cleanedMessage = userMessage.toLowerCase();
  for (const key in keywordMap) {
    for (const phrase of keywordMap[key]) {
      if (cleanedMessage.includes(phrase)) {
        return key;
      }
    }
  }
  return null;
}

// === TEXT-TO-SPEECH FUNCTION ===
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}

// === INITIALIZE AFTER DOM LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  const chatFloatBtn = document.getElementById("chat-float-btn");

  // Scroll to Chat section on floating button click
  chatFloatBtn.addEventListener("click", () => {
    const chatSection = document.getElementById("chat");
    if (chatSection) chatSection.scrollIntoView({ behavior: "smooth" });
  });

  // Animate floating chat icon based on visible sections
  const sections = ["#about", "#projects", "#certifications", "#skills", "#internships", "#chat", "#contact"];
  const sides = ["right", "left"];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = sections.findIndex(id => entry.target.matches(id));
        const align = sides[index % 2];
        const rect = entry.target.getBoundingClientRect();
        const topY = window.scrollY + rect.top + rect.height / 2 - 30;
        chatFloatBtn.classList.add("animate");
        chatFloatBtn.style.top = `${topY}px`;
        chatFloatBtn.style.left = align === "left" ? "5%" : "90%";
        setTimeout(() => chatFloatBtn.classList.remove("animate"), 500);
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(id => {
    const el = document.querySelector(id);
    if (el) observer.observe(el);
  });

  // Support sending a message on ENTER key press
  const userInput = document.getElementById("userInput");
  if (userInput) {
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});

// === FUNCTION TO SEND MESSAGE TO THE CHATBOX ===
function sendMessage() {
  const inputElem = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const chatFloatBtn = document.getElementById("chat-float-btn");
  const userMessage = inputElem.value.trim();
  if (!userMessage) return;

  // Display user message
  chatbox.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;
  inputElem.value = '';

  // Display bot typing animation
  chatbox.innerHTML += `
    <div id="typing-indicator" class="typing-indicator">
      <strong>Bot is typing</strong>
      <span></span><span></span><span></span>
    </div>
  `;
  chatFloatBtn.classList.add("talking");
  chatbox.scrollTop = chatbox.scrollHeight;

  // Determine appropriate response based on keyword matching
  const matchedKey = getResponseKey(userMessage);
  const reply = qaPairs[matchedKey] || "🤖 I didn’t understand that. Try asking about Sameer’s certifications, tools, or internships.";

  // After a short delay, remove typing animation and display reply with voice output
  setTimeout(() => {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) typingIndicator.remove();
    chatbox.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
    chatFloatBtn.classList.remove("talking");
    chatbox.scrollTop = chatbox.scrollHeight;
    speak(reply);
  }, 1000);
}
