<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\EnrollmentRequest;
use App\Models\Enrollment;
use App\Services\CourseRecommendationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EnrollmentRequestController extends Controller
{
    use AuthorizesRequests;

    private CourseRecommendationService $recommendationService;

    public function __construct(CourseRecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    public function myLearning()
    {
        $enrollmentRequests = EnrollmentRequest::with(['course', 'course.instructor'])
            ->where('user_id', auth()->id())
            ->get()
            ->groupBy('status');

        $recommendedCourses = $this->recommendationService->getRecommendedCourses(auth()->user(), 6);

        return Inertia::render('Student/MyLearning', [
            'enrolledCourses' => $enrollmentRequests['accepted'] ?? [],
            'pendingRequests' => $enrollmentRequests['pending'] ?? [],
            'rejectedRequests' => $enrollmentRequests['rejected'] ?? [],
            'recommendedCourses' => $recommendedCourses
        ]);
    }

    public function store(Request $request, Course $course)
    {
        // Check if user already has a request for this course
        $existingRequest = EnrollmentRequest::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        if ($existingRequest) {
            return redirect()->route('student.my-learning')
                ->with('error', 'You have already requested enrollment in this course.');
        }

        // Create new enrollment request
        EnrollmentRequest::create([
            'user_id' => auth()->id(),
            'course_id' => $course->id,
            'status' => 'pending'
        ]);

        return redirect()->route('student.my-learning')
            ->with('success', 'Enrollment request sent successfully.');
    }

    public function accept(EnrollmentRequest $request)
    {
        $this->authorize('update', $request->course);

        $request->update([
            'status' => 'accepted'
        ]);

        // Create enrollment record
        $enrollment = Enrollment::firstOrCreate(
            [
                'user_id' => $request->user_id,
                'course_id' => $request->course_id,
            ],
            [
                'enrollment_date' => now(),
                'progress_percentage' => 0,
                'last_accessed' => now(),
                'completion_data' => json_encode(['completed_modules' => []]),
            ]
        );

        return back()->with('success', 'Enrollment request accepted.');
    }

    public function reject(Request $httpRequest, EnrollmentRequest $request)
    {
        $this->authorize('update', $request->course);

        $validated = $httpRequest->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);

        $request->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason']
        ]);

        return back()->with('success', 'Enrollment request rejected.');
    }
} 