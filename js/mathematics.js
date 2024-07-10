// mathematics.js

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".mathematics-topic");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const topic = event.target.getAttribute("data-topic");
      const basePath = "../data/mathematics/"; // Specify the base path for mathematics
      loadContent("mathematics", topic, basePath);
    });
  });
});
