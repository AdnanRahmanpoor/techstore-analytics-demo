document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    function renderCartItems() {
        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <h3 class="mt-3">Your cart is empty</h3>
                    <p class="text-muted">Add some items to get started!</p>
                    <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            checkoutBtn.disabled = true;
            return;
        }
        
        cartItemsContainer.innerHTML = cart.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" 
                             class="img-fluid rounded" style="max-height: 80px;">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="text-muted small">${item.category}</p>
                        <p class="text-primary fw-bold">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="col-md-3">
                        <div class="quantity-controls">
                            <button class="btn btn-outline-secondary btn-sm decrease-quantity">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="mx-2 quantity">${item.quantity}</span>
                            <button class="btn btn-outline-secondary btn-sm increase-quantity">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-outline-danger btn-sm remove-item">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        updateSummary();
        setupEventListeners();
    }
    
    function updateSummary() {
        const subtotal = cart.getSubtotal();
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    function setupEventListeners() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.productId;
                cart.removeItem(productId);
                renderCartItems();
                
                trackEvent('remove_from_cart', {
                    item_id: productId
                });
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.productId;
                const item = cart.items.find(item => item.id === productId);
                if (item) {
                    cart.updateQuantity(productId, item.quantity + 1);
                    renderCartItems();
                    
                    trackEvent('change_quantity', {
                        item_id: productId,
                        quantity: item.quantity + 1
                    });
                }
            });
        });
        
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.productId;
                const item = cart.items.find(item => item.id === productId);
                if (item) {
                    cart.updateQuantity(productId, item.quantity - 1);
                    renderCartItems();
                    
                    trackEvent('change_quantity', {
                        item_id: productId,
                        quantity: item.quantity - 1
                    });
                }
            });
        });
        
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length > 0) {
                trackEvent('begin_checkout', {
                    currency: 'USD',
                    value: cart.getSubtotal() * 1.1,
                    items: cart.items.map(item => ({
                        item_id: item.id,
                        item_name: item.name,
                        item_category: item.category,
                        price: item.price,
                        quantity: item.quantity
                    }))
                });
                
                window.location.href = 'checkout.html';
            }
        });
    }
    
    renderCartItems();
});