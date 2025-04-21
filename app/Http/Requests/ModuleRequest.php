<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'content' => ['required', 'string'],
            'order_index' => ['required', 'integer', 'min:1'],
            'resources' => ['nullable', 'array'],
            'metadata' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The module title is required.',
            'title.max' => 'The module title may not be greater than 255 characters.',
            'description.required' => 'The module description is required.',
            'content.required' => 'The module content is required.',
            'order_index.required' => 'The module order index is required.',
            'order_index.integer' => 'The module order index must be an integer.',
            'order_index.min' => 'The module order index must be at least 1.',
            'resources.array' => 'The module resources must be an array.',
            'metadata.array' => 'The module metadata must be an array.',
        ];
    }
} 