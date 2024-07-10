document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".science-topic");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const topic = event.target.getAttribute("data-topic");
      loadContent("science", topic); // Adjust to load content for science
    });
  });
});
