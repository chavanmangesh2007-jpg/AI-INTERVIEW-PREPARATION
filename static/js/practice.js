 // ================================
// Sidebar Active Menu
// ================================

let menuItems = document.querySelectorAll(".menu li");

menuItems.forEach(item => {

    item.addEventListener("click", function(){

        menuItems.forEach(li=>{
            li.classList.remove("active");
        });

        this.classList.add("active");

    });

});



// ================================
// Category Card Click
// ================================

let categoryCards = document.querySelectorAll(".category-card");


categoryCards.forEach(card=>{

    card.addEventListener("click",function(){

        let title = this.querySelector("h3").innerText;


        if(title=="Technical Questions"){
            window.location.href="Technical Question.html";
        }

        else if(title=="HR Questions"){
            window.location.href="HR Question.html";
        }

        else if(title=="Aptitude Questions"){
            window.location.href="Apitude Question.html";
        }

        else if(title=="System Design"){
            window.location.href="System Design.html";
        }
        
        else if(title=="Behavioral Questions"){
             window.location.href="Practice Behaveral.html";
        }
        
        else if(title=="Mixed Practice"){
            window.location.href="Mixed Practice.html";
        }
        
        else if(title=="Company Specific"){
             window.location.href="Company Specific.html";
        }
        
        else if(title=="Most Asked"){
             window.location.href="Most Asked.html";
        }


    });

});



// ================================
// Dropdown Sorting
// ================================

let select = document.querySelector("select");


select.addEventListener("change",function(){

    let cards = document.querySelector(".category-grid");

    let items = Array.from(
        cards.children
    );


    if(this.value=="Newest"){

        items.reverse();

    }


    if(this.value=="Oldest"){

        items.sort();

    }


    items.forEach(item=>{
        cards.appendChild(item);
    });


});



// ================================
// Continue Button
// ================================

let buttons=document.querySelectorAll("button");


buttons.forEach(btn=>{


    if(btn.innerText=="Continue"){

        btn.addEventListener("click",function(){

            alert(
            "Practice session started!"
            );

        });

    }

});



// ================================
// View All Button
// ================================

let viewAll=document.querySelector(".table-header a");


viewAll.addEventListener("click",function(e){

    e.preventDefault();

    alert(
    "Opening all practice history..."
    );

});



// ================================
// Statistics Counter Animation
// ================================

let numbers=document.querySelectorAll(".card h2");


numbers.forEach(num=>{


    let target=parseInt(
        num.innerText.replace(",","")
    );


    let count=0;


    let interval=setInterval(()=>{


        count += Math.ceil(target/100);


        if(count>=target){

            num.innerText=target.toLocaleString();

            clearInterval(interval);

        }

        else{

            num.innerText=count.toLocaleString();

        }


    },20);


});



// ================================
// Navbar Profile Button
// ================================

let profile=document.querySelector(".signup");


profile.addEventListener("click",function(){

    window.location.href="profile.html";

});

fetch("http://127.0.0.1:5000/stats")
.then(res=>res.json())
.then(data=>{

document.querySelectorAll(".card h2")[0].innerHTML=data.questions;

document.querySelectorAll(".card h2")[1].innerHTML=data.tests;

document.querySelectorAll(".card h2")[2].innerHTML=data.score;

document.querySelectorAll(".card h2")[3].innerHTML=data.streak;

});


fetch("http://127.0.0.1:5000/practice",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

title:"Arrays and Strings",

category:"Technical",

progress:70,

score:85,

date:"25 July 2026"

})

})
.then(res=>res.json())
.then(data=>{

alert(data.message);

});



fetch("http://127.0.0.1:5000/history")
.then(res=>res.json())
.then(data=>{

console.log(data);

// येथे table मध्ये data दाखवू शकता

});