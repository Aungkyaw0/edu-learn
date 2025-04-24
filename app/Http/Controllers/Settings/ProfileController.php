<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('settings/Profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'bio' => $user->bio,
                'profile_picture' => $user->profile_picture ?: '/images/default-avatar.png',
                'preferences' => $user->preferences ?? [
                    'email_notifications' => true,
                    'language' => 'en',
                    'theme' => 'light',
                    'learning_style' => 'visual',
                    'difficulty_preference' => 'balanced',
                    'interests' => [],
                ],
            ],
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();

            // Log the received data for debugging
            \Log::info('Profile update request data:', $request->all());

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
                'bio' => ['nullable', 'string', 'max:500'],
                'profile_picture' => ['nullable', 'image', 'max:2048'],
                'preferences' => ['nullable', 'array'], // Changed to array since we're receiving JSON data
            ], [
                'name.required' => 'The name field is required.',
                'email.required' => 'The email field is required.',
                'email.email' => 'Please enter a valid email address.',
                'email.unique' => 'This email is already taken.',
                'profile_picture.image' => 'The profile picture must be an image.',
                'profile_picture.max' => 'The profile picture must not be larger than 2MB.',
                'preferences.array' => 'The preferences must be a valid array.',
            ]);

            // Handle profile picture upload
            if ($request->hasFile('profile_picture')) {
                try {
                    // Delete old profile picture if it exists
                    if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
                        Storage::disk('public')->delete($user->profile_picture);
                    }

                    // Store new profile picture
                    $path = $request->file('profile_picture')->store('profile-pictures', 'public');
                    $validated['profile_picture'] = Storage::url($path);
                } catch (\Exception $e) {
                    \Log::error('Profile picture upload failed: ' . $e->getMessage());
                    return back()->withErrors(['profile_picture' => 'Failed to upload profile picture.']);
                }
            }

            // Handle preferences - no need to decode as it's already an array
            if ($request->has('preferences')) {
                $validated['preferences'] = $request->input('preferences');
            }

            $user->fill($validated);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            $user->save();

            // Log successful update
            \Log::info('Profile updated successfully for user: ' . $user->id);

            return back()->with([
                'success' => 'Profile updated successfully.',
                'user' => $user->fresh()
            ]);

        } catch (\Exception $e) {
            // Log the error
            \Log::error('Profile update failed: ' . $e->getMessage());
            
            return back()->withErrors([
                'error' => 'Failed to update profile. ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Delete profile picture if it exists
        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
