import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function Result({ auth, course, assessment, result }) {
    return (
        <AppLayout>
            <Head title="Assessment Result" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900">Assessment Results</h1>
                                <p className="mt-2 text-gray-600">{assessment.title}</p>
                            </div>

                            {/* Score Summary */}
                            <div className={`mb-8 p-6 rounded-lg ${
                                result.passed ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                                <div className="flex items-center">
                                    {result.passed ? (
                                        <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                                    ) : (
                                        <XCircleIcon className="h-8 w-8 text-red-600 mr-3" />
                                    )}
                                    <div>
                                        <h2 className={`text-xl font-semibold ${
                                            result.passed ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                            {result.passed ? 'Congratulations! You Passed!' : 'Assessment Not Passed'}
                                        </h2>
                                        <div className="mt-2 text-sm">
                                            <p className="text-gray-600">
                                                Score: <span className="font-semibold">{result.score}%</span>
                                                <span className="mx-2">•</span>
                                                Correct Answers: <span className="font-semibold">{result.correctAnswers} out of {result.totalQuestions}</span>
                                            </p>
                                            <p className="mt-1 text-gray-600">
                                                Required to Pass: <span className="font-semibold">80% (8 out of 10 questions)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Question Review */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h3>
                                <div className="space-y-6">
                                    {result.questions.map((question, index) => (
                                        <div key={index} className={`p-6 rounded-lg border ${
                                            question.is_correct ? 'border-green-200' : 'border-red-200'
                                        }`}>
                                            <div className="flex items-start">
                                                <div className={`rounded-full p-1 mr-3 ${
                                                    question.is_correct ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                    {question.is_correct ? (
                                                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <XCircleIcon className="h-5 w-5 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-base font-medium text-gray-900">
                                                        Question {index + 1}
                                                    </h4>
                                                    <p className="mt-2 text-gray-700">{question.question}</p>

                                                    {/* Options */}
                                                    <div className="mt-4 space-y-2">
                                                        {question.options.map((option, optionIndex) => (
                                                            <div
                                                                key={optionIndex}
                                                                className={`p-3 rounded-md ${
                                                                    optionIndex === question.correct_answer
                                                                        ? 'bg-green-50 border border-green-200'
                                                                        : optionIndex === question.user_answer && !question.is_correct
                                                                        ? 'bg-red-50 border border-red-200'
                                                                        : 'bg-gray-50 border border-gray-200'
                                                                }`}
                                                            >
                                                                <div className="flex items-center">
                                                                    <span className={`flex-1 ${
                                                                        optionIndex === question.correct_answer
                                                                            ? 'text-green-800'
                                                                            : optionIndex === question.user_answer && !question.is_correct
                                                                            ? 'text-red-800'
                                                                            : 'text-gray-700'
                                                                    }`}>
                                                                        {option}
                                                                    </span>
                                                                    {optionIndex === question.correct_answer && (
                                                                        <span className="ml-2 text-green-600 text-sm">
                                                                            Correct Answer
                                                                        </span>
                                                                    )}
                                                                    {optionIndex === question.user_answer && !question.is_correct && (
                                                                        <span className="ml-2 text-red-600 text-sm">
                                                                            Your Answer
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4">
                                <a
                                    href={route('student.course.learn', course.id)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Return to Course
                                </a>
                                {!result.passed && (
                                    <a
                                        href={route('courses.assessments.take', course.id)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Retake Assessment
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 