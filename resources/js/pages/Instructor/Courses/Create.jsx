import { useState } from 'react';
import { useForm } from "@inertiajs/react";
import AppLayout from '@/Layouts/AppLayout';
import { InputLabel, TextInput, InputError } from "@/Components/Forms";
import { router } from '@inertiajs/react';

export default function CreateCourse({ user }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: '',
        difficulty_level: 'beginner',
        duration: '',
        price: '',
        thumbnail: null,
        learning_outcomes: [''],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.courses.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                router.visit(route('instructor.courses.index'));
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setData('thumbnail', file);
        }
    };

    const addLearningOutcome = () => {
        setData('learning_outcomes', [...data.learning_outcomes, '']);
    };

    const removeLearningOutcome = (index) => {
        const outcomes = [...data.learning_outcomes];
        outcomes.splice(index, 1);
        setData('learning_outcomes', outcomes);
    };

    const updateLearningOutcome = (index, value) => {
        const outcomes = [...data.learning_outcomes];
        outcomes[index] = value;
        setData('learning_outcomes', outcomes);
    };

    return (
        <AppLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Course</h1>

                            <form onSubmit={handleSubmit} className="space-y-6 text-black" encType="multipart/form-data">
                                {/* Title */}
                                <div>
                                    <InputLabel htmlFor="title" value="Course Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={4}
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Category */}
                                <div>
                                    <InputLabel htmlFor="category" value="Category" />
                                    <TextInput
                                        id="category"
                                        type="text"
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Enter course category"
                                        required
                                    />
                                    <InputError message={errors.category} className="mt-2" />
                                </div>

                                {/* Difficulty Level */}
                                <div>
                                    <InputLabel htmlFor="difficulty_level" value="Difficulty Level" />
                                    <select
                                        id="difficulty_level"
                                        value={data.difficulty_level}
                                        onChange={e => setData('difficulty_level', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    <InputError message={errors.difficulty_level} className="mt-2" />
                                </div>

                                {/* Duration */}
                                <div>
                                    <InputLabel htmlFor="duration" value="Duration (hours)" />
                                    <TextInput
                                        id="duration"
                                        type="number"
                                        min="1"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.duration} className="mt-2" />
                                </div>

                                {/* Price */}
                                <div>
                                    <InputLabel htmlFor="price" value="Price ($)" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.price} className="mt-2" />
                                </div>

                                {/* Thumbnail */}
                                <div>
                                    <InputLabel htmlFor="thumbnail" value="Course Thumbnail" />
                                    <div className="mt-2 flex items-center">
                                        {selectedImage && (
                                            <div className="mr-4">
                                                <img
                                                    src={selectedImage}
                                                    alt="Course thumbnail preview"
                                                    className="h-32 w-32 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <input
                                            id="thumbnail"
                                            type="file"
                                            onChange={handleImageChange}
                                            className="mt-1 block w-full"
                                            accept="image/*"
                                        />
                                    </div>
                                    <InputError message={errors.thumbnail} className="mt-2" />
                                </div>

                                {/* Learning Outcomes */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <InputLabel value="Learning Outcomes" />
                                        <button
                                            type="button"
                                            onClick={addLearningOutcome}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Add Outcome
                                        </button>
                                    </div>
                                    {data.learning_outcomes.map((outcome, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <TextInput
                                                value={outcome}
                                                onChange={e => updateLearningOutcome(index, e.target.value)}
                                                className="flex-1"
                                                placeholder={`Learning outcome ${index + 1}`}
                                                required
                                            />
                                            {data.learning_outcomes.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLearningOutcome(index)}
                                                    className="px-2 py-1 text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <InputError message={errors.learning_outcomes} className="mt-2" />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        {processing ? 'Creating...' : 'Create Course'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}