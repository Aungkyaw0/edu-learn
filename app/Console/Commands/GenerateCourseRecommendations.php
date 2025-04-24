<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\CourseRecommendationService;
use Illuminate\Console\Command;

class GenerateCourseRecommendations extends Command
{
    protected $signature = 'recommendations:generate {--user= : Specific user ID to generate recommendations for}';
    protected $description = 'Generate course recommendations for users';

    private CourseRecommendationService $recommendationService;

    public function __construct(CourseRecommendationService $recommendationService)
    {
        parent::__construct();
        $this->recommendationService = $recommendationService;
    }

    public function handle(): void
    {
        $userId = $this->option('user');

        if ($userId) {
            $user = User::find($userId);
            if ($user) {
                $this->generateForUser($user);
            } else {
                $this->error("User not found with ID: {$userId}");
            }
            return;
        }

        $this->info('Generating recommendations for all users...');

        User::where('role', 'student')->chunk(100, function ($users) {
            foreach ($users as $user) {
                $this->generateForUser($user);
            }
        });

        $this->info('Recommendations generated successfully!');
    }

    private function generateForUser(User $user): void
    {
        $this->info("Generating recommendations for user: {$user->name}");
        $this->recommendationService->generateRecommendations($user);
    }
} 