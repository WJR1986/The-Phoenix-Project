// Function to load content for different topics
function loadContent(section, topic) {
  fetch(`../data/prep/${topic}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let content = "";
      data.sections.forEach((section, index) => {
        // Convert \n to <br> for line breaks
        let formattedContent = section.content.replace(/\n/g, "<br>");

        // Check if content is an array (bullet points)
        if (Array.isArray(section.content)) {
          formattedContent = "<ul>";
          section.content.forEach((item) => {
            formattedContent += `<li>${item.replace(/\n/g, "<br>")}</li>`;
          });
          formattedContent += "</ul>";
        }

        // Construct the image source path
        let imageSrc = section.image
          ? `../assets/images/${topic}/${section.image}`
          : "";
        let imageTitle = section.imageTitle || ""; // Default to empty string if imageTitle is not defined

        content += `
          <div class="card mb-3">
            <div class="card-header" id="heading${index}">
              <h5 class="mb-0">
                <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="${
          index === 0 ? "true" : "false"
        }" aria-controls="collapse${index}">
                  ${section.title}
                </button>
              </h5>
            </div>
            <div id="collapse${index}" class="collapse ${
          index === 0 ? "show" : ""
        }" aria-labelledby="heading${index}" data-parent="#content-area">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-md-${imageSrc ? "8" : "12"}">
                    <div class="card-text">${formattedContent}</div>
                  </div>
                  ${
                    imageSrc
                      ? `
                  <div class="col-md-4">
                    <div class="image-container">
                      <img src="${imageSrc}" class="img-fluid border rounded p-2 ml-2 mt-3 max-image-size" alt="${section.title}">
                      <div class="image-title">${imageTitle}</div>
                    </div>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
        `;
      });

      content += `
        <div class="card mb-3">
          <div class="card-header">
            <h5 class="mb-0">
              <button class="btn btn-link" id="test-knowledge-btn" data-toggle="collapse" data-target="#quiz" aria-expanded="false" aria-controls="quiz">
                Test Your Knowledge
              </button>
            </h5>
          </div>
          <div id="quiz" class="collapse" aria-labelledby="quiz" data-parent="#content-area">
            <div class="card-body" id="quiz-content">
              <!-- Quiz content will be loaded here dynamically -->
            </div>
          </div>
        </div>
      `;

      document.getElementById("content-area").innerHTML = content;

      // Initialize Bootstrap Collapse for all collapse buttons
      document
        .querySelectorAll('[data-toggle="collapse"][data-target^="#collapse"]')
        .forEach((button) => {
          button.addEventListener("click", () => {
            const target = button.getAttribute("data-target");
            const collapseElement = document.querySelector(target);
            const currentlyExpanded =
              collapseElement.classList.contains("show");

            // Toggle the collapse state
            if (!currentlyExpanded) {
              // Close all other collapse elements
              document
                .querySelectorAll(".collapse.show")
                .forEach((collapse) => {
                  collapse.classList.remove("show");
                });
            }

            // Ensure the clicked collapse element toggles its own state
            collapseElement.classList.toggle("show");
          });
        });

      // Initialize Bootstrap Collapse for quiz section
      const quizCollapse = new bootstrap.Collapse(
        document.getElementById("quiz"),
        {
          toggle: false, // Initialize collapse manually
        }
      );

      // Event listener for the "Test Your Knowledge" button to toggle quiz collapse
      document
        .getElementById("test-knowledge-btn")
        .addEventListener("click", function () {
          if (!quizCollapse._isTransitioning) {
            // Check if collapse animation is not in progress
            quizCollapse.toggle();
            // Load quiz content only if quiz section is going to be expanded
            if (!quizCollapse._isCollapsed) {
              loadQuiz(section, topic);
            }
          }
        });

      // Event listener for the collapse event to reset quiz results
      document
        .getElementById("quiz")
        .addEventListener("hidden.bs.collapse", function () {
          document.getElementById("quiz-results").innerHTML = "";
        });
    })
    .catch((error) => console.error("Error loading content:", error));
}

// Function to load quiz for different topics
function loadQuiz(section, topic) {
  fetch(`../data/prep/${topic}-quiz.json`)
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

      // Initialize Bootstrap Collapse for quiz section (already initialized in loadContent)

      // Event listener for the submit button after quiz content is loaded
      document
        .getElementById("submit-quiz-btn")
        .addEventListener("click", () => {
          submitQuiz(section, topic);
        });
    })
    .catch((error) => console.error("Error loading quiz:", error));
}

// Function to submit quiz for different topics
function submitQuiz(section, topic) {
  fetch(`../data/prep/${topic}-quiz.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const quizForm = document.getElementById("quiz-form");
      const formData = new FormData(quizForm);
      let score = 0;

      data.quiz.forEach((question, index) => {
        const userAnswer = formData.get(`question${index}`);
        if (userAnswer === question.answer) {
          score++;
        }
      });

      const resultText = `You got ${score} out of ${data.quiz.length} correct.`;
      document.getElementById(
        "quiz-results"
      ).innerHTML = `<div class="alert alert-info">${resultText}</div>`;
    })
    .catch((error) => console.error("Error submitting quiz:", error));
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
