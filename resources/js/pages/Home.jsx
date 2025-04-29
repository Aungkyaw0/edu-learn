import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import RecommendedCourses from '@/Components/Courses/RecommendedCourses';

export default function Home({ auth, recommendedCourses }) {
    return (
        <AppLayout>
            <Head title="Home" />
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto mt-3">
                    <div className="relative z-10 bg-white lg:max-w-2xl lg:w-full">
                        <svg
                            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                            fill="currentColor"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg>

                        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Transform Your Learning with</span>{' '}
                                    <span className="block text-indigo-600 xl:inline">AI-Powered Education</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Experience personalized learning paths, instant feedback, and adaptive assessments designed to help you achieve your educational goals.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link
                                            href="/courses"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                        >
                                            Browse Courses
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link
                                            href="/register"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="mt-3 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src="images/hero-bg.png"
                        alt="AI-Powered Education"
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            A better way to learn
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Our platform combines cutting-edge AI technology with proven educational methods to deliver an exceptional learning experience.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Personalized Learning</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        AI-powered recommendations and adaptive learning paths tailored to your individual needs and learning style.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Instant Feedback</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Get immediate, detailed feedback on your work with AI-powered analysis and suggestions for improvement.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Progress Tracking</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Monitor your learning journey with detailed analytics and insights into your performance and progress.
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-16">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Community Learning</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Connect with fellow learners, share knowledge, and collaborate on projects in our vibrant learning community.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Learning Statistics Section */}
            <div className="bg-indigo-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Our Impact
                        </h2>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                            Join thousands of learners who have transformed their education journey with EduLearn.
                        </p>
                    </div>
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="text-4xl font-bold text-indigo-600">10,000+</div>
                                <div className="mt-2 text-lg font-medium text-gray-900">Active Learners</div>
                                <p className="mt-1 text-sm text-gray-500">Engaged in personalized learning paths</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="text-4xl font-bold text-indigo-600">95%</div>
                                <div className="mt-2 text-lg font-medium text-gray-900">Success Rate</div>
                                <p className="mt-1 text-sm text-gray-500">Of students achieving their learning goals</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="text-4xl font-bold text-indigo-600">500+</div>
                                <div className="mt-2 text-lg font-medium text-gray-900">Courses</div>
                                <p className="mt-1 text-sm text-gray-500">Covering diverse subjects and skills</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="text-4xl font-bold text-indigo-600">24/7</div>
                                <div className="mt-2 text-lg font-medium text-gray-900">AI Support</div>
                                <p className="mt-1 text-sm text-gray-500">Personalized assistance available anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            What Our Learners Say
                        </h2>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                            Hear from students who have experienced the power of AI-driven education.
                        </p>
                    </div>
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/1.jpg" alt="Sarah Johnson" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-medium text-gray-900">Sarah Johnson</div>
                                        <div className="text-sm text-indigo-600">Data Science Student</div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-500">
                                    "The AI-powered recommendations helped me discover courses I never would have considered. It's like having a personal learning coach!"
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/men/1.jpg" alt="Michael Chen" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-medium text-gray-900">Michael Chen</div>
                                        <div className="text-sm text-indigo-600">Web Development Student</div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-500">
                                    "The instant feedback on my coding exercises has been invaluable. I can see my progress in real-time and improve faster."
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/2.jpg" alt="Emma Rodriguez" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-medium text-gray-900">Emma Rodriguez</div>
                                        <div className="text-sm text-indigo-600">Business Analytics Student</div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-500">
                                    "The adaptive learning system really understands my strengths and weaknesses. It's made learning complex topics much more manageable."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-indigo-700">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Ready to transform your learning experience?</span>
                        <span className="block text-indigo-200">Start your journey today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                            >
                                Get started
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <Link
                                href="/courses"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Browse courses
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <RecommendedCourses courses={recommendedCourses} />
        </AppLayout>
    );
} 