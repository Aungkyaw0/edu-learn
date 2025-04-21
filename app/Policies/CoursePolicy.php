<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CoursePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Course $course): bool
    {
        return true; // Anyone can view published courses
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'instructor';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Course $course): bool
    {
        return $user->id === $course->instructor_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Course $course): bool
    {
        return $user->id === $course->instructor_id;
    }

    /**
     * Determine whether the user can manage modules.
     */
    public function manageModules(User $user, Course $course): bool
    {
        return $user->id === $course->instructor_id;
    }

    /**
     * Determine whether the user can manage lessons.
     */
    public function manageLessons(User $user, Course $course): bool
    {
        return $user->id === $course->instructor_id;
    }
} 