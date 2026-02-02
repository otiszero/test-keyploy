# Hướng dẫn sử dụng Keploy cho Realtime Chat Backend

## Yêu cầu
- Docker Desktop 4.25+ (đã cài)
- Keploy CLI (đã cài - version 3.3.9)

## Trạng thái hiện tại
✅ Docker network `keploy-network` đã tạo
✅ Backend image đã build thành công
✅ PostgreSQL + Backend đang chạy
✅ API hoạt động tại http://localhost:5000

## Cách sử dụng

### 1. Dừng backend hiện tại (để Keploy quản lý)
```bash
docker compose -f docker-compose.keploy.yml down
```

### 2. Chạy Keploy Record Mode (cần sudo trên macOS)
```bash
# Đảm bảo postgres đang chạy
docker compose -f docker-compose.keploy.yml up -d postgres

# Chờ postgres healthy
sleep 10

# Chạy Keploy record (cần nhập password sudo)
sudo keploy record -c "docker compose -f docker-compose.keploy.yml up backend" \
  --container-name "side-keploy-fullstack-backend-1" \
  --network "keploy-network" \
  --buildDelay 30
```

### 3. Gọi API để record test cases
Trong terminal khác, chạy:
```bash
./keploy-api-samples.sh
```

Hoặc gọi API thủ công:
```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123456", "displayName": "Test User"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123456"}'
```

### 4. Dừng recording
Nhấn `Ctrl+C` trong terminal đang chạy Keploy

### 5. Chạy Test Mode
```bash
# Đảm bảo postgres đang chạy
docker compose -f docker-compose.keploy.yml up -d postgres
sleep 10

# Chạy tests
sudo keploy test -c "docker compose -f docker-compose.keploy.yml up backend" \
  --container-name "side-keploy-fullstack-backend-1" \
  --network "keploy-network" \
  --delay 10 \
  --buildDelay 30
```

## Cấu trúc thư mục sau khi record
```
keploy/
├── test-set-0/
│   ├── tests/
│   │   ├── test-1.yaml    # Register API
│   │   ├── test-2.yaml    # Login API
│   │   └── ...
│   └── mocks/
│       ├── mock-1.yaml    # Database mocks
│       └── ...
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /auth/register | Đăng ký user |
| POST | /auth/login | Đăng nhập |
| GET | /users/profile | Lấy profile (cần token) |
| PATCH | /users/profile | Cập nhật profile (cần token) |
| POST | /auth/change-password | Đổi mật khẩu (cần token) |

## Script tiện ích
- `./keploy-test.sh record` - Bắt đầu recording
- `./keploy-test.sh test` - Chạy tests
- `./keploy-test.sh clean` - Xóa test data

## Lưu ý quan trọng
1. **macOS cần sudo**: Keploy sử dụng eBPF qua Docker, cần quyền root
2. **Database state**: Mỗi lần test, database sẽ được reset về trạng thái ban đầu nhờ mocks
3. **WebSocket**: Keploy chủ yếu test REST API, WebSocket cần test riêng

## Troubleshooting

### Lỗi "address already in use"
```bash
# Tìm process đang dùng port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Lỗi Prisma
Backend đã được cấu hình với Prisma 5.22.0 và OpenSSL, không cần thêm gì.

### Xem logs
```bash
docker compose -f docker-compose.keploy.yml logs -f backend
```
