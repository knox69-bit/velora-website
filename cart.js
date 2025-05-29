document.addEventListener('DOMContentLoaded', function() {
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        cartList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartList.innerHTML = '<li>Your cart is empty.</li>';
            cartTotal.textContent = '';
            return;
        }

        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <span>${item.name} - ${item.price} (x${item.quantity})</span>
            `;
            cartList.appendChild(li);

            // Remove $ and convert to number for total
            total += parseFloat(item.price.replace('$', '')) * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    clearCartBtn.addEventListener('click', function() {
        localStorage.removeItem('cart');
        cart = [];
        renderCart();
    });

    document.getElementById('order-now').addEventListener('click', function() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        let message = 'Hello, I would like to order:\n';
        cart.forEach(item => {
            message += `- ${item.name} (${item.price}) x${item.quantity}\n`;
        });
        let total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('$','')) * item.quantity, 0);
        message += `Total: $${total.toFixed(2)}`;

        // Replace with your WhatsApp number (no + or spaces)
        let phone = '96176574238';
        let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });

    renderCart();
});