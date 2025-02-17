import { onLogin } from "../../ui/auth/login.js";

export default function loginInit() {
  console.log("🔑 Running loginInit()...");

  // Rendre login-formet inn i #app
  document.getElementById("app").innerHTML = `
    <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-80 text-white mx-auto mt-20">
      <h2 class="text-xl font-medium text-center mb-4 font-[crimson]">Welcome</h2>
      <form id="login-form" class="flex flex-col space-y-4">
        <input type="email" name="email" placeholder="Email" class="p-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-gray-300" required>
        <input type="password" name="password" placeholder="Password" class="p-3 bg-white/20 text-white rounded-lg outline-none focus:ring-2 focus:ring-gray-300" required>
        <button type="submit" class="bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-300 transition">Login</button>
      </form>
      <p class="text-center text-sm mt-4">New here? <a href="/auth/register/" class="underline">Register</a></p>
    </div>
  `;

  // **Legg til event listener på skjemaet**
  setTimeout(() => {
    const form = document.getElementById("login-form");
  
    if (form) {
      form.addEventListener("submit", onLogin);
      console.log("✅ Login form event listener added.");
    } else {
      console.error("❌ Login form not found in the DOM.");
    }
  }, 50); // Gir tid til at innholdet lastes før vi prøver å koble event listener
}
