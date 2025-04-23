<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'questions',
        'passing_score',
        'is_published',
    ];

    protected $casts = [
        'questions' => 'array',
        'is_published' => 'boolean',
        'passing_score' => 'integer',
    ];

    // Relationships
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }

    // Helper Methods
    public function calculateScore(array $answers): int
    {
        $correctAnswers = 0;
        foreach ($this->questions as $index => $question) {
            if (isset($answers[$index]) && $answers[$index] === $question['correct_answer']) {
                $correctAnswers++;
            }
        }
        return $correctAnswers;
    }

    public function isPassing(int $score): bool
    {
        return $score >= $this->passing_score;
    }

    public function validateQuestions(): bool
    {
        if (!is_array($this->questions) || count($this->questions) !== 10) {
            return false;
        }

        foreach ($this->questions as $question) {
            if (!isset($question['question']) || 
                !isset($question['options']) || 
                !isset($question['correct_answer']) || 
                !is_array($question['options']) || 
                count($question['options']) !== 4 || 
                !in_array($question['correct_answer'], [0, 1, 2, 3])) {
                return false;
            }
        }

        return true;
    }
} 