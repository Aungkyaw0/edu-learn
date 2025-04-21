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
        'question_bank',
        'time_limit',
        'passing_score',
        'is_published',
        'metadata',
    ];

    protected $casts = [
        'question_bank' => 'array',
        'is_published' => 'boolean',
        'time_limit' => 'integer',
        'passing_score' => 'integer',
        'metadata' => 'json',
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

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    // Helper Methods
    public function getTotalPointsAttribute(): int
    {
        return collect($this->question_bank)->sum('points');
    }

    public function getQuestionCountAttribute(): int
    {
        return count($this->question_bank);
    }

    public function getAverageScoreAttribute(): float
    {
        if ($this->results->isEmpty()) {
            return 0;
        }

        return $this->results->avg('score');
    }

    public function getPassingRateAttribute(): float
    {
        if ($this->results->isEmpty()) {
            return 0;
        }

        $passingCount = $this->results->where('score', '>=', $this->passing_score)->count();
        return ($passingCount / $this->results->count()) * 100;
    }

    public function getTimeLimitInMinutes()
    {
        return $this->time_limit ?? 0;
    }

    public function getQuestionTypes()
    {
        return collect($this->question_bank)
            ->pluck('type')
            ->unique()
            ->values()
            ->toArray();
    }
} 