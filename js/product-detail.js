document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Find product in our mock database
    const product = getProductById(productId);
    
    if (product) {
        // Populate product details
        document.getElementById('productImage').src = product.image;
        document.getElementById('productSku').textContent = product.id;
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('productDescription').textContent = product.description;
        
        // Track product view
        trackEvent('view_item', {
            currency: 'USD',
            value: product.price,
            items: [{
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                price: product.price
            }]
        });
        
        // Add to cart button
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('inputQuantity').value) || 1;
            
            cart.addItem({
                ...product,
                quantity: quantity
            });
            
            // Track add to cart
            trackEvent('add_to_cart', {
                currency: 'USD',
                value: product.price * quantity,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.category,
                    price: product.price,
                    quantity: quantity
                }]
            });
            
            alert(`${product.name} added to cart!`);
        });
    } else {
        // Product not found, redirect to home
        window.location.href = 'index.html';
    }
});

// Mock product database
function getProductById(id) {
    const products = [
        {
            id: 'PHONE_001',
            name: 'iPhone 14 Pro',
            price: 999,
            category: 'smartphones',
            image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
            description: 'A16 Bionic chip, Pro camera system with 48MP Main, Ultra Wide, and Telephoto cameras, and all-day battery life.'
        },
        {
            id: 'LAPTOP_001',
            name: 'MacBook Pro 14"',
            price: 1999,
            category: 'laptops',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
            description: 'M2 Pro chip with 10-core CPU and 16-core GPU, 16GB unified memory, 512GB SSD storage.'
        },
        {
            id: 'HEADPHONES_001',
            name: 'AirPods Pro (2nd gen)',
            price: 249,
            category: 'headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
            description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio.'
        },
        {
            id: 'PHONE_002',
            name: 'Samsung Galaxy S23',
            price: 799,
            category: 'smartphones',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
            description: 'Snapdragon 8 Gen 2, 50MP camera, 8K video recording, 3900mAh battery.'
        },
        {
            id: 'ACCESSORY_001',
            name: 'Wireless Charger',
            price: 39,
            category: 'accessories',
            image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop',
            description: 'Fast charging, Qi compatible, works with all smartphones.'
        },
        {
            id: 'LAPTOP_002',
            name: 'Dell XPS 13',
            price: 1299,
            category: 'laptops',
            image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop',
            description: 'Intel i7, 16GB RAM, 512GB SSD, 13.4" 4K touch display.'
        }
    ];
    
    return products.find(p => p.id === id);
}