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
  let contestants = []; // Array to keep track of current contestants
  let quizData = []; // Array to store quiz questions loaded from JSON

  const API="./db.json"
  const loadQuizData = () => {
    const storedQuizData = localStorage.getItem('quizData');
    if (storedQuizData) {
      quizData = JSON.parse(storedQuizData);
      initializeQuiz(); // Initialize quiz with stored data
    } else {
      fetch(API)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          quizData = data;
          localStorage.setItem('quizData', JSON.stringify(quizData)); // Store data in localStorage
          initializeQuiz(); // Initialize quiz with fetched data
        })
        .catch(error => {
          console.error('Error fetching quiz data:', error);
        });
    }
  };

  const startQuiz = () => {
    quizContainer.style.display = 'block';
    entryContainer.style.display = 'none';
    startBtn.style.display = 'none';
    submitBtn.style.display = 'none';
    loadQuestion();
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

    startTimer(); // Start timer for each question
  };

  const handleOptionClick = (e) => {
    clearInterval(countdownTimer); // Stop the timer when an option is clicked

    const selectedOption = e.target.dataset.answer;
    const correctAnswer = quizData[currentQuestionIndex].correctAnswer;

    if (selectedOption === correctAnswer) {
      explanationText.style.color = 'green';
      explanationText.textContent = "Correct! " + quizData[currentQuestionIndex].explanation;
      updateLeaderboard(); // Update leaderboard for correct answer
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

  const startTimer = () => {
    let timeLeft = 10; // seconds for each question (adjust as needed)
    timeDisplay.textContent = timeLeft;

    countdownTimer = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = timeLeft;

      if (timeLeft === 0) {
        clearInterval(countdownTimer);
        handleOptionClick(); // Simulate answering incorrectly when time runs out
      }
    }, 1000);
  };

  const updateLeaderboard = () => {
    const contestantName = contestantNameInput.value.trim();
    if (contestantName !== '' && !contestants.includes(contestantName)) {
      contestants.push(contestantName); // Add new contestant to the list
    }

    leaderboardList.innerHTML = '';
    contestants.forEach((contestant, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${contestant}`;
      leaderboardList.appendChild(li);
    });
  };

  const submitQuiz = () => {
    // Assuming the quiz has ended, show final score and leaderboard
    quizContainer.innerHTML = `<h2>Quiz Completed!</h2>`;
    showLeaderboard();
  };

  const showLeaderboard = () => {
    // Display leaderboard logic here
    // You can modify this to show top scorers, all contestants, etc.
  };

  enterBtn.addEventListener('click', () => {
    const contestantName = contestantNameInput.value.trim();
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
    } else {
      submitBtn.style.display = 'block';
    }
  });

  submitBtn.addEventListener('click', submitQuiz);

  // Initial leaderboard data (for testing)
  leaderboard = [];

  showLeaderboard(); // Display initial leaderboard

  // Load quiz data when the page is loaded
  loadQuizData();
});
