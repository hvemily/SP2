/**
 * Handles routing for different paths and dynamically imports the appropriate modules.
 *
 * @param {string} [pathname=window.location.pathname] - the pathname of the current route, defaults to the current page's pathname.
 * @returns {Promise<void>} a promise that resolves once the relevant module for the route is imported.
 */
export default async function router(pathname = window.location.pathname) {
  // Normalize the pathname by removing "index.html", trailing slashes, and query strings
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
      import("../router/views/login.js")
        .then((module) => module.default?.())
        .catch((error) => console.error("❌ Failed to import login.js:", error));
      break;

    case "/auth/register":
      import("../router/views/register.js")
        .then((module) => module.default?.())
        .catch((error) => console.error("❌ Failed to import register.js:", error));
      break;

    case "/profile":
      console.log("🧑 Navigating to profile page...");
      import("../router/views/profile.js")
        .then((module) => {
          if (module.profileInit) {
            module.profileInit();
          } else {
            console.error("❌ profile.js does not have profileInit.");
          }
        })
        .catch((error) => console.error("❌ Failed to import profile.js:", error));
      break;

    case "/listings":
      console.log("📦 Navigating to listings...");
      loadPage("../router/views/post.js");
      break;

      case "/listing/create":
        console.log("✍️ Navigating to create listing...");
        loadPage("./views/postCreate.js");
        break;
      

        case "/listing/edit":
          const listingId = new URLSearchParams(window.location.search).get("id");
          if (listingId) {
            console.log("✏️ Editing listing...");
            import("../router/views/postEdit.js")
              .then((module) => {
                module.default(listingId);
              })
              .catch((error) => console.error("❌ Failed to import postEdit.js:", error));
          } else {
            loadPage("../router/views/notFound.js");
          }
          break;
        

    case "/listing":
      console.log("📄 Navigating to listing details...");
      import("../router/views/post.js")
        .then((module) => {
          console.log("📄 Calling post.js default function for listing details...");
          module.default();
        })
        .catch((error) => console.error("❌ Failed to import post.js for listing details:", error));
      break;
      
    default:
      console.log("❌ Page not found, loading 404...");
      loadPage("../router/views/notFound.js");
  }
}

/**
 * Hjelpefunksjon for å laste inn moduler dynamisk.
 * @param {string} modulePath - Stien til modulen som skal importeres.
 */
function loadPage(modulePath) {
  console.log(`Loading module ${modulePath}...`);
  import(modulePath)
    .then((module) => {
      if (module.default) {
        module.default();
      } else {
        console.error("Module does not have a default export.");
      }
    })
    .catch((error) => console.error("❌ Failed to load module:", error));
}
