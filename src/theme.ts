// The standalone preview follows the host site's theme key and html.light class.
export function initializeTheme() {
  const button = document.getElementById("theme-toggle") as HTMLButtonElement;
  const system = matchMedia("(prefers-color-scheme: light)");
  function readPreference() {
    try {
      return localStorage.getItem("gb-theme");
    } catch {
      return null;
    }
  }
  function apply(light: boolean) {
    document.documentElement.classList.toggle("light", light);
    button.textContent = light ? "Dark theme" : "Light theme";
    button.setAttribute(
      "aria-label",
      light ? "Switch to dark theme" : "Switch to light theme",
    );
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", light ? "#f7f5f1" : "#0e1012");
  }
  function sync() {
    const preference = readPreference();
    apply(preference === "light" || (preference !== "dark" && system.matches));
  }
  button.addEventListener("click", () => {
    const light = !document.documentElement.classList.contains("light");
    try {
      localStorage.setItem("gb-theme", light ? "light" : "dark");
    } catch {
      /* Theme remains usable without storage. */
    }
    apply(light);
  });
  system.addEventListener("change", sync);
  window.addEventListener("storage", sync);
  sync();
}
