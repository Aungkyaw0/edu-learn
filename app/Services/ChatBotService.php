<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class ChatBotService
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

    public function generateResponse(string $message)
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
                                'text' => "You are a helpful educational assistant for EduLearn, an online learning platform. Your responses should be informative, encouraging, and focused on helping users with their learning journey. Format your responses in Markdown for better readability. This is the user's question: {$message}"
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
                throw new Exception('Failed to generate response');
            }

            $result = $response->json();
            return $result['choices'][0]['message']['content'] ?? 'I apologize, but I could not generate a response at this time.';

        } catch (Exception $e) {
            Log::error('ChatBot Error', [
                'message' => $message,
                'error' => $e->getMessage()
            ]);
            throw new Exception('Failed to generate response. Please try again later.');
        }
    }
} 