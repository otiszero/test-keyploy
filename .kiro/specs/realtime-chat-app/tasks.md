# Implementation Plan: Realtime Chat App

## Overview

Triển khai ứng dụng chat realtime với NestJS backend, ReactJS frontend và PostgreSQL database. Implementation sẽ được chia thành các phase: setup, authentication, user profile, chat functionality và integration.

## Tasks

- [x] 1. Setup project structure và database
  - [x] 1.1 Khởi tạo NestJS backend project
    - Tạo NestJS project với CLI
    - Cài đặt dependencies: @nestjs/websockets, @nestjs/platform-socket.io, @prisma/client, bcrypt, @nestjs/jwt, @nestjs/passport, passport-jwt, class-validator, class-transformer
    - Cấu hình environment variables
    - _Requirements: 10.1, 10.2_
  
  - [x] 1.2 Setup Prisma và database schema
    - Khởi tạo Prisma với PostgreSQL
    - Tạo schema cho User, Message, PasswordResetToken
    - Chạy migration
    - _Requirements: 1.1, 7.1_
  
  - [x] 1.3 Khởi tạo ReactJS frontend project
    - Tạo React project với Vite
    - Cài đặt dependencies: socket.io-client, axios, react-router-dom, react-hot-toast
    - Setup project structure (components, contexts, services, pages)
    - _Requirements: 9.1_

- [x] 2. Implement Authentication Module
  - [x] 2.1 Tạo Auth module với DTOs và validation
    - Tạo RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto
    - Implement validation với class-validator
    - _Requirements: 1.3, 1.4, 4.3_
  
  - [x] 2.2 Implement AuthService - Register
    - Hash password với bcrypt (salt rounds = 10)
    - Check duplicate email
    - Create user trong database
    - _Requirements: 1.1, 1.2, 1.5, 10.1_
  
  - [ ]* 2.3 Write property test cho password hashing
    - **Property 4: Password hashing**
    - **Validates: Requirements 1.5, 4.4, 10.1**
  
  - [x] 2.4 Implement AuthService - Login
    - Verify credentials
    - Generate JWT token với 24h expiry
    - _Requirements: 2.1, 2.2, 2.3, 10.2_
  
  - [ ]* 2.5 Write property test cho login round-trip
    - **Property 5: Login round-trip**
    - **Validates: Requirements 2.1**
  
  - [x] 2.6 Implement JWT Strategy và Guard
    - Tạo JwtStrategy với passport-jwt
    - Tạo JwtAuthGuard
    - _Requirements: 10.2, 10.3_
  
  - [x] 2.7 Implement AuthService - Forgot Password
    - Generate reset token
    - Save token với expiry 1 hour
    - (Email sending sẽ được mock trong MVP)
    - _Requirements: 3.1, 3.2_
  
  - [x] 2.8 Implement AuthService - Reset Password
    - Verify token validity và expiry
    - Update password và invalidate token
    - _Requirements: 3.3, 3.4, 3.5_
  
  - [ ]* 2.9 Write property test cho reset token single-use
    - **Property 7: Reset token single-use**
    - **Validates: Requirements 3.5**
  
  - [x] 2.10 Implement AuthService - Change Password
    - Verify current password
    - Update với new hashed password
    - _Requirements: 4.1, 4.2, 4.4_
  
  - [x] 2.11 Tạo AuthController với tất cả endpoints
    - POST /auth/register
    - POST /auth/login
    - POST /auth/forgot-password
    - POST /auth/reset-password
    - POST /auth/change-password (protected)
    - _Requirements: 1.1, 2.1, 3.1, 3.3, 4.1_

- [x] 3. Checkpoint - Auth module tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement User Profile Module
  - [x] 4.1 Tạo User module với DTOs
    - Tạo UserProfileDto, UpdateProfileDto
    - Implement validation cho displayName
    - _Requirements: 5.1, 5.3_
  
  - [x] 4.2 Implement UserService
    - getProfile: trả về user info
    - updateProfile: update displayName
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 4.3 Write property test cho profile operations
    - **Property 9: Profile retrieval**
    - **Property 10: Profile update with valid displayName**
    - **Property 11: Empty displayName rejection**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  
  - [x] 4.4 Tạo UserController
    - GET /users/profile (protected)
    - PATCH /users/profile (protected)
    - _Requirements: 5.1, 5.2_

- [x] 5. Implement Chat Module và WebSocket Gateway
  - [x] 5.1 Tạo Chat module với DTOs
    - Tạo SendMessageDto, MessageDto
    - Implement validation cho message content (1-1000 chars, non-whitespace)
    - _Requirements: 7.2, 7.4_
  
  - [x] 5.2 Implement ChatService
    - createMessage: save message với sender info
    - getRecentMessages: lấy N tin nhắn gần nhất
    - _Requirements: 7.1, 7.3, 8.3_
  
  - [ ]* 5.3 Write property test cho message operations
    - **Property 14: Valid message is saved and broadcast**
    - **Property 15: Invalid message content rejection**
    - **Property 16: Message metadata**
    - **Property 17: Recent messages retrieval**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 8.3**
  
  - [x] 5.4 Implement WebSocket Gateway
    - handleConnection: verify JWT và accept/reject
    - handleDisconnect: cleanup
    - handleSendMessage: validate, save, broadcast
    - _Requirements: 6.1, 6.2, 6.3, 7.1, 8.1_
  
  - [ ]* 5.5 Write property test cho WebSocket authentication
    - **Property 12: WebSocket connection with valid JWT**
    - **Property 13: WebSocket connection with invalid JWT**
    - **Validates: Requirements 6.2, 6.3, 10.3**

- [x] 6. Checkpoint - Backend complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement Frontend - Auth
  - [x] 7.1 Tạo API service
    - Setup axios instance với base URL
    - Implement interceptors cho JWT token
    - Tạo auth API functions (register, login, forgotPassword, resetPassword, changePassword)
    - _Requirements: 2.4_
  
  - [x] 7.2 Tạo AuthContext
    - Manage user state và isAuthenticated
    - Implement login, register, logout functions
    - Persist token trong localStorage
    - _Requirements: 2.4_
  
  - [x] 7.3 Tạo Auth components
    - LoginForm với email/password inputs
    - RegisterForm với email/password/displayName inputs
    - ForgotPasswordForm
    - ResetPasswordForm
    - _Requirements: 1.1, 2.1, 3.1, 3.3_
  
  - [x] 7.4 Tạo Auth pages và routing
    - LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
    - Protected route wrapper
    - _Requirements: 2.1, 10.3_

- [x] 8. Implement Frontend - Profile
  - [x] 8.1 Tạo ProfileForm component
    - Hiển thị email (read-only)
    - Input cho displayName
    - Change password section
    - _Requirements: 5.1, 5.2, 5.4, 4.1_
  
  - [x] 8.2 Tạo ProfilePage
    - Fetch và display profile
    - Handle update profile
    - Handle change password
    - _Requirements: 5.1, 5.2, 4.1_

- [x] 9. Implement Frontend - Chat
  - [x] 9.1 Tạo SocketContext
    - Manage socket connection
    - Connect với JWT token
    - Handle reconnection logic
    - Manage messages state
    - _Requirements: 6.1, 6.4, 6.5_
  
  - [x] 9.2 Tạo Chat components
    - ChatContainer: main chat wrapper
    - MessageList: hiển thị danh sách tin nhắn
    - MessageItem: hiển thị single message với sender info và timestamp
    - MessageInput: input field với Enter to send
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 9.3 Tạo ChatPage
    - Load recent messages on mount
    - Real-time message updates
    - Auto-scroll on new messages
    - _Requirements: 8.2, 8.3, 9.1, 9.2_

- [x] 10. Integration và Polish
  - [x] 10.1 Wire all components together
    - Setup React Router với all pages
    - Implement navigation
    - Add toast notifications cho errors/success
    - _Requirements: All_
  
  - [x] 10.2 Error handling và edge cases
    - Handle network errors
    - Handle token expiry
    - Handle WebSocket disconnection
    - _Requirements: 10.3, 10.5_

- [x] 11. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional và có thể skip cho faster MVP
- Mỗi task reference specific requirements để traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples và edge cases
- Backend sẽ được hoàn thành trước frontend để có API stable
