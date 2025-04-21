import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function InstructorCourseShow({ course }) {
    return (
        <AppLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-semibold text-gray-900">{course.title}</h1>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('instructor.courses.edit', course.id)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                                    >
                                        Edit Course
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Course Details</h2>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Category</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{course.category || 'Uncategorized'}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Difficulty Level</dt>
                                            <dd className="mt-1 text-sm text-gray-900 capitalize">{course.difficulty_level}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {course.is_published ? 'Published' : 'Draft'}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Students</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{course.enrollments_count || 0}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
                                    <p className="text-gray-600">{course.description}</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Outcomes</h2>
                                <ul className="list-disc list-inside space-y-2">
                                    {course.learning_outcomes?.map((outcome, index) => (
                                        <li key={index} className="text-gray-600">{outcome}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Modules</h2>
                                {course.modules?.length > 0 ? (
                                    <div className="space-y-4">
                                        {course.modules.map((module) => (
                                            <div key={module.id} className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                                                <p className="mt-1 text-sm text-gray-600">{module.description}</p>
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-900">Lessons</h4>
                                                    <ul className="mt-2 space-y-2">
                                                        {module.lessons?.map((lesson) => (
                                                            <li key={lesson.id} className="text-sm text-gray-600">
                                                                {lesson.title}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No modules added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}