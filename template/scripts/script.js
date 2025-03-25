document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initializeApp();
});

function initializeApp() {
    // Show loading animation
    showLoading(true);
    
    // Simulate data loading
    setTimeout(() => {
        showLoading(false);
        animateElements();
        initializeInteractions();
    }, 1500);
}

function showLoading(show) {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerHTML = '<div class="loading-spinner"></div>';
    
    if (show) {
        document.body.appendChild(loadingElement);
    } else {
        const existingLoader = document.querySelector('.loading');
        if (existingLoader) {
            existingLoader.classList.add('fade-out');
            setTimeout(() => {
                existingLoader.remove();
            }, 500);
        }
    }
}

function animateElements() {
    // Animate user welcome with typing effect
    const welcomeElement = document.querySelector('.user-welcome');
    if (welcomeElement) {
        const text = welcomeElement.textContent;
        welcomeElement.textContent = '';
        welcomeElement.style.opacity = '1';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < text.length) {
                welcomeElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 50);
    }
    
    // Animate cards with 3D effect
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
    
    // Animate background elements
    animateBackgroundElements();
}

function animateBackgroundElements() {
    // Create floating particles in the background
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        
        // Random properties
        const size = Math.random() * 5 + 3;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = Math.random() * 0.5;
        
        container.appendChild(particle);
    }
    
    // Add this style to your CSS
    const style = document.createElement('style');
    style.textContent = `
        .bg-particle {
            position: absolute;
            background: white;
            border-radius: 50%;
            z-index: 1;
            pointer-events: none;
            animation: float-particle linear infinite;
        }
        
        @keyframes float-particle {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(0) translateX(20px); }
            75% { transform: translateY(20px) translateX(10px); }
            100% { transform: translateY(0) translateX(0); }
        }
    `;
    document.head.appendChild(style);
}

function initializeInteractions() {
    // Initialize card carousel
    initCardCarousel();
    
    // Initialize service items
    initServiceItems();
    
    // Initialize payment selection
    initPaymentSelection();
    
    // Initialize dark mode toggle
    initDarkModeToggle();
    
    // Add scroll animations
    initScrollAnimations();
}

function initCardCarousel() {
    const cardsContainer = document.querySelector('.cards-container');
    const paginationDots = document.querySelectorAll('.dot');
    let activeIndex = 0;
    
    if (!cardsContainer || !paginationDots.length) return;
    
    // Update active card and dot
    function updateActiveCard(index) {
        const cards = cardsContainer.querySelectorAll('.card');
        
        // Remove active class from all cards and dots
        cards.forEach(card => card.classList.remove('active'));
        paginationDots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current card and dot
        if (cards[index]) cards[index].classList.add('active');
        if (paginationDots[index]) paginationDots[index].classList.add('active');
        
        // Scroll to active card
        if (cards[index]) {
            const cardWidth = cards[index].offsetWidth + 15; // Width + gap
            cardsContainer.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        }
        
        activeIndex = index;
    }
    
    // Initialize first card as active
    updateActiveCard(0);
    
    // Add click event to pagination dots
    paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateActiveCard(index);
        });
    });
    
    // Auto rotate cards every 5 seconds
    setInterval(() => {
        activeIndex = (activeIndex + 1) % paginationDots.length;
        updateActiveCard(activeIndex);
    }, 5000);
    
    // Add touch swipe functionality
    let startX, endX;
    cardsContainer.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });
    
    cardsContainer.addEventListener('touchend', e => {
        endX = e.changedTouches[0].clientX;
        
        // If swiped left and not at the last card
        if (startX > endX + 50 && activeIndex < paginationDots.length - 1) {
            updateActiveCard(activeIndex + 1);
        }
        
        // If swiped right and not at the first card
        if (startX < endX - 50 && activeIndex > 0) {
            updateActiveCard(activeIndex - 1);
        }
    });
}

function initServiceItems() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        // Add click effect
        item.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            item.appendChild(ripple);
            
            // Position ripple from center of click
            const rect = item.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.top = '50%';
            ripple.style.left = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
                
                // Show notification
                showNotification('Service Selected', 'You selected ' + item.querySelector('.service-name').textContent, 'success');
            }, 500);
        });
    });
    
    // Add ripple style
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.5s linear;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function initPaymentSelection() {
    // Provider selection
    const providerItems = document.querySelectorAll('.provider-item');
    
    providerItems.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle selected class
            providerItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            
            // Update check icon
            const checks = document.querySelectorAll('.provider-check');
            checks.forEach(check => check.innerHTML = '');
            
            const currentCheck = item.querySelector('.provider-check');
            if (currentCheck) {
                currentCheck.innerHTML = '<i class="fas fa-check"></i>';
            }
        });
    });
    
    // Amount options
    const amountOptions = document.querySelectorAll('.amount-option');
    
    amountOptions.forEach(option => {
        option.addEventListener('click', () => {
            amountOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Payment methods
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
        });
    });
    
    // Submit button
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            showLoading(true);
            
            // Simulate processing
            setTimeout(() => {
                showLoading(false);
                showNotification('Payment Successful', 'Your payment has been processed successfully!', 'success');
            }, 2000);
        });
    }
}

function showNotification(title, message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <div class="notification-icon ${type}">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification with delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        
        setTimeout(() => {
            notification.remove();
        }, 500);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 500);
        }
    }, 5000);
}

function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (!darkModeToggle) return;
    
    darkModeToggle.addEventListener('click', () => {
        darkModeToggle.classList.toggle('active');
        document.body.classList.toggle('light-mode');
        
        // Update local storage preference
        const isDarkMode = darkModeToggle.classList.contains('active');
        localStorage.setItem('darkMode', isDarkMode);
        
        // Add confetti effect on toggle
        createConfetti(10);
    });
    
    // Check saved preference
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'true') {
        darkModeToggle.classList.add('active');
        document.body.classList.remove('light-mode');
    } else if (savedDarkMode === 'false') {
        darkModeToggle.classList.remove('active');
        document.body.classList.add('light-mode');
    }
}

function createConfetti(count) {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const size = Math.random() * 8 + 5;
        const colors = ['#5b86e5', '#36d1dc', '#d16ba5', '#ff9a9e', '#58a5f8'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;
        
        // Apply styles
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.top = '0';
        confetti.style.animationDuration = `${duration}s`;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
            
            // Remove container if empty
            if (!confettiContainer.childElementCount) {
                confettiContainer.remove();
            }
        }, duration * 1000);
    }
    
    // Add confetti style
    const style = document.createElement('style');
    style.textContent = `
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        }
        
        .confetti {
            position: absolute;
            border-radius: 2px;
            animation: confetti-fall linear forwards;
        }
        
        @keyframes confetti-fall {
            0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function initScrollAnimations() {
    // Add scroll reveal effect to elements
    const elementsToAnimate = [
        '.info-box', 
        '.service-item', 
        '.transaction-item',
        '.form-section'
    ];
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all elements
    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            // Reset animation classes first
            element.classList.remove('fadeInUp', 'fadeInScale', 'slideInRight');
            element.style.opacity = '0';
            
            // Add revealed class for custom animation
            element.classList.add('to-reveal');
            
            observer.observe(element);
        });
    });
    
    // Add necessary CSS
    const style = document.createElement('style');
    style.textContent = `
        .to-reveal {
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .info-box.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-item.revealed {
            opacity: 1;
            transform: scale(1);
        }
        
        .transaction-item.revealed {
            opacity: 1;
            transform: translateX(0);
        }
        
        .form-section.revealed {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Add dynamic wave effect to the header
function addWaveEffect() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    const wave = document.createElement('div');
    wave.className = 'nav-wave';
    nav.appendChild(wave);
    
    // Add wave style
    const style = document.createElement('style');
    style.textContent = `
        .nav-wave {
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 10px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23111726'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23111726'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%23111726'%3E%3C/path%3E%3C/svg%3E") repeat-x;
            background-size: 1200px 10px;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
}

// Initialize additional effects
addWaveEffect();

// Add tilt effect to cards and service items
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.card, .service-item, .info-box');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.transition = 'transform 0.5s ease';
        });
    });
}

// Initialize tilt effect
initTiltEffect();

// Add parallax effect for background elements
function initParallaxEffect() {
    document.addEventListener('mousemove', (e) => {
        const bgElements = document.querySelectorAll('.bg-element');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        bgElements.forEach((element, index) => {
            const depth = (index + 1) * 10;
            const moveX = (mouseX * depth) - (depth / 2);
            const moveY = (mouseY * depth) - (depth / 2);
            
            element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1)`;
        });
    });
}

// Initialize parallax effect
initParallaxEffect();