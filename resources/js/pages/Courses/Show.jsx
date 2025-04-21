import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CourseShow({ course, enrollmentStatus }) {
    const { post, processing } = useForm();

    const handleEnrollmentRequest = () => {
        post(route('enrollment-requests.store', course.id));
    };

    const getEnrollmentButton = () => {
        if (!auth.user) {
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
            case 'enrolled':
                return (
                    <button
                        disabled
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600"
                    >
                        Enrolled
                    </button>
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
                        Request Enrollment
                    </button>
                );
        }
    };

    return (
        <AppLayout>
            <Head title={course.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                        <div className="p-8">
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
import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CourseShow({ course, user, isEnrolled }) {
    const { post, processing } = useForm();
    const defaultAvatar = '/images/default-avatar.png';
    const learningOutcomes = course.learning_outcomes || [];

    const handleEnroll = () => {
        post(`/courses/${course.id}/enroll`);
    };

    return (
        <AppLayout>
            <div className="bg-white">
                {/* Course Header */}
                <div className="relative">
                    <div className="absolute inset-0">
                        <img
                            className="w-full h-96 object-cover"
                            src={course.thumbnail || '/images/default-course.jpg'}
                            alt={course.title}
                        />
                        <div className="absolute inset-0 bg-gray-900 mix-blend-multiply" />
                    </div>
                    <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {course.title}
                        </h1>
                        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                            {course.description}
                        </p>
                        
                        {/* Learning Outcomes */}
                        {learningOutcomes.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-white">What you'll learn</h2>
                                <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {learningOutcomes.map((outcome, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg
                                                className="h-6 w-6 text-green-400 mt-0.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="ml-3 text-white">{outcome}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Course Details */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Course Information
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Instructor
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {course.instructor?.name || 'Unknown Instructor'}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Category
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {course.category?.name || 'Uncategorized'}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Duration
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {course.duration || 0} hours
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Level
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {course.difficulty_level || 'Beginner'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Course Modules */}
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
                                <div className="mt-4 space-y-4">
                                    {(course.modules || []).map((module) => (
                                        <div
                                            key={module.id}
                                            className="bg-white shadow overflow-hidden sm:rounded-lg"
                                        >
                                            <div className="px-4 py-5 sm:px-6">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                    {module.title}
                                                </h3>
                                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                                    {module.description}
                                                </p>
                                            </div>
                                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                                <div className="prose max-w-none text-gray-500">
                                                    {module.content}
                                                </div>
                                                {isEnrolled && (
                                                    <div className="mt-4">
                                                        <Link
                                                            href={`/courses/${course.id}/modules/${module.id}`}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                        >
                                                            Start Module
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="mt-8 lg:mt-0">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Course Details
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900">
                                            ${course.price || 0}
                                        </span>
                                        <div className="flex items-center">
                                            <svg
                                                className="h-5 w-5 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="ml-2 text-sm text-gray-500">
                                                {course.rating || 0} ({course.reviews_count || 0} reviews)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        {isEnrolled ? (
                                            <Link
                                                href={`/courses/${course.id}/learn`}
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Continue Learning
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={handleEnroll}
                                                disabled={processing}
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Enroll Now
                                            </button>
                                        )}
                                    </div>

                                    {learningOutcomes.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-sm font-medium text-gray-900">What you'll learn</h4>
                                            <ul className="mt-4 space-y-2">
                                                {learningOutcomes.map((outcome, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <svg
                                                            className="h-5 w-5 text-green-500"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            {outcome}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}