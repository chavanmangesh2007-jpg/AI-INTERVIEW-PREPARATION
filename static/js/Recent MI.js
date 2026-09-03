
// Back button confirmation
const backBtn = document.querySelector(".back-btn");

if(backBtn){
    backBtn.addEventListener("click", function(e){
        const confirmBack = confirm("Go back to Dashboard?");
        if(!confirmBack){
            e.preventDefault();
        }
    });
}

// View Details Button
const buttons = document.querySelectorAll("button");

buttons.forEach((btn)=>{
    btn.addEventListener("click",function(){

        const row = this.closest(".row");

        const job = row.querySelector("h3").innerText;
        const score = row.querySelector(".score span").innerText;
        const performance = row.querySelector("h4").innerText;

        alert(
            "Interview Details\n\n" +
            "Role : " + job +
            "\nScore : " + score +
            "\nPerformance : " + performance
        );

        // To open another page instead of alert
        // window.location.href = "interview-details.html";
    });
});



// Search Interview
const searchInput = document.querySelector(".search-box input");

if(searchInput){

searchInput.addEventListener("keyup",function(){

    const value = this.value.toLowerCase();

    rows.forEach((row)=>{

        const text = row.innerText.toLowerCase();

        if(text.includes(value)){
            row.style.display="grid";
        }else{
            row.style.display="none";
        }

    });

});

}

// Pagination Button Active
const pageButtons = document.querySelectorAll(".pagination button");

pageButtons.forEach((btn)=>{

    btn.addEventListener("click",()=>{

        pageButtons.forEach((b)=>{
            b.classList.remove("active");
        });

        btn.classList.add("active");

    });

});