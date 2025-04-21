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
        'feedback',
        'ai_analysis',
        'completed_at',
    ];

    protected $casts = [
        'answers' => 'array',
        'score' => 'float',
        'ai_analysis' => 'array',
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

    // Scopes
    public function scopePassed($query)
    {
        return $query->where('score', '>=', function ($query) {
            $query->select('passing_score')
                ->from('assessments')
                ->whereColumn('id', 'assessment_results.assessment_id');
        });
    }

    public function scopeFailed($query)
    {
        return $query->where('score', '<', function ($query) {
            $query->select('passing_score')
                ->from('assessments')
                ->whereColumn('id', 'assessment_results.assessment_id');
        });
    }

    // Helper Methods
    public function getIsPassingAttribute(): bool
    {
        return $this->score >= $this->assessment->passing_score;
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
        foreach ($this->assessment->question_bank as $question) {
            $answer = collect($this->answers)->firstWhere('question_id', $question['id']);
            $results[] = [
                'question_id' => $question['id'],
                'question' => $question['question'],
                'type' => $question['type'],
                'student_answer' => $answer ? $answer['answer'] : null,
                'correct_answer' => $question['correct_answer'],
                'points' => $question['points'],
                'is_correct' => $answer ? $this->isAnswerCorrect($question, $answer['answer']) : false,
            ];
        }
        return $results;
    }

    private function isAnswerCorrect(array $question, string $answer): bool
    {
        if ($question['type'] === 'multiple_choice' || $question['type'] === 'true_false') {
            return strtolower(trim($answer)) === strtolower(trim($question['correct_answer']));
        }

        // For short answer and essay questions, we'll rely on the AI analysis
        return true;
    }

    public function getQuestionAnalysis()
    {
        return $this->ai_analysis['question_analysis'] ?? [];
    }

    public function getPerformanceInsights()
    {
        return $this->ai_analysis['performance_insights'] ?? [];
    }

    public function getRecommendedResources()
    {
        return $this->ai_analysis['recommended_resources'] ?? [];
    }
} 