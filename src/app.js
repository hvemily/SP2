import '../src/css/style.css';
import router from "../src/js/router/index";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, running router...");
    router();
});

window.addEventListener("popstate", () => {
    console.log("Back button pressed, reloading router...");
    router();
});
