# 📸 HƯỚNG DẪN THAY ĐỔI ẢNH

## Cách thay đổi ảnh trên website

Tất cả ảnh đã được tập trung vào file **`images-config.js`** để dễ dàng quản lý và thay thế.

### 🎯 Cách thay đổi:

1. **Mở file `images-config.js`**

2. **Tìm phần ảnh cần thay đổi** (ví dụ):
   ```javascript
   hero: {
       main: "URL_ẢNH_CŨ"
   }
   ```

3. **Thay URL mới**:
   ```javascript
   hero: {
       main: "URL_ẢNH_MỚI_CỦA_BẠN"
   }
   ```

4. **Lưu file** và refresh trình duyệt → Ảnh tự động cập nhật!

---

## 📋 Danh sách các phần ảnh:

### 1. **Hero Section** (Ảnh đầu trang)
```javascript
hero: {
    main: "..."  // Ảnh nền hero chính
}
```

### 2. **Couple Section** (Cô dâu chú rể)
```javascript
couple: {
    main: "..."  // Ảnh couple với overlay text
}
```

### 3. **Love Story Section**
```javascript
story: {
    main: "...",           // Ảnh love story
    decorationIcon: "..."  // Icon trang trí
}
```

### 4. **Dearest Section**
```javascript
dearest: {
    main: "...",   // Ảnh lớn
    small: "..."   // Ảnh nhỏ bên cạnh
}
```

### 5. **Wedding Info Section**
```javascript
info: {
    main: "...",   // Ảnh lớn
    small: "..."   // Ảnh nhỏ
}
```

### 6. **Perfect Section** (Lịch)
```javascript
perfect: {
    background: "...",  // Ảnh nền phần lịch
    heartIcon: "..."    // Icon trái tim ngày cưới
}
```

### 7. **Gallery Section** (3 ảnh)
```javascript
gallery: {
    photo1: "...",  // Ảnh nhỏ thứ 1
    photo2: "...",  // Ảnh nhỏ thứ 2
    photo3: "..."   // Ảnh lớn dưới cùng
}
```

### 8. **Sunshine Section**
```javascript
sunshine: {
    main: "..."  // Ảnh "You are my Sunshine"
}
```

### 9. **QR Code - Mừng cưới** ⚠️ Quan trọng!
```javascript
qrCode: {
    groom: "images/qr-groom.jpg",  // QR code chú rể
    bride: "images/qr-bride.jpg"   // QR code cô dâu
}
```

**Lưu ý**: File QR code là file local, đặt trong thư mục `images/`

### 10. **Audio Icon**
```javascript
audio: {
    icon: "..."  // Icon nút phát nhạc
}
```

---

## 💡 Mẹo sử dụng:

### Sử dụng ảnh từ URL online:
```javascript
main: "https://example.com/your-image.jpg"
```

### Sử dụng ảnh local (trong thư mục `images/`):
```javascript
main: "images/your-photo.jpg"
```

### Đổi tất cả ảnh cùng lúc:
- Chỉ cần sửa trong file `images-config.js`
- Không cần sửa file `index.html`
- Tất cả ảnh tự động cập nhật!

---

## 🚀 Workflow thay ảnh:

1. **Upload ảnh mới** lên hosting (hoặc đặt vào thư mục `images/`)
2. **Copy URL** của ảnh
3. **Mở `images-config.js`**
4. **Paste URL** vào đúng vị trí
5. **Lưu file** → **Refresh trình duyệt** → **Xong!** ✅

---

## ⚠️ Lưu ý quan trọng:

- **QR Code**: Nhớ tạo và đặt 2 file `qr-groom.jpg` và `qr-bride.jpg` vào thư mục `images/`
- **Tỷ lệ ảnh**: Giữ tỷ lệ ảnh phù hợp để tránh méo
- **Kích thước**: Nên tối ưu ảnh trước khi upload (không quá 2MB/ảnh)
- **Format**: Khuyến nghị JPEG cho ảnh, PNG cho icon

---

## 📁 Cấu trúc thư mục:

```
thiepcuoi/
├── index.html
├── styles.css
├── script.js
├── images-config.js  ← File cấu hình ảnh (QUAN TRỌNG!)
├── images/
│   ├── qr-groom.jpg  ← Thêm file này
│   └── qr-bride.jpg  ← Thêm file này
└── api/
    └── messages.js
```

---

**Chúc bạn thành công! 🎉**
