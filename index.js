document.addEventListener('DOMContentLoaded', function () {
  const startBtn = document.getElementById('start-btn');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn'); 
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
  let leaderboard = {}; // Use an object to track marks for each contestant
  let contestants = []; // Array to keep track of current contestants
  let quizData = []; // Array to store quiz questions loaded from JSON
  let countdownTimer; // Variable to hold the timer interval

  const API = './db.json';

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

  const initializeQuiz = () => {
    // Reset variables for a new quiz session
    currentQuestionIndex = 0;
    leaderboard = {};
    contestants = [];
    countdownTimer = null;

    // Display initial state
    entryContainer.style.display = 'block';
    quizContainer.style.display = 'none';
    startBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
    leaderboardList.innerHTML = '';

    // Clear contestant name input
    contestantNameInput.value = '';
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

    // Calculate question number
    const questionNumber = currentQuestionIndex + 1;

    questionContainer.querySelector('#question-text').textContent = `Question ${questionNumber}: ${question}`;
    options.forEach((option, index) => {
      const li = document.createElement('li');
      li.textContent = option;
      li.classList.add('option');
      li.dataset.answer = option;
      li.addEventListener('click', handleOptionClick);
      optionsList.appendChild(li);
    });

    startQuestionTimer(); // Start timer for each question
  };

  const handleOptionClick = (e) => {
    clearInterval(countdownTimer); // Stop the timer when an option is clicked

    const selectedOption = e.target.dataset.answer;
    const correctAnswer = quizData[currentQuestionIndex].correctAnswer;

    let answeredCorrectly = false;

    if (selectedOption === correctAnswer) {
      answeredCorrectly = true;
      explanationText.style.color = 'black';
      explanationText.textContent = "Correct! " + quizData[currentQuestionIndex].explanation;
    } else {
      explanationText.style.color = 'red';
      explanationText.textContent = "Wrong! The correct answer is: " + correctAnswer + ". " + quizData[currentQuestionIndex].explanation;
    }

    updateLeaderboard(answeredCorrectly); // Update leaderboard based on answer

    showCorrectAnswer(); // Show correct answer after user submits their answer

    nextBtn.style.display = 'block';
    prevBtn.style.display = 'block'; // Ensure previous button is always displayed
    document.querySelectorAll('.option').forEach(option => {
      option.removeEventListener('click', handleOptionClick);
    });
  };

  const showCorrectAnswer = () => {
    const correctAnswer = quizData[currentQuestionIndex].correctAnswer;
    const options = optionsList.querySelectorAll('.option');

    options.forEach(option => {
      if (option.dataset.answer === correctAnswer) {
        option.style.backgroundColor = 'purple';
      }
    });
  };

  const resetOptions = () => {
    optionsList.innerHTML = '';
    explanationText.textContent = '';
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none'; // Hide previous button initially
    const options = optionsList.querySelectorAll('.option');
    options.forEach(option => {
      option.style.backgroundColor = ''; // Reset background color of options
    });
  };

  const startQuestionTimer = () => {
    let timeLeft = 10; // seconds for each question (adjust as needed)
    timeDisplay.textContent = timeLeft;

    countdownTimer = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = timeLeft;

      if (timeLeft === 0) {
        clearInterval(countdownTimer);
        handleTimeUp(); // Function to handle when time is up
      }
    }, 1000);
  };

  const handleTimeUp = () => {
    explanationText.style.color = 'red';
    explanationText.textContent = "Time's up! The correct answer is: " + quizData[currentQuestionIndex].correctAnswer + ". " + quizData[currentQuestionIndex].explanation;
    showCorrectAnswer(); // Show correct answer after time is up
    nextQuestion();
  };

  const nextQuestion = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      loadQuestion();
      if (currentQuestionIndex === quizData.length - 1) {
        submitBtn.style.display = 'block'; // Show submit button 
      }
    } else {
      submitQuiz();
    }
  };

  const updateLeaderboard = (answeredCorrectly) => {
    const contestantName = contestantNameInput.value.trim();
    if (contestantName !== '' && !contestants.includes(contestantName)) {
      contestants.push(contestantName); // Add new contestant to the list
      leaderboard[contestantName] = 0; // Initialize marks to 0 for new contestant
    }

    if (answeredCorrectly) {
      leaderboard[contestantName]++; // Increment marks if answered correctly
    }

    leaderboardList.innerHTML = '';
    contestants.forEach((contestant, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${contestant} - Marks: ${leaderboard[contestant]}`;
      leaderboardList.appendChild(li);
    });
  };

  const submitQuiz = () => {
    // Assuming the quiz has ended, show final score and leaderboard
    quizContainer.innerHTML = `<h2>Quiz Completed!</h2>`;
    showFinalLeaderboard();
    submitBtn.style.display = 'none'; // Hide submit button at the end
    prevBtn.style.display = 'none';
  };  

  //   // Add a restart button
  //   const restartBtn = document.createElement('button');
  //   restartBtn.textContent = 'Restart Quiz';
  //   restartBtn.classList.add('btn', 'btn-restart');
  //   restartBtn.addEventListener('click', () => {
  //     initializeQuiz();
  //     startBtn.style.display = 'inline-block'; // Show start button again
  //   });
  //   quizContainer.appendChild(restartBtn);
  // };

  const showFinalLeaderboard = () => {
    // Display final leaderboard logic here
    leaderboardList.innerHTML = '';
    const sortedContestants = contestants.sort((a, b) => leaderboard[b] - leaderboard[a]); // Sort contestants by marks
    sortedContestants.forEach((contestant, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${contestant} - Marks: ${leaderboard[contestant]}`;
      leaderboardList.appendChild(li);
    });

    // Display final scores below the "Quiz Completed!" message
    const finalScores = document.createElement('div');
    finalScores.classList.add('final-scores');
    finalScores.innerHTML = '<h3>Final Scores</h3>';
    sortedContestants.forEach((contestant, index) => {
      const score = document.createElement('p');
      score.textContent = `${index + 1}. ${contestant} - Marks: ${leaderboard[contestant]}`;
      finalScores.appendChild(score);
    });
    quizContainer.appendChild(finalScores);
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
    clearInterval(countdownTimer); // Stop timer when user manually proceeds to next question
    nextQuestion();
  });

  prevBtn.addEventListener('click', () => {
    clearInterval(countdownTimer); // Stop timer when user goes to previous question
    currentQuestionIndex--;
    if (currentQuestionIndex >= 0) {
      loadQuestion();
    } else {
      // Handle edge case where currentQuestionIndex is less than 0
      currentQuestionIndex = 0; // Ensure index does not go negative
    }
  });

  submitBtn.addEventListener('click', submitQuiz);

  // Initial leaderboard data
  leaderboard = {};

  // Load quiz data when the page is loaded
  loadQuizData();
});
