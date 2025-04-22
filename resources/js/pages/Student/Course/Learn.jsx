import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Learn({ course, enrollment }) {
    const modules = course?.modules || [];
    const [activeModule, setActiveModule] = useState(modules[0]?.id || null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedLessons, setExpandedLessons] = useState(new Set());

    const completedModules = enrollment?.completion_data?.completed_modules || [];
    const progressPercentage = enrollment?.progress_percentage || 0;

    const handleModuleClick = (moduleId) => {
        setActiveModule(moduleId);
        setActiveLesson(null);
        setExpandedLessons(new Set()); // Reset expanded lessons when changing modules
    };

    const handleLessonClick = (lessonId) => {
        setActiveLesson(lessonId);
        // Toggle the expanded state of the clicked lesson
        setExpandedLessons(prev => {
            const newSet = new Set(prev);
            if (newSet.has(lessonId)) {
                newSet.delete(lessonId);
            } else {
                newSet.add(lessonId);
            }
            return newSet;
        });
    };

    const isModuleCompleted = (moduleId) => {
        return completedModules.includes(moduleId);
    };

    const isLessonExpanded = (lessonId) => {
        return expandedLessons.has(lessonId);
    };

    return (
        <AppLayout>
            <Head title={`${course?.title || 'Course'} - Learning`} />

            <div className="min-h-screen bg-gray-100">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Course Header */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
                                    <p className="mt-1 text-sm text-gray-500">Instructor: {course?.instructor?.name}</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-4">
                                        <span className="text-sm font-medium text-gray-500">Progress</span>
                                        <div className="mt-1 h-2 w-32 bg-gray-200 rounded-full">
                                            <div
                                                className="h-full bg-indigo-600 rounded-full"
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {progressPercentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar - Modules List */}
                        <div className="w-full md:w-1/4">
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Course Modules</h2>
                                    <nav className="space-y-1">
                                        {modules.map((module) => (
                                            <button
                                                key={module.id}
                                                onClick={() => handleModuleClick(module.id)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                                                    activeModule === module.id
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{module.title}</span>
                                                    {isModuleCompleted(module.id) && (
                                                        <svg
                                                            className="h-5 w-5 text-green-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="w-full md:w-3/4 text-gray-700">
                            {activeModule ? (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        {modules
                                            .find((m) => m.id === activeModule)
                                            ?.lessons?.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="mb-4 border rounded-lg overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => handleLessonClick(lesson.id)}
                                                        className="w-full p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                                                    >
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-900">
                                                                {lesson.title}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {lesson.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-gray-500 mr-4">
                                                                {lesson.duration} min
                                                            </span>
                                                            <svg
                                                                className={`h-5 w-5 text-gray-400 transform transition-transform ${
                                                                    isLessonExpanded(lesson.id) ? 'rotate-180' : ''
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
                                                    </button>
                                                    {isLessonExpanded(lesson.id) && (
                                                        <div className="p-4 bg-gray-50 border-t">
                                                            <div className="prose max-w-none text-gray-800 font-mono indent-20">
                                                                {lesson.content}
                                                            </div>
                                                            <div className="mt-4 flex justify-end">
                                                                <button
                                                                    onClick={() => handleLessonClick(lesson.id)}
                                                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    Close
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6 text-center">
                                        <p className="text-gray-500">Select a module to view its lessons</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 