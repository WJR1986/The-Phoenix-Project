document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".prep-topic");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const topic = event.target.getAttribute("data-topic");
      const section = event.target.getAttribute("data-section");
      const contentContainerId = `content-area-${topic}`; // Construct contentContainerId
      loadContent(section, topic, contentContainerId); // Pass contentContainerId to loadContent function
    });
  });
});
