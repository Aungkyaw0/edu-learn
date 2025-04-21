 -- Insert sample instructors
INSERT INTO users (name, email, password, role, bio, created_at, updated_at) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@edulearn.com', '$2y$12$RAQmtt1OJhS1IcrwMcSxvuvCFNr/6HuJek4Sir.FGfYsgV7MPhT2i', 'instructor', 'Expert in Web Development with 10+ years of experience teaching at top universities.', NOW(), NOW()),
('Prof. Michael Chen', 'michael.chen@edulearn.com', '$2y$12$RAQmtt1OJhS1IcrwMcSxvuvCFNr/6HuJek4Sir.FGfYsgV7MPhT2i', 'instructor', 'AI and Machine Learning specialist with extensive industry experience.', NOW(), NOW()),
('Emma Davis', 'emma.davis@edulearn.com', '$2y$12$RAQmtt1OJhS1IcrwMcSxvuvCFNr/6HuJek4Sir.FGfYsgV7MPhT2i', 'instructor', 'UX/UI design professional and certified design thinking facilitator.', NOW(), NOW());

-- Insert sample courses
INSERT INTO courses (title, description, instructor_id, category, difficulty_level, thumbnail, is_published, price, created_at, updated_at) VALUES
('Modern Web Development with React & Laravel', 'Master full-stack web development using React for frontend and Laravel for backend. Learn modern development practices, API integration, and deployment strategies.', 1, 'Web Development', 'intermediate', 'courses/web-dev.jpg', true, 79.99, NOW(), NOW()),
('Artificial Intelligence Fundamentals', 'Comprehensive introduction to AI concepts, machine learning algorithms, and practical applications. Includes hands-on projects and real-world case studies.', 2, 'Artificial Intelligence', 'beginner', 'courses/ai-basics.jpg', true, 89.99, NOW(), NOW()),
('Advanced Machine Learning', 'Deep dive into neural networks, deep learning, and advanced ML algorithms. Build sophisticated AI models and learn deployment strategies.', 2, 'Artificial Intelligence', 'advanced', 'courses/advanced-ml.jpg', true, 129.99, NOW(), NOW()),
('UI/UX Design Masterclass', 'Learn end-to-end product design, from user research to high-fidelity prototypes. Master industry-standard tools and design systems.', 3, 'Design', 'intermediate', 'courses/uiux-design.jpg', true, 69.99, NOW(), NOW());

-- Insert sample modules for Web Development course
INSERT INTO modules (course_id, title, content, order_index, created_at, updated_at) VALUES
(1, 'Introduction to Modern Web Development', 'Overview of full-stack development, setup development environment, and introduction to React and Laravel.', 1, NOW(), NOW()),
(1, 'React Fundamentals', 'Components, props, state management, hooks, and modern React patterns.', 2, NOW(), NOW()),
(1, 'Laravel Backend Development', 'RESTful APIs, authentication, database management, and Laravel best practices.', 3, NOW(), NOW()),
(1, 'Full Stack Integration', 'Connecting React frontend with Laravel backend, deployment, and optimization.', 4, NOW(), NOW());

-- Insert sample modules for AI Fundamentals course
INSERT INTO modules (course_id, title, content, order_index, created_at, updated_at) VALUES
(2, 'Introduction to AI', 'Basic concepts of AI, history, and current applications in industry.', 1, NOW(), NOW()),
(2, 'Machine Learning Basics', 'Supervised and unsupervised learning, model evaluation, and basic algorithms.', 2, NOW(), NOW()),
(2, 'Neural Networks', 'Fundamentals of neural networks, architectures, and training processes.', 3, NOW(), NOW()),
(2, 'Practical AI Applications', 'Real-world AI implementation, case studies, and future trends.', 4, NOW(), NOW());

-- Insert sample assessments
INSERT INTO assessments (course_id, title, description, question_bank, time_limit, passing_score, is_published, created_at, updated_at) VALUES
(1, 'React Fundamentals Quiz', 'Test your understanding of React core concepts', '{"questions":[{"question":"What is a React component?","options":["A JavaScript function","A CSS file","An HTML element","A database table"],"correct":0}]}', 30, 70, true, NOW(), NOW()),
(2, 'AI Concepts Assessment', 'Evaluate your understanding of basic AI concepts', '{"questions":[{"question":"What is machine learning?","options":["A type of computer hardware","A subset of artificial intelligence","A programming language","A database system"],"correct":1}]}', 45, 75, true, NOW(), NOW());

-- Insert sample enrollments
INSERT INTO enrollments (user_id, course_id, progress, last_accessed_at, created_at, updated_at) VALUES
(1, 2, 25, NOW(), NOW(), NOW()),
(2, 1, 40, NOW(), NOW(), NOW()),
(3, 1, 60, NOW(), NOW(), NOW());

-- Insert sample assessment results
INSERT INTO assessment_results (user_id, assessment_id, score, feedback, submitted_at, created_at, updated_at) VALUES
(1, 1, 85, 'Great understanding of React fundamentals. Focus more on hooks and state management.', NOW(), NOW(), NOW()),
(2, 2, 92, 'Excellent grasp of AI concepts. Consider exploring advanced topics.', NOW(), NOW(), NOW());