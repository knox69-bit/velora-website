document.addEventListener('DOMContentLoaded', function() {
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        const cartList = document.getElementById('cart-list');
        const cartTotal = document.getElementById('cart-total');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartList.innerHTML = '';
        let total = 0;

        cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${item.img}" alt="${item.name}" style="height:32px;vertical-align:middle;margin-right:8px;">
                <span class="cart-item-link" data-product="${item.name}" style="cursor:pointer;text-decoration:underline;">${item.name} - ${item.price} x ${item.quantity}</span>
                <button class="remove-item-btn" data-idx="${idx}" title="Remove one">−</button>
            `;
            cartList.appendChild(li);

            // Calculate total (assuming price is like "$79.99")
            total += parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(btn.getAttribute('data-idx'));
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity -= 1;
                } else {
                    cart.splice(idx, 1);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });

        // Add event listeners for cart item links (MUST be here)
        document.querySelectorAll('.cart-item-link').forEach(link => {
            link.addEventListener('click', function() {
                const productName = link.getAttribute('data-product');
                const productId = 'product-' + productName.replace(/\s+/g, '-');
                window.location.href = 'index.html#' + productId;
            });
        });
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

    // Initial render
    renderCart();
});