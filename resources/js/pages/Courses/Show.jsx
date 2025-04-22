import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ course, enrollmentStatus, auth }) {
    const { post, processing } = useForm();
    const [expandedModules, setExpandedModules] = useState(new Set());

    const handleEnrollmentRequest = () => {
        post(route('enrollment-requests.store', course.id), {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(route('student.my-learning'));
            },
            onError: (errors) => {
                console.error('Enrollment request failed:', errors);
            }
        });
    };

    const handleModuleClick = (moduleId) => {
        setExpandedModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId);
            } else {
                newSet.add(moduleId);
            }
            return newSet;
        });
    };

    const isModuleExpanded = (moduleId) => {
        return expandedModules.has(moduleId);
    };

    const getEnrollmentButton = () => {
        if (!auth?.user) {
            return (
                <Link
                    href={route('login')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Login to Enroll
                </Link>
            );
        }

        if (auth.user.role !== 'student') {
            return null;
        }

        switch (enrollmentStatus) {
            case 'accepted':
                return (
                    <Link
                        href={route('student.course.learn', course.id)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                        Continue Learning
                    </Link>
                );
            case 'pending':
                return (
                    <button
                        disabled
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600"
                    >
                        Enrollment Pending
                    </button>
                );
            case 'rejected':
                return (
                    <button
                        disabled
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600"
                    >
                        Enrollment Rejected
                    </button>
                );
            default:
                return (
                    <button
                        onClick={handleEnrollmentRequest}
                        disabled={processing}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        {processing ? 'Processing...' : 'Request Enrollment'}
                    </button>
                );
        }
    };

    return (
        <AppLayout>
            <Head title={course.title} />

            <div className="py-12">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8">
                    {/* Course Header */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="relative h-96">
                            <img
                                src={course.thumbnail || '/images/default-course.jpg'}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="text-center text-white px-4">
                                    <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                                    <p className="text-xl mb-6">{course.description}</p>
                                    {getEnrollmentButton()}
                                </div>
                            </div>
                        </div>

                        {/* Course Details */}
                        <div className="p-8 text-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Column - Course Info */}
                                <div className="md:col-span-2">
                                    <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                                    <div className="prose max-w-none">
                                        <p>{course.description}</p>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold mb-4">What You'll Learn</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {course.learning_outcomes?.map((outcome, index) => (
                                                <li key={index} className="flex items-start">
                                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{outcome}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Course Modules */}
                                    <div className="mt-8 text-gray-800">
                                        <h3 className="text-xl font-bold mb-4">Course Modules</h3>
                                        <div className="space-y-4">
                                            {course.modules?.map((module) => (
                                                <div key={module.id} className="bg-gray-50 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => handleModuleClick(module.id)}
                                                        className="w-full p-6 text-left hover:bg-gray-100 transition-colors duration-150"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-lg font-medium text-gray-900">
                                                                Module Name - {module.title}
                                                            </h4>
                                                            
                                                            <svg
                                                                className={`h-6 w-6 text-gray-500 transform transition-transform duration-200 ${
                                                                    isModuleExpanded(module.id) ? 'rotate-180' : ''
                                                                }`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <p className="text-gray-600">{module.description}</p>
                                                        <div className="mt-4 flex items-center text-sm text-gray-500">
                                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {module.duration} minutes
                                                        </div>
                                                    </button>
                                                    
                                                    {isModuleExpanded(module.id) && (
                                                        <div className="px-6 pb-6 bg-white border-t border-gray-200">
                                                            <div className="mt-4">
                                                                
                                                                {module.content && (
                                                                    <div className="mt-4 prose max-w-none text-gray-800">
                                                                        {module.content}
                                                                    </div>
                                                                )}
                                                                {enrollmentStatus === 'accepted' && (
                                                                    <div className="mt-6 flex justify-end">
                                                                        <Link
                                                                            href={route('student.course.learn', course.id)}
                                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                                        >
                                                                            Start Learning
                                                                        </Link>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Course Details */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Instructor</h4>
                                            <div className="mt-2 flex items-center">
                                                <img
                                                    src={course.instructor.profile_picture || '/images/default-avatar.png'}
                                                    alt={course.instructor.name}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                                <span className="ml-3 text-gray-900 font-medium">
                                                    {course.instructor.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Category</h4>
                                            <p className="mt-1 text-gray-900">{course.category || 'Uncategorized'}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                                            <p className="mt-1 text-gray-900">{course.duration || 0} hours</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Difficulty Level</h4>
                                            <p className="mt-1 text-gray-900">{course.difficulty_level || 'Beginner'}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Price</h4>
                                            <p className="mt-1 text-gray-900">${course.price || 0}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                                            <div className="mt-1 flex items-center">
                                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="ml-1 text-gray-900">
                                                    {course.rating || '0'} ({course.reviews_count || '0'} reviews)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}