import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Lesson({ course, module, lesson, enrollment }) {
    const { post, processing } = useForm();
    const [isCompleted, setIsCompleted] = useState(
        enrollment.completion_data?.completed_lessons?.includes(lesson.id) || false
    );

    const handleCompleteLesson = () => {
        post(route('student.lessons.complete', [course.id, lesson.id]), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCompleted(true);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`${lesson.title} - ${course.title}`} />

            <div className="min-h-screen bg-gray-100">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Lesson Header */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Module: {module.title} | Course: {course.title}
                                    </p>
                                </div>
                                {!isCompleted && (
                                    <button
                                        onClick={handleCompleteLesson}
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        {processing ? 'Marking as complete...' : 'Mark as Complete'}
                                    </button>
                                )}
                                {isCompleted && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                            </div>

                            {/* Lesson Resources */}
                            {lesson.resources && lesson.resources.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Resources</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {lesson.resources.map((resource) => (
                                            <a
                                                key={resource.id}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex-shrink-0">
                                                    <svg
                                                        className="h-6 w-6 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {resource.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">{resource.description}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Back to Module
                                </button>
                                {!isCompleted && (
                                    <button
                                        onClick={handleCompleteLesson}
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        {processing ? 'Marking as complete...' : 'Mark as Complete'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 