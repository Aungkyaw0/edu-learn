<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'difficulty_level',
        'thumbnail',
        'is_published',
        'instructor_id',
        'price',
        'metadata',
        'duration',
        'learning_outcomes',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'price' => 'decimal:2',
        'metadata' => 'json',
        'learning_outcomes' => 'json',
    ];

    /**
     * Get the instructor that owns the course.
     */
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get the modules for the course.
     */
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order_index');
    }

    /**
     * Get the enrollments for the course.
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the assessments for the course.
     */
    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class);
    }

    /**
     * Get the enrollment requests for the course.
     */
    public function enrollmentRequests(): HasMany
    {
        return $this->hasMany(EnrollmentRequest::class);
    }

    /**
     * Get the pending enrollment requests for the course.
     */
    public function pendingEnrollmentRequests(): HasMany
    {
        return $this->enrollmentRequests()->where('status', 'pending');
    }

    /**
     * Get the enrolled students for the course.
     */
    public function enrolledStudents(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollment_requests')
                    ->wherePivot('status', 'accepted');
    }

    /**
     * Get the lessons for the course.
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    /**
     * Get the assessment for the course.
     */
    public function assessment(): HasOne
    {
        return $this->hasOne(Assessment::class);
    }

    /**
     * Scope a query to only include published courses.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to only include courses by difficulty level.
     */
    public function scopeByDifficulty($query, $level)
    {
        return $query->where('difficulty_level', $level);
    }
}