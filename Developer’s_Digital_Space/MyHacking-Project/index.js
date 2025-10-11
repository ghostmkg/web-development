
        // Global Variables
        let currentPage = 'home';
        
        // DOM Elements
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const contactForm = document.getElementById('contact-form');
        
        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initializeNavigation();
            initializeContactForm();
            initializeAnimations();
        });
        
        // Navigation Functions
        function initializeNavigation() {
            // Mobile menu toggle
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
        
        function showPage(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                currentPage = pageId;
                
                // Update navigation
                updateNavigation(pageId);
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Update page title
                updatePageTitle(pageId);
            }
        }
        
        function updateNavigation(activePageId) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current page link
            const activeLink = document.querySelector(`[onclick="showPage('${activePageId}')"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
        
        function updatePageTitle(pageId) {
            const titles = {
                home: 'Alex Johnson - Web Developer Portfolio',
                about: 'About Me - Alex Johnson',
                portfolio: 'Portfolio - Alex Johnson',
                services: 'Services - Alex Johnson',
                contact: 'Contact - Alex Johnson'
            };
            
            document.title = titles[pageId] || 'Alex Johnson - Web Developer Portfolio';
        }
        
        // Contact Form Functions
        function initializeContactForm() {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                if (validateForm()) {
                    submitForm();
                }
            });
            
            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    clearError(this);
                });
            });
        }
        
        function validateForm() {
            let isValid = true;
            const fields = ['name', 'email', 'subject', 'message'];
            
            fields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }