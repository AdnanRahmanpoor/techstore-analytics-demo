document.addEventListener('DOMContentLoaded', () => {
    const orderItemsContainer = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (cart.items.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    
    // Render order summary
    orderItemsContainer.innerHTML = cart.items.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <div class="fw-bold">${item.name}</div>
                <div class="small text-muted">Qty: ${item.quantity}</div>
            </div>
            <div class="text-end">
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        </div>
    `).join('');
    
    const subtotal = cart.getSubtotal();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const orderData = {
            id: 'ORD-' + Date.now(),
            items: cart.items,
            total: total,
            customerInfo: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value
            },
            paymentInfo: {
                cardLast4: document.getElementById('cardNumber').value.slice(-4),
                cardType: document.getElementById('cardNumber').value.startsWith('4') ? 'Visa' : 'Mastercard'
            },
            timestamp: new Date().toISOString()
        };
        
        // Save order data
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Track purchase
        trackEvent('purchase', {
            transaction_id: orderData.id,
            value: orderData.total,
            currency: 'USD',
            items: orderData.items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                item_category: item.category,
                price: item.price,
                quantity: item.quantity
            }))
        });
        
        // Clear cart
        cart.clearCart();
        
        // Redirect to thank you page
        window.location.href = 'thank-you.html';
    });
});