<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\EnrollmentRequest;

class CourseController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $courses = Course::with(['instructor'])
            ->withCount('enrollments')
            ->paginate(9);

        return Inertia::render('Courses/Index', [
            'courses' => $courses
        ]);
    }

    public function show(Course $course)
    {
        $enrollmentStatus = null;

        if (auth()->check() && auth()->user()->role === 'student') {
            $request = EnrollmentRequest::where('user_id', auth()->id())
                ->where('course_id', $course->id)
                ->first();

            if ($request) {
                $enrollmentStatus = $request->status;
            }
        }

        return Inertia::render('Courses/Show', [
            'course' => $course->load('instructor'),
            'enrollmentStatus' => $enrollmentStatus,
        ]);
    }

    public function instructorIndex()
    {
        $courses = Course::where('instructor_id', Auth::id())
            ->withCount('enrollments')
            ->paginate(9);

        return Inertia::render('Instructor/Courses/Index', [
            'courses' => $courses
        ]);
    }

    public function create()
    {
        return Inertia::render('Instructor/Courses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|max:2048',
            'learning_outcomes' => 'required|array|min:1',
            'learning_outcomes.*' => 'required|string|max:255',
            'difficulty_level' => 'required|in:beginner,intermediate,advanced',
            'duration' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:0',
            'is_published' => 'boolean',
        ]);

        $validated['instructor_id'] = Auth::id();
        $validated['is_published'] = false; // Set default value for is_published

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('course-thumbnails', 'public');
            $validated['thumbnail'] = Storage::url($path);
        }

        Course::create($validated);

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course created successfully.');
    }

    public function edit(Course $course)
    {
        $this->authorize('update', $course);

        $course->load(['modules.lessons']);

        return Inertia::render('Instructor/Courses/Edit', [
            'course' => $course
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $this->authorize('update', $course);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|max:2048',
            'learning_outcomes' => 'required|array|min:1',
            'learning_outcomes.*' => 'required|string|max:255',
            'difficulty_level' => 'required|in:beginner,intermediate,advanced',
            'duration' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:0',
            'is_published' => 'boolean',
        ]);

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($course->thumbnail && Storage::disk('public')->exists($course->thumbnail)) {
                Storage::disk('public')->delete($course->thumbnail);
            }

            $path = $request->file('thumbnail')->store('course-thumbnails', 'public');
            $validated['thumbnail'] = Storage::url($path);
        }

        $course->update($validated);

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);

        // Delete thumbnail if exists
        if ($course->thumbnail && Storage::disk('public')->exists($course->thumbnail)) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
} 