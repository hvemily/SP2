export default async function router(pathname = window.location.pathname) {
  // Normaliser pathen: fjerner "index.html" og trailing slash, og fjerner query string
  pathname = pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  pathname = pathname.split("?")[0];
  console.log("Normalized path:", pathname);

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
      import("./views/profile.js")
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
      loadPage("../router/views/postCreate.js");
      break;

    case "/listing/edit":
      const listingId = new URLSearchParams(window.location.search).get("id");
      if (listingId) {
        console.log("✏️ Editing listing...");
        import("../router/views/postEdit.js")
          .then((module) => {
            if (module.default) {
              module.default(listingId);
            } else {
              console.error("❌ postEdit.js does not have a default export.");
            }
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
          if (module.default) {
            console.log("📄 Calling post.js default function for listing details...");
            module.default();
          } else {
            console.error("❌ post.js does not have a default export.");
          }
        })
        .catch((error) => console.error("❌ Failed to import post.js for listing details:", error));
      break;
      
    // Legg til en case for kategori-siden
    case "/listing/category":
      console.log("📂 Navigating to category page...");
      import("../router/views/category.js")
        .then((module) => {
          if (module.default) {
            module.default();
          } else {
            console.error("❌ category.js does not have a default export.");
          }
        })
        .catch((error) => console.error("❌ Failed to import category.js:", error));
      break;

    default:
      console.log("❌ Page not found, loading 404...");
      loadPage("../router/views/notFound.js");
  }
}

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
