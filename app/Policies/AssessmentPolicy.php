<?php

namespace App\Policies;

use App\Models\Assessment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AssessmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Assessment $assessment): bool
    {
        if ($assessment->is_published) {
            return true;
        }

        return $user->id === $assessment->course->instructor_id;
    }

    public function create(User $user): bool
    {
        return $user->role === 'instructor';
    }

    public function update(User $user, Assessment $assessment): bool
    {
        return $user->id === $assessment->course->instructor_id;
    }

    public function delete(User $user, Assessment $assessment): bool
    {
        return $user->id === $assessment->course->instructor_id;
    }

    public function submit(User $user, Assessment $assessment): bool
    {
        if (!$assessment->is_published) {
            return false;
        }

        return $user->role === 'student' && $user->enrollments()
            ->where('course_id', $assessment->course_id)
            ->exists();
    }

    public function viewResults(User $user, Assessment $assessment): bool
    {
        return $user->id === $assessment->course->instructor_id;
    }
} 