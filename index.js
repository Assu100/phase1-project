document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const enterBtn = document.getElementById('enter-btn');
    const entryContainer = document.getElementById('entry-container');
    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.getElementById('question-container');
    const optionsList = document.getElementById('options-list');
    const explanationText = document.getElementById('explanation');
    const leaderboardList = document.getElementById('leaderboard-list');
    const timeDisplay = document.getElementById('time');
    const contestantNameInput = document.getElementById('contestant-name');
  
    let currentQuestionIndex = 0;
    let leaderboard = [];
    let contestantName = '';
  
    const quizData = [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        explanation: "Paris is the capital city of France."
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
        correctAnswer: "William Shakespeare",
        explanation: "'Romeo and Juliet' is a tragedy written by William Shakespeare."
      },
      // Add more questions here...
    ];
  
    const startQuiz = () => {
      quizContainer.style.display = 'block';
      entryContainer.style.display = 'none';
      startBtn.style.display = 'none';
      submitBtn.style.display = 'none';
      loadQuestion();
      countdownTimer();
    };
  
    const loadQuestion = () => {
      resetOptions();
      const currentQuestion = quizData[currentQuestionIndex];
      const { question, options } = currentQuestion;
  
      questionContainer.querySelector('#question-text').textContent = question;
      options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option;
        li.classList.add('option');
        li.dataset.answer = option;
        li.addEventListener('click', handleOptionClick);
        optionsList.appendChild(li);
      });
    };
  
    const handleOptionClick = (e) => {
      const selectedOption = e.target.dataset.answer;
      const correctAnswer = quizData[currentQuestionIndex].correctAnswer;
  
      if (selectedOption === correctAnswer) {
        explanationText.style.color = 'green';
        explanationText.textContent = "Correct! " + quizData[currentQuestionIndex].explanation;
      } else {
        explanationText.style.color = 'red';
        explanationText.textContent = "Wrong! The correct answer is: " + correctAnswer + ". " + quizData[currentQuestionIndex].explanation;
      }
  
      showCorrectAnswer(); // Show correct answer after user submits their answer
  
      nextBtn.style.display = 'block';
      document.querySelectorAll('.option').forEach(option => {
        option.removeEventListener('click', handleOptionClick);
      });
    };
  
    const showCorrectAnswer = () => {
      const correctAnswer = quizData[currentQuestionIndex].correctAnswer;
      const options = optionsList.querySelectorAll('.option');
  
      options.forEach(option => {
        if (option.dataset.answer === correctAnswer) {
          option.style.backgroundColor = 'lightgreen';
        }
      });
    };
  
    const resetOptions = () => {
      optionsList.innerHTML = '';
      explanationText.textContent = '';
      nextBtn.style.display = 'none';
      const options = optionsList.querySelectorAll('.option');
      options.forEach(option => {
        option.style.backgroundColor = ''; // Reset background color of options
      });
    };
  
    const countdownTimer = () => {
      let timeLeft = 10; // seconds
      timeDisplay.textContent = timeLeft;
  
      const timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
  
        if (timeLeft === 0) {
          clearInterval(timer);
          handleOptionClick(); // Simulate answering incorrectly when time runs out
        }
      }, 1000);
    };
  
    const showLeaderboard = () => {
      leaderboardList.innerHTML = '';
      leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard by score descending
      leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name} - ${entry.score} points`;
        leaderboardList.appendChild(li);
      });
    };
  
    const submitQuiz = () => {
      // Assuming the quiz has ended, show final score and leaderboard
      quizContainer.innerHTML = `<h2>Quiz Completed!</h2>`;
      showLeaderboard();
    };
  
    enterBtn.addEventListener('click', () => {
      contestantName = contestantNameInput.value.trim();
      if (contestantName !== '') {
        startQuiz();
      } else {
        alert('Please enter your name to start the quiz.');
      }
    });
  
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizData.length) {
        loadQuestion();
        countdownTimer();
      } else {
        submitBtn.style.display = 'block';
      }
    });
  
    submitBtn.addEventListener('click', submitQuiz);
  
    // // Initial leaderboard data (for testing)
    // leaderboard = [
    //   { name: "Alice", score: 20 },
    //   { name: "Bob", score: 15 },
    //   { name: "Charlie", score: 18 }
    // ];
  
    showLeaderboard(); // Display initial leaderboard
  });
  