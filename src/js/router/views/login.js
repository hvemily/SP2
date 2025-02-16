import { onLogin } from "../../ui/auth/login";

/**
 * handles login form submission by calling the onLogin function.
 * the function ensures that the login form is found and attaches the submit event listener to it.
 * 
 * @throws {Error} If the login form is not found in the DOM.
 */
const form = document.forms.login;

if (form) {
  form.addEventListener("submit", onLogin);
} else {
  throw new Error("Login form not found");
}
