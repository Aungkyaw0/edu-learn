<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->float('score')->default(0); // Recommendation score/weight
            $table->string('reason')->nullable(); // Why this course is recommended
            $table->json('metadata')->nullable(); // Additional recommendation data
            $table->timestamps();

            // Ensure unique recommendations per user-course pair
            $table->unique(['user_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_recommendations');
    }
}; 