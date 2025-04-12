const questionsData = {
    Backend: {
      Basic: [
        {
          question: "Which language is commonly used for backend development?",
          options: ["HTML", "CSS", "Python", "JavaScript"],
          correct: "Python",
        },
        {
          question: "What is a REST API?",
          options: [
            "A type of database",
            "A frontend framework",
            "An architectural style for web services",
            "A programming language",
          ],
          correct: "An architectural style for web services",
        },
        {
          question: "Which HTTP method is used to fetch data from a server?",
          options: ["POST", "PUT", "GET", "DELETE"],
          correct: "GET",
        },
        {
          question: "Which database is SQL-based?",
          options: ["MongoDB", "Firebase", "PostgreSQL", "DynamoDB"],
          correct: "PostgreSQL",
        },
        {
          question: "What does CRUD stand for?",
          options: [
            "Create, Read, Update, Delete",
            "Create, Remove, Upload, Download",
            "Call, Request, Update, Drop",
            "Code, Run, Use, Deploy",
          ],
          correct: "Create, Read, Update, Delete",
        },
      ],
      Intermediate: [
        {
          question: "Which framework is NOT used for backend development?",
          options: ["Django", "Express.js", "Flask", "Bootstrap"],
          correct: "Bootstrap",
        },
        {
          question: "What does JWT stand for in authentication?",
          options: [
            "Java Web Token",
            "JavaScript Web Token",
            "JSON Web Token",
            "Jenkins Web Token",
          ],
          correct: "JSON Web Token",
        },
        {
          question: "Which database follows the ACID principle?",
          options: ["MySQL", "MongoDB", "Redis", "Cassandra"],
          correct: "MySQL",
        },
        {
          question: "What is the purpose of middleware in Express.js?",
          options: [
            "To style the frontend",
            "To handle HTTP requests and responses",
            "To manage CSS animations",
            "To connect frontend to backend",
          ],
          correct: "To handle HTTP requests and responses",
        },
        {
          question: "Which tool is used for API testing?",
          options: ["Postman", "Figma", "Webpack", "Redux"],
          correct: "Postman",
        },
      ],
      Advanced: [
        {
          question: "Which caching system is commonly used to speed up backend applications?",
          options: ["Redis", "MongoDB", "PostgreSQL", "GraphQL"],
          correct: "Redis",
        },
        {
          question: "What is an event loop in Node.js?",
          options: [
            "A function to handle loops in JavaScript",
            "A concurrency model that handles async operations",
            "A method to create REST APIs",
            "A feature for rendering frontend pages",
          ],
          correct: "A concurrency model that handles async operations",
        },
        {
          question: "Which protocol is used in WebSockets?",
          options: ["HTTP", "TCP", "UDP", "FTP"],
          correct: "TCP",
        },
        {
          question: "Which NoSQL database uses document-based storage?",
          options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
          correct: "MongoDB",
        },
        {
          question: "Which tool is used for CI/CD automation?",
          options: ["Jenkins", "PostgreSQL", "Bootstrap", "MongoDB"],
          correct: "Jenkins",
        },
      ],
    },
  
    UIUX: {
      Basic: [
        {
          question: "What does UI stand for?",
          options: ["User Internet", "User Interface", "Unique Identity", "Universal Integration"],
          correct: "User Interface",
        },
        {
          question: "What tool is commonly used for UI design?",
          options: ["React", "Figma", "Node.js", "MongoDB"],
          correct: "Figma",
        },
        {
          question: "Which principle is important in UI design?",
          options: ["Minimalism", "Complexity", "Randomization", "Opacity"],
          correct: "Minimalism",
        },
        {
          question: "What does UX stand for?",
          options: ["User Experience", "Universal Exchange", "Ultra Extreme", "User Execution"],
          correct: "User Experience",
        },
        {
          question: "Which is a UI design tool?",
          options: ["Photoshop", "MongoDB", "React", "TensorFlow"],
          correct: "Photoshop",
        },
      ],
      Intermediate: [
        {
          question: "What is the main goal of UX design?",
          options: ["Attracting investors", "Enhancing user satisfaction", "Creating complex designs", "Building databases"],
          correct: "Enhancing user satisfaction",
        },
        {
          question: "Which color model is used for web design?",
          options: ["CMYK", "RGB", "HSL", "HEX"],
          correct: "RGB",
        },
        {
          question: "Which is NOT a UI design principle?",
          options: ["Consistency", "Accessibility", "Confusion", "Simplicity"],
          correct: "Confusion",
        },
        {
          question: "What is a wireframe?",
          options: ["A type of website", "A basic layout of a webpage", "A CSS framework", "A database schema"],
          correct: "A basic layout of a webpage",
        },
        {
          question: "Which software is used for prototyping?",
          options: ["Figma", "Django", "TensorFlow", "MongoDB"],
          correct: "Figma",
        },
      ],
    },
  
    DataAnalyst: {
      Basic: [
        {
          question: "What is the purpose of data analysis?",
          options: ["To design websites", "To extract insights from data", "To manage servers", "To write code"],
          correct: "To extract insights from data",
        },
        {
          question: "Which software is used for data visualization?",
          options: ["Excel", "MongoDB", "Django", "Figma"],
          correct: "Excel",
        },
        {
          question: "What is Big Data?",
          options: ["A large software company", "A large dataset", "A type of database", "A UI design trend"],
          correct: "A large dataset",
        },
        {
          question: "Which programming language is commonly used in data analysis?",
          options: ["Python", "HTML", "CSS", "PHP"],
          correct: "Python",
        },
        {
          question: "Which of these is a BI tool?",
          options: ["Power BI", "Figma", "React", "PostgreSQL"],
          correct: "Power BI",
        },
      ],
    },
  };
  
  export default questionsData;
  