import React, { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function EditProfileModal({ isOpen, onClose, user }) {
    const fileInputRef = useRef();
    const [imagePreview, setImagePreview] = useState(user?.profile_picture || '/images/default-avatar.png');

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        profile_picture: null,
        preferences: {
            email_notifications: user?.preferences?.email_notifications ?? true,
            language: user?.preferences?.language ?? 'en',
            theme: user?.preferences?.theme ?? 'light',
            learning_style: user?.preferences?.learning_style ?? 'visual',
            difficulty_preference: user?.preferences?.difficulty_preference ?? 'balanced',
            interests: user?.preferences?.interests ?? [],
        },
    });

    // Update form data when user prop changes
    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                profile_picture: null,
                preferences: {
                    email_notifications: user.preferences?.email_notifications ?? true,
                    language: user.preferences?.language ?? 'en',
                    theme: user.preferences?.theme ?? 'light',
                    learning_style: user.preferences?.learning_style ?? 'visual',
                    difficulty_preference: user.preferences?.difficulty_preference ?? 'balanced',
                    interests: user.preferences?.interests ?? [],
                },
            });
            setImagePreview(user.profile_picture || '/images/default-avatar.png');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('bio', data.bio);
        
        // Send preferences directly as an object
        formData.append('preferences', JSON.stringify(data.preferences));
        
        if (data.profile_picture) {
            formData.append('profile_picture', data.profile_picture);
        }

        // Log the form data for debugging
        console.log('Form Data:', {
            name: data.name,
            email: data.email,
            bio: data.bio,
            preferences: data.preferences,
            profile_picture: data.profile_picture
        });

        patch(route('profile.update'), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            },
            onFinish: () => {
                console.log('Request finished');
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePreferenceChange = (key, value) => {
        setData('preferences', {
            ...data.preferences,
            [key]: value,
        });
    };

    const handleInterestChange = (interest) => {
        const currentInterests = data.preferences?.interests ?? [];
        const updatedInterests = currentInterests.includes(interest)
            ? currentInterests.filter(i => i !== interest)
            : [...currentInterests, interest];
        
        handlePreferenceChange('interests', updatedInterests);
    };

    // Add debug output for initial data
    useEffect(() => {
        console.log('Current form data:', data);
    }, [data]);

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 text-gray-800">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Edit Profile
                </h2>

                <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="h-24 w-24 rounded-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 text-white hover:bg-indigo-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                    {errors.profile_picture && (
                        <p className="text-sm text-red-600">{errors.profile_picture}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={data.bio}
                        onChange={e => setData('bio', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.bio && (
                        <p className="text-sm text-red-600">{errors.bio}</p>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="email_notifications"
                                checked={data.preferences.email_notifications}
                                onChange={e => handlePreferenceChange('email_notifications', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-900">
                                Receive email notifications
                            </label>
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                                Language
                            </label>
                            <select
                                id="language"
                                value={data.preferences.language}
                                onChange={e => handlePreferenceChange('language', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                                Theme
                            </label>
                            <select
                                id="theme"
                                value={data.preferences.theme}
                                onChange={e => handlePreferenceChange('theme', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="learning_style" className="block text-sm font-medium text-gray-700">
                                Learning Style
                            </label>
                            <select
                                id="learning_style"
                                value={data.preferences.learning_style}
                                onChange={e => handlePreferenceChange('learning_style', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="visual">Visual</option>
                                <option value="auditory">Auditory</option>
                                <option value="reading">Reading/Writing</option>
                                <option value="kinesthetic">Kinesthetic</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="difficulty_preference" className="block text-sm font-medium text-gray-700">
                                Content Difficulty
                            </label>
                            <select
                                id="difficulty_preference"
                                value={data.preferences.difficulty_preference}
                                onChange={e => handlePreferenceChange('difficulty_preference', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="beginner">Beginner-focused</option>
                                <option value="balanced">Balanced</option>
                                <option value="advanced">Advanced-focused</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interests
                            </label>
                            <div className="space-y-2">
                                {['Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'UI/UX Design', 'DevOps', 'Cybersecurity'].map((interest) => (
                                    <div key={interest} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`interest-${interest}`}
                                            checked={data.preferences?.interests?.includes(interest) ?? false}
                                            onChange={() => handleInterestChange(interest)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`interest-${interest}`} className="ml-2 block text-sm text-gray-900">
                                            {interest}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 