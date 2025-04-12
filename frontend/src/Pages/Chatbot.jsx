import React, { useState, useRef } from 'react';
import ChatBot, { ChatBotProvider } from 'react-chatbotify';
import axios from 'axios';

// Check if browser supports speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const flow = {
  start: {
    message: "Hey! I’m Sehpaathi 🤖. What do you want to learn today?",
    options: [
      "Backend",
      "UI/UX",
      "Data Analysis",
      "Artificial Intelligence",
      "DBMS",
      "Web Development",
      "Other",
    ],
    path: (params) => {
      const option = params.userInput;
      return option === "Other" ? "ask_other_topic" : option.toLowerCase().replace(/ /g, "_");
    },
  },

  backend: {
    message: `🔧 Backend:\n1️⃣ JS Basics\n2️⃣ Node.js + Express\n3️⃣ MongoDB / SQL\n4️⃣ Auth (JWT)\n5️⃣ Build APIs\n6️⃣ Deploy`,
    options: ["Back to Main Menu"],
    path: () => "start",
  },
  ui_ux: {
    message: `🎨 UI/UX:\n1️⃣ Learn Figma\n2️⃣ UX Principles\n3️⃣ Wireframes & Prototypes\n4️⃣ UI Challenges\n5️⃣ Portfolio`,
    options: ["Back to Main Menu"],
    path: () => "start",
  },
  data_analysis: {
    message: `📊 Data Analysis:\n1️⃣ Python + Pandas\n2️⃣ SQL Queries\n3️⃣ Seaborn Charts\n4️⃣ Kaggle Projects\n5️⃣ Tableau`,
    options: ["Back to Main Menu"],
    path: () => "start",
  },
  artificial_intelligence: {
    message: `🧠 AI:\n1️⃣ Python + Numpy\n2️⃣ ML Basics\n3️⃣ TensorFlow\n4️⃣ Mini AI Projects`,
    options: ["Back to Main Menu"],
    path: () => "start",
  },
  dbms: {
    message: `🗃️ DBMS:\n1️⃣ SQL Basics\n2️⃣ Joins, GroupBy\n3️⃣ Indexing\n4️⃣ ER Diagrams\n5️⃣ MongoDB`,
    options: ["Back to Main Menu"],
    path: () => "start",
  },
  web_development: {
    message: `🌐 Web Dev:\n1️⃣ HTML/CSS/JS\n2️⃣ React\n3️⃣ Git + GitHub\n4️⃣ Backend (Node)\n5️⃣ Deploy`,
    options: ["Back to Main Menu"],
    path: () => "start",
  },

  ask_other_topic: {
    message: "Tell me the topic you're curious about:",
    path: "fetch_gemini_response",
  },

  fetch_gemini_response: {
    message: "Let me fetch something for you... 🧠",
    path: async (params) => {
      const topic = params.userInput;

      try {
        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY`,
          {
            contents: [{ parts: [{ text: `Give a short, beginner-friendly learning guide about ${topic}` }] }],
          }
        );

        const content = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return {
          message: content || "Sorry, I couldn't find relevant info on that topic.",
          options: ["Back to Main Menu"],
          path: () => "start",
        };
      } catch (err) {
        console.error("Gemini API Error:", err);
        return {
          message: "Oops! Something went wrong while fetching info.",
          options: ["Back to Main Menu"],
          path: () => "start",
        };
      }
    },
  },
};

const SehpaathiBot = () => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const startListening = () => {
    if (!recognition) return alert("Speech Recognition not supported in this browser.");
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      if (inputRef.current) {
        inputRef.current.value = transcript;
      }
    };
  };

  return (
    <ChatBotProvider>
      <div style={{ position: 'relative' }}>
        <ChatBot
          flow={flow}
          input={{
            placeholder: "Type or use mic 🎙️",
            value: inputValue,
            ref: inputRef,
            onChange: (e) => setInputValue(e.target.value),
          }}
          styles={{
            chatWindowStyle: { padding: "12px" },
            optionButtonStyle: {
              backgroundColor: "#2563eb",
              color: "white",
              fontSize: "13px",
              padding: "6px 12px",
              margin: "4px",
              borderRadius: "8px",
            },
            inputStyle: {
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "calc(100% - 40px)",
              marginRight: "8px",
            },
          }}
          settings={{
            general: { disableInput: false },
            chatHistory: { storageKey: "sehpaathi_chat" },
          }}
        />
        <button
          onClick={startListening}
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "18px",
            cursor: "pointer",
          }}
          title="Click to speak"
        >
          🎙️
        </button>
      </div>
    </ChatBotProvider>
  );
};

export default SehpaathiBot;
