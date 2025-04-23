<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'user_id',
        'answers',
        'score',
        'passed',
        'completed_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'score' => 'integer',
        'passed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Helper Methods
    public function calculateAndUpdateScore(): void
    {
        $this->score = $this->assessment->calculateScore($this->answers);
        $this->passed = $this->assessment->isPassing($this->score);
        $this->save();
    }

    public function getTimeTakenAttribute(): int
    {
        if (!$this->completed_at || !$this->created_at) {
            return 0;
        }
        return $this->completed_at->diffInSeconds($this->created_at);
    }

    public function getQuestionResultsAttribute(): array
    {
        $results = [];
        foreach ($this->assessment->questions as $index => $question) {
            $studentAnswer = $this->answers[$index] ?? null;
            $correctAnswerText = isset($question['options'][$question['correct_answer']]) 
                ? $question['options'][$question['correct_answer']] 
                : null;
            
            $results[] = [
                'question' => $question['question'],
                'student_answer' => $studentAnswer,
                'student_answer_text' => isset($studentAnswer) ? $question['options'][$studentAnswer] : null,
                'correct_answer' => $question['correct_answer'],
                'correct_answer_text' => $correctAnswerText,
                'is_correct' => isset($studentAnswer) && $studentAnswer === $question['correct_answer'],
                'options' => $question['options'],
            ];
        }
        return $results;
    }

    public function validateAnswers(): bool
    {
        if (!is_array($this->answers) || count($this->answers) !== 10) {
            return false;
        }

        foreach ($this->answers as $answer) {
            if (!is_int($answer) || $answer < 0 || $answer > 3) {
                return false;
            }
        }

        return true;
    }
} 