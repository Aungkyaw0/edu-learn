import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CourseCard from '@/Components/CourseCard';

export default function Dashboard({ auth, courses }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Instructor Dashboard</h2>}
        >
            <Head title="Instructor Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900 text-lg font-semibold mb-2">Total Courses</div>
                            <div className="text-3xl font-bold text-indigo-600">{courses.length}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900 text-lg font-semibold mb-2">Total Modules</div>
                            <div className="text-3xl font-bold text-indigo-600">
                                {courses.reduce((total, course) => total + course.modules.length, 0)}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900 text-lg font-semibold mb-2">Published Courses</div>
                            <div className="text-3xl font-bold text-indigo-600">
                                {courses.filter(course => course.is_published).length}
                            </div>
                        </div>
                    </div>

                    {/* Recent Courses */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.slice(0, 6).map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 