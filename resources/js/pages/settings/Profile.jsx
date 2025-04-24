import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import EditProfileModal from '@/Components/Profile/EditProfileModal';
import { router } from '@inertiajs/react';

export default function Profile({ auth, user }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        // Refresh the page to get the latest user data
        router.reload({ only: ['user'] });
    };

    // Ensure user data is properly initialized
    const userData = user || {
        name: '',
        email: '',
        bio: '',
        profile_picture: '/images/default-avatar.png',
        preferences: {
            email_notifications: true,
            language: 'en',
            theme: 'light',
            learning_style: 'visual',
            difficulty_preference: 'balanced',
            interests: [],
        },
    };

    return (
        <AppLayout user={auth.user}>
            <div className="py-12 text-gray-800">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-semibold">Profile Settings</h2>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Name</h4>
                                            <p className="mt-1">{userData.name || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                            <p className="mt-1">{userData.email || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                                            <p className="mt-1">{userData.bio || 'No bio provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-2">Preferences</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Email Notifications</h4>
                                            <p className="mt-1">{userData.preferences?.email_notifications ? 'Enabled' : 'Disabled'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Language</h4>
                                            <p className="mt-1">{userData.preferences?.language || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Theme</h4>
                                            <p className="mt-1 capitalize">{userData.preferences?.theme || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Learning Style</h4>
                                            <p className="mt-1 capitalize">{userData.preferences?.learning_style || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Content Difficulty</h4>
                                            <p className="mt-1 capitalize">{userData.preferences?.difficulty_preference || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Interests</h4>
                                            <p className="mt-1">
                                                {userData.preferences?.interests?.length 
                                                    ? userData.preferences.interests.join(', ') 
                                                    : 'No interests selected'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-2">Profile Picture</h3>
                                <img
                                    src={userData.profile_picture}
                                    alt="Profile"
                                    className="h-32 w-32 rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={handleModalClose}
                user={userData}
            />
        </AppLayout>
    );
} 