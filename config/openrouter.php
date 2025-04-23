<?php

return [
    /*
    |--------------------------------------------------------------------------
    | OpenRouter API Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for the OpenRouter API integration.
    |
    */

    'verify_ssl' => env('OPENROUTER_VERIFY_SSL', false),
    'api_key' => env('OPENROUTER_API_KEY'),
    'base_url' => env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
]; 