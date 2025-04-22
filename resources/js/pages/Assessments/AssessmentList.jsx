import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function AssessmentList({ course, assessments, auth }) {
    return (
        <AppLayout>
            <Head title={`Assessments - ${course.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Assessments for {course.title}
                                </h2>
                                {auth.user.role === 'instructor' && (
                                    <Link
                                        href={route('assessments.create', course.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Create Assessment
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-4">
                                {assessments.map((assessment) => (
                                    <div
                                        key={assessment.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {assessment.title}
                                                </h3>
                                                <p className="text-gray-600 mt-1">
                                                    {assessment.description}
                                                </p>
                                                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>
                                                        {assessment.question_count} questions
                                                    </span>
                                                    <span>
                                                        {assessment.total_points} points
                                                    </span>
                                                    {assessment.time_limit && (
                                                        <span>
                                                            {assessment.time_limit} minutes
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('assessments.show', assessment.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    View Details
                                                </Link>
                                                {auth.user.role === 'instructor' && (
                                                    <>
                                                        <Link
                                                            href={route('assessments.edit', assessment.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <Link
                                                            href={route('assessments.results', assessment.id)}
                                                            className="text-purple-600 hover:text-purple-800"
                                                        >
                                                            Results
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {assessments.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No assessments available for this course.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 