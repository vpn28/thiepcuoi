// Wedding date
const weddingDate = new Date('2025-12-21T11:30:00');

// Audio control
const audioControl = document.getElementById('audioControl');
const bgMusic = document.getElementById('bgMusic');

audioControl.addEventListener('click', () => {
    if (bgMusic.paused) {
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
    
    container.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// Add message to DOM with livestream effect
function addMessageToDOM(name, count, attend, message, timestamp) {
    if (!guestbook) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'guest-message';
    
    const attendText = attend === 'yes' ? '✓ Tham dự' : '✗ Không tham dự';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <h4 class="guest-name">${name}</h4>
            <span class="guest-info">${attendText}</span>
        </div>
        ${message ? `<p class="message-content">${message}</p>` : ''}
    `;
    
    guestbook.appendChild(messageDiv);
    
    // Create floating hearts (3-5 hearts)
    const heartCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            createFloatingHeart(guestbook);
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
    const guestbook = document.getElementById('guestbook');
    if (!guestbook) return;
    
    // Create hearts more frequently
    setInterval(() => {
        // 70% chance to create 1-2 hearts every 1.5 seconds
        if (Math.random() < 0.7) {
            const count = Math.floor(Math.random() * 2) + 1; // 1-2 hearts
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    createFloatingHeart(guestbook);
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
