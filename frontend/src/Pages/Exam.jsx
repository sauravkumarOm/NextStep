import { useState, useEffect } from "react";
import questionsData from "../question"; // Importing questions JSON

const TestingPage = () => {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Basic");
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [pastScores, setPastScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState(null);
  const [hoverOption, setHoverOption] = useState(null);

  // Load past scores from localStorage
  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("userScores")) || [];
    setPastScores(storedScores);
  }, []);

  // Setup and clear timer
  useEffect(() => {
    if (testStarted && !quizCompleted && timeLeft > 0) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(timerInterval);
      return () => clearInterval(timerInterval);
    }
    
    if (timeLeft === 0 && timer) {
      clearInterval(timer);
    }
  }, [testStarted, timeLeft, quizCompleted, timer]);

  const testQuestions = selectedSkill ? questionsData[selectedSkill]?.[selectedLevel] || [] : [];

  const handleStartTest = () => {
    if (!selectedSkill) {
      alert("Please select a skill before starting the test.");
      return;
    }
    setTestStarted(true);
    setTimeLeft(testQuestions.length * 30); // 30 seconds per question
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === testQuestions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
      saveScoreToLocalStorage();
      if (timer) clearInterval(timer);
    }
  };

  // Save the result to localStorage
  const saveScoreToLocalStorage = () => {
    const newScore = { 
      skill: selectedSkill, 
      level: selectedLevel, 
      score: score + (selectedAnswer === testQuestions[currentQuestionIndex].correct ? 1 : 0), 
      total: testQuestions.length,
      date: new Date().toLocaleDateString()
    };
    const updatedScores = [...pastScores, newScore];
    setPastScores(updatedScores);
    localStorage.setItem("userScores", JSON.stringify(updatedScores));
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setTestStarted(false);
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto rounded-xl shadow-xl overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-blue-600 py-5 px-6">
          <h2 className="text-3xl font-bold text-white text-center">Skill Assessment</h2>
          {testStarted && !quizCompleted && (
            <div className="flex justify-between items-center mt-3">
              <span className="text-white font-medium">
                Question {currentQuestionIndex + 1}/{testQuestions.length}
              </span>
              <span className="bg-white text-blue-600 px-3 py-1 rounded-full font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {!testStarted ? (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Start a New Assessment</h3>
                
                {/* Skill Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Skill:</label>
                  <div className="relative">
                    <select
                      className="w-full p-3 pl-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                    >
                      <option value="">-- Choose a Skill --</option>
                      {Object.keys(questionsData).map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Difficulty Level Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Difficulty Level:</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Basic', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        className={`py-2 rounded-lg transition-colors duration-200 ${
                          selectedLevel === level
                            ? 'bg-blue-600 text-white font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedLevel(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Test Button */}
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg flex items-center justify-center"
                  onClick={handleStartTest}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Assessment
                </button>
              </div>

              {/* Display Past Scores */}
              {pastScores.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Assessment History</h3>
                  <div className="overflow-y-auto max-h-64 pr-2">
                    {pastScores.map((entry, index) => (
                      <div 
                        key={index} 
                        className="p-3 mb-2 border rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{entry.skill}</span>
                            <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {entry.level}
                            </span>
                            {entry.date && (
                              <span className="block text-sm text-gray-500 mt-1">{entry.date}</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg font-bold">
                              {Math.round((entry.score / entry.total) * 100)}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              ({entry.score}/{entry.total})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : !quizCompleted ? (
            testQuestions.length > 0 && (
              <div>
                {/* Progress Indicator */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question */}
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Q{currentQuestionIndex + 1}: {testQuestions[currentQuestionIndex].question}
                </h3>

                {/* Options */}
                <ul className="space-y-3 mb-6">
                  {testQuestions[currentQuestionIndex].options.map((option, index) => (
                    <li
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedAnswer === option
                          ? "bg-blue-600 text-white border-blue-700 shadow-md"
                          : hoverOption === index
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-200 hover:bg-blue-50"
                      }`}
                      onClick={() => setSelectedAnswer(option)}
                      onMouseEnter={() => setHoverOption(index)}
                      onMouseLeave={() => setHoverOption(null)}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                          selectedAnswer === option 
                            ? "bg-white text-blue-600" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-base">{option}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Next Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                    selectedAnswer
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer}
                >
                  {currentQuestionIndex < testQuestions.length - 1 ? (
                    <>
                      Next Question
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  ) : (
                    "Finish Assessment"
                  )}
                </button>
              </div>
            )
          ) : (
            // Quiz Completion Section
            <div className="py-8 text-center">
              <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Assessment Completed!</h3>
              <p className="text-lg text-gray-600 mb-4">
                You've completed the {selectedLevel} assessment for {selectedSkill}
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.round((score / testQuestions.length) * 100)}%
                </div>
                <p className="text-lg text-gray-700">
                  You answered <span className="font-semibold">{score}</span> out of <span className="font-semibold">{testQuestions.length}</span> questions correctly
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className="bg-white border border-blue-500 text-blue-600 p-3 rounded-lg text-base font-semibold transition-all duration-300 hover:bg-blue-50"
                  onClick={restartTest}
                >
                  Take Another Test
                </button>
                <button
                  className="bg-blue-600 text-white p-3 rounded-lg text-base font-semibold transition-all duration-300 hover:bg-blue-700"
                  onClick={() => {
                    setTestStarted(true);
                    setQuizCompleted(false);
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setSelectedAnswer(null);
                    setTimeLeft(testQuestions.length * 30);
                  }}
                >
                  Retry Same Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestingPage;
