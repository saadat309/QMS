// ====== Centralized Error Handler ======

// Handles errors by logging technical details and showing a user-friendly message

export function handleError(error, userMessage = "Something went wrong. Please try again.") {
  // Log technical details for debugging (could be sent to server in production)
  if (error instanceof Error) {
    console.error(error.stack || error.message);
  } else if (typeof error === "object" && error !== null && error.message) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  // Always show a generic message to the user
  showModal(userMessage);
}

// ====== Modal Function ======

// Displays a modal with a message and buttons based on type
// Returns a promise that resolves with the user's choice

export function showModal(message, { type = "alert" } = {}) {
  return new Promise((resolve) => {
    const modal = document.getElementById("customModal");
    const msg = document.getElementById("modalMessage");
    const btns = document.getElementById("modalButtons");
    msg.innerHTML = message;
    btns.innerHTML = "";

    function close(result) {
      modal.style.display = "none";
      resolve(result);
    }

    if (type === "confirm") {
      const yesBtn = document.createElement("button");
      yesBtn.textContent = "Yes";
      yesBtn.onclick = () => close(true);
      const noBtn = document.createElement("button");
      noBtn.textContent = "No";
      noBtn.onclick = () => close(false);
      btns.appendChild(yesBtn);
      btns.appendChild(noBtn);
    } else {
      const okBtn = document.createElement("button");
      okBtn.textContent = "OK";
      okBtn.onclick = () => close(true);
      btns.appendChild(okBtn);
    }

    modal.style.display = "flex";
  });
}