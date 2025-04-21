<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AssessmentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Public course routes
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);

        // Course routes
        Route::middleware('role:instructor,admin')->group(function () {
            Route::post('/courses', [CourseController::class, 'store']);
            Route::put('/courses/{course}', [CourseController::class, 'update']);
            Route::delete('/courses/{course}', [CourseController::class, 'destroy']);
            Route::post('/courses/{course}/publish', [CourseController::class, 'publish']);
            Route::post('/courses/{course}/unpublish', [CourseController::class, 'unpublish']);
            Route::get('/instructor/courses', [CourseController::class, 'getInstructorCourses']);
        });

        // Module routes will be added here
        // Assessment routes
        Route::middleware(['auth:sanctum', 'check.role:instructor,student'])->group(function () {
            Route::get('/courses/{course}/assessments', [AssessmentController::class, 'index']);
            Route::get('/assessments/{assessment}', [AssessmentController::class, 'show']);
            Route::post('/assessments/{assessment}/submit', [AssessmentController::class, 'submit']);
            Route::get('/assessments/{assessment}/results', [AssessmentController::class, 'getResults']);
            Route::get('/assessments/{assessment}/results/{user}', [AssessmentController::class, 'getStudentResult']);
        });

        Route::middleware(['auth:sanctum', 'check.role:instructor'])->group(function () {
            Route::post('/courses/{course}/assessments', [AssessmentController::class, 'store']);
            Route::put('/assessments/{assessment}', [AssessmentController::class, 'update']);
            Route::delete('/assessments/{assessment}', [AssessmentController::class, 'destroy']);
        });

        // Enrollment routes will be added here
    });
}); 