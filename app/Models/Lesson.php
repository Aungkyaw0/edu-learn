<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'title',
        'content',
        'duration',
        'order_index',
        'resources',
        'metadata'
    ];

    protected $casts = [
        'duration' => 'integer',
        'order_index' => 'integer',
        'resources' => 'array',
        'metadata' => 'json'
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
} 