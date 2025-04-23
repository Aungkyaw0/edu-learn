import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import FlashMessage from '@/Components/FlashMessage';

export default function Learn({ course, enrollment, assessment }) {
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
        setExpandedLessons((prev) => {
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

    const allLessonsCompleted = course.modules.every((module) =>
        module.lessons.every((lesson) => enrollment.completion_data?.completed_lessons?.includes(lesson.id)),
    );

    return (
        <AppLayout>
            <Head title={`${course?.title || 'Course'} - Learning`} />
            <FlashMessage />

            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {/* Course Header */}
                    <div className="mb-6 rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
                                    <p className="mt-1 text-sm text-gray-500">Instructor: {course?.instructor?.name}</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-4">
                                        <span className="text-sm font-medium text-gray-500">Progress</span>
                                        <div className="mt-1 h-2 w-32 rounded-full bg-gray-200">
                                            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progressPercentage}%` }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
                                    </div>
                                    {progressPercentage < 80 ? (
                                        <Link
                                            href={route('courses.assessments.take', course.id)}
                                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-700"
                                        >
                                            Take Assessment Now
                                        </Link>
                                    ) : assessment ? (
                                        <Link
                                            href={route('courses.assessments.result', [course.id, assessment.id])}
                                            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-700"
                                        >
                                            Assessment Result
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 md:flex-row">
                        {/* Sidebar - Modules List */}
                        <div className="w-full md:w-1/4">
                            <div className="rounded-lg bg-white shadow">
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="mb-4 text-lg font-medium text-gray-900">Course Modules</h2>
                                    <nav className="space-y-1">
                                        {modules.map((module) => (
                                            <button
                                                key={module.id}
                                                onClick={() => handleModuleClick(module.id)}
                                                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                                                    activeModule === module.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{module.title}</span>
                                                    {isModuleCompleted(module.id) && (
                                                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                        <div className="w-full text-gray-700 md:w-3/4">
                            {activeModule ? (
                                <div className="rounded-lg bg-white shadow">
                                    <div className="px-4 py-5 sm:p-6">
                                        {modules
                                            .find((m) => m.id === activeModule)
                                            ?.lessons?.map((lesson) => (
                                                <div key={lesson.id} className="mb-4 overflow-hidden rounded-lg border">
                                                    <button
                                                        onClick={() => handleLessonClick(lesson.id)}
                                                        className="flex w-full cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
                                                    >
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                                                            <p className="mt-1 text-sm text-gray-500">{lesson.description}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="mr-4 text-sm text-gray-500">{lesson.duration} min</span>
                                                            <svg
                                                                className={`h-5 w-5 transform text-gray-400 transition-transform ${
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
                                                        <div className="border-t bg-gray-50 p-4">
                                                            <div className="prose max-w-none indent-20 font-mono text-gray-800">{lesson.content}</div>
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
                                <div className="rounded-lg bg-white shadow">
                                    <div className="px-4 py-5 text-center sm:p-6">
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
