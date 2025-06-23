document.addEventListener('DOMContentLoaded', function() {
    // Add to Cart logic
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const card = button.closest('.product-card');
            const name = card.querySelector('h4').innerText;
            const price = card.querySelector('p').innerText;
            const img = card.querySelector('img').getAttribute('src');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.name === name && item.price === price);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, img, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            showToast(`${name} added to cart!`);
        });
    });

    // Show More/Less toggle for each product card
    document.querySelectorAll('.show-more-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const card = btn.closest('.product-card');
            const desc = btn.nextElementSibling;
            if (!desc.classList.contains('show')) {
                desc.classList.add('show');
                card.classList.add('showing-more');
                btn.textContent = "Show Less";
            } else {
                desc.classList.remove('show');
                card.classList.remove('showing-more');
                btn.textContent = "Show More";
            }
        });
    });


    document.querySelectorAll('.product-card').forEach(function(card, idx) {
        const img = card.querySelector('.product-img');
        const prevBtn = card.querySelector('.img-switch-btn.prev');
        const nextBtn = card.querySelector('.img-switch-btn.next');
        let images = [img.getAttribute('src')];
        const dataImages = card.getAttribute('data-images');
        if (dataImages) {
            try {
                images = JSON.parse(dataImages);
            } catch (e) {}
        }
        let current = 0;

        function showImg(i) {
            img.setAttribute('src', images[i]);
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                current = (current - 1 + images.length) % images.length;
                showImg(current);
            });
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                current = (current + 1) % images.length;
                showImg(current);
            });
        }
    });

    document.querySelectorAll('.cart-item-link').forEach(link => {
        link.addEventListener('click', function() {
            const productName = link.getAttribute('data-product');
            // Build the product card ID (must match your HTML)
            const productId = 'product-' + productName.replace(/\s+/g, '-');
            const productCard = document.getElementById(productId);
            if (productCard) {
                window.location.href = 'index.html#' + productId;
            }
        });
    });

    if (window.location.hash) {
        const el = document.querySelector(window.location.hash);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('highlight');
            setTimeout(() => el.classList.remove('highlight'), 2000);
        }
    }
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2000);
}