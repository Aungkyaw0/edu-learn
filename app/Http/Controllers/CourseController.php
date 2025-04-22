<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\EnrollmentRequest;
use App\Models\Enrollment;
use App\Models\Lesson;

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
            'course' => $course->load(['instructor', 'modules']),
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

    public function learn(Course $course)
    {
        // Check if user is enrolled in the course
        $enrollment = Enrollment::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return redirect()->route('student.my-learning')
                ->with('error', 'You are not enrolled in this course.');
        }

        // Update last accessed time
        $enrollment->update(['last_accessed' => now()]);

        return Inertia::render('Student/Course/Learn', [
            'course' => $course->load(['modules.lessons', 'instructor']),
            'enrollment' => $enrollment,
        ]);
    }

    public function completeLesson(Course $course, Lesson $lesson)
    {
        // Check if user is enrolled in the course
        $enrollment = Enrollment::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return redirect()->route('student.my-learning')
                ->with('error', 'You are not enrolled in this course.');
        }

        // Update completion data
        $completionData = $enrollment->completion_data ?? [];
        $completedLessons = $completionData['completed_lessons'] ?? [];
        
        if (!in_array($lesson->id, $completedLessons)) {
            $completedLessons[] = $lesson->id;
            $completionData['completed_lessons'] = $completedLessons;
            
            // Check if all lessons in the module are completed
            $module = $lesson->module;
            $moduleLessons = $module->lessons->pluck('id')->toArray();
            $completedModuleLessons = array_intersect($moduleLessons, $completedLessons);
            
            if (count($completedModuleLessons) === count($moduleLessons)) {
                $completedModules = $completionData['completed_modules'] ?? [];
                if (!in_array($module->id, $completedModules)) {
                    $completedModules[] = $module->id;
                    $completionData['completed_modules'] = $completedModules;
                }
            }
            
            // Update progress percentage
            $totalLessons = $course->modules->sum(function ($module) {
                return $module->lessons->count();
            });
            
            $enrollment->update([
                'completion_data' => $completionData,
                'progress_percentage' => (count($completedLessons) / $totalLessons) * 100,
            ]);
        }

        return back()->with('success', 'Lesson marked as completed.');
    }
} 