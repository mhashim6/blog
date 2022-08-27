window.onload = function () {
  if (window.CSS && CSS.supports("color", "var(--sandman)")) {
    const storage = localStorage.getItem("dark-mode");

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "dark");
      document
        .querySelector("meta[name='theme-color']")
        .setAttribute("content", "#17191C");
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "light");
      document
        .querySelector("meta[name='theme-color']")
        .setAttribute("content", "#EDE3D9");
    }

    if (storage && storage === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document
        .querySelector("meta[name='theme-color']")
        .setAttribute("content", "#17191C");
    }

    if (storage && storage === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      document
        .querySelector("meta[name='theme-color']")
        .setAttribute("content", "#EDE3D9");
    }

    const toggleTheme = function toggleTheme(e) {
      if (e.currentTarget.classList.contains("dark--hidden")) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("dark-mode", "dark");
        document
          .querySelector("meta[name='theme-color']")
          .setAttribute("content", "#17191C");
        return;
      }
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("dark-mode", "light");
      document
        .querySelector("meta[name='theme-color']")
        .setAttribute("content", "#EDE3D9");
    };
    const toggleThemes = document.querySelectorAll(".theme__btn");
    toggleThemes.forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });
  }
};
