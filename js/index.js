document.addEventListener('DOMContentLoaded', () => {
    // Filter products function
    function filterProducts(category) {
        const products = document.querySelectorAll('.product-item');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // Update active button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });
        
        // Filter products
        products.forEach(product => {
            if (category === '' || product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        
        // Track filter event
        trackEvent('filter_products', {
            filter_category: category || 'all'
        });
    }

    // Setup filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            filterProducts(e.target.dataset.filter);
        });
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            e.preventDefault(); // Prevent default behavior
            
            // Only process if this is the direct click target
            if (e.target !== this && !this.contains(e.target)) return;
            
            const button = e.currentTarget;
            const productData = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: parseFloat(button.dataset.productPrice),
                category: button.dataset.productCategory,
                image: button.dataset.productImage
            };
            
            if (!productData.id || !productData.name) {
                console.error('Missing product data:', productData);
                return;
            }
            
            cart.addItem(productData);
        }, { once: false, capture: true }); // Explicit event options
    });
    
    // Setup view product buttons
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            
            // Track view item
            trackEvent('view_item', {
                item_id: productId
            });
            
            // Navigate to product detail page
            window.location.href = `product-detail.html?id=${productId}`;
        });
    });
});