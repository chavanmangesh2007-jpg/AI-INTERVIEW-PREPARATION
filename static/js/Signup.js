// ================================
// Signup Form Validation
// ================================

let form = document.querySelector("form");
let inputs = document.querySelectorAll("input");

if (form) {
    form.addEventListener("submit", function(e){
        let name = inputs[0] ? inputs[0].value.trim() : "";
        let email = inputs[1] ? inputs[1].value.trim() : "";
        let password = inputs[2] ? inputs[2].value.trim() : "";
        let confirmPassword = inputs[3] ? inputs[3].value.trim() : "";

        if (name=="" || email=="" || password=="" || confirmPassword=="") {
            return;
        }

        if (password.length < 6) {
            alert("Password must be minimum 6 characters");
            e.preventDefault();
            return;
        }
    });
}

let googleBtn = document.querySelector(".google");
if (googleBtn) {
    googleBtn.addEventListener("click", function(){
        alert("Google Signup Coming Soon!");
    });
}

let githubBtn = document.querySelector(".github");
if (githubBtn) {
    githubBtn.addEventListener("click", function(){
        alert("GitHub Signup Coming Soon!");
    });
}

let passwordInputs = document.querySelectorAll("input[type='password']");
passwordInputs.forEach(input => {
    input.addEventListener("keyup", function(){
        if(this.value.length < 6){
            this.style.border = "2px solid red";
        } else {
            this.style.border = "2px solid green";
        }
    });
});
