// import { Link } from '@inertiajs/react';
// import AppLayout from '@/Layouts/AppLayout';
// import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// export default function InstructorCourseShow({ course }) {
//     return (
//         <AppLayout>
//             <div className="py-12">
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//                         <div className="p-6 bg-white border-b border-gray-200">
//                             <div className="flex justify-between items-center mb-6">
//                                 <h1 className="text-3xl font-semibold text-gray-900">{course.title}</h1>
//                                 <div className="flex space-x-2">
//                                     <Link
//                                         href={route('instructor.courses.edit', course.id)}
//                                         className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
//                                     >
//                                         Edit Course
//                                     </Link>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                                 <div>
//                                     <h2 className="text-lg font-medium text-gray-900 mb-4">Course Details</h2>
//                                     <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
//                                         <div className="sm:col-span-1">
//                                             <dt className="text-sm font-medium text-gray-500">Category</dt>
//                                             <dd className="mt-1 text-sm text-gray-900">{course.category || 'Uncategorized'}</dd>
//                                         </div>
//                                         <div className="sm:col-span-1">
//                                             <dt className="text-sm font-medium text-gray-500">Difficulty Level</dt>
//                                             <dd className="mt-1 text-sm text-gray-900 capitalize">{course.difficulty_level}</dd>
//                                         </div>
//                                         <div className="sm:col-span-1">
//                                             <dt className="text-sm font-medium text-gray-500">Status</dt>
//                                             <dd className="mt-1 text-sm text-gray-900">
//                                                 {course.is_published ? 'Published' : 'Draft'}
//                                             </dd>
//                                         </div>
//                                         <div className="sm:col-span-1">
//                                             <dt className="text-sm font-medium text-gray-500">Students</dt>
//                                             <dd className="mt-1 text-sm text-gray-900">{course.enrollments_count || 0}</dd>
//                                         </div>
//                                     </dl>
//                                 </div>

//                                 <div>
//                                     <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
//                                     <p className="text-gray-600">{course.description}</p>
//                                 </div>
//                             </div>

//                             <div className="mt-8">
//                                 <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Outcomes</h2>
//                                 <ul className="list-disc list-inside space-y-2">
//                                     {course.learning_outcomes?.map((outcome, index) => (
//                                         <li key={index} className="text-gray-600">{outcome}</li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             <div className="mt-8">
//                                 <h2 className="text-lg font-medium text-gray-900 mb-4">Modules</h2>
//                                 {course.modules?.length > 0 ? (
//                                     <div className="space-y-4">
//                                         {course.modules.map((module) => (
//                                             <div key={module.id} className="bg-gray-50 p-4 rounded-lg">
//                                                 <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
//                                                 <p className="mt-1 text-sm text-gray-600">{module.description}</p>
//                                                 <div className="mt-4">
//                                                     <h4 className="text-sm font-medium text-gray-900">Lessons</h4>
//                                                     <ul className="mt-2 space-y-2">
//                                                         {module.lessons?.map((lesson) => (
//                                                             <li key={lesson.id} className="text-sm text-gray-600">
//                                                                 {lesson.title}
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p className="text-gray-600">No modules added yet.</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }


import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, course }) {
    return (
        <AppLayout>
            <Head title={course.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Course Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900">{course.title}</h1>
                                    <p className="mt-2 text-gray-600">{course.description}</p>
                                </div>
                                <Link
                                    href={route('instructor.courses.edit', course.id)}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Edit Course
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Assessment Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Final Assessment</h2>
                                {!course.assessment ? (
                                    <Link
                                        href={route('courses.assessments.create', course.id)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Create Assessment
                                    </Link>
                                ) : (
                                    <div className="flex space-x-2">
                                        <Link
                                            href={route('courses.assessments.edit', [course.id, course.assessment.id])}
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-500 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            Edit Assessment
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
                                                    router.delete(route('courses.assessments.destroy', [course.id, course.assessment.id]));
                                                }
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Delete Assessment
                                        </button>
                                    </div>
                                )}
                            </div>

                            {course.assessment ? (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-lg mb-2">{course.assessment.title}</h3>
                                    <p className="text-gray-600 mb-4">{course.assessment.description}</p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium mb-2">Assessment Details:</h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            <li>10 Multiple Choice Questions</li>
                                            <li>Passing Score: 8/10</li>
                                            <li>No time limit</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-600">
                                    No assessment has been created for this course yet. Create one to test your students' knowledge.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modules Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Course Modules</h2>
                                <Link
                                    href={route('instructor.modules.create', { course: course.id })}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add Module
                                </Link>
                            </div>

                            {course.modules.length > 0 ? (
                                <div className="space-y-4">
                                    {course.modules.map((module) => (
                                        <div key={module.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-lg">{module.title}</h3>
                                                    <p className="text-gray-600 mt-1">{module.description}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('instructor.modules.edit', module.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-600">
                                    No modules have been created for this course yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}