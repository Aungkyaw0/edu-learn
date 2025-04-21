<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\EnrollmentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentRequestController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        // Check if user already has a request for this course
        $existingRequest = EnrollmentRequest::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        if ($existingRequest) {
            return back()->with('error', 'You have already requested enrollment in this course.');
        }

        // Create new enrollment request
        EnrollmentRequest::create([
            'user_id' => auth()->id(),
            'course_id' => $course->id,
            'status' => 'pending'
        ]);

        return back()->with('success', 'Enrollment request sent successfully.');
    }

    public function accept(EnrollmentRequest $request)
    {
        $this->authorize('update', $request->course);

        $request->update([
            'status' => 'accepted'
        ]);

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

    public function myLearning()
    {
        $enrollmentRequests = EnrollmentRequest::with(['course', 'course.instructor'])
            ->where('user_id', auth()->id())
            ->get()
            ->groupBy('status');

        return Inertia::render('Student/MyLearning', [
            'enrolledCourses' => $enrollmentRequests['accepted'] ?? [],
            'pendingRequests' => $enrollmentRequests['pending'] ?? [],
            'rejectedRequests' => $enrollmentRequests['rejected'] ?? []
        ]);
    }
} 