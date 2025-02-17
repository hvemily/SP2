/**
 * Handles routing for different paths and dynamically imports the appropriate modules.
 * 
 * @param {string} [pathname=window.location.pathname] - The pathname of the current route, defaults to the current page's pathname.
 * @returns {Promise<void>} A promise that resolves once the relevant module for the route is imported.
 */

export default async function router(pathname = window.location.pathname) {
  // Normalize the pathname by removing "index.html", trailing slashes, and query strings
  pathname = pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  pathname = pathname.split("?")[0]; // Remove query strings

  switch (pathname) {
    case "":
    case "/":
      console.log("📥 Trying to import home.js...");

      import("../router/views/home.js").then((module) => {
        console.log("🏠 Calling home.js default function...");
        if (module.default) {
          module.default();
        } else {
          console.warn("⚠️ home.js has no default export.");
        }
      }).catch((error) => console.error("❌ Failed to import home.js:", error));

      break;
      case "/auth/login":
        case "/auth/login/index.html":
          console.log("🔑 Navigating to login page...");
          import("../router/views/login.js")
            .then((module) => {
              console.log("✅ Login.js imported successfully.");
              module.default(); // Kaller loginInit() som håndterer rendering
            })
            .catch((error) => console.error("Failed to import login.js:", error));
          break;                                  
    case "/auth/register.js":
      import("../router/views/register")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import register.js:", error));
      break;
    case "/profile.js":
      import("../router/views/profile")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import profile.js:", error));
      break;
    case "/listings.js":
      import("../router/views/post")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import listings.js:", error));
      break;
    case "/listings/create.js":
      import("../router/views/postCreate")
        .then((module) => module.default())
        .catch((error) => console.error("Failed to import create.js:", error));
      break;
    case "/listings/edit.js":
      const listingId = new URLSearchParams(window.location.search).get("id");
      if (listingId) {
        import("../router/views/postEdit.js")
          .then((module) => module.editListing(listingId))
          .catch((error) => console.error("Failed to import edit.js:", error));
      } else {
        import("../router/views/notFound.js")
          .catch((error) => console.error("Failed to load notFound.js:", error));
      }
      break;
    default:
      import("../router/views/notFound.js")
        .catch((error) => console.error("Failed to load notFound.js:", error));
  }
}
