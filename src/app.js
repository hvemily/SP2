import '../src/css/style.css';
import router from "../src/js/router/index.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 App loaded, running router...");
    router();
});

// Håndter interne lenker uten full refresh
document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (link && link.href.startsWith(window.location.origin)) {
        event.preventDefault(); // Hindrer sideoppdatering
        const newPath = link.getAttribute("href");

        if (newPath !== window.location.pathname) {
            window.history.pushState({}, "", newPath);
            router(); // 🚀 Kjør router for å oppdatere innholdet i #app
        }
    }
});

// Håndter navigasjon bakover/forover
window.addEventListener("popstate", () => {
    console.log("🔙 Navigating back/forward...");
    router();
});
