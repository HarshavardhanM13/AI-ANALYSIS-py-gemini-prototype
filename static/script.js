




document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        //console.log(await response.text()); 

        const data = await response.json();
        if (data) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            alert("Login Failed: " + data);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});






