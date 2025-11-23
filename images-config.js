// Cấu hình tất cả ảnh cho website cưới
// Thay đổi URL ảnh tại đây để cập nhật toàn bộ website

const WEDDING_IMAGES = {
    // Hero Section
    hero: {
        main: "https://lh3.google.com/u/0/d/1WHktLWG89cNbtMGv8XGf9j5cn7jL0MKQ=w1920-h946-iv1?auditContext=thumbnail&auditContext=prefetch"
    },

    // Couple Section
    couple: {
        main: "https://lh3.google.com/u/0/d/1NG1pouRgQW0AmYL_FFvLJ58iLcvdlICM=w3000-h6501-iv1?auditContext=thumbnail&auditContext=forDisplay"
    },

    // Love Story Section
    story: {
        main: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/33108cfa-eebb-49f7-8d94-da847ff81905.jpeg",
        decorationIcon: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/4f9cc258-948c-4b45-b2fb-9075905dc57f.png"
    },

    // Dearest Section
    dearest: {
        main: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/0d2f9d57-3461-444b-87c6-0d8f3c4489de.jpeg",
        small: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/d8c117d7-51aa-43ad-b616-c511c746f362.jpeg"
    },

    // Wedding Info Section
    info: {
        main: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/96624014-6e8e-4df2-9577-6b87fc0dda7f.jpeg",
        small: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/3e9b5d30-32ba-4034-9952-6ec02489ad24.jpeg"
    },

    // Perfect Section (with calendar)
    perfect: {
        background: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/048c66b5-b4e1-462e-b8df-9651d9d5a361.jpeg",
        heartIcon: "https://cdn.cinelove.me/assets/plugins/calen_heart_1.png"
    },

    // Gallery Section
    gallery: {
        photo1: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/bce43835-1a2e-4d3c-a1b4-5d2830c9a25c.jpeg",
        photo2: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/adf5f081-6d66-429e-921b-a8f9832940cb.jpeg",
        photo3: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/4990d53a-c8e0-47b6-8ccc-4efca542bc32.jpeg"
    },

    // Sunshine Section
    sunshine: {
        main: "https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/c47cf001-2170-4c33-923a-82f6e8b117f0.jpeg"
    },

    // QR Code - Mừng cưới (Local files)
    qrCode: {
        groom: "images/qr-groom.jpg",
        bride: "images/qr-bride.jpg"
    },

    // Audio control icon
    audio: {
        icon: "https://cdn.cinelove.me/assets/audio-1.png"
    }
};

// Hàm để load ảnh vào các element
function loadWeddingImages() {
    // Hero
    const heroImg = document.querySelector('.hero-full .hero-img');
    if (heroImg) heroImg.src = WEDDING_IMAGES.hero.main;

    // Couple
    const coupleImg = document.querySelector('.photo-frame img');
    if (coupleImg) coupleImg.src = WEDDING_IMAGES.couple.main;

    // Story
    const storyImg = document.querySelector('.story-photo img');
    if (storyImg) storyImg.src = WEDDING_IMAGES.story.main;
    
    const decorationIcons = document.querySelectorAll('.invitation-icon');
    decorationIcons.forEach(icon => {
        icon.src = WEDDING_IMAGES.story.decorationIcon;
    });

    // Dearest
    const dearestMainImg = document.querySelector('.dearest-main-photo');
    if (dearestMainImg) dearestMainImg.src = WEDDING_IMAGES.dearest.main;
    
    const dearestSmallImg = document.querySelector('.dearest-small-photo');
    if (dearestSmallImg) dearestSmallImg.src = WEDDING_IMAGES.dearest.small;

    // Info
    const infoMainImg = document.querySelector('.info-photo-main img');
    if (infoMainImg) infoMainImg.src = WEDDING_IMAGES.info.main;
    
    const infoSmallImg = document.querySelector('.info-photo-small img');
    if (infoSmallImg) infoSmallImg.src = WEDDING_IMAGES.info.small;

    // Perfect
    const perfectBg = document.querySelector('.perfect-bg-img');
    if (perfectBg) perfectBg.src = WEDDING_IMAGES.perfect.background;
    
    const heartIcon = document.querySelector('.heart-date');
    if (heartIcon) heartIcon.src = WEDDING_IMAGES.perfect.heartIcon;

    // Gallery
    const galleryPhotos = document.querySelectorAll('.gallery-small-photo img');
    if (galleryPhotos[0]) galleryPhotos[0].src = WEDDING_IMAGES.gallery.photo1;
    if (galleryPhotos[1]) galleryPhotos[1].src = WEDDING_IMAGES.gallery.photo2;
    
    const galleryBottomImg = document.querySelector('.gallery-bottom-photo img');
    if (galleryBottomImg) galleryBottomImg.src = WEDDING_IMAGES.gallery.photo3;

    // Sunshine
    const sunshineImg = document.querySelector('.couple-photo img');
    if (sunshineImg) sunshineImg.src = WEDDING_IMAGES.sunshine.main;

    // QR Codes
    const qrGroomImg = document.querySelector('.account-box:nth-child(1) .account-qr-image');
    if (qrGroomImg) qrGroomImg.src = WEDDING_IMAGES.qrCode.groom;
    
    const qrBrideImg = document.querySelector('.account-box:nth-child(2) .account-qr-image');
    if (qrBrideImg) qrBrideImg.src = WEDDING_IMAGES.qrCode.bride;

    // Audio icon
    const audioIcon = document.querySelector('.music-icon');
    if (audioIcon) audioIcon.src = WEDDING_IMAGES.audio.icon;
}

// Auto-load images khi trang load xong
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWeddingImages);
} else {
    loadWeddingImages();
}
