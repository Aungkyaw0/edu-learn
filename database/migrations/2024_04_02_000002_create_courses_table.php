<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->foreignId('instructor_id')->constrained('users');
            $table->string('category');
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
            $table->string('thumbnail')->nullable();
            $table->boolean('is_published')->default(false);
            $table->decimal('price', 10, 2)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
}; 