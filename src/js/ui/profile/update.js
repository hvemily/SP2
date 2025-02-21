import { showAlert } from "../../../app";

/**
 * Handles the profile update form submission.
 * 
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} A promise that resolves when the profile update is complete.
 */
export async function onUpdateProfile(event) {
  event.preventDefault();

  const form = event.target;
  const bio = form.bio.value.trim();
  const profilePicUrl = form["profile-pic-url"].value.trim();

  // Validate input
  if (!bio || !profilePicUrl) {
    showAlert("Both bio and profile picture URL must be provided.");
    return;
  }

  const updatedData = {
    bio,
    profilePicture: profilePicUrl,
  };

  try {
    // call the API to update the profile (assuming an API function for updating the profile exists)
    await updateProfile(updatedData);

    showAlert("Profile updated successfully!", "success");
    setTimeout(() => {
      window.location.reload();
    }, 2000); 
  } catch (error) {
    showAlert("Failed to update profile. Please try again.", "error");
    console.error("Error updating profile:", error.message);
  }
}

/**
 * dummy function to simulate the API call for updating the profile.
 * 
 * @param {Object} data - the data to update the profile with.
 * @param {string} data.bio - the new bio text.
 * @param {string} data.profilePicture - the URL of the new profile picture.
 * @returns {Promise<void>} resolves when the profile has been updated.
 */
async function updateProfile(data) {
  // simulate API call to update profile
  return new Promise((resolve) => setTimeout(resolve, 1000)); 
}
