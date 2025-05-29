document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.product-card button');

    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            // Get product info
            const card = button.closest('.product-card');
            const name = card.querySelector('h4').innerText;
            const price = card.querySelector('p').innerText;
            const img = card.querySelector('img').getAttribute('src');

            // Get cart from localStorage or create new
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if product already in cart
            const existing = cart.find(item => item.name === name && item.price === price);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, img, quantity: 1 });
            }

            // Save back to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            showToast(`${name} added to cart!`);
        });
    });
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2000);
}