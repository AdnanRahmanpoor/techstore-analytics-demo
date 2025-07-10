document.addEventListener('DOMContentLoaded', () => {
    const orderData = JSON.parse(localStorage.getItem('lastOrder'));
    
    if (!orderData) {
        window.location.href = 'index.html';
        return;
    }
    
    const orderDate = new Date(orderData.timestamp).toLocaleDateString();
    const customerName = `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`;
    
    document.getElementById('orderId').textContent = orderData.id;
    document.getElementById('orderIdDetails').textContent = orderData.id;
    document.getElementById('orderDate').textContent = orderDate;
    document.getElementById('customerName').textContent = customerName;
    document.getElementById('customerEmail').textContent = orderData.customerInfo.email;
    document.getElementById('orderTotal').textContent = `$${orderData.total.toFixed(2)}`;
    
    // Display ordered items
    const itemsContainer = document.getElementById('orderedItems');
    itemsContainer.innerHTML = orderData.items.map(item => `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
                <strong>${item.name}</strong>
                <div class="small text-muted">${item.category}</div>
            </div>
            <div class="text-end">
                <div>$${item.price.toFixed(2)} x ${item.quantity}</div>
                <div class="small text-muted">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        </div>
    `).join('');
});