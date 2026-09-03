 // =====================================
// Search Questions
// =====================================

let searchInput = document.querySelector(
".search-box input"
);

let cards = document.querySelectorAll(
".card"
);


searchInput.addEventListener("keyup",function(){

    let value = searchInput.value.toLowerCase();


    cards.forEach(card=>{

        let question = card.querySelector("h2")
        .innerText.toLowerCase();


        if(question.includes(value)){
            card.style.display="flex";
        }
        else{
            card.style.display="none";
        }

    });

});




// =====================================
// Role Filter
// =====================================

let filter = document.querySelector("select");


filter.addEventListener("change",function(){


let selected = filter.value;


cards.forEach(card=>{


let role = card.querySelector(".role")
.innerText;


if(selected=="All Roles" || role==selected){

    card.style.display="flex";

}

else{

    card.style.display="none";

}


});


});




// =====================================
// View Answer Button
// =====================================

let answerButtons = document.querySelectorAll(".view-answer-btn");

answerButtons.forEach((btn) => {
    btn.addEventListener("click", function() {
        let answer = btn.getAttribute("data-answer") || "No answer available.";
        alert("Answer:\n\n" + answer);
    });
});





// =====================================
// Unsave Question Button
// =====================================

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let unsaveBtns = document.querySelectorAll(".unsave-btn");

unsaveBtns.forEach((btn) => {
    btn.addEventListener("click", function() {
        let choice = confirm("Remove this question from your saved list?");
        if (choice) {
            const title = btn.getAttribute("data-title");
            const category = btn.getAttribute("data-category");

            fetch("/api/toggle-save-question/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-CSRFToken": getCookie("csrftoken") || ""
                },
                body: `title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'removed' || data.status === 'saved') {
                    const card = btn.closest(".card");
                    if (card) {
                        card.remove();
                    }
                    updateCount();
                }
            })
            .catch(err => console.error(err));
        }
    });
});




// =====================================
// Update Saved Count
// =====================================


function updateCount(){


let count=document.querySelector(
".badge"
);


let total=document.querySelectorAll(
".card"
).length;


count.innerHTML=
`
<i class="fa-regular fa-bookmark"></i>
${total} Questions Saved
`;


}




// =====================================
// Sidebar Active Menu
// =====================================


let menuItems=document.querySelectorAll(
".sidebar1 ul li"
);


menuItems.forEach(item=>{


item.addEventListener("click",function(){


menuItems.forEach(li=>{
li.classList.remove("active1");
});


this.classList.add("active1");


});


});




// =====================================
// Profile Button
// =====================================


let profile=document.querySelector(
".signup"
);


profile.addEventListener("click",function(){

window.location.href="profile.html";

});