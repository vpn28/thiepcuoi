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

// RSVP Form
const rsvpForm = document.getElementById('rsvpForm');
rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(rsvpForm);
    const name = formData.get('name') || rsvpForm.querySelector('input[type="text"]').value;
    alert(`Cảm ơn ${name} đã xác nhận tham dự!`);
    rsvpForm.reset();
});

// Wish Button
const btnWish = document.getElementById('btnWish');
const wishInput = document.getElementById('wishInput');
const guestbook = document.getElementById('guestbook');

btnWish.addEventListener('click', () => {
    const wish = wishInput.value.trim();
    if (wish) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'guest-message';
        messageDiv.innerHTML = `
            <h4>Bạn:</h4>
            <p>${wish}</p>
        `;
        guestbook.insertBefore(messageDiv, guestbook.firstChild);
        wishInput.value = '';
    }
});

// Gift Button
const btnGift = document.getElementById('btnGift');
const giftCount = document.getElementById('giftCount');

btnGift.addEventListener('click', () => {
    let count = parseInt(giftCount.textContent);
    count++;
    giftCount.textContent = count;
    
    btnGift.style.transform = 'scale(1.2)';
    setTimeout(() => {
        btnGift.style.transform = 'scale(1)';
    }, 200);
});

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
