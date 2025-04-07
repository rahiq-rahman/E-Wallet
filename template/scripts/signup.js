const API_URL = "http://localhost:3000/auth/signup"; // Replace with your backend URL

document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get form values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const phone_no = document.getElementById("phone_no").value;
    const nid = document.getElementById("nid").value;

    // Client-side validation
    const errorMessage = document.getElementById("error-message");

    if (!username || !email || !password || !confirmPassword || !phone_no || !nid) {
        errorMessage.textContent = "Please fill in all required fields.";
        errorMessage.style.color = "red";
        errorMessage.style.display = "block";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        errorMessage.style.color = "red";
        errorMessage.style.display = "block";
        return;
    }

    // Data to send to backend
    const userData = { username, email, password, phone_no, nid };

    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.status === 201) {
            errorMessage.textContent = result.message;
            errorMessage.style.color = "green";
            errorMessage.style.display = "block";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        } else {
            errorMessage.textContent = result.message || "Signup failed.";
            errorMessage.style.color = "red";
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.color = "red";
        errorMessage.style.display = "block";
    }
});