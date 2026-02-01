# Tài liệu Yêu cầu

## Giới thiệu

Ứng dụng chat realtime đơn giản cho phép người dùng đăng ký, đăng nhập và tham gia trò chuyện trong kênh chat toàn cầu. Hệ thống sử dụng NestJS với WebSocket cho backend, ReactJS cho frontend và PostgreSQL với Prisma ORM cho cơ sở dữ liệu.

## Thuật ngữ

- **Hệ_thống**: Ứng dụng chat realtime bao gồm backend NestJS và frontend ReactJS
- **Người_dùng**: Cá nhân đã đăng ký và xác thực với hệ thống
- **Kênh_toàn_cầu**: Phòng chat duy nhất nơi tất cả người dùng đã xác thực có thể gửi và nhận tin nhắn
- **Tin_nhắn**: Nội dung văn bản được gửi bởi người dùng trong kênh chat
- **WebSocket_Gateway**: Thành phần NestJS xử lý kết nối WebSocket realtime
- **JWT_Token**: JSON Web Token dùng để xác thực người dùng
- **Prisma_Client**: ORM client để tương tác với cơ sở dữ liệu PostgreSQL

## Yêu cầu

### Yêu cầu 1: Đăng ký tài khoản

**User Story:** Là một khách truy cập, tôi muốn đăng ký tài khoản mới, để có thể tham gia chat trong ứng dụng.

#### Tiêu chí chấp nhận

1. KHI người dùng gửi form đăng ký với email và mật khẩu hợp lệ THÌ Hệ_thống PHẢI tạo tài khoản mới và trả về thông báo thành công
2. KHI người dùng gửi email đã tồn tại trong hệ thống THÌ Hệ_thống PHẢI từ chối đăng ký và trả về lỗi "Email đã được sử dụng"
3. KHI người dùng gửi email không đúng định dạng THÌ Hệ_thống PHẢI từ chối đăng ký và trả về lỗi validation
4. KHI người dùng gửi mật khẩu ngắn hơn 8 ký tự THÌ Hệ_thống PHẢI từ chối đăng ký và trả về lỗi validation
5. KHI tài khoản được tạo thành công THÌ Hệ_thống PHẢI mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu

### Yêu cầu 2: Đăng nhập

**User Story:** Là một người dùng đã đăng ký, tôi muốn đăng nhập vào hệ thống, để có thể truy cập các tính năng chat.

#### Tiêu chí chấp nhận

1. KHI người dùng gửi email và mật khẩu đúng THÌ Hệ_thống PHẢI xác thực thành công và trả về JWT_Token
2. KHI người dùng gửi email không tồn tại THÌ Hệ_thống PHẢI từ chối đăng nhập và trả về lỗi "Thông tin đăng nhập không hợp lệ"
3. KHI người dùng gửi mật khẩu sai THÌ Hệ_thống PHẢI từ chối đăng nhập và trả về lỗi "Thông tin đăng nhập không hợp lệ"
4. KHI đăng nhập thành công THÌ Hệ_thống PHẢI lưu JWT_Token vào localStorage của trình duyệt

### Yêu cầu 3: Quên mật khẩu

**User Story:** Là một người dùng đã quên mật khẩu, tôi muốn đặt lại mật khẩu, để có thể truy cập lại tài khoản của mình.

#### Tiêu chí chấp nhận

1. KHI người dùng yêu cầu đặt lại mật khẩu với email hợp lệ THÌ Hệ_thống PHẢI tạo token đặt lại mật khẩu và gửi email hướng dẫn
2. KHI người dùng yêu cầu đặt lại mật khẩu với email không tồn tại THÌ Hệ_thống PHẢI trả về thông báo chung (không tiết lộ email có tồn tại hay không)
3. KHI người dùng sử dụng token đặt lại mật khẩu hợp lệ THÌ Hệ_thống PHẢI cho phép đặt mật khẩu mới
4. KHI token đặt lại mật khẩu đã hết hạn (sau 1 giờ) THÌ Hệ_thống PHẢI từ chối yêu cầu đặt lại mật khẩu
5. KHI mật khẩu mới được đặt thành công THÌ Hệ_thống PHẢI vô hiệu hóa token đặt lại mật khẩu đã sử dụng

### Yêu cầu 4: Đổi mật khẩu

**User Story:** Là một người dùng đã đăng nhập, tôi muốn đổi mật khẩu, để bảo mật tài khoản của mình.

#### Tiêu chí chấp nhận

1. KHI người dùng đã xác thực gửi mật khẩu hiện tại đúng và mật khẩu mới hợp lệ THÌ Hệ_thống PHẢI cập nhật mật khẩu thành công
2. KHI người dùng gửi mật khẩu hiện tại sai THÌ Hệ_thống PHẢI từ chối đổi mật khẩu và trả về lỗi
3. KHI mật khẩu mới ngắn hơn 8 ký tự THÌ Hệ_thống PHẢI từ chối đổi mật khẩu và trả về lỗi validation
4. KHI mật khẩu được đổi thành công THÌ Hệ_thống PHẢI mã hóa mật khẩu mới trước khi lưu

### Yêu cầu 5: Hồ sơ người dùng

**User Story:** Là một người dùng đã đăng nhập, tôi muốn xem và cập nhật hồ sơ cá nhân, để quản lý thông tin của mình.

#### Tiêu chí chấp nhận

1. KHI người dùng đã xác thực truy cập trang hồ sơ THÌ Hệ_thống PHẢI hiển thị thông tin hồ sơ hiện tại (tên hiển thị, email)
2. KHI người dùng cập nhật tên hiển thị THÌ Hệ_thống PHẢI lưu thay đổi và trả về thông báo thành công
3. KHI người dùng gửi tên hiển thị rỗng THÌ Hệ_thống PHẢI từ chối cập nhật và trả về lỗi validation
4. Hệ_thống PHẢI hiển thị email của người dùng ở chế độ chỉ đọc (không cho phép thay đổi)

### Yêu cầu 6: Kết nối WebSocket

**User Story:** Là một người dùng đã đăng nhập, tôi muốn kết nối realtime với server, để có thể nhận và gửi tin nhắn tức thì.

#### Tiêu chí chấp nhận

1. KHI người dùng đã xác thực mở trang chat THÌ Hệ_thống PHẢI thiết lập kết nối WebSocket với JWT_Token
2. KHI kết nối WebSocket được thiết lập với token hợp lệ THÌ WebSocket_Gateway PHẢI xác thực và cho phép kết nối
3. KHI kết nối WebSocket được thiết lập với token không hợp lệ hoặc hết hạn THÌ WebSocket_Gateway PHẢI từ chối kết nối
4. KHI kết nối WebSocket bị ngắt THÌ Hệ_thống PHẢI tự động thử kết nối lại sau 3 giây
5. KHI người dùng đăng xuất THÌ Hệ_thống PHẢI đóng kết nối WebSocket

### Yêu cầu 7: Gửi tin nhắn trong kênh toàn cầu

**User Story:** Là một người dùng đã kết nối, tôi muốn gửi tin nhắn vào kênh toàn cầu, để giao tiếp với những người dùng khác.

#### Tiêu chí chấp nhận

1. KHI người dùng gửi tin nhắn không rỗng THÌ Hệ_thống PHẢI lưu tin nhắn vào cơ sở dữ liệu và phát broadcast đến tất cả người dùng đang kết nối
2. KHI người dùng gửi tin nhắn rỗng hoặc chỉ chứa khoảng trắng THÌ Hệ_thống PHẢI từ chối gửi và không lưu vào cơ sở dữ liệu
3. KHI tin nhắn được gửi thành công THÌ Hệ_thống PHẢI gắn thông tin người gửi (tên hiển thị) và thời gian gửi
4. KHI tin nhắn vượt quá 1000 ký tự THÌ Hệ_thống PHẢI từ chối gửi và trả về lỗi validation

### Yêu cầu 8: Nhận tin nhắn realtime

**User Story:** Là một người dùng đang kết nối, tôi muốn nhận tin nhắn mới ngay lập tức, để theo dõi cuộc trò chuyện.

#### Tiêu chí chấp nhận

1. KHI có tin nhắn mới được gửi trong kênh toàn cầu THÌ Hệ_thống PHẢI phát tin nhắn đến tất cả người dùng đang kết nối trong vòng 1 giây
2. KHI tin nhắn được nhận THÌ Hệ_thống PHẢI hiển thị với thông tin người gửi và thời gian
3. KHI người dùng mở trang chat THÌ Hệ_thống PHẢI tải và hiển thị 50 tin nhắn gần nhất từ cơ sở dữ liệu

### Yêu cầu 9: Hiển thị giao diện chat

**User Story:** Là một người dùng, tôi muốn có giao diện chat trực quan, để dễ dàng đọc và gửi tin nhắn.

#### Tiêu chí chấp nhận

1. Hệ_thống PHẢI hiển thị danh sách tin nhắn với tin nhắn mới nhất ở cuối
2. Hệ_thống PHẢI tự động cuộn xuống khi có tin nhắn mới
3. Hệ_thống PHẢI hiển thị rõ ràng tin nhắn của người dùng hiện tại khác với tin nhắn của người khác
4. KHI người dùng nhấn Enter trong ô nhập tin nhắn THÌ Hệ_thống PHẢI gửi tin nhắn
5. KHI tin nhắn đang được gửi THÌ Hệ_thống PHẢI hiển thị trạng thái loading và vô hiệu hóa nút gửi

### Yêu cầu 10: Bảo mật và xác thực

**User Story:** Là một quản trị viên hệ thống, tôi muốn đảm bảo bảo mật cho ứng dụng, để bảo vệ dữ liệu người dùng.

#### Tiêu chí chấp nhận

1. Hệ_thống PHẢI sử dụng bcrypt để mã hóa mật khẩu với salt rounds tối thiểu là 10
2. Hệ_thống PHẢI sử dụng JWT với thời gian hết hạn 24 giờ cho access token
3. KHI JWT_Token hết hạn THÌ Hệ_thống PHẢI yêu cầu người dùng đăng nhập lại
4. Hệ_thống PHẢI validate tất cả input từ người dùng trước khi xử lý
5. KHI có lỗi xảy ra THÌ Hệ_thống PHẢI ghi log lỗi nhưng không tiết lộ thông tin nhạy cảm cho client
