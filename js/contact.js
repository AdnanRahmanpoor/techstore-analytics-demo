document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Track contact form submission
        trackEvent('contact_form_submit', {
            form_name: 'contact',
            form_data: {
                name: formData.name,
                email: formData.email,
                subject: formData.subject
            }
        });
        
        alert('Thank you for your message! We will get back to you soon.');
        document.getElementById('contactForm').reset();
    });
});