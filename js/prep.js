// Event listeners for different topics on prep-for-release.html with debouncing
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".prep-topic");
  let timeout; // Initialize timeout variable

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const topic = event.target.getAttribute("data-topic");
      const section = event.target.getAttribute("data-section");

      // Determine basePath based on the section
      let basePath = "";
      if (section === "prep-for-release") {
        basePath = "../data/prep/";
      } else if (section === "mathematics") {
        basePath = "../data/mathematics/";
      } else if (section === "education") {
        basePath = "../data/education/";
      }

      // Clear previous content if needed
      document.getElementById("content-area").innerHTML = "";

      // Implementing debounce to wait for user to stop clicking
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Call loadContent function with section, topic, and basePath
        loadContent(section, topic, basePath);
      }, 300); // Adjust debounce delay as needed (300ms here)
    });
  });
});
