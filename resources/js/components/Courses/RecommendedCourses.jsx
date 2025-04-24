import React from 'react';
import { Link } from '@inertiajs/react';

export default function RecommendedCourses({ courses }) {
    if (!courses || courses.length === 0) {
        return null;
    }

    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Recommended for You
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Courses tailored to your interests and learning style
                    </p>
                </div>

                <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex-shrink-0">
                                <img
                                    className="h-48 w-full object-cover"
                                    src={course.thumbnail || '/images/default-course.jpg'}
                                    alt={course.title}
                                />
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            course.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                                            course.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {course.difficulty_level.charAt(0).toUpperCase() + course.difficulty_level.slice(1)}
                                        </span>
                                        <span className="text-sm text-gray-500">{course.category}</span>
                                    </div>
                                    <Link href={route('courses.show', course.id)} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900">{course.title}</p>
                                        <p className="mt-3 text-base text-gray-500 line-clamp-2">
                                            {course.description}
                                        </p>
                                    </Link>
                                </div>
                                <div className="mt-6">
                                    <div className="text-sm text-indigo-600 mb-2">
                                        {course.recommendation_reason}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < Math.round(course.recommendation_score)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 15.585l-7.07 4.267 1.857-7.819L0 7.933l7.944-.833L10 0l2.056 7.1L20 7.933l-4.787 4.1 1.857 7.819z"
                                                    />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            ${course.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 