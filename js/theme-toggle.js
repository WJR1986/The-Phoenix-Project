document.addEventListener("DOMContentLoaded", () => {
  const htmlElement = document.documentElement;
  const themeToggleIcon = document.getElementById("theme-icon");
  const lightModeButton = document.getElementById("light-mode");
  const darkModeButton = document.getElementById("dark-mode");
  const navbars = document.querySelectorAll(".navbar");
  const buttons = document.querySelectorAll(".btn");

  // Function to update theme
  function updateTheme(theme) {
    if (theme === "dark") {
      htmlElement.setAttribute("data-bs-theme", "dark");
      navbars.forEach((navbar) => {
        navbar.classList.remove("navbar-light", "bg-light");
        navbar.classList.add("navbar-dark", "bg-dark");
      });
      buttons.forEach((button) => {
        button.classList.remove("btn-dark");
        button.classList.add("btn-outline-light");
      });
      themeToggleIcon.classList.remove("fa-sun");
      themeToggleIcon.classList.add("fa-moon");
    } else {
      htmlElement.setAttribute("data-bs-theme", "light");
      navbars.forEach((navbar) => {
        navbar.classList.remove("navbar-dark", "bg-dark");
        navbar.classList.add("navbar-light", "bg-light");
      });
      buttons.forEach((button) => {
        button.classList.remove("btn-outline-light");
        button.classList.add("btn-dark");
      });
      themeToggleIcon.classList.remove("fa-moon");
      themeToggleIcon.classList.add("fa-sun");
    }
  }

  // Load theme from localStorage if available
  const savedTheme = localStorage.getItem("theme") || "dark";
  updateTheme(savedTheme);

  // Event listeners for theme toggle buttons
  lightModeButton.addEventListener("click", () => {
    localStorage.setItem("theme", "light");
    updateTheme("light");
  });

  darkModeButton.addEventListener("click", () => {
    localStorage.setItem("theme", "dark");
    updateTheme("dark");
  });
});
