<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'content',
        'order_index',
        'resources',
        'metadata',
    ];

    protected $casts = [
        'order_index' => 'integer',
        'resources' => 'array',
        'metadata' => 'json',
    ];

    /**
     * Get the course that owns the module.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the lessons for the module.
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order_index');
    }

    // Scopes
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index');
    }

    // Helper Methods
    public function getNextModule()
    {
        return $this->course->modules()
            ->where('order_index', '>', $this->order_index)
            ->orderBy('order_index')
            ->first();
    }

    public function getPreviousModule()
    {
        return $this->course->modules()
            ->where('order_index', '<', $this->order_index)
            ->orderByDesc('order_index')
            ->first();
    }

    public function getResourceCount()
    {
        return count($this->resources ?? []);
    }

    public function getEstimatedDuration()
    {
        return $this->metadata['estimated_duration'] ?? 0;
    }
} 