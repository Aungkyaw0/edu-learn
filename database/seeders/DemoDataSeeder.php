<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert sample instructors
        $instructors = [
            [
                'name' => 'Dr. Sarah Johnson',
                'email' => 'sarah.johnson@edulearn.com',
                'password' => Hash::make('password123'),
                'role' => 'instructor',
                'bio' => 'Expert in Web Development with 10+ years of experience teaching at top universities.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Prof. Michael Chen',
                'email' => 'michael.chen@edulearn.com',
                'password' => Hash::make('password123'),
                'role' => 'instructor',
                'bio' => 'AI and Machine Learning specialist with extensive industry experience.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Emma Davis',
                'email' => 'emma.davis@edulearn.com',
                'password' => Hash::make('password123'),
                'role' => 'instructor',
                'bio' => 'UX/UI design professional and certified design thinking facilitator.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($instructors as $instructor) {
            DB::table('users')->insert($instructor);
        }

        // Insert sample courses
        $courses = [
            [
                'title' => 'Modern Web Development with React & Laravel',
                'description' => 'Master full-stack web development using React for frontend and Laravel for backend. Learn modern development practices, API integration, and deployment strategies.',
                'instructor_id' => 1,
                'category' => 'Web Development',
                'difficulty_level' => 'intermediate',
                'thumbnail' => 'courses/web-dev.jpg',
                'is_published' => true,
                'price' => 79.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Artificial Intelligence Fundamentals',
                'description' => 'Comprehensive introduction to AI concepts, machine learning algorithms, and practical applications. Includes hands-on projects and real-world case studies.',
                'instructor_id' => 2,
                'category' => 'Artificial Intelligence',
                'difficulty_level' => 'beginner',
                'thumbnail' => 'courses/ai-basics.jpg',
                'is_published' => true,
                'price' => 89.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Advanced Machine Learning',
                'description' => 'Deep dive into neural networks, deep learning, and advanced ML algorithms. Build sophisticated AI models and learn deployment strategies.',
                'instructor_id' => 2,
                'category' => 'Artificial Intelligence',
                'difficulty_level' => 'advanced',
                'thumbnail' => 'courses/advanced-ml.jpg',
                'is_published' => true,
                'price' => 129.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'UI/UX Design Masterclass',
                'description' => 'Learn end-to-end product design, from user research to high-fidelity prototypes. Master industry-standard tools and design systems.',
                'instructor_id' => 3,
                'category' => 'Design',
                'difficulty_level' => 'intermediate',
                'thumbnail' => 'courses/uiux-design.jpg',
                'is_published' => true,
                'price' => 69.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($courses as $course) {
            DB::table('courses')->insert($course);
        }

        // Insert sample modules
        $modules = [
            // Web Development course modules
            [
                'course_id' => 1,
                'title' => 'Introduction to Modern Web Development',
                'description' => 'Get started with modern web development by understanding the fundamentals of full-stack development using React and Laravel.',
                'content' => 'Overview of full-stack development, setup development environment, and introduction to React and Laravel.',
                'order_index' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'course_id' => 1,
                'title' => 'React Fundamentals',
                'description' => 'Learn the core concepts of React and how to build modern user interfaces.',
                'content' => 'Components, props, state management, hooks, and modern React patterns.',
                'order_index' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // AI Fundamentals course modules
            [
                'course_id' => 2,
                'title' => 'Introduction to AI',
                'description' => 'A comprehensive introduction to artificial intelligence and its applications.',
                'content' => 'Basic concepts of AI, history, and current applications in industry.',
                'order_index' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'course_id' => 2,
                'title' => 'Machine Learning Basics',
                'description' => 'Understanding the fundamentals of machine learning and its core concepts.',
                'content' => 'Supervised and unsupervised learning, model evaluation, and basic algorithms.',
                'order_index' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($modules as $module) {
            DB::table('modules')->insert($module);
        }

        // Insert sample assessments
        

        // Insert sample enrollments
        $enrollments = [
            [
                'user_id' => 1,
                'course_id' => 2,
                'enrollment_date' => now(),
                'progress_percentage' => 25.00,
                'last_accessed' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'course_id' => 1,
                'enrollment_date' => now(),
                'progress_percentage' => 40.00,
                'last_accessed' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($enrollments as $enrollment) {
            DB::table('enrollments')->insert($enrollment);
        }

        // Insert sample assessment results
        
    }
} 