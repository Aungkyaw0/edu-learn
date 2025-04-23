import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Take({ auth, course, assessment }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(Array(assessment.questions.length).fill(null));
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        answers: Array(assessment.questions.length).fill(null)
    });

    const currentQuestion = assessment.questions[currentQuestionIndex];

    const handleAnswerSelect = (optionIndex) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
        setData('answers', newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < assessment.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedAnswers.includes(null)) {
            alert('Please answer all questions before submitting.');
            return;
        }

        // Log the data being sent
        console.log('Submitting answers:', {
            answers: data.answers
        });

        post(route('courses.assessments.submit', [course.id, assessment.id]));
    };

    return (
        <AppLayout>
            <Head title={`${course.title} - Assessment`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {!isSubmitted ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-semibold text-gray-900">{assessment.title}</h1>
                                    <p className="mt-2 text-gray-600">{assessment.description}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
                                        <span>{Math.round((currentQuestionIndex + 1) / assessment.questions.length * 100)}%</span>
                                    </div>
                                    <div className="bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Question */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                                        {currentQuestion.question}
                                    </h2>
                                    <div className="space-y-3">
                                        {currentQuestion.options.map((option, index) => (
                                            <label
                                                key={index}
                                                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                                                    selectedAnswers[currentQuestionIndex] === index
                                                        ? 'bg-blue-50 border-blue-500'
                                                        : 'hover:bg-gray-50 border-gray-200'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="answer"
                                                    value={index}
                                                    checked={selectedAnswers[currentQuestionIndex] === index}
                                                    onChange={() => handleAnswerSelect(index)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-3 text-gray-800">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        disabled={currentQuestionIndex === 0}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    
                                    {currentQuestionIndex === assessment.questions.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {processing ? 'Submitting...' : 'Submit Assessment'}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-semibold text-gray-900">Assessment Results</h1>
                                    <div className={`mt-4 p-4 rounded-lg ${
                                        result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                    }`}>
                                        <p className={`text-lg font-medium ${
                                            result.passed ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                            {result.passed ? 'Congratulations! You passed!' : 'Assessment not passed'}
                                        </p>
                                        <p className="mt-2 text-sm">
                                            Score: {result.score}% (Required: 80%)
                                        </p>
                                        <p className="mt-1 text-sm">
                                            Correct Answers: {result.correctAnswers} out of {result.totalQuestions}
                                        </p>
                                    </div>
                                </div>

                                {/* Question Review */}
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h2>
                                    <div className="space-y-6">
                                        {assessment.questions.map((question, index) => (
                                            <div key={index} className={`p-4 rounded-lg border ${
                                                selectedAnswers[index] === question.correct_answer
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-red-50 border-red-200'
                                            }`}>
                                                <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                                                <p className="mt-2">{question.question}</p>
                                                
                                                <div className="mt-3 space-y-2">
                                                    {question.options.map((option, optionIndex) => (
                                                        <div key={optionIndex} className={`p-2 rounded ${
                                                            optionIndex === question.correct_answer
                                                                ? 'bg-green-100 text-green-800'
                                                                : selectedAnswers[index] === optionIndex
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-50'
                                                        }`}>
                                                            {option}
                                                            {optionIndex === question.correct_answer && (
                                                                <span className="ml-2 text-green-600">(Correct Answer)</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <a
                                        href={route('student.course.learn', course.id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Return to Course
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 