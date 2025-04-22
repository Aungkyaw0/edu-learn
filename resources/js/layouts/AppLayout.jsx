import LoginModal from '@/Components/Auth/LoginModal';
import RegisterModal from '@/Components/Auth/RegisterModal';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/" className="text-2xl font-bold text-indigo-600">
                                    EduLearn
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href={route('courses.index')}
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                >
                                    Courses
                                </Link>
                                {auth?.user?.role === 'student' && (
                                    <Link
                                        href={route('student.my-learning')}
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        My Learning
                                    </Link>
                                )}
                                {auth?.user?.role === 'instructor' && (
                                    <Link
                                        href={route('instructor.courses.index')}
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        My Courses
                                    </Link>
                                )}
                                {auth?.user?.role === 'instructor' && (
                                    <Link
                                        href={route('instructor.dashboard')}
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {auth?.user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">{auth.user.name}</span>
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={auth.user.profile_picture || '/images/default-avatar.png'}
                                        alt={auth.user.name}
                                    />
                                    <Link href={route('logout')} method="post" as="button" className="text-sm text-gray-700 hover:text-gray-900">
                                        Logout
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => setIsLoginModalOpen(true)} className="text-gray-700 hover:text-gray-900">
                                        Sign in
                                    </button>
                                    <button
                                        onClick={() => setIsRegisterModalOpen(true)}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onRegisterClick={() => {
                    setIsLoginModalOpen(false);
                    setIsRegisterModalOpen(true);
                }}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onLoginClick={() => {
                    setIsRegisterModalOpen(false);
                    setIsLoginModalOpen(true);
                }}
            />
        </div>
    );
}
