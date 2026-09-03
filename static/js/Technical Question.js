
// Topic Click Function

let topics = document.querySelectorAll(".row");


topics.forEach(function(topic){

    topic.addEventListener("click",function(){

        let name = this.querySelector(".left span").innerText;

        alert(name + " Questions Opened");

    });

});





// Start Practice Button

document.querySelector(".banner button")
.addEventListener("click",function(){

    window.location.href="Mock Interview.html";

});





// Bookmark Card Click

document.querySelector(".orange")
.parentElement
.addEventListener("click",function(){

    alert("Bookmarked Questions Opened ⭐");

});





// Change Total Questions Animation

let total = document.querySelector(".stats .card h2");

let count = 0;

let interval = setInterval(function(){

    if(count <= 650)
    {
        total.innerHTML = count;
        count += 25;
    }
    else
    {
        clearInterval(interval);
        total.innerHTML="650";
    }

},50);





// Row Hover Effect

topics.forEach(function(row){

    row.addEventListener("mouseover",function(){

        this.style.cursor="pointer";
        this.style.background="#f8f7ff";

    });


    row.addEventListener("mouseout",function(){

        this.style.background="#fff";

    });

});
