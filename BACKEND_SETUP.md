# CleanCycle Backend Setup Guide

## 🚀 Complete Backend Implementation

This backend provides a comprehensive API for the CleanCycle waste management application with the following features:

### 📋 Features Implemented

1. **Authentication & Authorization**
   - JWT-based authentication with refresh tokens
   - Role-based access control (User/Admin)
   - Protected routes and middleware
   - Password hashing with bcrypt

2. **User Management**
   - User registration and login
   - Profile management
   - Admin user management
   - User statistics and activity tracking

3. **Schedule Management**
   - Create, read, update, delete waste pickup schedules
   - Support for different waste types
   - Recurring schedules
   - Status tracking (scheduled, in-progress, completed, etc.)

4. **Issue Reporting**
   - Report waste management issues
   - Issue tracking and resolution
   - Comment system
   - Priority and status management

5. **Notifications**
   - Admin-to-user notifications
   - Multiple delivery channels (in-app, email, SMS, push)
   - Notification targeting and scheduling
   - Read/delivery tracking

6. **Pickup History**
   - Detailed pickup records
   - Environmental impact tracking
   - Quality and efficiency metrics
   - Cost tracking and analytics

7. **Analytics**
   - Comprehensive statistics
   - Performance metrics
   - Environmental impact data
   - User activity analytics

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

The backend requires these additional dependencies that have been added to package.json:

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "multer": "^1.4.5-lts.1",
    "validator": "^13.11.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/mongoose": "^5.11.97",
    "@types/multer": "^1.4.12",
    "@types/validator": "^13.11.7"
  }
}
```

### 2. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Required - Change these values
MONGODB_URI=mongodb://localhost:27017/cleancycle
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-minimum-32-characters

# Optional - Defaults provided
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

## 📊 MongoDB Setup

### Option 1: Local MongoDB Installation

#### For macOS (using Homebrew):
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify installation
mongosh
```

#### For Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install the .msi file
3. Start MongoDB service from Services panel
4. Use MongoDB Compass (GUI) or mongosh (CLI)

#### For Linux (Ubuntu/Debian):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**: Go to https://www.mongodb.com/atlas and sign up
2. **Create Cluster**: 
   - Choose "Build a Database"
   - Select "Free" tier (M0 Sandbox)
   - Choose your cloud provider and region
   - Create cluster

3. **Setup Database Access**:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username/password
   - Set role to "Read and write to any database"

4. **Setup Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - For development: Add `0.0.0.0/0` (allows all IPs)
   - For production: Add your specific IP addresses

5. **Get Connection String**:
   - Go to "Databases" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `cleancycle`

   Example:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleancycle?retryWrites=true&w=majority
   ```

6. **Update .env**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cleancycle?retryWrites=true&w=majority
   ```

### Option 3: Docker MongoDB

```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=cleancycle \
  -v mongodb_data:/data/db \
  mongo:latest

# Update .env
MONGODB_URI=mongodb://admin:password@localhost:27017/cleancycle?authSource=admin
```

## 🔧 Database Schema

The backend includes these MongoDB collections:

1. **users** - User accounts and profiles
2. **schedules** - Waste pickup schedules
3. **issues** - Reported issues and problems
4. **notifications** - System notifications
5. **pickuphistories** - Historical pickup data

All models include:
- Proper validation and constraints
- Indexes for performance
- Relationships between collections
- Virtual fields for computed values
- Middleware for business logic

## 🚀 Running the Backend

### Development Mode:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
npm start
```

### Available Scripts:
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run build:server # Build server only
npm start           # Start production server
npm test            # Run tests
npm run typecheck   # TypeScript type checking
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user
- `POST /logout` - Logout user
- `PUT /update-profile` - Update user profile

### Users (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /stats` - Get user statistics (admin only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (admin only)
- `PUT /:id/status` - Update user status (admin only)
- `GET /:id/activity` - Get user activity

### Schedules (`/api/schedules`)
- `GET /` - Get schedules with filters
- `POST /` - Create new schedule
- `GET /stats` - Get schedule statistics
- `GET /:id` - Get schedule by ID
- `PUT /:id` - Update schedule
- `DELETE /:id` - Delete schedule
- `GET /upcoming` - Get upcoming schedules

### Issues (`/api/issues`)
- `GET /` - Get issues with filters
- `POST /` - Create new issue
- `GET /stats` - Get issue statistics
- `GET /:id` - Get issue by ID
- `PUT /:id` - Update issue
- `DELETE /:id` - Delete issue
- `POST /:id/comments` - Add comment to issue

### Notifications (`/api/notifications`)
- `GET /` - Get notifications
- `POST /` - Create notification (admin only)
- `GET /stats` - Get notification statistics
- `GET /:id` - Get notification by ID
- `PUT /:id` - Update notification
- `DELETE /:id` - Delete notification
- `POST /:id/read` - Mark notification as read

### Pickup History (`/api/pickup-history`)
- `GET /` - Get pickup history with filters
- `POST /` - Create pickup record
- `GET /stats` - Get pickup statistics
- `GET /:id` - Get pickup record by ID
- `PUT /:id` - Update pickup record
- `DELETE /:id` - Delete pickup record

### Analytics (`/api/analytics`)
- `GET /overview` - Get overview analytics
- `GET /waste-types` - Get waste type analytics
- `GET /performance` - Get performance metrics
- `GET /environmental` - Get environmental impact
- `GET /costs` - Get cost analysis

## 🔐 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevents abuse
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Zod schema validation
- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication
- **Role-based Access** - Admin/user permissions
- **Data Sanitization** - Mongoose built-in

## 🧪 Testing the API

Use tools like Postman, Insomnia, or curl to test the API:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🔄 Connecting Frontend to Backend

Update your frontend authentication context to use the backend API:

1. Change the API base URL to `http://localhost:5000/api`
2. Update authentication calls to use JWT tokens
3. Implement proper error handling for API responses
4. Add token refresh logic for expired tokens

Example frontend API client:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = {
  async post(endpoint: string, data: any, token?: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  async get(endpoint: string, token?: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return response.json();
  }
};
```

## 📈 Production Considerations

1. **Environment Variables** - Use secure values for JWT secrets
2. **Database Security** - Enable authentication and use SSL
3. **HTTPS** - Use SSL certificates
4. **Logging** - Implement comprehensive logging
5. **Monitoring** - Add health checks and metrics
6. **Backup** - Regular database backups
7. **Scaling** - Consider load balancing and clustering

## 🆘 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:
   - Check if MongoDB is running
   - Verify connection string in .env
   - Check network access (for Atlas)

2. **JWT Token Issues**:
   - Ensure JWT_SECRET is set and secure
   - Check token expiration settings
   - Verify token format in requests

3. **Port Already in Use**:
   - Change PORT in .env file
   - Kill process using the port: `lsof -ti:5000 | xargs kill`

4. **CORS Errors**:
   - Update CLIENT_URL in .env
   - Check CORS configuration in server

### Debug Mode:
Set `DEBUG_MODE=true` in .env for detailed error logging.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check MongoDB connection and status
4. Verify environment variables are set correctly

The backend is now fully implemented and ready for production use with your CleanCycle frontend application!
