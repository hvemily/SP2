// src/js/router/index.js

const views = import.meta.glob("./views/*.js");

export default async function router(pathname = window.location.pathname) {
  // Normalize path (uten query/trailing slash/index.html)
  pathname = pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  pathname = pathname.split("?")[0];

  switch (pathname) {
    case "":
    case "/":
      await loadPage("./views/home.js");
      break;

    case "/auth/login":
      await loadPage("./views/login.js");
      break;

    case "/auth/register":
      await loadPage("./views/register.js");
      break;

    case "/profile": {
      const mod = await loadPage("./views/profile.js", { returnModule: true });
      if (mod?.profileInit) mod.profileInit();
      else if (mod?.default) mod.default();
      else console.error("❌ profile.js has no export to run.");
      break;
    }

    case "/listings":
      await loadPage("./views/post.js");
      break;

    case "/listing/create":
      await loadPage("./views/postCreate.js");
      break;

    case "/listing/edit": {
      const listingId = new URLSearchParams(window.location.search).get("id");
      if (listingId) {
        const mod = await loadPage("./views/postEdit.js", { returnModule: true });
        if (mod?.default) mod.default(listingId);
        else console.error("❌ postEdit.js does not have a default export.");
      } else {
        await loadPage("./views/notFound.js");
      }
      break;
    }

    case "/listing":
      await loadPage("./views/post.js");
      break;

    case "/listing/category":
      await loadPage("./views/category.js");
      break;

    default:
      await loadPage("./views/notFound.js");
  }
}

// Loading module via glob map (not direct import(modulePath) that gets 404/MIME in prod)
async function loadPage(modulePath, { returnModule = false } = {}) {
  const importer = views[modulePath];
  if (!importer) {
    console.error(`❌ View not found for "${modulePath}". Available:`, Object.keys(views));
    return;
  }
  try {
    const mod = await importer();
    if (returnModule) return mod;
    if (mod?.default) return mod.default();
    console.error(`❌ ${modulePath} has no default export.`);
  } catch (error) {
    console.error(`❌ Failed to load ${modulePath}:`, error);
  }
}
