# IdeaBoard - Two-Part Web Application

A modern, full-stack web application consisting of a marketing landing page and a real-time idea sharing board. Built with Next.js, Node.js, Express, PostgreSQL, and Docker.

## 🚀 Features

### Landing Page
- **Responsive Design**: Beautiful, mobile-first design that works on all devices
- **Hero Section**: Compelling call-to-action with gradient background
- **Features Section**: Highlights key benefits with icons and descriptions
- **Modern UI**: Built with Tailwind CSS for a clean, professional look

### Idea Board App
- **Real-time Updates**: Ideas and upvotes update automatically every 30 seconds
- **Anonymous Sharing**: Users can share ideas without creating accounts
- **Upvoting System**: Community-driven ranking through upvotes
- **Character Limit**: 280-character limit to encourage concise, impactful ideas
- **Live Counter**: Real-time display of total ideas shared

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Features**: Server-side rendering, static generation, responsive design

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **API**: RESTful API with proper error handling

### Database
- **Engine**: PostgreSQL 15
- **Schema**: Simple ideas table with id, text, upvotes, and timestamps
- **Features**: Auto-generated UUIDs, character validation, indexing

### Containerization
- **Docker**: Multi-stage builds for optimized images
- **Docker Compose**: Orchestrates all services with health checks
- **Production Ready**: Optimized for deployment and scaling

## 📋 Prerequisites

- Docker and Docker Compose installed on your system
- Git (for cloning the repository)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assessment-2
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Landing Page: http://localhost:3000
   - Idea Board App: http://localhost:3000/app
   - API Health Check: http://localhost:3001/api/health

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Start PostgreSQL** (using Docker)
   ```bash
   docker run --name idea_board_db -e POSTGRES_DB=idea_board -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

## 🔧 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Returns the API status.

**Response:**
```json
{
  "status": "OK",
  "message": "Idea Board API is running"
}
```

#### Get All Ideas
```http
GET /api/ideas
```
Retrieves all ideas sorted by upvotes (descending) and creation date.

**Response:**
```json
[
  {
    "id": "uuid",
    "text": "Your brilliant idea here",
    "upvotes": 5,
    "created_at": "2024-01-01T12:00:00.000Z"
  }
]
```

#### Create New Idea
```http
POST /api/ideas
Content-Type: application/json

{
  "text": "Your brilliant idea here"
}
```

**Validation:**
- `text` is required
- `text` must be 1-280 characters
- Whitespace is automatically trimmed

**Response:**
```json
{
  "id": "uuid",
  "text": "Your brilliant idea here",
  "upvotes": 0,
  "created_at": "2024-01-01T12:00:00.000Z"
}
```

#### Upvote Idea
```http
POST /api/ideas/:id/upvote
```
Increments the upvote count for a specific idea.

**Response:**
```json
{
  "id": "uuid",
  "text": "Your brilliant idea here",
  "upvotes": 6,
  "created_at": "2024-01-01T12:00:00.000Z"
}
```

## 🗄️ Database Schema

### Ideas Table
```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL CHECK (length(text) <= 280),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐳 Docker Services

### Services Overview
- **postgres**: PostgreSQL 15 database
- **backend**: Node.js/Express API server
- **frontend**: Next.js application

### Ports
- **3000**: Frontend application
- **3001**: Backend API
- **5432**: PostgreSQL database

### Volumes
- **postgres_data**: Persistent database storage

## 🔄 Real-time Features

The application implements real-time updates through:

1. **Automatic Polling**: Frontend polls the API every 30 seconds
2. **Manual Refresh**: Users can manually refresh the ideas list
3. **Immediate Updates**: Upvotes and new ideas update immediately after user actions

## 🎨 Design Decisions

### Frontend
- **Tailwind CSS**: Chosen for rapid development and consistent design
- **Next.js App Router**: Modern routing with server components
- **TypeScript**: Type safety and better developer experience
- **Responsive Design**: Mobile-first approach with breakpoints

### Backend
- **Express.js**: Lightweight and flexible web framework
- **PostgreSQL**: Reliable, ACID-compliant database
- **TypeScript**: Type safety and better maintainability
- **RESTful API**: Simple, predictable API design

### Database
- **UUID Primary Keys**: Globally unique identifiers
- **Character Validation**: Database-level constraints
- **Automatic Timestamps**: Built-in creation tracking
- **Indexing**: Optimized for common queries

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set production database credentials
2. **SSL/TLS**: Use HTTPS in production
3. **Database Backups**: Implement regular backup strategy
4. **Monitoring**: Add logging and health monitoring
5. **Scaling**: Consider horizontal scaling for high traffic

### Kubernetes (Bonus)
The application is containerized and ready for Kubernetes deployment. You can create:
- `deployment.yaml` for pod management
- `service.yaml` for internal networking
- `ingress.yaml` for external access

## 🧪 Testing

### Manual Testing
1. **Landing Page**: Verify responsive design and navigation
2. **Idea Submission**: Test character limits and validation
3. **Upvoting**: Verify vote counting and real-time updates
4. **Real-time Updates**: Check automatic refresh functionality

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Create an idea
curl -X POST http://localhost:3001/api/ideas \
  -H "Content-Type: application/json" \
  -d '{"text": "Test idea"}'

# Get all ideas
curl http://localhost:3001/api/ideas
```

## 📝 Development Notes

### Trade-offs Made
1. **Polling vs WebSockets**: Chose polling for simplicity and reliability
2. **Anonymous vs User Accounts**: Anonymous for lower barrier to entry
3. **Character Limit**: 280 characters to encourage concise ideas
4. **Database**: PostgreSQL for reliability over NoSQL alternatives

### Future Enhancements
1. **User Authentication**: Add user accounts and profiles
2. **Categories**: Organize ideas by topics
3. **Comments**: Allow discussion on ideas
4. **Advanced Filtering**: Search and filter capabilities
5. **WebSocket Integration**: True real-time updates
6. **Rate Limiting**: Prevent spam and abuse

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL container is running
   - Check database credentials in environment variables

2. **Frontend Can't Connect to API**
   - Verify backend is running on port 3001
   - Check CORS configuration

3. **Docker Build Fails**
   - Ensure Docker is running
   - Try `docker-compose down` and `docker-compose up --build`

4. **Port Already in Use**
   - Stop other services using ports 3000, 3001, or 5432
   - Or modify ports in docker-compose.yml

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using modern web technologies**
