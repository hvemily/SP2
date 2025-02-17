import '../src/css/style.css';
import router from "../src/js/router/index.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 App loaded, running router...");
    router();
});

document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link && link.href.startsWith(window.location.origin)) {
        event.preventDefault();
        const newPath = link.getAttribute("href");

        if (newPath !== window.location.pathname) {
            window.history.pushState({}, "", newPath);
            router(); // 🚀 Laster inn riktig innhold
        }
    }
});

window.addEventListener("popstate", () => {
    console.log("🔙 Navigating back/forward...");
    router();
});

// 🎯 Legg til disse funksjonene og eksporter dem:
export function showAlert(message, type = "info") {
    alert(`${type.toUpperCase()}: ${message}`); 
}

export function showLoader() {
    console.log("⏳ Showing loader...");
}

export function hideLoader() {
    console.log("✅ Hiding loader...");
}
