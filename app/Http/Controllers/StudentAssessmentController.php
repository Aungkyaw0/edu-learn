<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AssessmentResult;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class StudentAssessmentController extends Controller
{
    use AuthorizesRequests;

    public function show(Course $course, Assessment $assessment)
    {
        $this->authorize('view', $course);

        // Check if student has already completed the assessment
        $result = $assessment->results()
            ->where('user_id', auth()->id())
            ->first();

        if ($result) {
            return Inertia::render('Assessment/Result', [
                'course' => $course,
                'assessment' => $assessment,
                'result' => $result->load('user'),
            ]);
        }

        // Remove correct answers from questions before sending to frontend
        $questions = collect($assessment->questions)->map(function ($question) {
            return [
                'question' => $question['question'],
                'options' => $question['options'],
            ];
        })->all();

        return Inertia::render('Assessment/Take', [
            'course' => $course,
            'assessment' => [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'description' => $assessment->description,
                'questions' => $questions,
            ],
        ]);
    }

    public function take(Course $course)
    {
        // Check if student is enrolled and has completed all lessons
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->firstOrFail();

        $allLessonsCompleted = $course->modules->every(function ($module) use ($enrollment) {
            return $module->lessons->every(function ($lesson) use ($enrollment) {
                return in_array($lesson->id, $enrollment->completion_data['completed_lessons'] ?? []);
            });
        });

        
        // Check if assessment exists
        if (!$course->assessment) {
            return redirect()->route('student.course.learn', $course->id)
                ->with('error', 'No assessment available for this course.');
        }

        // Check if student has already passed the assessment
        $existingResult = AssessmentResult::where('user_id', Auth::id())
            ->where('assessment_id', $course->assessment->id)
            ->where('passed', true)
            ->first();

        if ($existingResult) {
            return redirect()->route('student.course.learn', $course->id)
                ->with('error', 'You have already passed this assessment.');
        }

        return Inertia::render('Student/Assessment/Take', [
            'course' => $course->load('modules.lessons'),
            'assessment' => $course->assessment,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function submit(Request $request, Course $course, Assessment $assessment)
    {
        try {
            Log::info('Assessment submission received', [
                'user_id' => Auth::id(),
                'course_id' => $course->id,
                'assessment_id' => $assessment->id,
                'answers' => $request->input('answers')
            ]);

            // Validate request
            $validated = $request->validate([
                'answers' => 'required|array|size:10',
                'answers.*' => 'required|integer|min:0|max:3',
            ]);

            // Calculate score
            $totalQuestions = count($assessment->questions);
            $correctAnswers = 0;
            $questionResults = [];

            foreach ($validated['answers'] as $index => $answer) {
                $isCorrect = $answer === $assessment->questions[$index]['correct_answer'];
                if ($isCorrect) {
                    $correctAnswers++;
                }
                
                $questionResults[] = [
                    'question' => $assessment->questions[$index]['question'],
                    'options' => $assessment->questions[$index]['options'],
                    'correct_answer' => $assessment->questions[$index]['correct_answer'],
                    'user_answer' => $answer,
                    'is_correct' => $isCorrect
                ];
            }

            $score = ($correctAnswers / $totalQuestions) * 100;
            $passed = $score >= 80; // 80% is passing score

            // Create assessment result
            $result = AssessmentResult::create([
                'assessment_id' => $assessment->id,
                'user_id' => Auth::id(),
                'score' => $score,
                'answers' => $validated['answers'],
                'passed' => $passed,
                'completed_at' => now(),
            ]);

            // If passed, update enrollment status
            if ($passed) {
                $enrollment = Enrollment::where('user_id', Auth::id())
                    ->where('course_id', $course->id)
                    ->first();

                if ($enrollment) {
                    $enrollment->update([
                        'is_completed' => true,
                        'progress_percentage' => 100.00,
                        'completed_at' => now(),
                    ]);
                }
            }

            $resultData = [
                'score' => $score,
                'passed' => $passed,
                'correctAnswers' => $correctAnswers,
                'totalQuestions' => $totalQuestions,
                'questions' => $questionResults
            ];

            session(['assessment_result' => $resultData]);

            return redirect()->route('courses.assessments.result', [
                'course' => $course->id,
                'assessment' => $assessment->id
            ]);

        } catch (\Exception $e) {
            Log::error('Assessment submission error', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'course_id' => $course->id,
                'assessment_id' => $assessment->id,
                'request_data' => $request->all()
            ]);

            return response()->json([
                'message' => 'Failed to submit assessment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showResult(Course $course, Assessment $assessment)
    {
        try {
            $result = session('assessment_result');
            
            if (!$result) {
                // If no result in session, get the latest result for this user and assessment
                $latestResult = AssessmentResult::where('user_id', Auth::id())
                    ->where('assessment_id', $assessment->id)
                    ->latest()
                    ->first();

                if (!$latestResult) {
                    return redirect()->route('courses.assessments.take', $course->id)
                        ->with('error', 'No assessment result found.');
                }

                $result = [
                    'score' => $latestResult->score,
                    'passed' => $latestResult->passed,
                    'correctAnswers' => collect($latestResult->answers)
                        ->filter(function ($answer, $index) use ($assessment) {
                            return $answer === $assessment->questions[$index]['correct_answer'];
                        })->count(),
                    'totalQuestions' => count($assessment->questions),
                    'questions' => collect($assessment->questions)->map(function ($question, $index) use ($latestResult) {
                        return [
                            'question' => $question['question'],
                            'options' => $question['options'],
                            'correct_answer' => $question['correct_answer'],
                            'user_answer' => $latestResult->answers[$index],
                            'is_correct' => $latestResult->answers[$index] === $question['correct_answer']
                        ];
                    })->all()
                ];
            }

            return Inertia::render('Student/Assessment/Result', [
                'course' => $course,
                'assessment' => $assessment,
                'result' => $result,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Assessment result error: ' . $e->getMessage(), [
                'course_id' => $course->id,
                'assessment_id' => $assessment->id,
                'user_id' => Auth::id()
            ]);
            
            return redirect()->route('student.course.learn', $course->id)
                ->with('error', 'Failed to load assessment result.');
        }
    }
} 