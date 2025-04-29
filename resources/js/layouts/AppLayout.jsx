import LoginModal from '@/Components/Auth/LoginModal';
import RegisterModal from '@/Components/Auth/RegisterModal';
import EditProfileModal from '@/Components/Profile/EditProfileModal';
import FlashMessage from '@/Components/FlashMessage';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ChatBot from '@/Components/ChatBot';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    return (
        <>
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
                                    {/* <button
                                        onClick={() => setIsProfileModalOpen(true)}
                                        className="flex items-center space-x-3 hover:opacity-80"
                                    >
                                        <span className="text-sm font-medium text-gray-700">{auth.user.name}</span>
                                        <img
                                            className="h-8 w-8 rounded-full object-cover"
                                            src={auth.user.profile_picture || '/images/default-avatar.png'}
                                            alt={auth.user.name}
                                        />
                                    </button> */}
                                    <Link
                                        href={route('profile.edit')}
                                        method="get"
                                        className="flex items-center space-x-3 hover:opacity-80"
                                    >
                                        <span className="text-sm font-medium text-gray-700">{auth.user.name}</span>
                                        <img
                                            className="h-8 w-8 rounded-full object-cover"
                                            src={auth.user.profile_picture || '/images/default-avatar.png'}
                                            alt={auth.user.name}
                                        />
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="ms-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-indigo-700 hover:text-slate-20"
                                    >
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

            <main>
                <FlashMessage />
                {children}
            </main>

            <ChatBot />

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

            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={auth?.user}
            />
        </div>
            <footer className="bg-indigo-950 border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* About Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About EduLearn</h3>
                            <p className="mt-4 text-base text-gray-500">
                                Transforming education through AI-powered personalized learning experiences.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <Link href="/courses" className="text-base text-gray-500 hover:text-gray-900">
                                        Browse Courses
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <Link href="/faq" className="text-base text-gray-500 hover:text-gray-900">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/help" className="text-base text-gray-500 hover:text-gray-900">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect With Us</h3>
                            <div className="mt-4 flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 border-t border-gray-200 pt-8">
                        <p className="text-base text-gray-400 text-center">
                            &copy; {new Date().getFullYear()} EduLearn. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            </>
    );
}
