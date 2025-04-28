URL Shortener System

This project is a Microservices-based URL Shortener System built using Java Spring Boot, PostgreSQL, and Redis.
It is designed to be modular, scalable, and production-ready with Docker containerization and JWT-based authentication.

📚 Project Structure

The system is divided into three main microservices:


Service	Description
Authentication Service	Handles user registration, login, and JWT token generation.
API Service	Manages creation of short URLs, redirects, and interacts with Redis/PostgreSQL.
Analytics Service	Tracks URL usage analytics like click counts and stores them in PostgreSQL.
🚀 Tech Stack

Backend Framework: Java Spring Boot 3.x
Database: PostgreSQL
Caching Layer: Redis
Authentication: JWT (JSON Web Tokens)
Containerization: Docker, Docker Compose
Build Tool: Maven
Security: Spring Security, BCrypt Password Encoding
🛠️ Key Features

Shorten any long URL with a unique shortcode.
User authentication with secure password hashing and JWT tokens.
Access analytics for each short URL (click counts, basic user metadata).
Fast redirection using Redis caching.
Clean, modular microservices architecture.
Ready for CI/CD integration and cloud deployment.
📂 Folder Structure

url-shortener-system/
│
├── auth-service/        # User authentication (register/login) microservice
├── api-service/         # URL generation and redirection microservice
├── analytics-service/   # Click tracking and analytics microservice
├── docker-compose.yml   # For local deployment
├── README.md            # Project documentation
└── scripts/             # (Optional) DB migrations, setup scripts
⚙️ How to Run Locally

Clone the repository
git clone https://github.com/your-username/url-shortener-system.git
cd url-shortener-system
Build the services
./mvnw clean install
Run with Docker Compose
docker-compose up --build
Access the services
Authentication Service: http://localhost:8081/api/auth
API Service: http://localhost:8082/api/url
Analytics Service: http://localhost:8083/api/analytics
🧪 API Endpoints Overview

Authentication Service

Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login and get JWT
API Service

Method	Endpoint	Description
POST	/api/url/shorten	Create a short URL (Auth required)
GET	/s/{shortCode}	Redirect to original URL
Analytics Service

Method	Endpoint	Description
GET	/api/analytics/{shortCode}	View click statistics
📈 Future Improvements

Expiry settings for short URLs.
User-specific URL dashboard.
Geo-location and browser-level analytics.
Kubernetes deployment support (K8s YAMLs).
OAuth2 login (Google, GitHub).
✨ Contributing

Contributions are welcome!
Feel free to fork the repository, open issues, or submit pull requests.

🛡️ License

This project is licensed under the MIT License.

🚀 Made with 💻 by [Your Name]
