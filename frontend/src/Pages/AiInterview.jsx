import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIInterview = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [report, setReport] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [micPermission, setMicPermission] = useState('unknown');
    const [cameraPermission, setCameraPermission] = useState('unknown');
    const [tabSwitches, setTabSwitches] = useState(0);
    const [isTabActive, setIsTabActive] = useState(true);
    const [userPresent, setUserPresent] = useState(true);
    const [noiseLevel, setNoiseLevel] = useState(0);
    const [role, setRole] = useState('');
    const [experience, setExperience] = useState('');
    const [level, setLevel] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    const recognitionRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const faceDetectorRef = useRef(null);
    const detectionActiveRef = useRef(false);

    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-development-api-key-here';
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const sampleAnswers = {
        "Software Developer": {
            "Beginner": [
                "I'm a recent graduate with internship experience in software development...",
                "My strengths include quick learning and basic coding skills...",
                "I'm working on deepening my debugging skills...",
                "I want to grow my technical skills with your company...",
                "I see myself as a skilled developer contributing to projects..."
            ],
            "Intermediate": [
                "I'm a developer with 3 years of experience in full-stack development...",
                "My strengths include problem-solving and team collaboration...",
                "I'm improving my advanced algorithm skills...",
                "I’m drawn to your innovative tech stack...",
                "I aim to lead small projects and mentor juniors..."
            ],
            "Advanced": [
                "I'm a seasoned developer with 7+ years in software architecture...",
                "My strengths are system design and leadership...",
                "I'm refining my skills in emerging technologies...",
                "I want to drive impactful solutions at your company...",
                "I see myself as a tech lead shaping the company’s future..."
            ]
        },
        "Default": [
            "I'm a motivated individual with relevant experience...",
            "My strengths include adaptability and communication...",
            "I'm working on enhancing my skills...",
            "I’m excited to contribute to your team...",
            "I see myself growing into a key role..."
        ]
    };

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const micStatus = await navigator.permissions.query({ name: 'microphone' });
                setMicPermission(micStatus.state);
                micStatus.onchange = () => setMicPermission(micStatus.state);

                const cameraStatus = await navigator.permissions.query({ name: 'camera' });
                setCameraPermission(cameraStatus.state);
                cameraStatus.onchange = () => setCameraPermission(cameraStatus.state);
            } catch (err) {
                console.error('Permission check error:', err);
            }
        };

        checkPermissions();

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsRecording(true);
                setError(null);
                setupNoiseDetection();
            };

            recognitionRef.current.onresult = (event) => {
                const currentTranscript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError(`Speech recognition error: ${event.error}. Please check microphone permissions.`);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                }
            };
        } else {
            setError('Speech recognition not supported. Use Chrome or a compatible browser.');
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitches(prev => prev + 1);
                setIsTabActive(false);
                setError('Warning: Tab switch detected. Please stay on this tab during the interview.');
            } else {
                setIsTabActive(true);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        if ('FaceDetector' in window) {
            faceDetectorRef.current = new window.FaceDetector({ fastMode: true });
        } else {
            console.warn('FaceDetector API not supported in this browser.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            detectionActiveRef.current = false;
        };
    }, []);

    useEffect(() => {
        const setupCamera = async () => {
            if (isSetupComplete && videoRef.current && !streamRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                    setCameraPermission('granted');
                    detectUserPresence();
                } catch (err) {
                    console.error('Camera setup error:', err);
                    setError('Failed to access camera: ' + err.message);
                    setCameraPermission('denied');
                }
            }
        };
        setupCamera();
    }, [isSetupComplete]);

    const detectUserPresence = () => {
        if (!faceDetectorRef.current || !videoRef.current || detectionActiveRef.current) return;

        detectionActiveRef.current = true;

        const detect = async () => {
            if (!detectionActiveRef.current || !streamRef.current) return;

            try {
                const faces = await faceDetectorRef.current.detect(videoRef.current);
                const isPresent = faces.length > 0;
                setUserPresent(isPresent);
                if (!isPresent && isRecording) {
                    setError('Warning: No user detected in camera view. Please stay visible.');
                }
            } catch (err) {
                console.error('Face detection error:', err);
            }
            setTimeout(detect, 1000);
        };
        detect();
    };

    const generateQuestions = async () => {
        if (!role || !experience || !level) {
            setError('Please fill in all fields: Role, Experience, and Level.');
            return;
        }

        setIsLoading(true);
        try {
            const prompt = `
        Generate 5 interview questions for a candidate applying for the role of "${role}" 
        with ${experience} years of experience at a "${level}" level (Beginner, Intermediate, or Advanced). 
        The questions should be relevant to the role, experience, and level, increasing in complexity appropriately.
        Return the response as a valid JSON array of strings, e.g.:
        [
          "Question 1",
          "Question 2",
          "Question 3",
          "Question 4",
          "Question 5"
        ]
        Ensure the output is strictly JSON format without additional text, markdown, or backticks.
      `;

            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();
            const cleanResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedQuestions = JSON.parse(cleanResponse);

            if (Array.isArray(parsedQuestions) && parsedQuestions.length === 5) {
                setQuestions(parsedQuestions);
                setIsSetupComplete(true);
            } else {
                throw new Error('Invalid question format received from API');
            }
        } catch (err) {
            console.error('Error generating questions:', err);
            setError('Failed to generate questions: ' + err.message);
            setQuestions([
                "Tell me about yourself",
                "What are your strengths?",
                "What are your weaknesses?",
                "Why do you want this job?",
                "Where do you see yourself in 5 years?"
            ]);
            setIsSetupComplete(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isSetupComplete && questions.length > 0 && currentQuestion < questions.length) {
            speak(questions[currentQuestion]);
        }
    }, [currentQuestion, isSetupComplete, questions]);

    const setupNoiseDetection = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 2048;
            source.connect(analyserRef.current);

            const checkNoise = () => {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setNoiseLevel(average);
                if (average > 50 && isRecording) {
                    setError('Warning: High background noise detected (Level: ' + Math.round(average) + '). Please reduce noise.');
                }
                if (isRecording) {
                    requestAnimationFrame(checkNoise);
                }
            };
            checkNoise();
        } catch (err) {
            console.error('Noise detection error:', err);
        }
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const requestMicPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicPermission('granted');
            startRecording();
        } catch (err) {
            setError('Microphone access denied. Please allow microphone permissions.');
            setMicPermission('denied');
        }
    };

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraPermission('granted');
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                detectUserPresence();
            }
        } catch (err) {
            setError('Camera access denied. Please allow camera permissions.');
            setCameraPermission('denied');
        }
    };

    const startRecording = () => {
        if (!recognitionRef.current) {
            setError('Speech recognition not available');
            return;
        }

        if (micPermission === 'denied') {
            setError('Microphone access denied. Please enable it in settings.');
            return;
        }

        if (micPermission === 'prompt' || micPermission === 'unknown') {
            requestMicPermission();
            return;
        }

        setTranscript('');
        setError(null);
        try {
            recognitionRef.current.start();
        } catch (err) {
            setError('Failed to start recording: ' + err.message);
            setIsRecording(false);
        }
    };

    const stopRecording = async () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();

            if (transcript.trim()) {
                setIsLoading(true);
                try {
                    const analysis = await analyzeAnswer(transcript, questions[currentQuestion]);
                    setAnswers(prev => [...prev, { answer: transcript, analysis }]);
                    setTranscript('');

                    if (currentQuestion < questions.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                    } else {
                        generateReport();
                    }
                } catch (error) {
                    setError('Error analyzing answer: ' + error.message);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setError('No response recorded. Please speak clearly.');
            }
        }
    };

    const analyzeAnswer = async (answer, question) => {
        try {
            const prompt = `
        Analyze this interview response for the role of "${role}" with ${experience} years of experience at a "${level}" level:
        Question: "${question}"
        Response: "${answer}"
        
        Return a valid JSON object with the following structure:
        {
          "score": <number between 0 and 100>,
          "feedback": "<detailed feedback string tailored to the role, experience, and level>"
        }
        Ensure the output is strictly JSON format without additional text, markdown, or backticks.
        Provide feedback specific to the role, experience, and level, suggesting improvements relevant to its requirements. Keep it very short and too the point.
      `;

            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();
            const cleanResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

            let parsedResponse;
            try {
                parsedResponse = JSON.parse(cleanResponse);
            } catch (parseError) {
                console.error('JSON parse error:', parseError, 'Raw response:', responseText);
                return {
                    score: 50,
                    feedback: `Error parsing AI response: ${parseError.message}. Raw response: ${responseText}`
                };
            }

            if (typeof parsedResponse.score !== 'number' || parsedResponse.score < 0 || parsedResponse.score > 100 ||
                typeof parsedResponse.feedback !== 'string') {
                return {
                    score: 50,
                    feedback: "Invalid response format from AI. Expected score (number 0-100) and feedback (string)."
                };
            }

            return parsedResponse;
        } catch (error) {
            console.error('Gemini API error:', error);
            return {
                score: 50,
                feedback: `Error analyzing response: ${error.message}`
            };
        }
    };

    const generateReport = () => {
        setReport({
            totalScore: answers.reduce((sum, ans) => sum + ans.analysis.score, 0) / answers.length,
            detailedAnalysis: answers.map((ans, idx) => ({
                question: questions[idx],
                userAnswer: ans.answer,
                suggestedAnswer: (sampleAnswers[role]?.[level] || sampleAnswers["Default"])[idx],
                score: ans.analysis.score,
                feedback: ans.analysis.feedback
            })),
            tabSwitches: tabSwitches,
            presenceIssues: !userPresent,
            noiseLevel: noiseLevel,
            role: role,
            experience: experience,
            level: level
        });
    };

    const resetInterview = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setReport(null);
        setTranscript('');
        setIsLoading(false);
        setError(null);
        setTabSwitches(0);
        setUserPresent(true);
        setNoiseLevel(0);
        setRole('');
        setExperience('');
        setLevel('');
        setQuestions([]);
        setIsSetupComplete(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        detectionActiveRef.current = false;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">AI Mock Interview</h1>

            {!isSetupComplete && !report && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Setup Your Interview</h2>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-gray-700 mb-2">Role:</label>
                        <input
                            type="text"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g., Software Developer"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="experience" className="block text-gray-700 mb-2">Experience (years):</label>
                        <input
                            type="number"
                            id="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="e.g., 3"
                            min="0"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="level" className="block text-gray-700 mb-2">Level:</label>
                        <select
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="">Select a level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <button
                        onClick={generateQuestions}
                        className={`w-full px-6 py-2 rounded-md text-white transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Generating Questions...' : 'Start Interview'}
                    </button>
                </div>
            )}

            {isSetupComplete && (
                <div className="flex justify-center mb-4">
                    {cameraPermission === 'granted' ? (
                        <video ref={videoRef} autoPlay playsInline className="w-64 h-48 rounded-md border" />
                    ) : (
                        <button
                            onClick={requestCameraPermission}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Enable Camera
                        </button>
                    )}
                </div>
            )}

            {micPermission === 'denied' && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    Microphone access is required. Please enable it in your browser settings and refresh.
                </div>
            )}

            {cameraPermission === 'denied' && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    Camera access is recommended. Please enable it in your browser settings and refresh.
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!isTabActive && (
                <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
                    Warning: Please return to this tab to continue. Tab switches: {tabSwitches}
                </div>
            )}

            {!userPresent && isRecording && (
                <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
                    Warning: User not detected in camera view. Please stay visible.
                </div>
            )}

            {noiseLevel > 50 && isRecording && (
                <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
                    Warning: High background noise detected (Level: {Math.round(noiseLevel)}). Please reduce noise.
                </div>
            )}

            {isSetupComplete && !report ? (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <div className="text-center text-gray-600 mb-4">
                        Question {currentQuestion + 1} of {questions.length}
                    </div>

                    <div className="bg-white p-4 rounded-md mb-4">
                        <p className="text-lg text-gray-700">{questions[currentQuestion]}</p>
                        {isLoading && <p className="text-sm text-gray-500 italic mt-2">Analyzing your answer...</p>}
                    </div>

                    <div className="bg-white p-4 rounded-md min-h-[100px] mb-4 relative">
                        <p className="text-gray-600">{transcript || "Your answer will appear here..."}</p>
                        {isRecording && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                    </div>

                    <div className="text-center space-x-4">
                        {!isRecording ? (
                            <button
                                onClick={startRecording}
                                className={`px-6 py-2 rounded-md text-white transition-colors ${isLoading || !recognitionRef.current || micPermission === 'denied'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                disabled={isLoading || !recognitionRef.current || micPermission === 'denied'}
                            >
                                {micPermission === 'prompt' ? 'Grant Mic Access & Start' : 'Start Recording'}
                            </button>
                        ) : (
                            <button
                                onClick={stopRecording}
                                className={`px-6 py-2 rounded-md text-white transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                disabled={isLoading}
                            >
                                Stop Recording
                            </button>
                        )}
                        {currentQuestion > 0 && !isRecording && (
                            <button
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                                className="px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                            >
                                Previous Question
                            </button>
                        )}
                        {answers.length > 0 && !isRecording && (
                            <button
                                onClick={generateReport}
                                className="px-6 py-2 rounded-md text-white bg-purple-500 hover:bg-purple-600"
                            >
                                Finish & View Report
                            </button>
                        )}
                    </div>
                </div>
            ) : report ? (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Interview Report</h2>
                    <p className="text-lg text-gray-700 mb-2">Role: {report.role}</p>
                    <p className="text-lg text-gray-700 mb-2">Experience: {report.experience} years</p>
                    <p className="text-lg text-gray-700 mb-2">Level: {report.level}</p>
                    <p className="text-lg text-gray-700 mb-2">Average Score: {report.totalScore.toFixed(1)}%</p>
                    <p className="text-lg text-gray-700 mb-2">Tab Switches Detected: {report.tabSwitches}</p>
                    <p className="text-lg text-gray-700 mb-2">Presence Issues: {report.presenceIssues ? 'Yes' : 'No'}</p>
                    <p className="text-lg text-gray-700 mb-6">Average Noise Level: {Math.round(report.noiseLevel)}</p>

                    {report.detailedAnalysis.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-md mb-4">
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Question {idx + 1}: {item.question}</h3>
                            <p className="text-gray-600"><strong>Your Answer:</strong> {item.userAnswer}</p>
                            <p className="text-gray-600"><strong>Suggested Answer:</strong> {item.suggestedAnswer}</p>
                            <p className="text-gray-600"><strong>Score:</strong> {item.score}%</p>
                            <p className="text-gray-600"><strong>Feedback:</strong> {item.feedback}</p>
                        </div>
                    ))}

                    <button
                        onClick={resetInterview}
                        className="block mx-auto px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Start New Interview
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default AIInterview;