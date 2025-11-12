# Hướng dẫn quản lý lời chúc

## Cách hoạt động

Website sẽ tự động:
1. Đọc lời chúc từ file `messages.json` 
2. Kết hợp với lời chúc trong localStorage (trình duyệt)
3. Hiển thị tất cả lời chúc cho mọi người xem

## Cách xuất file messages.json

### Bước 1: Mở Console trong trình duyệt
- Nhấn `F12` hoặc chuột phải > "Inspect" > Tab "Console"

### Bước 2: Chạy lệnh xuất file
```javascript
exportMessagesToJSON()
```

### Bước 3: File sẽ tự động tải về
- File tên: `messages.json`
- Chứa tất cả lời chúc từ localStorage

### Bước 4: Upload file lên website
- Copy file `messages.json` vào thư mục website
- Thay thế file cũ
- Tất cả người xem sẽ thấy lời chúc mới

## Các lệnh hữu ích trong Console

### Xem tất cả lời chúc:
```javascript
JSON.parse(localStorage.getItem('weddingMessages'))
```

### Xuất file JSON:
```javascript
exportMessagesToJSON()
```

### Xóa tất cả lời chúc (cẩn thận!):
```javascript
localStorage.removeItem('weddingMessages')
location.reload()
```

### Đếm số lượng lời chúc:
```javascript
JSON.parse(localStorage.getItem('weddingMessages')).length
```

## Cấu trúc dữ liệu

Mỗi lời chúc có format:
```json
{
  "name": "Tên người gửi",
  "count": "2",
  "attend": "yes",
  "message": "Lời chúc...",
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

## Lưu ý

- **localStorage**: Chỉ lưu trên máy người dùng, không chia sẻ được
- **messages.json**: Lưu trên server, mọi người đều xem được
- Website tự động merge 2 nguồn dữ liệu
- Cần xuất file định kỳ để cập nhật lời chúc công khai

## Quy trình cập nhật định kỳ

1. Mỗi ngày/tuần mở Console
2. Chạy `exportMessagesToJSON()`
3. Upload file mới lên hosting
4. Mọi người sẽ thấy lời chúc mới nhất
