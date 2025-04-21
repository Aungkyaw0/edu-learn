<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentRequestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Public routes
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Auth routes
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

// Course routes
Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');

// Protected routes
Route::middleware(['auth'])->group(function () {
    // Student routes
    Route::middleware('role:student')->group(function () {
        Route::post('/courses/{course}/enroll', [CourseController::class, 'enroll'])->name('courses.enroll');
        Route::get('/courses/{course}/learn', [CourseController::class, 'learn'])->name('courses.learn');
        Route::get('/courses/{course}/lessons/{lesson}', [CourseController::class, 'showLesson'])->name('courses.lessons.show');
        Route::post('/courses/{course}/lessons/{lesson}/complete', [CourseController::class, 'completeLesson'])->name('courses.lessons.complete');
        Route::get('/courses/{course}/assessments/{assessment}', [AssessmentController::class, 'show'])->name('assessments.show');
        Route::post('/courses/{course}/assessments/{assessment}/submit', [AssessmentController::class, 'submit'])->name('assessments.submit');
    });

    // Instructor routes
    Route::middleware('role:instructor')->prefix('instructor')->name('instructor.')->group(function () {
        // Course management
        Route::get('/courses', [CourseController::class, 'instructorIndex'])->name('courses.index');
        Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
        Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
        Route::get('/courses/{course}', [CourseController::class, 'instructorShow'])->name('courses.show');
        Route::get('/courses/{course}/edit', [CourseController::class, 'edit'])->name('courses.edit');
        Route::put('/courses/{course}', [CourseController::class, 'update'])->name('courses.update');
        Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');

        // Module management
        Route::post('/courses/{course}/modules', [ModuleController::class, 'store'])->name('modules.store');
        Route::put('/modules/{module}', [ModuleController::class, 'update'])->name('modules.update');
        Route::delete('/modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');

        // Lesson management
        Route::post('/modules/{module}/lessons', [LessonController::class, 'store'])->name('lessons.store');
        Route::put('/lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
        Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');

        // Assessment management
        Route::get('/courses/{course}/assessments', [AssessmentController::class, 'index'])->name('assessments.index');
        Route::get('/courses/{course}/assessments/create', [AssessmentController::class, 'create'])->name('assessments.create');
        Route::post('/courses/{course}/assessments', [AssessmentController::class, 'store'])->name('assessments.store');
        Route::get('/courses/{course}/assessments/{assessment}/edit', [AssessmentController::class, 'edit'])->name('assessments.edit');
        Route::put('/courses/{course}/assessments/{assessment}', [AssessmentController::class, 'update'])->name('assessments.update');
        Route::delete('/courses/{course}/assessments/{assessment}', [AssessmentController::class, 'destroy'])->name('assessments.destroy');
        Route::get('/courses/{course}/assessments/{assessment}/results', [AssessmentController::class, 'getResults'])->name('assessments.results');
    });

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return inertia('Admin/Dashboard');
        })->name('admin.dashboard');
    });

    // Student routes
    Route::middleware(['auth', 'role:student'])->group(function () {
        Route::get('/my-learning', [EnrollmentRequestController::class, 'myLearning'])->name('student.my-learning');
        Route::post('/courses/{course}/enroll', [EnrollmentRequestController::class, 'store'])->name('enrollment-requests.store');
    });
});

// Instructor routes for managing enrollment requests
Route::middleware(['auth', 'role:instructor'])->group(function () {
    Route::post('/enrollment-requests/{request}/accept', [EnrollmentRequestController::class, 'accept'])->name('enrollment-requests.accept');
    Route::post('/enrollment-requests/{request}/reject', [EnrollmentRequestController::class, 'reject'])->name('enrollment-requests.reject');
});

Route::middleware(['auth', 'role:instructor'])->group(function () {
    Route::get('/instructor/dashboard', [DashboardController::class, 'index'])->name('instructor.dashboard');
    
    // Course routes
    Route::get('/instructor/courses', [CourseController::class, 'instructorIndex'])->name('instructor.courses.index');
    Route::get('/instructor/courses/create', [CourseController::class, 'create'])->name('instructor.courses.create');
    Route::post('/instructor/courses', [CourseController::class, 'store'])->name('instructor.courses.store');
    Route::get('/instructor/courses/{course}/edit', [CourseController::class, 'edit'])->name('instructor.courses.edit');
    Route::put('/instructor/courses/{course}', [CourseController::class, 'update'])->name('instructor.courses.update');
    Route::delete('/instructor/courses/{course}', [CourseController::class, 'destroy'])->name('instructor.courses.destroy');

    // Module routes
    Route::get('/instructor/modules/create', [ModuleController::class, 'create'])->name('instructor.modules.create');
    Route::post('/instructor/modules', [ModuleController::class, 'store'])->name('instructor.modules.store');
    Route::get('/instructor/modules/{module}/edit', [ModuleController::class, 'edit'])->name('instructor.modules.edit');
    Route::put('/instructor/modules/{module}', [ModuleController::class, 'update'])->name('instructor.modules.update');
    Route::delete('/instructor/modules/{module}', [ModuleController::class, 'destroy'])->name('instructor.modules.destroy');

    // Lesson routes
    Route::get('/instructor/lessons/create', [LessonController::class, 'create'])->name('instructor.lessons.create');
    Route::post('/instructor/lessons', [LessonController::class, 'store'])->name('instructor.lessons.store');
    Route::get('/instructor/lessons/{lesson}/edit', [LessonController::class, 'edit'])->name('instructor.lessons.edit');
    Route::put('/instructor/lessons/{lesson}', [LessonController::class, 'update'])->name('instructor.lessons.update');
    Route::delete('/instructor/lessons/{lesson}', [LessonController::class, 'destroy'])->name('instructor.lessons.destroy');
});

require __DIR__.'/auth.php';
