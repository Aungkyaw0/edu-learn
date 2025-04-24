<?php

namespace App\Services;

use App\Models\User;
use App\Models\Course;
use App\Models\CourseRecommendation;
use Illuminate\Support\Collection;

class CourseRecommendationService
{
    private const MIN_SCORE_THRESHOLD = 4.0; // Minimum score to be recommended
    private const MAX_RECOMMENDATIONS_PER_CATEGORY = 3; // Maximum recommendations per category
    private const INTEREST_WEIGHT = 3.0; // Weight for interest matches
    private const DIFFICULTY_WEIGHT = 2.0; // Weight for difficulty matches
    private const CATEGORY_WEIGHT = 1.0; // Weight for category popularity

    public function generateRecommendations(User $user): void
    {
        // Delete existing recommendations for the user
        CourseRecommendation::where('user_id', $user->id)->delete();

        // Get user's interests and preferences
        $interests = $user->preferences['interests'] ?? [];
        $learningStyle = $user->preferences['learning_style'] ?? 'visual';
        $difficultyPreference = $user->preferences['difficulty_preference'] ?? 'balanced';

        // If user has no interests set, we can't make good recommendations
        if (empty($interests)) {
            return;
        }

        // Get completed courses to exclude
        $completedCourseIds = $user->enrollments()
            ->where('progress_percentage', 100)
            ->pluck('course_id');

        // Get all published courses not completed by the user
        $availableCourses = Course::published()
            ->whereNotIn('id', $completedCourseIds)
            ->get();

        // Group courses by category
        $coursesByCategory = $availableCourses->groupBy('category');
        $recommendations = collect();

        // Process each category
        foreach ($coursesByCategory as $category => $courses) {
            $categoryRecommendations = collect();

            foreach ($courses as $course) {
                $score = $this->calculateRecommendationScore($course, $user, $interests, $learningStyle, $difficultyPreference);
                
                if ($score >= self::MIN_SCORE_THRESHOLD) {
                    $categoryRecommendations->push([
                        'course' => $course,
                        'score' => $score,
                        'reason' => $this->generateRecommendationReason($course, $user, $interests, $learningStyle, $difficultyPreference)
                    ]);
                }
            }

            // Take top N recommendations from this category
            $topCategoryRecommendations = $categoryRecommendations
                ->sortByDesc('score')
                ->take(self::MAX_RECOMMENDATIONS_PER_CATEGORY);

            $recommendations = $recommendations->concat($topCategoryRecommendations);
        }

        // Create recommendations in database
        foreach ($recommendations as $recommendation) {
            CourseRecommendation::create([
                'user_id' => $user->id,
                'course_id' => $recommendation['course']->id,
                'score' => $recommendation['score'],
                'reason' => $recommendation['reason'],
                'metadata' => [
                    'interest_match' => array_intersect($interests, $recommendation['course']->metadata['skills'] ?? []),
                    'difficulty_match' => $this->getDifficultyMatch($recommendation['course']->difficulty_level, $difficultyPreference),
                    'learning_style_match' => $learningStyle
                ]
            ]);
        }
    }

    private function calculateRecommendationScore(Course $course, User $user, array $interests, string $learningStyle, string $difficultyPreference): float
    {
        $score = 0;

        // Interest match (up to 5 points * INTEREST_WEIGHT)
        $courseSkills = $course->metadata['skills'] ?? [];
        $matchingInterests = array_intersect($interests, $courseSkills);
        $interestScore = (count($matchingInterests) / max(1, count($interests))) * 5;
        $score += $interestScore * self::INTEREST_WEIGHT;

        // Difficulty match (up to 3 points * DIFFICULTY_WEIGHT)
        $difficultyScore = $this->getDifficultyMatch($course->difficulty_level, $difficultyPreference);
        $score += $difficultyScore * self::DIFFICULTY_WEIGHT;

        // Category popularity (up to 2 points * CATEGORY_WEIGHT)
        $categoryPopularity = Course::where('category', $course->category)
            ->where('is_published', true)
            ->count() / Course::where('is_published', true)->count();
        $score += $categoryPopularity * 2 * self::CATEGORY_WEIGHT;

        // Learning style bonus (up to 1 point)
        if ($course->metadata['learning_style'] ?? null === $learningStyle) {
            $score += 1;
        }

        return round($score, 2);
    }

    private function getDifficultyMatch(string $courseLevel, string $preference): float
    {
        $difficultyMap = [
            'beginner' => 1,
            'intermediate' => 2,
            'advanced' => 3
        ];

        $courseDifficulty = $difficultyMap[$courseLevel] ?? 2;
        $preferredDifficulty = match($preference) {
            'beginner' => 1,
            'advanced' => 3,
            default => 2
        };

        // Return a score based on how close the course difficulty is to the preferred difficulty
        return 3 - abs($courseDifficulty - $preferredDifficulty);
    }

    private function generateRecommendationReason(Course $course, User $user, array $interests, string $learningStyle, string $difficultyPreference): string
    {
        $reasons = [];

        // Check interest match
        $courseSkills = $course->metadata['skills'] ?? [];
        $matchingInterests = array_intersect($interests, $courseSkills);
        if (count($matchingInterests) > 0) {
            $reasons[] = "Matches your interests in " . implode(", ", array_slice($matchingInterests, 0, 2));
        }

        // Check difficulty match
        if ($this->getDifficultyMatch($course->difficulty_level, $difficultyPreference) >= 2) {
            $reasons[] = "Suitable for your {$difficultyPreference} level";
        }

        // Learning style match
        if ($course->metadata['learning_style'] ?? null === $learningStyle) {
            $reasons[] = "Optimized for your {$learningStyle} learning style";
        }

        // If no specific reasons, add a generic one
        if (empty($reasons)) {
            $reasons[] = "Popular course in {$course->category}";
        }

        return implode(". ", $reasons);
    }

    public function getRecommendedCourses(User $user, int $limit = 5): Collection
    {
        return CourseRecommendation::where('user_id', $user->id)
            ->with('course')
            ->orderByDesc('score')
            ->take($limit)
            ->get()
            ->map(function ($recommendation) {
                $recommendation->course->recommendation_reason = $recommendation->reason;
                $recommendation->course->recommendation_score = $recommendation->score;
                return $recommendation->course;
            });
    }
} 