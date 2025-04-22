import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CourseCard from '@/Components/CourseCard';
import Modal from '@/Components/Modal';

export default function Dashboard({ auth, courses, pendingRequests }) {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        rejection_reason: '',
    });

    const handleAccept = (request) => {
        post(route('enrollment-requests.accept', request.id), {
            preserveScroll: true,
        });
    };

    const handleReject = () => {
        post(route('enrollment-requests.reject', selectedRequest.id), {
            preserveScroll: true,
            onSuccess: () => {
                setRejectModalOpen(false);
                reset();
                setSelectedRequest(null);
            },
        });
    };

    const openRejectModal = (request) => {
        setSelectedRequest(request);
        setRejectModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Instructor Dashboard" />

            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-lg">
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-800">Instructor Dashboard</h2>
                    </div>
                    <nav className="mt-4">
                        <Link
                            href={route('instructor.dashboard')}
                            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link
                            href={route('instructor.courses.index')}
                            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            My Courses
                        </Link>
                        <Link
                            href={route('instructor.courses.create')}
                            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create Course
                        </Link>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-8">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-medium text-gray-900">Total Courses</h3>
                                <p className="mt-2 text-3xl font-semibold text-indigo-600">{courses.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
                                <p className="mt-2 text-3xl font-semibold text-indigo-600">
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
                                <p className="mt-2 text-3xl font-semibold text-indigo-600">{pendingRequests.length}</p>
                            </div>
                        </div>

                        {/* Course Requests */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Enrollment Requests</h2>
                                
                                {pendingRequests.length === 0 ? (
                                    <div className="text-center py-8">
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
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            You don't have any pending enrollment requests at the moment.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Student
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Course
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Requested At
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {pendingRequests.map((request) => (
                                                    <tr key={request.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <img
                                                                        className="h-10 w-10 rounded-full"
                                                                        src={request.user.profile_picture || '/images/default-avatar.png'}
                                                                        alt={request.user.name}
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {request.user.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {request.user.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {request.course.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {request.course.category || 'Uncategorized'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(request.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => handleAccept(request)}
                                                                disabled={processing}
                                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => openRejectModal(request)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Reject
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Reject Enrollment Request
                    </h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason
                        </label>
                        <textarea
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            rows="4"
                            value={data.rejection_reason}
                            onChange={(e) => setData('rejection_reason', e.target.value)}
                            placeholder="Please provide a reason for rejecting this enrollment request..."
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setRejectModalOpen(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            {processing ? 'Processing...' : 'Reject Request'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
} 