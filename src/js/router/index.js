/**
 * Handles routing for different paths and dynamically imports the appropriate modules.
 * 
 * @param {string} [pathname=window.location.pathname] - The pathname of the current route, defaults to the current page's pathname.
 * @returns {Promise<void>} A promise that resolves once the relevant module for the route is imported.
 */

console.log("🚀 Router is running...");

console.log("🌍 Current pathname:", window.location.pathname);



export default async function router(pathname = window.location.pathname) {
  // Normalize the pathname by removing "index.html", trailing slashes, and query strings
  pathname = pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  pathname = pathname.split("?")[0]; // Remove query strings

  switch (pathname) {
    case "/":
      console.log("📥 Trying to import home.js...");
      console.log("📥 Trying to import home.js...");

      import("./views/home.js")
        .then(() => console.log("✅ home.js loaded successfully"))
        .catch((error) => console.error("❌ Failed to import home.js:", error));

      break;
    case "/auth/login":
      import("../router/views/login")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import login.js:", error));
      break;
    case "/auth/register":
      import("../router/views/register")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import register.js:", error));
      break;
    case "/profile":
      import("../router/views/profile")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import profile.js:", error));
      break;
    case "/listings":
      import("../router/views/post")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import listings.js:", error));
      break;
    case "/listings/create":
      import("../router/views/postCreate")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import create.js:", error));
      break;
    case "/listings/edit":
      const listingId = new URLSearchParams(window.location.search).get("id");
      if (listingId) {
        import("../router/views/postEdit")
          .then((module) => module.editListing(listingId))
          .catch((error) => console.error("Failed to import edit.js:", error));
      } else {
        import("../router/views/notFound")
          .catch((error) => console.error("Failed to load notFound.js:", error));
      }
      break;
    default:
      import("../router/views/notFound")
        .catch((error) => console.error("Failed to load notFound.js:", error));
  }
}
