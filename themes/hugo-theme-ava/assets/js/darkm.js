window.onload = function () {
  if (window.CSS && CSS.supports("color", "var(--sandman)")) {
    const setTelegramCommentsTheme = function telegramTheme(dark = 0) {
      document.getElementById("telegram_comments").dataset.dark = dark;
    };

    const storage = localStorage.getItem("dark-mode");

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "dark");
      setTelegramCommentsTheme(1);
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "light");
      setTelegramCommentsTheme(0);
    }

    if (storage && storage === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      setTelegramCommentsTheme(1);
    }

    if (storage && storage === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      setTelegramCommentsTheme(0);
    }

    const toggleTheme = function toggleTheme(e) {
      if (e.currentTarget.classList.contains("dark--hidden")) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("dark-mode", "dark");
        setTelegramCommentsTheme(1);
        return;
      }
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("dark-mode", "light");
      setTelegramCommentsTheme(0);
    };
    const toggleThemes = document.querySelectorAll(".theme__btn");
    toggleThemes.forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });
  }
};
