// Enhanced Store functionality
document.addEventListener('DOMContentLoaded', function() {
    // Category navigation with enhanced effects
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            const category = this.getAttribute('data-category');
            if (category) {
                // Add page transition
                document.querySelector('.page-transition').classList.add('active');
                
                setTimeout(() => {
                    window.location.href = `${category}.html`;
                }, 600);
            }
        });
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Product selection for payment page with enhanced UI
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            productCards.forEach(c => {
                c.classList.remove('active');
                c.style.transform = 'translateY(0)';
            });
            
            // Add active class to clicked card with enhanced animation
            this.classList.add('active');
            this.style.transform = 'translateY(-15px) scale(1.02)';
            
            // Update payment summary with animation
            updatePaymentSummary(this);
            
            // Add confirmation pulse
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
    
    // Enhanced payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelectorAll('.payment-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods with fade out
            paymentMethods.forEach(m => {
                m.classList.remove('active');
                m.style.opacity = '0.7';
            });
            
            // Hide all payment details with slide up
            paymentDetails.forEach(detail => {
                detail.style.opacity = '0';
                detail.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    detail.classList.remove('active');
                }, 300);
            });
            
            // Add active class to clicked method with enhanced animation
            this.classList.add('active');
            this.style.opacity = '1';
            this.style.transform = 'translateY(-3px)';
            
            // Show selected payment details with slide down
            const paymentType = this.getAttribute('data-payment');
            const selectedDetail = document.querySelector(`.payment-details[data-payment="${paymentType}"]`);
            if (selectedDetail) {
                setTimeout(() => {
                    selectedDetail.classList.add('active');
                    setTimeout(() => {
                        selectedDetail.style.opacity = '1';
                        selectedDetail.style.transform = 'translateY(0)';
                    }, 50);
                }, 300);
            }
        });
    });
    
    // Enhanced update payment summary
    function updatePaymentSummary(productCard) {
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        // Animate the update
        const summaryItems = document.querySelectorAll('.summary-item');
        summaryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-10px)';
        });
        
        setTimeout(() => {
            document.getElementById('selected-product').textContent = productName;
            document.getElementById('product-price').textContent = productPrice;
            document.getElementById('total-price').textContent = productPrice;
            
            // Update payment amounts
            document.getElementById('bkash-amount').textContent = productPrice;
            document.getElementById('nagad-amount').textContent = productPrice;
            
            // Animate back in
            summaryItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            });
        }, 300);
    }
    
    // Enhanced form submission with validation
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const username = formData.get('username');
            const product = document.getElementById('selected-product').textContent;
            const price = document.getElementById('total-price').textContent;
            const paymentMethod = document.querySelector('.payment-method.active');
            
            // Enhanced validation
            if (!paymentMethod) {
                showNotification('Please select a payment method', 'error');
                return;
            }
            
            if (product === 'None') {
                showNotification('Please select a product first', 'error');
                return;
            }
            
            const paymentType = paymentMethod.getAttribute('data-payment');
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate processing
            setTimeout(() => {
                // Show success notification
                showNotification(`Thank you for your purchase! ${product} will be delivered within 15 minutes after payment verification.`, 'success');
                
                // Reset form with animation
                this.reset();
                productCards.forEach(card => {
                    card.classList.remove('active');
                    card.style.transform = 'translateY(0)';
                });
                paymentMethods.forEach(method => {
                    method.classList.remove('active');
                    method.style.opacity = '0.7';
                    method.style.transform = 'translateY(0)';
                });
                paymentDetails.forEach(detail => {
                    detail.classList.remove('active');
                    detail.style.opacity = '0';
                });
                
                // Reset payment summary with animation
                document.getElementById('selected-product').textContent = 'None';
                document.getElementById('product-price').textContent = '৳0';
                document.getElementById('total-price').textContent = '৳0';
                document.getElementById('bkash-amount').textContent = '৳0';
                document.getElementById('nagad-amount').textContent = '৳0';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: rgba(36, 0, 70, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(123, 44, 191, 0.3);
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    color: white;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    transform: translateX(400px);
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    max-width: 400px;
                }
                .notification-success {
                    border-left: 4px solid #4CAF50;
                }
                .notification-error {
                    border-left: 4px solid #F44336;
                }
                .notification-info {
                    border-left: 4px solid var(--accent);
                }
                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.2rem;
                    margin-left: 1rem;
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                }
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }
    
    // Add search functionality to store pages
    const addSearchFunctionality = () => {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search products..." class="search-input">
                <button class="search-clear">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const productsSection = document.querySelector('.products-grid');
        if (productsSection) {
            productsSection.parentNode.insertBefore(searchContainer, productsSection);
            
            const searchInput = searchContainer.querySelector('.search-input');
            const searchClear = searchContainer.querySelector('.search-clear');
            const productCards = document.querySelectorAll('.product-card');
            
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                productCards.forEach(card => {
                    const title = card.querySelector('.product-title').textContent.toLowerCase();
                    const description = card.querySelector('.product-description').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Show/hide clear button
                searchClear.style.display = searchTerm ? 'flex' : 'none';
            });
            
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.focus();
            });
        }
    };
    
    // Initialize search on store pages
    if (document.querySelector('.products-grid')) {
        addSearchFunctionality();
    }
});