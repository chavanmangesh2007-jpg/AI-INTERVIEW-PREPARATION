// Safe Profile JS supporting Django form submission
document.addEventListener("DOMContentLoaded", () => {
    const upload = document.getElementById("upload");
    const profileImage = document.getElementById("profileImage");

    if (upload && profileImage) {
        upload.addEventListener("change", function() {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    const editBtn = document.querySelector(".edit-btn");
    if (editBtn) {
        const formFields = document.querySelectorAll(".form-grid input, .form-grid select, .form-grid textarea");
        editBtn.addEventListener("click", () => {
            formFields.forEach(field => field.disabled = false);
            editBtn.innerHTML = `<i class="fa-solid fa-check"></i> Editing Enabled`;
        });
    }
});