function loadContent(section, topic, basePath) {
  let imagePath = ""; // Initialize imagePath for images

  // Determine imagePath based on the section
  if (section === "prep-for-release") {
    imagePath = "/assets/images/basic-prep/";
  } else if (section === "mathematics" || section === "education") {
    imagePath = "/assets/images/education/";
  }

  fetch(`${basePath}${topic}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let content = "";
      data.sections.forEach((sectionData, index) => {
        let formattedContent = "";

        // Check if content is an array (bullet points)
        if (Array.isArray(sectionData.content)) {
          formattedContent = "<ul>";
          sectionData.content.forEach((item) => {
            if (typeof item === "string") {
              formattedContent += `<li>${item.replace(/\n/g, "<br>")}</li>`;
            } else if (typeof item === "object" && item.url && item.text) {
              formattedContent += `<li><a href="${item.url}" target="_blank">${item.text}</a></li>`;
            }
          });
          formattedContent += "</ul>";
        } else {
          formattedContent = sectionData.content.replace(/\n/g, "<br>");
        }

        // Construct the image source path and title
        let imageSrc = sectionData.image
          ? `${imagePath}${sectionData.image}`
          : "";
        let imageTitle = sectionData.imageTitle || "";

        // Constructing HTML for each section
        content += `
                  <div class="card mb-3">
                      <div class="card-header" id="heading${index}">
                          <h5 class="mb-0">
                              <button class="btn btn-link" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${
          index === 0 ? "true" : "false"
        }" aria-controls="collapse${index}">
                                  ${sectionData.title}
                              </button>
                          </h5>
                      </div>
                      <div id="collapse${index}" class="collapse ${
          index === 0 ? "show" : ""
        }" aria-labelledby="heading${index}" data-bs-parent="#content-area">
                          <div class="card-body">
                              <div class="row align-items-center">
                                  <div class="col-md-${imageSrc ? "8" : "12"}">
                                      <div class="card-text">${formattedContent}</div>
                                      ${
                                        sectionData.url
                                          ? `<a href="${sectionData.url}" target="_blank">More info</a>`
                                          : ""
                                      }
                                  </div>
                                  ${
                                    imageSrc
                                      ? `
                                          <div class="col-md-4">
                                              <div class="image-container">
                                                  <img src="${imageSrc}" class="img-fluid border rounded p-2 ml-2 mt-3 max-image-size" alt="${sectionData.title}">
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

      // Check if quiz file exists
      fetch(`${basePath}${topic}-quiz.json`)
        .then((quizResponse) => {
          if (quizResponse.ok) {
            // Append quiz section at the end
            content += `
                          <div class="card mb-3">
                              <div class="card-header">
                                  <h5 class="mb-0">
                                      <button class="btn btn-link" id="test-knowledge-btn" data-bs-toggle="collapse" data-bs-target="#quiz" aria-expanded="false" aria-controls="quiz">
                                          Test Your Knowledge
                                      </button>
                                  </h5>
                              </div>
                              <div id="quiz" class="collapse" aria-labelledby="quiz" data-bs-parent="#content-area">
                                  <div class="card-body" id="quiz-content">
                                      <!-- Quiz content will be loaded here dynamically -->
                                  </div>
                              </div>
                          </div>
                      `;
          }

          // Update content-area with generated HTML
          document.getElementById("content-area").innerHTML = content;

          // Initialize Bootstrap Collapse for all collapse buttons
          document
            .querySelectorAll(
              '[data-bs-toggle="collapse"][data-bs-target^="#collapse"]'
            )
            .forEach((button) => {
              button.addEventListener("click", () => {
                const target = button.getAttribute("data-bs-target");
                const collapseElement = new bootstrap.Collapse(target, {
                  toggle: true,
                });
              });
            });

          // Initialize Bootstrap Collapse for quiz section if exists
          if (quizResponse.ok) {
            document
              .getElementById("test-knowledge-btn")
              .addEventListener("click", function () {
                const quizCollapse = new bootstrap.Collapse(
                  document.getElementById("quiz"),
                  {
                    toggle: false, // Initialize collapse manually
                  }
                );
                if (!quizCollapse._isTransitioning) {
                  // Check if collapse animation is not in progress
                  quizCollapse.toggle();
                  // Load quiz content only if quiz section is going to be expanded
                  if (!quizCollapse._isCollapsed) {
                    loadQuiz(section, topic, basePath); // Pass basePath to loadQuiz
                  }
                }
              });

            // Event listener for collapse event to reset quiz results
            document
              .getElementById("quiz")
              .addEventListener("hidden.bs.collapse", function () {
                document.getElementById("quiz-results").innerHTML = "";
              });
          }
        })
        .catch((error) =>
          console.error("Error checking for quiz file:", error)
        );
    })
    .catch((error) => console.error("Error loading content:", error));
}
