<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class InstructorCoursesSeeder extends Seeder
{
    private $courseCategories = [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Cloud Computing',
        'DevOps',
        'Cybersecurity',
        'UI/UX Design',
        'Database Management',
        'Software Engineering'
    ];

    private $technologies = [
        'Web Development' => ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'PHP', 'Laravel', 'Django'],
        'Mobile Development' => ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Android Studio', 'iOS Development', 'Xamarin'],
        'Data Science' => ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow'],
        'Machine Learning' => ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Neural Networks', 'Deep Learning'],
        'Cloud Computing' => ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Serverless'],
        'DevOps' => ['Git', 'Jenkins', 'Docker', 'Kubernetes', 'Ansible', 'Terraform', 'CI/CD'],
        'Cybersecurity' => ['Network Security', 'Ethical Hacking', 'Cryptography', 'Security Tools', 'Penetration Testing'],
        'UI/UX Design' => ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Wireframing', 'Prototyping'],
        'Database Management' => ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQL', 'NoSQL'],
        'Software Engineering' => ['Design Patterns', 'Clean Code', 'Testing', 'Agile', 'Version Control', 'Architecture']
    ];

    public function run(): void
    {
        $faker = Faker::create();

        // Create 10 instructors
        for ($i = 0; $i < 10; $i++) {
            $instructor = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'),
                'role' => 'instructor',
                'bio' => $faker->paragraph,
                'preferences' => [
                    'email_notifications' => true,
                    'language' => 'en',
                    'theme' => 'light',
                ],
            ]);

            // Create 3-5 courses for each instructor
            $numCourses = rand(3, 5);
            for ($j = 0; $j < $numCourses; $j++) {
                $category = $this->courseCategories[array_rand($this->courseCategories)];
                $technologies = $this->technologies[$category];
                
                $metadata = [
                    'skills' => $faker->randomElements($technologies, rand(3, 5)),
                    'prerequisites' => $this->generatePrerequisites($category),
                    'target_audience' => $this->generateTargetAudience($category),
                    'estimated_duration' => rand(4, 12) . ' weeks'
                ];

                $course = Course::create([
                    'title' => $this->generateCourseTitle($category, $technologies),
                    'description' => $this->generateCourseDescription($category, $technologies),
                    'instructor_id' => $instructor->id,
                    'category' => $category,
                    'difficulty_level' => $faker->randomElement(['beginner', 'intermediate', 'advanced']),
                    'thumbnail' => null,
                    'is_published' => true,
                    'price' => $faker->randomFloat(2, 0, 199.99),
                    'metadata' => $metadata,
                ]);

                // Create 4-8 modules for each course
                $numModules = rand(4, 8);
                for ($k = 0; $k < $numModules; $k++) {
                    $moduleResources = [
                        'pdf_materials' => $faker->boolean(70) ? [$faker->word . '.pdf'] : [],
                        'external_links' => $faker->boolean(60) ? [$faker->url] : [],
                    ];

                    $moduleMetadata = [
                        'learning_objectives' => $this->generateLearningObjectives($category),
                    ];

                    $module = Module::create([
                        'course_id' => $course->id,
                        'title' => $this->generateModuleTitle($category, $k + 1),
                        'description' => $faker->paragraph,
                        'content' => $faker->paragraphs(3, true),
                        'order_index' => $k + 1,
                        'resources' => $moduleResources,
                        'metadata' => $moduleMetadata,
                    ]);

                    // Create 3-6 lessons for each module
                    $numLessons = rand(3, 6);
                    for ($l = 0; $l < $numLessons; $l++) {
                        $lessonResources = [
                            'video_url' => $faker->boolean(80) ? 'https://example.com/video' . $faker->uuid : null,
                            'attachments' => $faker->boolean(60) ? [$faker->word . '.pdf'] : [],
                            'code_samples' => $faker->boolean(70) ? ['github.com/example/' . $faker->slug] : [],
                        ];

                        $lessonMetadata = [
                            'type' => $faker->randomElement(['video', 'text', 'interactive']),
                            'difficulty' => $faker->randomElement(['basic', 'intermediate', 'advanced']),
                        ];

                        Lesson::create([
                            'module_id' => $module->id,
                            'title' => $this->generateLessonTitle($category, $l + 1),
                            'content' => $this->generateLessonContent(),
                            'duration' => rand(15, 45),
                            'order_index' => $l + 1,
                            'resources' => $lessonResources,
                            'metadata' => $lessonMetadata,
                        ]);
                    }
                }
            }
        }
    }

    private function generateCourseTitle($category, $technologies): string
    {
        $templates = [
            "Complete %s Bootcamp: From Beginner to Professional",
            "Master %s: Comprehensive Guide",
            "Professional %s Course",
            "The Ultimate %s Masterclass",
            "%s: Practical Projects and Real-world Applications"
        ];

        $mainTechnology = $technologies[array_rand($technologies)];
        return sprintf($templates[array_rand($templates)], $mainTechnology);
    }

    private function generateCourseDescription($category, $technologies): string
    {
        $faker = Faker::create();
        $mainTech = $technologies[array_rand($technologies)];
        
        return sprintf(
            "Master %s with this comprehensive course. You'll learn %s through practical projects and real-world examples. %s\n\n%s",
            $mainTech,
            implode(", ", array_slice($technologies, 0, 3)),
            $faker->paragraph,
            "By the end of this course, you'll be able to:\n- " . implode("\n- ", $this->generateLearningObjectives($category))
        );
    }

    private function generatePrerequisites($category): array
    {
        $basic = [
            "Basic computer knowledge",
            "Understanding of programming fundamentals",
        ];

        $specific = match($category) {
            'Web Development' => ["HTML/CSS basics", "JavaScript fundamentals"],
            'Mobile Development' => ["Object-oriented programming concepts", "Basic programming experience"],
            'Data Science' => ["Basic Python knowledge", "Mathematics fundamentals"],
            'Machine Learning' => ["Python programming", "Basic statistics knowledge"],
            default => ["Programming basics", "Problem-solving skills"]
        };

        return array_merge($basic, $specific);
    }

    private function generateTargetAudience($category): array
    {
        return [
            "Aspiring $category professionals",
            "Students interested in learning $category",
            "Professionals looking to upgrade their skills",
            "Career changers entering the tech industry"
        ];
    }

    private function generateModuleTitle($category, $index): string
    {
        $templates = [
            "Module $index: Introduction to %s",
            "Module $index: Advanced %s Concepts",
            "Module $index: Building Real-world %s Projects",
            "Module $index: %s Best Practices",
            "Module $index: Mastering %s"
        ];

        return sprintf($templates[array_rand($templates)], $category);
    }

    private function generateLessonTitle($category, $index): string
    {
        $faker = Faker::create();
        $templates = [
            "Lesson $index: Understanding %s",
            "Lesson $index: Implementing %s",
            "Lesson $index: Working with %s",
            "Lesson $index: %s in Practice",
            "Lesson $index: %s Deep Dive"
        ];

        $topic = $faker->words(2, true);
        return sprintf($templates[array_rand($templates)], $topic);
    }

    private function generateLessonContent(): string
    {
        $faker = Faker::create();
        return implode("\n\n", [
            "### Overview\n" . $faker->paragraph,
            "### Key Concepts\n- " . implode("\n- ", $faker->sentences(3)),
            "### Examples\n" . $faker->paragraph,
            "### Practice Exercise\n" . $faker->paragraph,
            "### Additional Resources\n- " . implode("\n- ", $faker->sentences(2))
        ]);
    }

    private function generateLearningObjectives($category): array
    {
        $faker = Faker::create();
        $templates = [
            "Understand the fundamentals of %s",
            "Build professional %s applications",
            "Implement best practices in %s",
            "Debug and troubleshoot %s issues",
            "Deploy %s solutions in production",
            "Optimize %s performance",
            "Write clean and maintainable code"
        ];

        $objectives = [];
        $count = rand(4, 6);
        for ($i = 0; $i < $count; $i++) {
            $objectives[] = sprintf($templates[array_rand($templates)], $category);
        }

        return array_unique($objectives);
    }
} 