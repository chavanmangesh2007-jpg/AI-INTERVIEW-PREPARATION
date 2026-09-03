 // ================================
// Signup Form Validation
// ================================


let form = document.querySelector("form");

let inputs = document.querySelectorAll("input");


form.addEventListener("submit", function(e){

    e.preventDefault();


    let name = inputs[0].value.trim();

    let email = inputs[1].value.trim();

    let password = inputs[2].value.trim();

    let confirmPassword = inputs[3].value.trim();



    // Empty Check

    if(name=="" || email=="" || password=="" || confirmPassword==""){

        alert("Please fill all fields");

        return;

    }



    // Email Validation

    


    // Password Length

    if(password.length < 6){

        alert(
        "Password must be minimum 6 characters"
        );

        return;

    }






    // Success

    alert(
    "Account Created Successfully!"
    );


    window.location.href="Home.html";


});




// ================================
// Google Signup Button
// ================================


let googleBtn=document.querySelector(".google");


googleBtn.addEventListener("click",function(){

    alert(
    "Google Signup Coming Soon!"
    );

});




// ================================
// Github Signup Button
// ================================


let githubBtn=document.querySelector(".github");


githubBtn.addEventListener("click",function(){

    alert(
    "GitHub Signup Coming Soon!"
    );

});




// ================================
// Password Show / Hide
// ================================


let passwordInputs=document.querySelectorAll(
"input[type='password']"
);


passwordInputs.forEach(input=>{


input.addEventListener("keyup",function(){


if(this.value.length < 6){

    this.style.border="2px solid red";

}

else{

    this.style.border="2px solid green";

}


});


});

