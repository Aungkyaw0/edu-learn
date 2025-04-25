# EduLearn - AI-Powered Learning Platform

EduLearn is a dynamic, personalized learning platform that leverages artificial intelligence to transform traditional course content into an engaging and adaptive learning experience. Built with Laravel 12, React, and Inertia.js, EduLearn offers a modern approach to online education.

## 🌟 Features

### Personalized Learning
- AI-driven course recommendations based on student performance and preferences
- Adaptive learning paths that adjust content difficulty in real-time
- Personalized dashboard with progress tracking and upcoming deadlines

### Interactive Learning Experience
- Real-time AI chatbot assistance for instant support
- Interactive course pages with video lectures and quizzes
- Discussion forums and real-time collaboration features
- Markdown support for rich content formatting

### Smart Assessment System
- AI-powered assessments that adapt to student levels
- Instant feedback on quizzes and assignments
- Automated grading system with NLP-based feedback
- Comprehensive analytics for tracking performance

### Administrative Tools
- Intuitive course management system
- Student progress monitoring
- Performance analytics dashboard
- Automated content recommendations

## 🚀 Getting Started

### Prerequisites
- PHP 8.2 or higher
- Node.js 18+ and npm
- Composer
- MySQL 8.0+

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd edulearn
```

2. Install PHP dependencies
```bash
composer install
```

3. Install Node.js dependencies
```bash
npm install
```

4. Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database in `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=edulearn
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations and seeders
```bash
php artisan migrate --seed
```

7. Build assets
```bash
npm run build
```

8. Start the development server
```bash
php artisan serve
```

## 🛠 Tech Stack

### Backend
- Laravel 12 - PHP Framework
- MySQL - Database

### Frontend
- React - UI Library
- Inertia.js - Modern Monolith Architecture
- Vite - Build Tool
- TailwindCSS - Styling

### AI Integration (Meta LLMA)
- AI Chatbot
- AI Course recommendations
- AI Assessment Generation

## 🔐 Security

- CSRF Protection
- XSS Prevention
- Role-based access control
- Secure password hashing
- Input validation and sanitization

## 📱 Responsive Design

The platform is built with a mobile-first approach, ensuring a seamless experience across:
- Desktop computers
- Tablets
- Mobile devices


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, please email [support@edulearn.com](mailto:support@edulearn.com) or open an issue in the repository.

---

