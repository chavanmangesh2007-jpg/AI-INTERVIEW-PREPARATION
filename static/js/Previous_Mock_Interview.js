 // ==============================
// Search Interview
// ==============================

const searchInput = document.querySelector(".search-box input");
const rows = document.querySelectorAll(".row");

searchInput.addEventListener("keyup", function () {
    let value = searchInput.value.toLowerCase();

    rows.forEach(function (row) {
        let text = row.innerText.toLowerCase();

        if (text.includes(value)) {
            row.style.display = "grid";
        } else {
            row.style.display = "none";
        }
    });
});


// ==============================
// Sort Interviews
// ==============================

const select = document.querySelector("select");
const tableBox = document.querySelector(".table-box");

select.addEventListener("change", function () {

    let interviewRows = Array.from(document.querySelectorAll(".row"));

    if (select.value === "Oldest First") {
        interviewRows.reverse();
    }

    interviewRows.forEach(function (row) {
        tableBox.appendChild(row);
    });
});


// ==============================
// View Details Button
// ==============================

const buttons = document.querySelectorAll(".row button");

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        let role = this.parentElement.querySelector("h3").innerText;
        let score = this.parentElement.querySelector(".score span").innerText;

        alert(
            "Interview Details\n\n" +
            "Role : " + role +
            "\nScore : " + score
        );

        // Open another page
        // window.location.href = "InterviewDetails.html";
    });

});





// ==============================
// Welcome Message
// ==============================

window.onload = function () {

    console.log("AI Interview Dashboard Loaded Successfully");

};