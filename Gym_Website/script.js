document.addEventListener('DOMContentLoaded', () => {
    // Handle header background on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            scrollToSection(sectionId);
            
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        // Simulate form submission (replace with actual API call)
        try {
            // Show loading toast
            Toastify({
                text: "Sending message...",
                duration: 2000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#2196F3",
                }
            }).showToast();

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success toast
            Toastify({
                text: "Message sent successfully! We'll get back to you soon.",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#4CAF50",
                }
            }).showToast();

            // Reset form
            contactForm.reset();
            
        } catch (error) {
            // Show error toast
            Toastify({
                text: "Oops! Something went wrong. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#F44336",
                }
            }).showToast();
        }
    });
});

// Smooth scroll helper function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}