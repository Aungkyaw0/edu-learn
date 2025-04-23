<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AssessmentResult;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class AssessmentController extends Controller
{
    use AuthorizesRequests;
    public function index(Course $course): JsonResponse
    {
        $this->authorize('view', $course);

        $assessments = $course->assessments()
            ->with(['results' => function ($query) {
                $query->where('user_id', Auth::id());
            }])
            ->get();

        return response()->json($assessments);
    }

    public function create(Course $course)
    {
        $this->authorize('update', $course);

        return Inertia::render('Assessment/Create', [
            'course' => $course
        ]);
    }

    public function store(Request $request, Course $course)
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'questions' => 'required|array|size:10',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|size:4',
            'questions.*.options.*' => 'required|string',
            'questions.*.correct_answer' => 'required|integer|min:0|max:3',
        ]);

        // Check if course already has an assessment
        if ($course->assessment) {
            return back()->with('error', 'This course already has an assessment.');
        }

        $assessment = $course->assessment()->create($validated);

        return back()->with('success', 'Assessment created successfully.');
    }

    public function show(Course $course, Assessment $assessment): JsonResponse
    {
        $this->authorize('view', $course);

        if (!$assessment->is_published && !$course->instructor_id === Auth::id()) {
            return response()->json(['message' => 'Assessment not found'], 404);
        }

        return response()->json($assessment);
    }

    public function edit(Course $course, Assessment $assessment)
    {
        $this->authorize('update', $course);
        
        return Inertia::render('Assessment/Edit', [
            'course' => $course,
            'assessment' => $assessment
        ]);
    }

    public function update(Request $request, Course $course, Assessment $assessment)
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'questions' => 'required|array|size:10',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|size:4',
            'questions.*.options.*' => 'required|string',
            'questions.*.correct_answer' => 'required|integer|min:0|max:3',
        ]);

        $assessment->update($validated);

        return back()->with('success', 'Assessment updated successfully.');
    }

    public function destroy(Course $course, Assessment $assessment)
    {
        Gate::authorize('update', $course);

        $assessment->delete();

        return back()->with('success', 'Assessment deleted successfully.');
    }

    public function submit(Request $request, Course $course, Assessment $assessment): JsonResponse
    {
        $this->authorize('view', $course);

        if (!$assessment->is_published) {
            return response()->json(['message' => 'Assessment is not available'], 403);
        }

        // Check if user has already submitted
        if ($assessment->results()->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'You have already submitted this assessment'], 403);
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer'],
            'answers.*.answer' => ['required', 'string'],
        ]);

        // Calculate score
        $score = $this->calculateScore($assessment, $validated['answers']);

        // Generate AI feedback
        $aiAnalysis = $this->generateAIAnalysis($assessment, $validated['answers'], $score);

        $result = AssessmentResult::create([
            'assessment_id' => $assessment->id,
            'user_id' => Auth::id(),
            'score' => $score,
            'answers' => $validated['answers'],
            'feedback' => $aiAnalysis['feedback'],
            'ai_analysis' => $aiAnalysis,
            'completed_at' => now(),
        ]);

        return response()->json($result, 201);
    }

    public function getResults(Course $course, Assessment $assessment): JsonResponse
    {
        $this->authorize('view', $course);

        if ($course->instructor_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $results = $assessment->results()
            ->with('user')
            ->get();

        return response()->json($results);
    }

    public function getStudentResult(Course $course, Assessment $assessment): JsonResponse
    {
        $this->authorize('view', $course);

        $result = $assessment->results()
            ->where('user_id', Auth::id())
            ->first();

        if (!$result) {
            return response()->json(['message' => 'No submission found'], 404);
        }

        return response()->json($result);
    }

    private function calculateScore(Assessment $assessment, array $answers): float
    {
        $totalPoints = 0;
        $earnedPoints = 0;

        foreach ($assessment->question_bank as $question) {
            $totalPoints += $question['points'];
            $studentAnswer = collect($answers)->firstWhere('question_id', $question['id']);

            if ($studentAnswer && $this->isAnswerCorrect($question, $studentAnswer['answer'])) {
                $earnedPoints += $question['points'];
            }
        }

        return ($earnedPoints / $totalPoints) * 100;
    }

    private function isAnswerCorrect(array $question, string $answer): bool
    {
        return strtolower(trim($answer)) === strtolower(trim($question['correct_answer']));
    }

    private function generateAIAnalysis(Assessment $assessment, array $answers, float $score): array
    {
        // This is a placeholder for AI analysis
        // In a real implementation, this would call an AI service
        return [
            'feedback' => "Your score is {$score}%. " . ($score >= $assessment->passing_score ? 'Congratulations! You passed.' : 'Please review the material and try again.'),
            'question_analysis' => [],
            'performance_insights' => [],
            'recommended_resources' => [],
        ];
    }
} 