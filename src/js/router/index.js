/**
 * Handles routing for different paths and dynamically imports the appropriate modules.
 * 
 * @param {string} [pathname=window.location.pathname] - the pathname of the current route, defaults to the current page's pathname.
 * @returns {Promise<void>} a promise that resolves once the relevant module for the route is imported.
 */
export default async function router(pathname = window.location.pathname) {
  // normalize the pathname by removing "index.html", trailing slashes, and query strings
  pathname = pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  pathname = pathname.split("?")[0]; // remove query strings


  switch (pathname) {
    case "":
    case "/":
      console.log("📥 Trying to import home.js...");
      import("../router/views/home.js")
        .then((module) => {
          console.log("🏠 Calling home.js default function...");
          module.default();
        })
        .catch((error) => console.error("❌ Failed to import home.js:", error));
      break;
      case "/auth/login":
        import("./views/login.js")
          .catch((error) => console.error("Failed to import login.js:", error));
        break;

    case "/auth/register":
    case "/auth/register/index.html":
      console.log("📜 Navigating to register page...");
      loadPage("/auth/register/index.html", "../router/views/register.js");
      break;

    case "/profile":
    case "/profile/index.html":
      console.log("🧑 Navigating to profile page...");
      loadPage("/profile/index.html", "../router/views/profile.js");
      break;

    case "/listings":
    case "/listings/index.html":
      console.log("📦 Navigating to listings...");
      loadPage("/listings/index.html", "../router/views/post.js");
      break;

    case "/listings/create":
    case "/listings/create/index.html":
      console.log("✍️ Navigating to create listing...");
      loadPage("/listings/create/index.html", "../router/views/postCreate.js");
      break;

    case "/listings/edit":
    case "/listings/edit/index.html":
      const listingId = new URLSearchParams(window.location.search).get("id");
      if (listingId) {
        console.log("✏️ Editing listing...");
        import("../router/views/postEdit.js")
          .then((module) => module.editListing(listingId))
          .catch((error) => console.error("Failed to import edit.js:", error));
      } else {
        loadPage("/notfound.html", "../router/views/notFound.js");
      }
      break;

    default:
      console.log("❌ Page not found, loading 404...");
      loadPage("/notfound.html", "../router/views/notFound.js");
  }
}
