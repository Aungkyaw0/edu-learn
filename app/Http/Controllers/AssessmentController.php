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

    public function store(Request $request, Course $course): JsonResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'question_bank' => ['required', 'array'],
            'question_bank.*.question' => ['required', 'string'],
            'question_bank.*.type' => ['required', 'string', Rule::in(['multiple_choice', 'true_false', 'short_answer', 'essay'])],
            'question_bank.*.options' => ['required_if:question_bank.*.type,multiple_choice', 'array'],
            'question_bank.*.correct_answer' => ['required', 'string'],
            'question_bank.*.points' => ['required', 'integer', 'min:1'],
            'time_limit' => ['nullable', 'integer', 'min:1'],
            'passing_score' => ['required', 'integer', 'min:1'],
            'is_published' => ['boolean'],
        ]);

        $assessment = $course->assessments()->create($validated);

        return response()->json($assessment, 201);
    }

    public function show(Course $course, Assessment $assessment): JsonResponse
    {
        $this->authorize('view', $course);

        if (!$assessment->is_published && !$course->instructor_id === Auth::id()) {
            return response()->json(['message' => 'Assessment not found'], 404);
        }

        return response()->json($assessment);
    }

    public function update(Request $request, Course $course, Assessment $assessment): JsonResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'question_bank' => ['sometimes', 'array'],
            'question_bank.*.question' => ['required_with:question_bank', 'string'],
            'question_bank.*.type' => ['required_with:question_bank', 'string', Rule::in(['multiple_choice', 'true_false', 'short_answer', 'essay'])],
            'question_bank.*.options' => ['required_if:question_bank.*.type,multiple_choice', 'array'],
            'question_bank.*.correct_answer' => ['required_with:question_bank', 'string'],
            'question_bank.*.points' => ['required_with:question_bank', 'integer', 'min:1'],
            'time_limit' => ['nullable', 'integer', 'min:1'],
            'passing_score' => ['sometimes', 'integer', 'min:1'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $assessment->update($validated);

        return response()->json($assessment);
    }

    public function destroy(Course $course, Assessment $assessment): JsonResponse
    {
        $this->authorize('update', $course);

        $assessment->delete();

        return response()->json(null, 204);
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