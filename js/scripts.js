// Initialize dataLayer before any tracking code
window.dataLayer = window.dataLayer || [];

// Helper function for analytics
function trackEvent(eventName, eventData) {
    console.log('Analytics Event:', eventName, eventData);
    window.dataLayer.push({
        event: eventName,
        ...eventData
    });
}

// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartBadge();
    }
    
        updateCartDisplay() {
        const badge = document.getElementById('cartBadge');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const viewCartBtn = document.getElementById('viewCartBtn');
        
        const totalItems = this.getTotalItems();
        const subtotal = this.getSubtotal();
        
        // Update badge
        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        // Update dropdown cart items
        if (cartItemsContainer) {
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<li class="text-center p-3 text-muted">Your cart is empty</li>';
                if (viewCartBtn) viewCartBtn.disabled = true;
            } else {
                cartItemsContainer.innerHTML = this.items.map(item => `
                    <li class="cart-item px-3">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" 
                                 style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                            <div class="ms-2 flex-grow-1">
                                <div class="fw-bold small">${item.name}</div>
                                <div class="text-muted small">$${item.price} x ${item.quantity}</div>
                            </div>
                            <button class="btn btn-sm btn-outline-danger remove-item" 
                                    data-product-id="${item.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </li>
                `).join('');
                
                if (viewCartBtn) viewCartBtn.disabled = false;
            }
        }
        
        // Update total
        if (cartTotal) {
            cartTotal.textContent = subtotal.toFixed(2);
        }
        
        // Setup event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent dropdown from closing
                const productId = e.target.closest('.remove-item').dataset.productId;
                this.removeItem(productId);
                
                trackEvent('remove_from_cart', {
                    item_id: productId
                });
            });
        });
    }
    
    addItem(product) {
        if (!product || !product.id || !product.name) {
            console.error('Invalid product data:', product);
            return;
        }

        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            // Ensure all required fields are present
            const newItem = {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price) || 0,
                category: product.category || 'uncategorized',
                image: product.image || 'assets/placeholder-product.jpg',
                quantity: product.quantity || 1
            };
            this.items.push(newItem);
        }
        
        this.saveCart();
        this.updateCartDisplay();
        
        // Show proper notification
        this.showNotification(`${product.name} added to cart!`, 'success');
        
        // Track analytics
        trackEvent('add_to_cart', {
            currency: 'USD',
            value: product.price,
            items: [{
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                price: product.price,
                quantity: 1
            }]
        });
    }
    
    // Modify removeItem to call updateCartDisplay
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }
    
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        // Clear any existing notifications first
        container.innerHTML = '';
        
        const alertClass = type === 'success' ? 'alert-success' : 
                        type === 'error' ? 'alert-danger' : 'alert-info';
        
        const notification = document.createElement('div');
        notification.className = `alert ${alertClass} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartBadge();
    }
    
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const count = this.getTotalItems();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }
    
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Initialize cart when page loads
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
    
    // Set up View Cart button
    const viewCartBtn = document.getElementById('viewCartBtn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    // Setup add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const button = e.target.closest('.add-to-cart');
            if (!button) return;
            
            const productData = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: parseFloat(button.dataset.productPrice),
                category: button.dataset.productCategory,
                image: button.dataset.productImage
            };
            
            // Validate product data
            if (!productData.id || !productData.name) {
                console.error('Missing product data:', productData);
                return;
            }
            
            cart.addItem(productData);
        });
    });
    
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
});