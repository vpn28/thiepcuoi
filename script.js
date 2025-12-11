// Wedding date
const weddingDate = new Date('2025-12-21T11:30:00');

// Audio control
const audioControl = document.getElementById('audioControl');
const bgMusic = document.getElementById('bgMusic');

// Initialize audio
function initAudio() {
    if (!bgMusic) return;
    
    console.log('🎵 Initializing audio...');
    bgMusic.muted = false;
    bgMusic.volume = 1;
    
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('✅ Audio playing!');
                if (audioControl) audioControl.classList.add('playing');
            })
            .catch(e => {
                console.log('⚠️ Play failed:', e.name);
                setupUnmuteOnInteraction();
            });
    }
}

// Unmute on first user interaction
function setupUnmuteOnInteraction() {
    const unmuteAudio = () => {
        if (bgMusic && bgMusic.muted) {
            console.log('👆 Unmuting audio on user interaction');
            bgMusic.muted = false;
            if (audioControl) audioControl.classList.add('playing');
            ['click', 'touchstart', 'keydown'].forEach(evt => {
                document.removeEventListener(evt, unmuteAudio);
            });
        }
    };
    
    ['click', 'touchstart', 'keydown'].forEach(event => {
        document.addEventListener(event, unmuteAudio, { once: true });
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudio);
} else {
    initAudio();
}

window.addEventListener('load', () => {
    setTimeout(initAudio, 200);
});

// Audio button control
if (audioControl && bgMusic) {
    audioControl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
            bgMusic.muted = false;
            bgMusic.play();
            audioControl.classList.add('playing');
        } else {
            bgMusic.pause();
            audioControl.classList.remove('playing');
        }
    });
}

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
const API_ENDPOINT = '/api/messages';

function initRSVPForm() {
    rsvpForm = document.getElementById('rsvpForm');
    guestbook = document.getElementById('guestbook');
    
    if (!rsvpForm || !guestbook) {
        console.log('RSVP form not found on this page');
        return;
    }
    
    rsvpForm.addEventListener('submit', handleFormSubmit);
    loadMessages();
}

async function loadMessages() {
    if (!guestbook) return;
    
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error('Failed to load messages');
        
        const messages = await response.json();
        guestbook.innerHTML = '';
        messages.forEach(msg => {
            addMessageToDOM(msg.name, msg.count, msg.attend, msg.message, msg.timestamp);
        });
        
        setTimeout(() => {
            duplicateMessagesForScroll();
        }, 500);
        
        console.log(`Loaded ${messages.length} messages from Vercel Blob Storage`);
        return messages;
    } catch (error) {
        console.error('Error loading messages:', error);
        
        const localMessages = JSON.parse(localStorage.getItem('weddingMessages') || '[]');
        guestbook.innerHTML = '';
        localMessages.forEach(msg => {
            addMessageToDOM(msg.name, msg.count, msg.attend, msg.message, msg.timestamp);
        });
        
        setTimeout(() => {
            duplicateMessagesForScroll();
        }, 500);
        
        console.log('Using localStorage fallback');
    }
}

function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    
    const startX = Math.random() * 90 + 5;
    const xOffset = (Math.random() - 0.5) * 100;
    
    heart.style.left = `${startX}%`;
    heart.style.bottom = '0';
    heart.style.setProperty('--x-offset', `${xOffset}px`);
    
    const heartsContainer = getOrCreateHeartsContainer(container);
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

function getOrCreateHeartsContainer(messageContainer) {
    let heartsOverlay = document.querySelector('.hearts-overlay-container');
    
    if (!heartsOverlay) {
        heartsOverlay = document.createElement('div');
        heartsOverlay.className = 'hearts-overlay-container';
        
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

function addMessageToDOM(name, count, attend, message, timestamp) {
    if (!guestbook) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'guest-message';
    
    const displayText = message 
        ? `<strong>${name}</strong>: ${message}` 
        : `<strong>${name}</strong>`;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-text">${displayText}</span>
        </div>
    `;
    
    guestbook.appendChild(messageDiv);
    
    const heartCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            createFloatingHeart(document.querySelector('.guest-messages'));
        }, i * 300);
    }
}

function duplicateMessagesForScroll() {
    const guestbook = document.getElementById('guestbook');
    if (!guestbook) return;
    
    const messages = Array.from(guestbook.children);
    if (messages.length === 0) return;
    
    messages.forEach(msg => {
        const clone = msg.cloneNode(true);
        guestbook.appendChild(clone);
    });
}

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
        return saveMessage(name, count, attend, message);
    }
}

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

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('guestName').value.trim();
    const attend = document.querySelector('input[name="attend"]:checked').value;
    const message = document.getElementById('guestMessage').value.trim();
    
    if (!name) {
        alert('Vui lòng nhập tên của bạn');
        return;
    }
    
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Đang gửi...</span>';
    submitBtn.disabled = true;
    
    try {
        const newMessage = await saveMessageToCloud(name, null, attend, message);
        
        addMessageToDOM(name, null, attend, message, newMessage.timestamp);
        
        console.log('New RSVP saved:', newMessage);
        
        alert(`Cảm ơn ${name} đã xác nhận! Chúng mình rất mong được gặp bạn.`);
        
        rsvpForm.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRSVPForm);
} else {
    initRSVPForm();
}

window.exportMessagesToJSON = exportMessagesToJSON;

function startRandomHearts() {
    const guestMessagesContainer = document.querySelector('.guest-messages');
    if (!guestMessagesContainer) return;
    
    setInterval(() => {
        if (Math.random() < 0.7) {
            const count = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    createFloatingHeart(guestMessagesContainer);
                }, i * 400);
            }
        }
    }, 1500);
}

setTimeout(startRandomHearts, 2000);

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-up, .slide-right, .slide-left').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

function autoScrollOnFirstVisit() {
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    console.log('🔍 Auto scroll check - hasVisited:', hasVisited);
    
    if (!hasVisited) {
        sessionStorage.setItem('hasVisited', 'true');
        console.log('✅ First visit detected - starting auto scroll');
        
        setTimeout(() => {
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const maxScroll = documentHeight - windowHeight;
            
            console.log('📏 Document height:', documentHeight);
            console.log('📐 Window height:', windowHeight);
            console.log('📊 Max scroll:', maxScroll);
            
            const scrollSpeed = 1;
            const targetScroll = maxScroll * 0.9;
            let currentScroll = window.pageYOffset;
            let isScrolling = true;
            let animationFrameId = null;
            
            console.log('🎯 Target scroll position:', targetScroll);
            console.log('🚀 Starting gradual auto scroll...');
            
            function stopAutoScroll() {
                if (isScrolling) {
                    isScrolling = false;
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                    }
                    console.log('⏹️ Auto scroll stopped by user interaction');
                    
                    document.removeEventListener('click', stopAutoScroll);
                    document.removeEventListener('touchstart', stopAutoScroll);
                    document.removeEventListener('wheel', stopAutoScroll);
                    document.removeEventListener('keydown', stopAutoScroll);
                }
            }
            
            document.addEventListener('click', stopAutoScroll, { once: true });
            document.addEventListener('touchstart', stopAutoScroll, { once: true });
            document.addEventListener('wheel', stopAutoScroll, { once: true });
            document.addEventListener('keydown', stopAutoScroll, { once: true });
            
            function gradualScroll() {
                if (!isScrolling) return;
                
                currentScroll += scrollSpeed;
                
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
                
                animationFrameId = requestAnimationFrame(gradualScroll);
            }
            
            requestAnimationFrame(gradualScroll);
        }, 2000);
    } else {
        console.log('⏭️ Not first visit - skipping auto scroll');
    }
}

window.addEventListener('load', () => {
    console.log('🌐 Page loaded - initializing auto scroll');
    autoScrollOnFirstVisit();
});
