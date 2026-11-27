/**
 * Notion Widgets — Shared Theme & Query Param Utility
 * Reads ?theme=light|dark and applies [data-theme] to <html>.
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const themeParam = (params.get("theme") || "").toLowerCase().trim();

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function getActiveTheme() {
    const explicit = document.documentElement.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getParam(name, fallback = null) {
    const value = params.get(name);
    return value !== null && value !== "" ? value : fallback;
  }

  // Apply immediately on load to prevent theme flash
  applyTheme(themeParam);

  window.NotionTheme = {
    applyTheme,
    getActiveTheme,
    getParam,
    params,
  };
})();
