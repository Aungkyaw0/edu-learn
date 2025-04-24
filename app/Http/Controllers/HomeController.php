<?php

namespace App\Http\Controllers;

use App\Services\CourseRecommendationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    private CourseRecommendationService $recommendationService;

    public function __construct(CourseRecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $recommendedCourses = [];

        if ($user && $user->role === 'student') {
            $recommendedCourses = $this->recommendationService->getRecommendedCourses($user, 6);
        }

        return Inertia::render('Home', [
            'recommendedCourses' => $recommendedCourses,
        ]);
    }
} 