import '../src/css/style.css';

import '../src/js/router/views/home.js'

// Håndter ruter dynamisk basert på hvilken side brukeren er på
const currentPath = window.location.pathname;

if (currentPath.includes("index.html") || currentPath === "/") {
    import("./js/router/views/home.js");
} else if (currentPath.includes("category.html")) {
    import("./js/category.js");
}
