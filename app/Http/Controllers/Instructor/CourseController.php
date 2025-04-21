<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function store(StoreCourseRequest $request)
    {
        $validated = $request->validated();
        $validated['instructor_id'] = auth()->id();
        
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('course-thumbnails', 'public');
        }

        $course = Course::create($validated);

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course created successfully.');
    }
} 