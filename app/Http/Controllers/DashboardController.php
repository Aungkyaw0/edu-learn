<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\EnrollmentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $courses = Course::where('instructor_id', auth()->id())
            ->with(['category', 'modules'])
            ->latest()
            ->get();

        return Inertia::render('Instructor/Dashboard', [
            'courses' => $courses,
        ]);
    }

    public function instructor()
    {
        $courses = Course::where('instructor_id', auth()->id())->get();
        
        $pendingRequests = EnrollmentRequest::with(['user', 'course'])
            ->whereIn('course_id', $courses->pluck('id'))
            ->where('status', 'pending')
            ->get();

        return Inertia::render('Instructor/Dashboard', [
            'courses' => $courses,
            'pendingRequests' => $pendingRequests,
            'stats' => [
                'totalCourses' => $courses->count(),
                'totalStudents' => EnrollmentRequest::whereIn('course_id', $courses->pluck('id'))
                    ->where('status', 'accepted')
                    ->count(),
                'pendingRequests' => $pendingRequests->count(),
            ],
        ]);
    }
} 