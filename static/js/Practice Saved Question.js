// Search Functionality

let searchInput = document.querySelector(".search-box input");
let cards = document.querySelectorAll(".card");

searchInput.addEventListener("keyup", function(){

    let value = searchInput.value.toLowerCase();

    cards.forEach(function(card){

        let question = card.querySelector("h2").innerText.toLowerCase();

        if(question.includes(value)){
            card.style.display="block";
        }
        else{
            card.style.display="none";
        }

    });

});


// Filter Button Functionality

let filterBtn = document.querySelector(".filter-btn");

filterBtn.addEventListener("click",function(){

    let category = prompt(
        "Enter category: Technical / Aptitude / HR"
    );


    cards.forEach(function(card){

        let tag = card.querySelector(".tag").innerText;


        if(category==null || category==""){
            card.style.display="block";
        }

        else if(tag.toLowerCase()==category.toLowerCase()){
            card.style.display="block";
        }

        else{
            card.style.display="none";
        }

    });

});


// Bookmark Save / Remove

let bookmarks = document.querySelectorAll(".bookmark");


bookmarks.forEach(function(bookmark){

    bookmark.addEventListener("click",function(){

        if(bookmark.classList.contains("fa-solid")){

            bookmark.classList.remove("fa-solid");
            bookmark.classList.add("fa-regular");

            alert("Question removed from saved");

        }

        else{

            bookmark.classList.remove("fa-regular");
            bookmark.classList.add("fa-solid");

            alert("Question saved");

        }

    });

});


// Three dot menu

let menuButtons = document.querySelectorAll(".fa-ellipsis-vertical");


menuButtons.forEach(function(btn){

    btn.addEventListener("click",function(){

        alert(
        "Options:\n1. View Question\n2. Remove from Saved"
        );

    });

});