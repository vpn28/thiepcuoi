# Hướng dẫn Deploy với Vercel Blob Storage

## Bước 1: Cài đặt Dependencies

```bash
npm install
```

Hoặc nếu chưa có npm, cài Node.js trước: https://nodejs.org/

## Bước 2: Tạo tài khoản Vercel

1. Truy cập: https://vercel.com/signup
2. Đăng ký bằng GitHub
3. Kết nối repository

## Bước 3: Cài đặt Vercel CLI

```bash
npm install -g vercel
```

## Bước 4: Login vào Vercel

```bash
vercel login
```

## Bước 5: Tạo Blob Store

1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project của bạn
3. Vào tab **Storage**
4. Click **Create Database**
5. Chọn **Blob**
6. Đặt tên: `wedding-messages`
7. Click **Create**

## Bước 6: Lấy Environment Variables

Sau khi tạo Blob Store, Vercel sẽ tự động thêm biến môi trường:
- `BLOB_READ_WRITE_TOKEN`

Bạn không cần làm gì thêm, Vercel tự động inject vào API routes.

## Bước 7: Deploy lên Vercel

### Cách 1: Qua CLI
```bash
vercel
```

Sau đó deploy production:
```bash
vercel --prod
```

### Cách 2: Qua GitHub (Tự động)
1. Push code lên GitHub
2. Vercel tự động deploy mỗi khi có commit mới
3. Branch `main` sẽ deploy lên production

## Bước 8: Kiểm tra

Sau khi deploy:
1. Mở website: `https://your-project.vercel.app`
2. Thử gửi lời chúc
3. Refresh trang → lời chúc vẫn còn (lưu trên cloud)
4. Mở tab mới → lời chúc hiển thị (shared giữa users)

## Cấu trúc Files

```
thiepcuoi/
├── api/
│   └── messages.js       # API endpoint cho Blob Storage
├── index.html            # Trang chính
├── styles.css            # CSS
├── script.js             # JavaScript (đã update)
├── package.json          # Dependencies
├── vercel.json           # Vercel config
└── .gitignore            # Git ignore
```

## API Endpoints

### GET /api/messages
Lấy tất cả lời chúc
```javascript
fetch('/api/messages')
  .then(res => res.json())
  .then(messages => console.log(messages));
```

### POST /api/messages
Thêm lời chúc mới
```javascript
fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Tên',
    count: '2',
    attend: 'yes',
    message: 'Lời chúc...'
  })
});
```

## Giám sát Blob Storage

1. Vào Vercel Dashboard
2. Chọn project
3. Tab **Storage** → **Blob**
4. Xem tất cả files đã lưu
5. Có thể download hoặc xóa từng file

## Chi phí

- **Free tier**: 
  - 100,000 requests/month
  - 500MB storage
  - Đủ cho hàng trăm lời chúc

## Troubleshooting

### Lỗi: "BLOB_READ_WRITE_TOKEN is not defined"
→ Tạo Blob Store trong Vercel Dashboard

### Lỗi: "Failed to save message"
→ Kiểm tra Console logs
→ Verify API endpoint: `/api/messages`

### Messages không hiển thị
→ Mở Console (F12)
→ Check API response
→ Verify Blob Store đã được tạo

## Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally with Vercel dev server
vercel dev
```

Website sẽ chạy tại: http://localhost:3000

## Backup Messages

Vẫn có thể export backup từ Console:
```javascript
exportMessagesToJSON()
```

File sẽ download về máy làm backup.
