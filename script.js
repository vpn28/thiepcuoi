// Wedding date
const weddingDate = new Date('2025-12-21T11:30:00');

// Audio control
const audioControl = document.getElementById('audioControl');
const bgMusic = document.getElementById('bgMusic');

// Function to play audio with retry mechanism
function playAudioWithRetry() {
    // Set up audio for autoplay
    bgMusic.autoplay = true;
    bgMusic.muted = false;
    
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('🎵 Audio auto-played successfully');
                audioControl.classList.add('playing');
            })
            .catch((error) => {
                console.log('⚠️ Auto-play attempt failed, retrying with muted trick...', error);
                
                // Muted autoplay trick - works on most browsers
                bgMusic.muted = true;
                bgMusic.play()
                    .then(() => {
                        console.log('🎵 Audio playing (muted trick), attempting to unmute...');
                        
                        // Try to unmute after a short delay
                        setTimeout(() => {
                            bgMusic.muted = false;
                            audioControl.classList.add('playing');
                            console.log('🔊 Audio unmuted');
                        }, 500);
                    })
                    .catch((muteError) => {
                        console.log('⚠️ Even muted autoplay failed:', muteError);
                    });
            });
    }
}

// Try to play audio immediately when script loads
playAudioWithRetry();

// Also try when page finishes loading
window.addEventListener('load', () => {
    console.log('📄 Page loaded - ensuring audio is playing');
    playAudioWithRetry();
});

// And try on user first interaction (click, touch) in case browser blocked everything
document.addEventListener('click', () => {
    if (bgMusic.paused) {
        console.log('👆 User clicked - attempting to play audio');
        playAudioWithRetry();
    }
}, { once: true });

document.addEventListener('touchstart', () => {
    if (bgMusic.paused) {
        console.log('👆 User touched - attempting to play audio');
        playAudioWithRetry();
    }
}, { once: true });

audioControl.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.muted = false;
        bgMusic.play().catch(() => {});
        audioControl.classList.add('playing');
    } else {
        bgMusic.pause();
        audioControl.classList.remove('playing');
    }
});

// Countdown
function updateCountdown() {
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// RSVP Form with Vercel Blob Storage
let rsvpForm, guestbook;
const API_ENDPOINT = '/api/messages'; // Vercel API endpoint

// Initialize RSVP form when DOM is ready
function initRSVPForm() {
    rsvpForm = document.getElementById('rsvpForm');
    guestbook = document.getElementById('guestbook');
    
    if (!rsvpForm || !guestbook) {
        console.log('RSVP form not found on this page');
        return;
    }
    
    // Handle form submission
    rsvpForm.addEventListener('submit', handleFormSubmit);
    
    // Load messages on initialization
    loadMessages();
}

// Load messages from Vercel Blob Storage
async function loadMessages() {
    if (!guestbook) return;
    
    try {
        // Fetch from Vercel API
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
            throw new Error('Failed to load messages');
        }
        
        const messages = await response.json();
        
        // Display all messages
        guestbook.innerHTML = '';
        messages.forEach(msg => {
            addMessageToDOM(msg.name, msg.count, msg.attend, msg.message, msg.timestamp);
        });
        
        // Duplicate for continuous scroll
        setTimeout(() => {
            duplicateMessagesForScroll();
        }, 500);
        
        console.log(`Loaded ${messages.length} messages from Vercel Blob Storage`);
        return messages;
    } catch (error) {
        console.error('Error loading messages:', error);
        
        // Fallback to localStorage if API fails
        const localMessages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
        guestbook.innerHTML = '';
        localMessages.forEach(msg => {
            addMessageToDOM(msg.name, msg.count, msg.attend, msg.message, msg.timestamp);
        });
        
        // Duplicate for continuous scroll
        setTimeout(() => {
            duplicateMessagesForScroll();
        }, 500);
        
        console.log('Using localStorage fallback');
    }
}

// Create floating heart animation
function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    
    // Random heart variations
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Random position
    const startX = Math.random() * 90 + 5; // 5% to 95%
    const xOffset = (Math.random() - 0.5) * 100; // -50px to +50px
    
    heart.style.left = `${startX}%`;
    heart.style.bottom = '0';
    heart.style.setProperty('--x-offset', `${xOffset}px`);
    
    // Append to body or a wrapper that's not clipped by overflow:hidden
    const heartsContainer = getOrCreateHeartsContainer(container);
    heartsContainer.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// Get or create hearts overlay container
function getOrCreateHeartsContainer(messageContainer) {
    let heartsOverlay = document.querySelector('.hearts-overlay-container');
    
    if (!heartsOverlay) {
        heartsOverlay = document.createElement('div');
        heartsOverlay.className = 'hearts-overlay-container';
        
        // Find the wrapper and insert overlay
        const wrapper = document.querySelector('.guest-messages-wrapper');
        const messagesDiv = document.querySelector('.guest-messages');
        
        if (wrapper && messagesDiv) {
            wrapper.insertBefore(heartsOverlay, messagesDiv);
            console.log('✓ Hearts overlay created successfully');
        } else {
            console.error('❌ Cannot find wrapper or messages container');
        }
    }
    
    return heartsOverlay;
}

// Add message to DOM with livestream effect
function addMessageToDOM(name, count, attend, message, timestamp) {
    if (!guestbook) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'guest-message';
    
    // Display as "Name: Message" format with bold name
    const displayText = message 
        ? `<strong>${name}</strong>: ${message}` 
        : `<strong>${name}</strong>`;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-text">${displayText}</span>
        </div>
    `;
    
    guestbook.appendChild(messageDiv);
    
    // Create floating hearts (3-5 hearts)
    const heartCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            createFloatingHeart(document.querySelector('.guest-messages'));
        }, i * 300);
    }
}

// Duplicate messages for continuous scroll effect
function duplicateMessagesForScroll() {
    const guestbook = document.getElementById('guestbook');
    if (!guestbook) return;
    
    const messages = Array.from(guestbook.children);
    if (messages.length === 0) return;
    
    // Duplicate messages to create seamless loop
    messages.forEach(msg => {
        const clone = msg.cloneNode(true);
        guestbook.appendChild(clone);
    });
}

// Save message to localStorage
function saveMessage(name, count, attend, message) {
    const messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
    const newMessage = {
        name: name,
        attend: attend,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    messages.unshift(newMessage);
    localStorage.setItem('weddingMessages', JSON.stringify(messages));
    
    return newMessage;
}

// Save message to Vercel Blob Storage
async function saveMessageToCloud(name, count, attend, message) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                attend,
                message,
            }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to save message');
        }
        
        const result = await response.json();
        console.log('Message saved to Vercel Blob Storage:', result);
        return result.message;
    } catch (error) {
        console.error('Error saving to cloud:', error);
        // Fallback to localStorage
        return saveMessage(name, count, attend, message);
    }
}

// Export messages to JSON file (no longer needed with Blob Storage, but kept for backup)
function exportMessagesToJSON() {
    const messages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
    const jsonString = JSON.stringify(messages, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'messages-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Messages exported to messages-backup.json');
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('guestName').value.trim();
    const attend = document.querySelector('input[name="attend"]:checked').value;
    const message = document.getElementById('guestMessage').value.trim();
    
    if (!name) {
        alert('Vui lòng nhập tên của bạn');
        return;
    }
    
    // Show loading state
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Đang gửi...</span>';
    submitBtn.disabled = true;
    
    try {
        // Save to Vercel Blob Storage (count = null)
        const newMessage = await saveMessageToCloud(name, null, attend, message);
        
        // Add to DOM
        addMessageToDOM(name, null, attend, message, newMessage.timestamp);
        
        // Log to console for tracking
        console.log('New RSVP saved:', newMessage);
        
        // Show success message
        alert(`Cảm ơn ${name} đã xác nhận! Chúng mình rất mong được gặp bạn.`);
        
        // Reset form
        rsvpForm.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRSVPForm);
} else {
    initRSVPForm();
}

// Make export function available globally
window.exportMessagesToJSON = exportMessagesToJSON;

// Random floating hearts for ambiance
function startRandomHearts() {
    const guestMessagesContainer = document.querySelector('.guest-messages');
    if (!guestMessagesContainer) return;
    
    // Create hearts more frequently
    setInterval(() => {
        // 70% chance to create 1-2 hearts every 1.5 seconds
        if (Math.random() < 0.7) {
            const count = Math.floor(Math.random() * 2) + 1; // 1-2 hearts
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    createFloatingHeart(guestMessagesContainer);
                }, i * 400);
            }
        }
    }, 1500); // Every 1.5 seconds
}

// Start random hearts after page loads
setTimeout(startRandomHearts, 2000);

// Scroll animations - giống template
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger animation by adding visible class
            entry.target.classList.add('visible');
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .slide-up, .slide-right, .slide-left').forEach(el => {
    // Initially pause animations
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// Auto scroll down slowly on first visit
function autoScrollOnFirstVisit() {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    console.log('🔍 Auto scroll check - hasVisited:', hasVisited);
    
    if (!hasVisited) {
        // Mark as visited for this session
        sessionStorage.setItem('hasVisited', 'true');
        console.log('✅ First visit detected - starting auto scroll');
        
        // Wait a bit for page to fully load
        setTimeout(() => {
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const maxScroll = documentHeight - windowHeight;
            
            console.log('📏 Document height:', documentHeight);
            console.log('📐 Window height:', windowHeight);
            console.log('📊 Max scroll:', maxScroll);
            
            // Scroll gradually with constant slow speed
            const scrollSpeed = 1; // pixels per frame (slower = smaller number)
            const targetScroll = maxScroll * 0.9; // Scroll to 90% of page
            let currentScroll = window.pageYOffset;
            let isScrolling = true;
            let animationFrameId = null;
            
            console.log('🎯 Target scroll position:', targetScroll);
            console.log('🚀 Starting gradual auto scroll...');
            
            // Function to stop auto scroll
            function stopAutoScroll() {
                if (isScrolling) {
                    isScrolling = false;
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                    }
                    console.log('⏹️ Auto scroll stopped by user interaction');
                    
                    // Remove event listeners after stopping
                    document.removeEventListener('click', stopAutoScroll);
                    document.removeEventListener('touchstart', stopAutoScroll);
                    document.removeEventListener('wheel', stopAutoScroll);
                    document.removeEventListener('keydown', stopAutoScroll);
                }
            }
            
            // Add event listeners to detect user interaction
            document.addEventListener('click', stopAutoScroll, { once: true });
            document.addEventListener('touchstart', stopAutoScroll, { once: true });
            document.addEventListener('wheel', stopAutoScroll, { once: true });
            document.addEventListener('keydown', stopAutoScroll, { once: true });
            
            function gradualScroll() {
                if (!isScrolling) return;
                
                currentScroll += scrollSpeed;
                
                // Stop when reached target
                if (currentScroll >= targetScroll) {
                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                    console.log('✨ Auto scroll completed!');
                    stopAutoScroll();
                    return;
                }
                
                window.scrollTo({
                    top: currentScroll,
                    behavior: 'auto'
                });
                
                // Continue scrolling
                animationFrameId = requestAnimationFrame(gradualScroll);
            }
            
            requestAnimationFrame(gradualScroll);
        }, 2000); // Start after 2 seconds to ensure everything is loaded
    } else {
        console.log('⏭️ Not first visit - skipping auto scroll');
    }
}

// Run auto scroll when page loads
window.addEventListener('load', () => {
    console.log('🌐 Page loaded - initializing auto scroll');
    autoScrollOnFirstVisit();
});
