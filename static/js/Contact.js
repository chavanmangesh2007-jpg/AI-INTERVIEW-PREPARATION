// Safe Contact JS
function sendWhatsApp() {
    let nameEl = document.getElementById("name") || document.querySelector("input[name='name']");
    let emailEl = document.getElementById("email") || document.querySelector("input[name='email']");
    let subjectEl = document.getElementById("subject") || document.querySelector("select[name='subject']");
    let messageEl = document.getElementById("message") || document.querySelector("textarea[name='message']");

    if (!nameEl || !emailEl || !messageEl) return;

    let name = nameEl.value.trim();
    let email = emailEl.value.trim();
    let subject = subjectEl ? subjectEl.value : "General Inquiry";
    let message = messageEl.value.trim();

    if (name === "" || email === "" || message === "") {
        alert("Please fill in all required fields.");
        return;
    }

    let phone = "917219621129";
    let text = `*AI Interview Contact Form*\n\n👤 Name : ${name}\n\n📧 Email : ${email}\n\n📌 Subject : ${subject}\n\n💬 Message :\n${message}`;
    let url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
}