<?php

namespace App\Http\Controllers;

use App\Services\ChatBotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ChatBotController extends Controller
{
    protected $chatBotService;

    public function __construct(ChatBotService $chatBotService)
    {
        $this->chatBotService = $chatBotService;
    }

    public function chat(Request $request)
    {
        // Log::info('Chatbot Controller :' + $request-);
        Log::info('Validated');
        try {
            $validated = $request->validate([
                'message' => 'required|string|max:1000',
            ]);
            Log::info('Validated');
            Log::info($validated['message']);

            $response = $this->chatBotService->generateResponse($validated['message']);
            Log::info($response);
            
            return back()->with([
                'chat_response' => [
                'content' => $response
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('ChatBot Validation Error:', [
                'errors' => $e->errors(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $e->errors()
                ], 422);
            }

            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('ChatBot Controller Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'An error occurred: ' . $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }
}