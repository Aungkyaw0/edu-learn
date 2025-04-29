import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/Forms/InputLabel';
import TextInput from '@/Components/Forms/TextInput';
import InputError from '@/Components/Forms/InputError';

export default function AssessmentModal({ show, onClose, course, assessment = null }) {
    const initialQuestions = Array(10).fill(null).map(() => ({
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0
    }));

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: assessment?.title || '',
        description: assessment?.description || '',
        questions: assessment?.questions || initialQuestions
    });

    useEffect(() => {
        if (assessment) {
            setData({
                title: assessment.title,
                description: assessment.description,
                questions: assessment.questions
            });
        }
    }, [assessment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (assessment) {
            put(route('courses.assessments.update', [course.id, assessment.id]), {
                onSuccess: () => {
                    onClose();
                    reset();
                }
            });
        } else {
            post(route('courses.assessments.store', course.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                }
            });
        }
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...data.questions];
        newQuestions[index] = {
            ...newQuestions[index],
            question: value
        };
        setData('questions', newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...data.questions];
        const newOptions = [...newQuestions[questionIndex].options];
        newOptions[optionIndex] = value;
        newQuestions[questionIndex] = {
            ...newQuestions[questionIndex],
            options: newOptions
        };
        setData('questions', newQuestions);
    };

    const handleCorrectAnswerChange = (questionIndex, value) => {
        const newQuestions = [...data.questions];
        newQuestions[questionIndex] = {
            ...newQuestions[questionIndex],
            correct_answer: parseInt(value)
        };
        setData('questions', newQuestions);
    };
    // console.log(data.questions);

    return (
        <Modal isOpen={show} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 text-gray-900 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {assessment ? 'Edit Assessment' : 'Create Assessment'}
                </h2>

                <div className="mt-4">
                    <InputLabel htmlFor="title" value="Title" />
                    <TextInput
                        id="title"
                        type="text"
                        name="title"
                        value={data.title}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('title', e.target.value)}
                        required
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="description" value="Description" />
                    <textarea
                        id="description"
                        name="description"
                        value={data.description}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        required
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
                    <div className="space-y-6">
                        {data.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="p-4 border rounded-lg bg-gray-50">
                                <div className="mb-4">
                                    <InputLabel value={`Question ${questionIndex + 1}`} />
                                    <TextInput
                                        type="text"
                                        value={question.question}
                                        className="mt-1 block w-full"
                                        onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                                        placeholder={`Enter question ${questionIndex + 1}`}
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-700">Options (select the correct answer):</p>
                                    {question.options.map((option, optionIndex) => (
                                        <div key={`${questionIndex}-${optionIndex}`} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`correct_answer_${questionIndex}`}
                                                value={optionIndex}
                                                checked={question.correct_answer === optionIndex}
                                                onChange={(e) => handleCorrectAnswerChange(questionIndex, e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                required
                                            />
                                            <TextInput
                                                type="text"
                                                value={option}
                                                className="flex-1"
                                                onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                                placeholder={`Option ${optionIndex + 1}`}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : (assessment ? 'Update Assessment' : 'Create Assessment')}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 