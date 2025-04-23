<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class AIAssessmentService
{
    protected $apiKey;
    protected $apiUrl;
    protected $verifySSL;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.key');
        $this->apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        $this->verifySSL = config('openrouter.verify_ssl', false);
    }

    public function generateAssessment(string $courseContent)
    {
        try {
            $response = Http::withOptions([
                'verify' => $this->verifySSL
            ])->withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'model' => 'meta-llama/llama-4-maverick:free',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => [
                            [
                                'type' => 'text',
                                'text' => "Generate 10 multiple choice questions with options and correct answers based on the following course content. Return only a JSON array without any additional text. Each question should have a 'options' array with 4 choices, 'question' field, and 'correct_answer' field with the correct answer: {$courseContent}"
                            ]
                        ]
                    ]
                ]
            ]);

            if (!$response->successful()) {
                Log::error('AI API Error', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                throw new Exception('Failed to generate assessment questions');
            }

            $result = $response->json();
            $content = $result['choices'][0]['message']['content'];
            
            // Clean up the content string (remove ```json and ``` if present)
            $content = preg_replace('/```json\n?|\n?```/', '', $content);
            
            // Parse the JSON content
            $questions = json_decode($content, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Failed to parse AI response: ' . json_last_error_msg());
            }

            return $questions;
        } catch (Exception $e) {
            Log::error('Assessment Generation Error', [
                'course_id' => $courseContent,
                'error' => $e->getMessage()
            ]);
            throw new Exception('Failed to generate assessment. Please try again later.');
        }
    }
} 