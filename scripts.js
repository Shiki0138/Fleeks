// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initScrollAnimations();
    initFAQ();
    initCounterAnimations();
    initSmoothScroll();
    initParallaxEffects();
    initTypingAnimation();
    initFloatingElements();
    
    // Remove loading screen
    setTimeout(() => {
        const loader = document.querySelector('.loading');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }, 500);
});

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.testimonial-card, .problem-card, .benefit-card, .proof-stat, .video-feature'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const hasArrow = text.includes('→');
    
    if (hasArrow) {
        // Handle "0→27人" format
        const parts = text.split('→');
        const endValue = parseInt(parts[1]);
        let currentValue = 0;
        
        const increment = endValue / 40;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= endValue) {
                currentValue = endValue;
                clearInterval(timer);
            }
            element.textContent = `0→${Math.floor(currentValue)}人`;
        }, 50);
    } else if (text.includes('%')) {
        // Handle percentage format
        const value = parseInt(text);
        let currentValue = 0;
        const increment = value / 40;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= value) {
                currentValue = value;
                clearInterval(timer);
            }
            element.textContent = `${Math.floor(currentValue)}%`;
        }, 50);
    } else if (text.includes('月商')) {
        // Handle "月商160%" format
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.animation = 'fadeInUp 0.8s ease-out';
        }, 300);
    }
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 50;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-bg, .hero-overlay');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = index === 0 ? 0.5 : 0.3;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'Instagram投稿を自動生成中...',
        'ターゲット顧客を分析中...',
        '最適な投稿時間を計算中...',
        '競合アカウントを調査中...'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
        }
        
        setTimeout(type, isDeleting ? 50 : 100);
    }
    
    type();
}

// Dynamic Slot Counter
function updateSlotCounter() {
    const slotsElement = document.querySelector('.slots-left');
    if (!slotsElement) return;
    
    // Simulate dynamic slots (in production, this would fetch from backend)
    const totalSlots = 10;
    const usedSlots = Math.floor(Math.random() * 3) + 1;
    const remainingSlots = totalSlots - usedSlots;
    
    slotsElement.textContent = `残り${remainingSlots}名`;
    
    // Add urgency animation if slots are low
    if (remainingSlots <= 3) {
        slotsElement.style.animation = 'pulse 1s infinite';
    }
}

// Update slots every 30 seconds
setInterval(updateSlotCounter, 30000);

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Hover Effects for Cards
document.querySelectorAll('.testimonial-card, .benefit-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// CTA Button Ripple Effect
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Performance Optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
const optimizedScroll = debounce(() => {
    // Add/remove header shadow on scroll
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Video Play Button
document.querySelector('.video-placeholder')?.addEventListener('click', function() {
    // In production, this would embed and play the actual video
    alert('動画プレビュー機能は本番環境で利用可能です');
});

// Form Validation (if forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Analytics Events (placeholder for production)
function trackEvent(category, action, label) {
    // In production, integrate with Google Analytics or similar
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track CTA clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('CTA', 'click', button.textContent.trim());
    });
});

// Lazy Loading for Images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Floating Elements Animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Random starting position
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        element.style.left = randomX + '%';
        element.style.top = randomY + '%';
        
        // Mouse interaction
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.5) rotate(360deg)';
            element.style.opacity = '0.8';
            element.style.color = 'var(--accent-gold)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1) rotate(0deg)';
            element.style.opacity = '0.3';
            element.style.color = 'rgba(212, 175, 55, 0.1)';
        });
        
        // Continuous movement
        setInterval(() => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const currentX = parseFloat(element.style.left);
            const currentY = parseFloat(element.style.top);
            
            const newX = currentX + (Math.random() - 0.5) * speed;
            const newY = currentY + (Math.random() - 0.5) * speed;
            
            // Keep within bounds
            element.style.left = Math.max(0, Math.min(95, newX)) + '%';
            element.style.top = Math.max(0, Math.min(95, newY)) + '%';
        }, 3000);
    });
}

// Enhanced Hero Animations
function initHeroEnhancements() {
    const heroBadge = document.querySelector('.hero-badge');
    
    // Intersection Observer for hero animations
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animations
                setTimeout(() => {
                    heroBadge.classList.add('pulse');
                }, 1000);
            }
        });
    }, { threshold: 0.5 });
    
    if (heroBadge) heroObserver.observe(heroBadge);
}

// YouTube IFrame API Setup
let player;
let fadeInterval;
let monitorInterval;
let isVideoLimited = false;
let hasReached30Seconds = false;
let playAttempts = 0;

// Check if video limit has been reached in previous session
function checkVideoLimitStatus() {
    const limitReached = localStorage.getItem('videoLimitReached');
    const limitTimestamp = localStorage.getItem('videoLimitTimestamp');
    
    if (limitReached === 'true') {
        // Check if limit was set recently (within 24 hours)
        const now = new Date().getTime();
        const timestamp = parseInt(limitTimestamp) || 0;
        const hoursPassed = (now - timestamp) / (1000 * 60 * 60);
        
        if (hoursPassed < 24) {
            hasReached30Seconds = true;
            isVideoLimited = true;
            console.log('Video limit status restored from previous session');
            return true;
        } else {
            // Reset after 24 hours
            localStorage.removeItem('videoLimitReached');
            localStorage.removeItem('videoLimitTimestamp');
        }
    }
    return false;
}

// Save video limit status
function saveVideoLimitStatus() {
    localStorage.setItem('videoLimitReached', 'true');
    localStorage.setItem('videoLimitTimestamp', new Date().getTime().toString());
}

function onYouTubeIframeAPIReady() {
    // Check if the player element exists
    const playerElement = document.getElementById('youtube-player');
    if (!playerElement) {
        console.log('YouTube player element not found');
        return;
    }

    player = new YT.Player('youtube-player', {
        height: '315',
        width: '100%',
        videoId: '0Bk1GrOBR1I',
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'rel': 0,
            'modestbranding': 1,
            'start': 0,
            'playsinline': 1, // Important for mobile
            'fs': 1, // Allow fullscreen
            'cc_load_policy': 0, // Don't show captions by default
            'iv_load_policy': 3 // Hide video annotations
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('YouTube player ready');
    
    // Check if video was previously limited
    const wasLimited = checkVideoLimitStatus();
    
    // Set initial volume
    if (player && player.setVolume) {
        player.setVolume(80);
    }
    
    // If video was previously limited, show overlay immediately
    if (wasLimited) {
        showVideoOverlay();
        console.log('Video was previously limited - overlay shown');
    }
    
    // Start seek prevention monitoring
    setTimeout(() => {
        preventSeekPast30Seconds();
    }, 1000);
}

function onPlayerStateChange(event) {
    // Block any play attempts if video has reached 30 seconds
    if (event.data == YT.PlayerState.PLAYING) {
        playAttempts++;
        
        if (hasReached30Seconds || isVideoLimited) {
            console.log('Play attempt blocked - 30 second limit reached');
            player.pauseVideo();
            showVideoOverlay();
            return;
        }
        
        // Check current time on play - if someone seeks past 30 seconds, block it
        if (player.getCurrentTime && player.getCurrentTime() >= 30) {
            console.log('Play attempt blocked - seeking past 30 seconds');
            player.pauseVideo();
            player.seekTo(0);
            hasReached30Seconds = true;
            isVideoLimited = true;
            showVideoOverlay();
            return;
        }
        
        console.log('Video started playing - attempt #' + playAttempts);
        // Start continuous monitoring
        startContinuousMonitoring();
        
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        // Clear monitoring intervals
        clearAllIntervals();
    }
}

function startContinuousMonitoring() {
    // Clear any existing intervals
    clearAllIntervals();
    
    // Start both fade monitoring and strict time enforcement
    fadeInterval = setInterval(() => {
        if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();
            
            // Immediate enforcement - if we've hit 30 seconds, stop everything
            if (currentTime >= 30) {
                enforceTimeLimit();
                return;
            }
            
            // Start fade at 25 seconds if not already limited
            if (currentTime >= 25 && !isVideoLimited) {
                const fadeProgress = (currentTime - 25) / 5; // 5-second fade duration
                const volume = Math.max(0, 80 * (1 - fadeProgress));
                
                if (player.setVolume) {
                    player.setVolume(Math.round(volume));
                }
            }
        }
    }, 50); // Check every 50ms for very responsive control
    
    // Additional strict enforcement check every 100ms
    monitorInterval = setInterval(() => {
        if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();
            
            // Double-check enforcement
            if (currentTime >= 30 || hasReached30Seconds) {
                enforceTimeLimit();
            }
            
            // Also check if someone manually seeks forward
            if (currentTime > 30) {
                console.log('Manual seek detected past 30 seconds - blocking');
                enforceTimeLimit();
            }
        }
    }, 100);
}

function enforceTimeLimit() {
    console.log('30 second limit enforced');
    
    // Set all flags
    hasReached30Seconds = true;
    isVideoLimited = true;
    
    // Save to localStorage for persistence
    saveVideoLimitStatus();
    
    // Stop the video immediately
    if (player && player.pauseVideo) {
        player.pauseVideo();
    }
    
    // Clear all intervals
    clearAllIntervals();
    
    // Show overlay
    showVideoOverlay();
    
    // Seek back to beginning for next potential play attempt
    if (player && player.seekTo) {
        player.seekTo(0);
    }
}

function clearAllIntervals() {
    if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
    }
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
}

function showVideoOverlay() {
    const overlay = document.getElementById('video-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        // Trigger the fade-in animation
        setTimeout(() => {
            overlay.classList.add('active');
        }, 50);
    }
}

function hideVideoOverlay() {
    const overlay = document.getElementById('video-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);
    }
}

// Function to reset video (for testing purposes only - not exposed to users)
function resetVideo() {
    console.log('Video reset function called - for testing only');
    
    // Reset all flags
    isVideoLimited = false;
    hasReached30Seconds = false;
    playAttempts = 0;
    
    // Clear all intervals
    clearAllIntervals();
    
    // Reset player state
    if (player && player.seekTo) {
        player.seekTo(0);
        player.setVolume(80);
    }
    
    // Hide overlay
    hideVideoOverlay();
}

// Additional security: Prevent manual seeking past 30 seconds
function preventSeekPast30Seconds() {
    if (!player || !player.getCurrentTime) return;
    
    setInterval(() => {
        if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();
            
            // If someone manually seeks past 30 seconds, enforce limit
            if (currentTime > 30 && !hasReached30Seconds) {
                console.log('Unauthorized seek past 30 seconds detected');
                enforceTimeLimit();
            }
        }
    }, 200); // Check every 200ms for seek attempts
}

// YouTube Video Controls
function initYouTubeControls() {
    // Check if YouTube API is available
    if (typeof YT !== 'undefined' && YT.Player) {
        onYouTubeIframeAPIReady();
    } else {
        // Wait for API to load
        console.log('Waiting for YouTube API to load...');
    }
}

// Enhanced mobile detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad detection
}

// Initialize enhanced features
setTimeout(() => {
    initHeroEnhancements();
    
    // Add mobile-specific optimizations
    if (isMobileDevice()) {
        console.log('Mobile device detected - optimizing video playback');
        document.body.classList.add('mobile-device');
    }
    
    // Initialize YouTube after a slight delay to ensure DOM is ready
    setTimeout(initYouTubeControls, 500);
}, 100);

// Add global error handling for YouTube API
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('youtube')) {
        console.log('YouTube API error detected, attempting fallback');
        // Could implement fallback iframe here if needed
    }
});