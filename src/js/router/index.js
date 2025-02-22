export default async function router(pathname = window.location.pathname) {
  // Normalizing path: removes "index.html" og trailing slash, and removes query string
  pathname = pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  pathname = pathname.split("?")[0];

  switch (pathname) {
    case "":
    case "/":
      import("../router/views/home.js")
        .then((module) => {
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
      loadPage("../router/views/post.js");
      break;

    case "/listing/create":
      loadPage("../router/views/postCreate.js");
      break;

    case "/listing/edit":
      const listingId = new URLSearchParams(window.location.search).get("id");
      if (listingId) {
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
      import("../router/views/post.js")
        .then((module) => {
          if (module.default) {
            module.default();
          } else {
            console.error("❌ post.js does not have a default export.");
          }
        })
        .catch((error) => console.error("❌ Failed to import post.js for listing details:", error));
      break;
      
    case "/listing/category":
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
      loadPage("../router/views/notFound.js");
  }
}

function loadPage(modulePath) {
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
