# Hướng dẫn Deploy Vercel qua GitHub (Không cần CLI)

## ⚠️ Lỗi SSL với Vercel CLI?
Nếu bạn gặp lỗi "self-signed certificate" → Deploy qua GitHub đơn giản hơn!

## Bước 1: Push code lên GitHub

### 1.1 Tạo Repository trên GitHub
1. Vào https://github.com/new
2. Đặt tên: `thiepcuoi`
3. Để **Public** hoặc **Private**
4. Không cần README, .gitignore (đã có)
5. Click **Create repository**

### 1.2 Push code lên GitHub
```powershell
# Init git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - Wedding invitation"

# Add remote (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/thiepcuoi.git

# Push lên GitHub
git push -u origin main
```

Nếu branch là `master` thay vì `main`:
```powershell
git branch -M main
git push -u origin main
```

## Bước 2: Kết nối Vercel với GitHub

### 2.1 Đăng ký Vercel bằng GitHub
1. Vào https://vercel.com/signup
2. Click **Continue with GitHub**
3. Authorize Vercel
4. Login thành công ✅

### 2.2 Import Project
1. Vào Dashboard: https://vercel.com/new
2. Click **Import Git Repository**
3. Chọn repository `thiepcuoi`
4. Click **Import**

### 2.3 Configure Project
- **Framework Preset**: Other (hoặc để trống)
- **Root Directory**: `./`
- **Build Command**: Để trống
- **Output Directory**: Để trống
- Click **Deploy**

## Bước 3: Tạo Blob Storage

### 3.1 Sau khi deploy xong
1. Vào project dashboard
2. Tab **Storage**
3. Click **Create Database**
4. Chọn **Blob**
5. Tên: `vanquynh`
6. Click **Create**

### 3.2 Vercel tự động thêm Environment Variables
Không cần làm gì thêm, Vercel tự inject `BLOB_READ_WRITE_TOKEN`

### 3.3 Redeploy để áp dụng
1. Tab **Deployments**
2. Click **...** ở deployment mới nhất
3. Click **Redeploy**
4. Đợi vài giây → Done! ✅

## Bước 4: Test Website

1. Click **Visit** để mở website
2. URL dạng: `https://thiepcuoi-xxx.vercel.app`
3. Thử gửi lời chúc
4. Refresh trang → lời chúc vẫn còn
5. Mở tab mới → lời chúc vẫn hiển thị ✅

## Tự động Deploy khi có thay đổi

Từ giờ, mỗi khi bạn push code lên GitHub:
```powershell
git add .
git commit -m "Update..."
git push
```

→ Vercel **tự động deploy** trong vài giây!

## Custom Domain (Optional)

### Nếu có domain riêng:
1. Tab **Settings** → **Domains**
2. Nhập domain: `thiepcuoi.com`
3. Follow hướng dẫn add DNS records
4. Đợi vài phút → Domain active ✅

### Nếu chưa có domain:
Dùng domain free của Vercel: `https://your-project.vercel.app`

## Troubleshooting

### Push lên GitHub bị lỗi
```powershell
# Config git user (nếu chưa có)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Thử push lại
git push -u origin main
```

### GitHub yêu cầu Personal Access Token
1. Vào https://github.com/settings/tokens
2. **Generate new token (classic)**
3. Chọn scopes: `repo`
4. Copy token
5. Khi push, dùng token làm password

### Vercel không thấy repository
1. Vào https://vercel.com/account/settings/git
2. Click **Adjust GitHub App Permissions**
3. Grant access cho repository

## Ưu điểm deploy qua GitHub

✅ Không cần CLI  
✅ Không gặp lỗi SSL/proxy  
✅ Tự động deploy khi push  
✅ Có version history  
✅ Rollback dễ dàng  
✅ Collaboration friendly  

## Monitoring

### Xem logs:
1. Project Dashboard
2. Tab **Deployments**
3. Click deployment → **View Function Logs**

### Xem Blob Storage:
1. Tab **Storage** → **Blob**
2. Xem tất cả messages đã lưu

---

**Kết luận**: Deploy qua GitHub đơn giản hơn và tránh được lỗi SSL của CLI! 🎉
