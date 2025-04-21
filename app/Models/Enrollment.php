<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'enrollment_date',
        'progress_percentage',
        'last_accessed',
        'completion_data',
    ];

    protected $casts = [
        'enrollment_date' => 'datetime',
        'last_accessed' => 'datetime',
        'completion_data' => 'json',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('progress_percentage', 100);
    }

    public function scopeInProgress($query)
    {
        return $query->where('progress_percentage', '<', 100);
    }

    // Helper Methods
    public function updateProgress($moduleId)
    {
        $totalModules = $this->course->modules()->count();
        if ($totalModules === 0) return;

        $completedModules = $this->completion_data['completed_modules'] ?? [];
        if (!in_array($moduleId, $completedModules)) {
            $completedModules[] = $moduleId;
            $this->completion_data = [
                'completed_modules' => $completedModules,
                'last_completed_module' => $moduleId,
                'last_completed_at' => now(),
            ];
            $this->progress_percentage = (count($completedModules) / $totalModules) * 100;
            $this->save();
        }
    }

    public function isCompleted()
    {
        return $this->progress_percentage === 100;
    }

    public function getTimeSpent()
    {
        return $this->completion_data['time_spent'] ?? 0;
    }
} 