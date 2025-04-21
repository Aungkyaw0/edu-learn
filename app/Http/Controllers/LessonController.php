<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class LessonController extends Controller
{
    use AuthorizesRequests;
    public function store(Request $request)
    {

        $validated = $request->validate([
            'module_id' => ['required', 'exists:modules,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'duration' => ['required', 'integer', 'min:1'], // duration in minutes
            'order_index' => ['required', 'integer', 'min:0'],
        ]);
        
        $module = Module::findOrFail($validated['module_id']);
        $this->authorize('update', $module->course);

        $lesson = $module->lessons()->create($validated);

        return back()->with('success', 'Lesson created successfully.');
    }

    public function update(Request $request, Module $module, Lesson $lesson)
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'duration' => ['required', 'integer', 'min:1'],
            'order_index' => ['required', 'integer', 'min:0'],
        ]);

        $lesson->update($validated);

        return back()->with('success', 'Lesson updated successfully.');
    }

    public function destroy(Module $module, Lesson $lesson)
    {
        $this->authorize('delete', $module->course);

        $lesson->delete();

        return back()->with('success', 'Lesson deleted successfully.');
    }
} 