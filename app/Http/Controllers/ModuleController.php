<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ModuleController extends Controller
{
    use AuthorizesRequests;
    public function index(Course $course): JsonResponse
    {
        $this->authorize('view', $course);

        $modules = $course->modules()
            ->ordered()
            ->get();

        return response()->json($modules);
    }

    public function create(Request $request)
    {
        $course = Course::findOrFail($request->query('course'));
        $this->authorize('update', $course);

        return Inertia::render('Instructor/Modules/Create', [
            'course' => $course
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'order_index' => 'required|integer|min:0',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        $this->authorize('update', $course);

        $module = Module::create($validated);

        return redirect()->route('instructor.courses.edit', $course->id)
            ->with('success', 'Module created successfully.');
    }

    public function show(Course $course, Module $module): JsonResponse
    {
        $this->authorize('view', $course);

        return response()->json($module);
    }

    public function edit(Module $module)
    {
        $this->authorize('update', $module->course);

        return Inertia::render('Instructor/Modules/Edit', [
            'module' => $module->load('lessons'),
            'course' => $module->course
        ]);
    }

    public function update(Request $request, Module $module)
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'order_index' => 'required|integer|min:0',
        ]);

        $module->update($validated);

        return redirect()->route('instructor.courses.edit', $module->course_id)
            ->with('success', 'Module updated successfully.');
    }

    public function destroy(Module $module)
    {
        $this->authorize('update', $module->course);
        
        $courseId = $module->course_id;
        $module->delete();

        return redirect()->route('instructor.courses.edit', $courseId)
            ->with('success', 'Module deleted successfully.');
    }

    public function reorder(Request $request, Course $course): JsonResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'modules' => ['required', 'array'],
            'modules.*.id' => ['required', 'exists:modules,id'],
            'modules.*.order_index' => ['required', 'integer', 'min:1'],
        ]);

        foreach ($validated['modules'] as $moduleData) {
            $course->modules()
                ->where('id', $moduleData['id'])
                ->update(['order_index' => $moduleData['order_index']]);
        }

        return response()->json(['message' => 'Modules reordered successfully']);
    }

    public function getNextModule(Course $course, Module $module): JsonResponse
    {
        $this->authorize('view', $course);

        $nextModule = $module->getNextModule();

        return response()->json($nextModule);
    }

    public function getPreviousModule(Course $course, Module $module): JsonResponse
    {
        $this->authorize('view', $course);

        $previousModule = $module->getPreviousModule();

        return response()->json($previousModule);
    }
} 