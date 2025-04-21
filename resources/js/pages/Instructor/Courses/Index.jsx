import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function InstructorCourses({ courses, user }) {
    return (
        <AppLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-900">My Courses</h1>
                        <Link
                            href={route('instructor.courses.create')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                        >
                            Create New Course
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {courses.data.map((course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                                    >
                                        <div className="aspect-w-16 aspect-h-9">
                                            <img
                                                className="w-full h-48 object-cover"
                                                src={course.thumbnail || '/images/default-course.jpg'}
                                                alt={course.title}
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center mb-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        {course.category || 'Uncategorized'}
                                                    </span>
                                                    <span className="mx-2 text-gray-500">•</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        course.is_published 
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {course.is_published ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                                    {course.description}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="text-sm text-gray-500">
                                                    {course.enrollments_count || 0} students enrolled
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('instructor.courses.edit', course.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={route('courses.show', course.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-indigo-600 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {courses.data.length === 0 && (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No courses yet
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating a new course.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('instructor.courses.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Create New Course
                                        </Link>
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