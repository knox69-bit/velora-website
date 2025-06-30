document.addEventListener('DOMContentLoaded', function() {
    // Add to Cart logic
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const card = button.closest('.product-card');
            const name = card.querySelector('h4').innerText;
            const price = card.querySelector('p').innerText;
            const colorInput = card.querySelector('input[type="radio"][name^="color-"]:checked');
            if (!colorInput) {
                showToast('Please select a color');
                return;
            }
            // Use the color image if available, else fallback to main image
            const img = colorInput.getAttribute('data-color-img') 
                ? colorInput.getAttribute('data-color-img') 
                : card.querySelector('.product-img').getAttribute('src');
            const color = colorInput.value;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.name === name && item.price === price && item.color === color);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, img, color, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            showToast(`${name} (${color}) added to cart!`);
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


// Image switching logic for product cards color and arrow buttons
document.querySelectorAll('.product-card').forEach(function(card) {
    const img = card.querySelector('.product-img');
    const prevBtn = card.querySelector('.img-switch-btn.prev');
    const nextBtn = card.querySelector('.img-switch-btn.next');
    const dataImages = card.getAttribute('data-images');
    if (!img || !dataImages) return;
    let images = [];
    try {
        images = JSON.parse(dataImages);
    } catch (e) {}
    let current = 0;

    // Get color step from data attribute, default to 1
    const colorStep = parseInt(card.getAttribute('data-color-step')) || 1;

    function showImg(i) {
        img.setAttribute('src', images[i]);
    }

    // Arrow buttons
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

    // Color radios
    const colorRadios = card.querySelectorAll('.color-options input[type="radio"]');
    colorRadios.forEach((radio) => {
        radio.addEventListener('change', function() {
            const imgIdx = parseInt(radio.getAttribute('data-img-index')) || 0;
            if (images[imgIdx]) {
                current = imgIdx;
                showImg(current);
            }
        });
    });
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

    document.querySelectorAll('.product-card').forEach(card => {
        const isOut = card.getAttribute('data-outofstock') === "true";
        const addBtn = card.querySelector('.add-to-cart-btn');
        if (isOut) {
            // Add overlay if not already present
            if (!card.querySelector('.out-of-stock-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'out-of-stock-overlay';
                overlay.textContent = 'Out of Stock';
                card.style.position = 'relative';
                card.appendChild(overlay);
            }
            if (addBtn) {
                addBtn.disabled = true;
                addBtn.textContent = "Out of Stock";
                addBtn.classList.add('disabled');
            }
        } else {
            // Remove overlay if present
            const overlay = card.querySelector('.out-of-stock-overlay');
            if (overlay) overlay.remove();
            if (addBtn) {
                addBtn.disabled = false;
                addBtn.textContent = "Add to Cart";
                addBtn.classList.remove('disabled');
            }
        }
    });

    document.querySelectorAll('.product-card').forEach(function(card) {
        const colorImgBox = card.querySelector('.color-img-box');
        const colorImg = card.querySelector('.color-img');
        const colorRadios = card.querySelectorAll('.color-options input[type="radio"]');
        const lensColorText = card.querySelector('.lens-color-text');

        colorRadios.forEach((radio) => {
            radio.addEventListener('change', function() {
                // Show color image
                const colorImgSrc = radio.getAttribute('data-color-img');
                if (colorImgSrc && colorImgBox && colorImg) {
                    colorImg.src = colorImgSrc;
                    colorImgBox.style.display = 'block';
                } else if (colorImgBox) {
                    colorImgBox.style.display = 'none';
                }
                // Show lens color text from data-lens-color
                if (lensColorText) {
                    const lensColor = radio.getAttribute('data-lens-color') || '';
                    lensColorText.textContent = lensColor ? "Lens color: " + lensColor : "";
                    lensColorText.style.display = lensColor ? 'block' : 'none';
                }
            });
        });
    });

// Expand image on click
let modalImages = [];
let modalCurrent = 0;

document.querySelectorAll('.product-img, .color-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
        const card = img.closest('.product-card');
        let images = [];
        let isColorImg = img.classList.contains('color-img');
        if (card && card.getAttribute('data-images') && !isColorImg) {
            try { images = JSON.parse(card.getAttribute('data-images')); } catch (e) {}
        }
        // If color image, show only that image in modal
        if (isColorImg) {
            images = [img.src];
        }
        modalImages = images.length ? images : [img.src];
        modalCurrent = modalImages.indexOf(img.src);
        if (modalCurrent === -1) modalCurrent = 0;

        const modal = document.getElementById('img-modal');
        const modalImg = document.getElementById('img-modal-img');
        modalImg.src = modalImages[modalCurrent];
        modal.style.display = 'flex';

        // Hide prev/next buttons if only one image (color preview)
        document.querySelector('.img-modal-prev').style.display = (modalImages.length > 1) ? 'flex' : 'none';
        document.querySelector('.img-modal-next').style.display = (modalImages.length > 1) ? 'flex' : 'none';
    });
});

function showModalImg(idx) {
    if (!modalImages.length) return;
    modalCurrent = (idx + modalImages.length) % modalImages.length;
    document.getElementById('img-modal-img').src = modalImages[modalCurrent];
}

document.querySelector('.img-modal-close').onclick = function() {
    document.getElementById('img-modal').style.display = 'none';
};
document.getElementById('img-modal').onclick = function(e) {
    if (e.target === this) this.style.display = 'none';
};

document.querySelector('.img-modal-prev').onclick = function(e) {
    e.stopPropagation();
    showModalImg(modalCurrent - 1);
};
document.querySelector('.img-modal-next').onclick = function(e) {
    e.stopPropagation();
    showModalImg(modalCurrent + 1);
};
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2000);
}