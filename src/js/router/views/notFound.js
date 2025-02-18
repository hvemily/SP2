export default function notFoundPage() {
  const container = document.getElementById("app") || document.body;
  container.innerHTML = "<h2>404 - Page Not Found</h2>";
}