# Terminal Commands Log

This file contains the distinct terminal commands executed during the implementation of the Admin Contact Messages feature.

## 1. Test Verification Message
Used to send a test POST request to the contact API to verify backend functionality.
```bash
curl -X POST http://localhost:5001/api/contact -H "Content-Type: application/json" -d '{"name": "Verification User", "email": "verify@example.com", "company": "Verify Corp", "message": "This is a verification message."}'
```
*(Note: Port may vary based on where the server is running)*

## 2. Start Development Server
Standard command to start the development server.
```bash
npm run dev
```

## 3. Start Development Server with Environment Variables
This command loads variables from `.env` before starting the server, which is required because `tsx` does not auto-load `.env` files.
```bash
export $(grep -v '^#' .env | xargs) && npm run dev
```

## 4. Start Development Server on Custom Port
Runs the server on port 5002 to avoid conflicts (e.g., if port 5000 is in use) while also loading environment variables.
```bash
export $(grep -v '^#' .env | xargs) && PORT=5002 npm run dev
```

## 5. Check Git Status
Checks the state of the working directory and staging area.
```bash
git status
```

## 6. Stage All Changes
Stages all modified and new files for the commit.
```bash
git add .
```

## 7. Commit Changes
Captures the snapshot of the project's currently staged changes with a descriptive message.
```bash
git commit -m "feat: implement admin access to contact messages and media selection"
```

## 8. Authentication & RBAC Verification through Curl

### Register Admin & Create Post (Immediate Publish)
```bash
# Register Admin
curl -v -c admin_cookies.txt -X POST http://localhost:5002/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password", "role": "admin"}'

# Create Published Post (Admin)
curl -v -b admin_cookies.txt -X POST http://localhost:5002/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Admin Post", "slug": "admin-post", "summary": "Admin summary", "content": "Admin content", "coverImage": "http://img.com", "isPublished": true}'
```

### Register User & Create Post (Forced Draft)
```bash
# Register User
curl -v -c user_cookies.txt -X POST http://localhost:5002/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "password", "role": "user"}'

# Create Post (User - will be Draft)
curl -v -b user_cookies.txt -X POST http://localhost:5002/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "User Post", "slug": "user-post", "summary": "User summary", "content": "User content", "coverImage": "http://img.com", "isPublished": true}'
```

### Password Change Verification
```bash
# Login
curl -v -c user_new_cookies.txt -X POST http://localhost:5002/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "password"}'

# Change Password
curl -v -b user_new_cookies.txt -X POST http://localhost:5002/api/user/password \
  -H "Content-Type: application/json" \
  -d '{"currentPassword": "password", "newPassword": "newpassword"}'
```

