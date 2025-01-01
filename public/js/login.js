let messageContainer = document.getElementById("messageContainer");

    // Fade out effect after 2 seconds
    setTimeout(function() {
        messageContainer.style.opacity = 0; // Fade out
        messageContainer.style.transition = "opacity 1s ease"; // Smooth transition
    }, 2000);

