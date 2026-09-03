// Safe AI Interview Dashboard JS
document.addEventListener("DOMContentLoaded", () => {


    // Sidebar active state
    const menuItems = document.querySelectorAll(".sidebar ul li");
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });
});