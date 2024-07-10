// Function to load quiz for different topics
function loadQuiz(section, topic, basePath) {
  fetch(`${basePath}${topic}-quiz.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Randomly select 10 questions from data.quiz
      const shuffledQuiz = shuffleArray(data.quiz).slice(0, 10);

      let quizContent = '<form id="quiz-form">';
      shuffledQuiz.forEach((question, index) => {
        quizContent += `
            <div class="mb-3">
              <label>${question.question}</label>
              ${question.options
                .map(
                  (option, i) => `
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="question${index}" value="${option}" id="question${index}option${i}">
                      <label class="form-check-label" for="question${index}option${i}">${option}</label>
                    </div>
                  `
                )
                .join("")}
            </div>
          `;
      });
      quizContent += `
          <button type="button" class="btn btn-primary" id="submit-quiz-btn">Submit</button>
          </form>
          <div id="quiz-results" class="mt-3"></div>
        `;
      document.getElementById("quiz-content").innerHTML = quizContent;

      // Save the shuffled quiz questions to a global variable for later reference
      window.currentQuiz = shuffledQuiz;

      // Initialize Bootstrap Collapse for quiz section (already initialized in loadContent)

      // Event listener for the submit button after quiz content is loaded
      document
        .getElementById("submit-quiz-btn")
        .addEventListener("click", () => {
          submitQuiz(section, topic, basePath); // Pass basePath to submitQuiz
        });
    })
    .catch((error) => console.error("Error loading quiz:", error));
}

// Function to submit quiz for different topics
function submitQuiz(section, topic, basePath) {
  const quizForm = document.getElementById("quiz-form");
  const formData = new FormData(quizForm);
  let score = 0;

  // Use the global variable that stores the shuffled questions
  window.currentQuiz.forEach((question, index) => {
    const userAnswer = formData.get(`question${index}`);
    if (userAnswer === question.answer) {
      score++;
    }
  });

  const totalQuestions = window.currentQuiz.length;
  const resultText = `You got ${score} out of ${totalQuestions} correct.`;
  document.getElementById(
    "quiz-results"
  ).innerHTML = `<div class="alert alert-info">${resultText}</div>`;
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
