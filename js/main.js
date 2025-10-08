// Enhanced Main JavaScript with smooth transitions
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll animations
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('animated');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('animated');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.2)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Staggered animations for grid items
    const staggerElements = document.querySelectorAll('.stagger-item');
    const handleStaggerAnimation = () => {
        staggerElements.forEach((el, index) => {
            if (elementInView(el, 1.1)) {
                setTimeout(() => {
                    displayScrollElement(el);
                }, index * 100);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
        handleStaggerAnimation();
    });
    
    // Initialize animations on page load
    handleScrollAnimation();
    handleStaggerAnimation();
    
    // Add scroll-animate class to elements that should animate on scroll
    document.querySelectorAll('.feature-card, .info-text, .info-image, .team-card, .support-card, .product-card, .about-text').forEach(el => {
        el.classList.add('scroll-animate');
    });
    
    // Add stagger-item class to grid items for staggered animation
    document.querySelectorAll('.features-grid .feature-card, .products-grid .product-card, .team-grid .team-card, .support-options .support-card').forEach((el, index) => {
        el.classList.add('stagger-item');
        el.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Page transition effect
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    pageTransition.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(pageTransition);
    
    // Handle page transitions
    document.querySelectorAll('a').forEach(link => {
        if (link.href && link.href.includes('.html') && !link.href.includes('#')) {
            link.addEventListener('click', function(e) {
                if (this.target === '_blank' || this.hasAttribute('download')) return;
                
                e.preventDefault();
                const href = this.href;
                
                pageTransition.classList.add('active');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            });
        }
    });
    
    // Remove transition when page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 300);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('btn-animate');
    });
    
    // Counter animation for statistics
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    };
    
    // Initialize counters when they come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});