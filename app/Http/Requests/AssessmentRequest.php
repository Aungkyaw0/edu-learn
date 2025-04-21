<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssessmentRequest extends FormRequest
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
            'question_bank' => ['required', 'array'],
            'question_bank.*.question' => ['required', 'string'],
            'question_bank.*.type' => ['required', 'string', Rule::in(['multiple_choice', 'true_false', 'short_answer', 'essay'])],
            'question_bank.*.options' => ['required_if:question_bank.*.type,multiple_choice', 'array'],
            'question_bank.*.correct_answer' => ['required', 'string'],
            'question_bank.*.points' => ['required', 'integer', 'min:1'],
            'time_limit' => ['nullable', 'integer', 'min:1'],
            'passing_score' => ['required', 'integer', 'min:1'],
            'is_published' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The assessment title is required.',
            'title.max' => 'The assessment title may not be greater than 255 characters.',
            'description.required' => 'The assessment description is required.',
            'question_bank.required' => 'The question bank is required.',
            'question_bank.*.question.required' => 'Each question must have a text.',
            'question_bank.*.type.required' => 'Each question must have a type.',
            'question_bank.*.type.in' => 'Invalid question type.',
            'question_bank.*.options.required_if' => 'Multiple choice questions must have options.',
            'question_bank.*.correct_answer.required' => 'Each question must have a correct answer.',
            'question_bank.*.points.required' => 'Each question must have points assigned.',
            'question_bank.*.points.min' => 'Each question must have at least 1 point.',
            'time_limit.min' => 'Time limit must be at least 1 minute.',
            'passing_score.required' => 'The passing score is required.',
            'passing_score.min' => 'The passing score must be at least 1.',
        ];
    }
} 