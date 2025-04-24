import React from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import RecommendedCourses from '@/Components/Courses/RecommendedCourses';

export default function MyLearning({ enrolledCourses, pendingRequests, rejectedRequests, recommendedCourses }) {
    const handleStartLearning = (courseId) => {
        router.get(route('student.course.learn', courseId));
    };

    const CourseCard = ({ course, status, rejectionReason }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
                <img
                    src={course.thumbnail || '/images/default-course.jpg'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    status === 'accepted' ? 'bg-green-100 text-green-800' :
                    status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
            </div>
            
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center mb-4">
                    <img
                        src={course.instructor.profile_picture || '/images/default-avatar.png'}
                        alt={course.instructor.name}
                        className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{course.instructor.name}</p>
                        <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                </div>

                {rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                        <h4 className="text-sm font-medium text-red-800">Rejection Reason:</h4>
                        <p className="text-sm text-red-600">{rejectionReason}</p>
                    </div>
                )}

                <div className="mt-4 flex justify-end">
                    {status === 'accepted' ? (
                        <button
                            onClick={() => handleStartLearning(course.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Start Now
                        </button>
                    ) : status === 'pending' ? (
                        <button
                            disabled
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600"
                        >
                            Pending Approval
                        </button>
                    ) : (
                        <button
                            disabled
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600"
                        >
                            Request Rejected
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const CourseSection = ({ title, courses, status }) => (
        courses.length > 0 && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map(request => (
                        <CourseCard
                            key={request.id}
                            course={request.course}
                            status={status}
                            rejectionReason={request.rejection_reason}
                        />
                    ))}
                </div>
            </div>
        )
    );

    return (
        <AppLayout>
            <Head title="My Learning" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Learning</h1>

                    <CourseSection
                        title="Enrolled Courses"
                        courses={enrolledCourses || []}
                        status="accepted"
                    />

                    <CourseSection
                        title="Pending Requests"
                        courses={pendingRequests || []}
                        status="pending"
                    />

                    <CourseSection
                        title="Rejected Requests"
                        courses={rejectedRequests || []}
                        status="rejected"
                    />

                    {!enrolledCourses?.length && !pendingRequests?.length && !rejectedRequests?.length && (
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
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Start exploring courses and request enrollment to begin your learning journey.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Explore Courses
                                </Link>
                            </div>
                        </div>
                    )}

                    <RecommendedCourses courses={recommendedCourses} />
                </div>
            </div>
        </AppLayout>
    );
} 