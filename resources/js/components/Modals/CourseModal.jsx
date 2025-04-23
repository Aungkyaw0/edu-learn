import { InputError, InputLabel, TextInput } from '@/Components/Forms';
import Modal from '@/Components/Modal';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CourseModal({ show, onClose, course }) {
    const [selectedImage, setSelectedImage] = useState(course?.thumbnail || null);

    const { data, setData, post, put, processing, errors } = useForm({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        thumbnail: null, // Use null for the file input initially
        learning_outcomes: course.learning_outcomes || [''],
        difficulty_level: course.difficulty_level || 'beginner',
        duration: course.duration || '',
        price: course.price || '',
        is_published: course.is_published || false,
        // **Keep this:** Inertia will add this to the payload for method spoofing
        _method: 'PUT',
    });

    useEffect(() => {
        if (show) {
            setData({
                title: course?.title || '',
                description: course?.description || '',
                category: course?.category || '',
                thumbnail: null, // Reset file input state when modal opens
                learning_outcomes: course?.learning_outcomes || [''],
                difficulty_level: course?.difficulty_level || 'beginner',
                duration: course?.duration || '',
                price: course?.price || '',
                is_published: course?.is_published || false,
                _method: 'PUT', // Ensure _method is set when data is reset
            });
            setSelectedImage(course?.thumbnail || null); // Set preview for existing thumbnail
        }
        // Clean up the object URL when modal closes or course changes
        return () => {
            if (selectedImage && selectedImage.startsWith('blob:')) {
                URL.revokeObjectURL(selectedImage);
            }
        };
    }, [show, course]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Use the POST method, which is more reliable for FormData with method spoofing.
        // Inertia's useForm detects the File object in 'data' and the '_method' key
        // and automatically creates a FormData payload and sends a POST request
        // with _method=PUT included.

        post(route('instructor.courses.update', course.id), {
            // Pass the data state directly. Inertia handles creating FormData if needed.
            // data: data, // This is the default when using useForm methods like post/put/patch
            onSuccess: () => {
                console.log('Course updated successfully!');
                // Assuming router is available globally or imported from '@inertiajs/react'
                router.visit(route('instructor.courses.index'));
            },
            onError: (errors) => {
                console.error('Update failed. Validation Errors:', errors);
                // The errors state in useForm will be updated and displayed
            },
            // preserveFiles: true, // Keep the selected file input value on error (optional but helpful)
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Revoke previous blob URL to free memory
            if (selectedImage && selectedImage.startsWith('blob:')) {
                URL.revokeObjectURL(selectedImage);
            }
            setSelectedImage(URL.createObjectURL(file));
            setData('thumbnail', file); // Set the File object in form data
        } else {
            // Handle clearing the selection if needed
            if (selectedImage && selectedImage.startsWith('blob:')) {
                URL.revokeObjectURL(selectedImage);
            }
            setSelectedImage(null); // Clear preview
            setData('thumbnail', null); // Set thumbnail back to null in form data
        }
    };

    // ... addLearningOutcome, removeLearningOutcome, updateLearningOutcome ...
    const addLearningOutcome = () => {
        setData('learning_outcomes', [...data.learning_outcomes, '']);
    };

    const removeLearningOutcome = (index) => {
        const newOutcomes = data.learning_outcomes.filter((_, i) => i !== index);
        setData('learning_outcomes', newOutcomes);
    };

    const updateLearningOutcome = (index, value) => {
        const newOutcomes = [...data.learning_outcomes];
        newOutcomes[index] = value;
        setData('learning_outcomes', newOutcomes);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            {/* ... form rendering code (same as before) ... */}
            <form onSubmit={handleSubmit} className="p-6 text-gray-600">
                {/* ... form fields (title, description, category, thumbnail, learning outcomes, difficulty, duration, price, is_published) ... */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Edit Course</h2>
                        <p className="mt-1 text-sm text-gray-600">Update your course information.</p>
                    </div>

                    <div>
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="category" value="Category" />
                        <TextInput
                            id="category"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                        />
                        <InputError message={errors.category} className="mt-2" />
                    </div>
                    {/* Thumbnail Input Section */}
                    <div>
                        <InputLabel htmlFor="thumbnail" value="Thumbnail" />
                        <input type="file" id="thumbnail" className="mt-1 block w-full" onChange={handleImageChange} accept="image/*" />
                        {selectedImage && (
                            <div className="mt-2">
                                <img src={selectedImage} alt="Course thumbnail preview" className="h-32 w-32 rounded-lg object-cover" />
                                {/* Optional: Button to clear selected image */}
                                {data.thumbnail instanceof File && ( // Only show clear if a new file is selected
                                    <button
                                        type="button"
                                        onClick={() => handleImageChange({ target: { files: [] } })} // Simulate clearing file input
                                        className="mt-1 text-sm text-red-600 hover:text-red-900"
                                    >
                                        Remove Selected Image
                                    </button>
                                )}
                            </div>
                        )}
                        {/* Display validation errors for thumbnail */}
                        <InputError message={errors.thumbnail} className="mt-2" />
                    </div>
                    {/* ... other fields ... */}

                    {/* Learning Outcomes Section */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <InputLabel value="Learning Outcomes" />
                            <button
                                type="button"
                                onClick={addLearningOutcome}
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
                            >
                                <PlusIcon className="mr-1 h-4 w-4" />
                                Add Outcome
                            </button>
                        </div>
                        {/* Map over learning_outcomes to render inputs */}
                        {data.learning_outcomes.map((outcome, index) => (
                            <div key={index} className="mt-2 flex items-center gap-2">
                                <TextInput
                                    type="text"
                                    className="block w-full"
                                    value={outcome}
                                    onChange={(e) => updateLearningOutcome(index, e.target.value)}
                                    placeholder={`Learning outcome ${index + 1}`}
                                />
                                {/* Show remove button if there's more than one outcome */}
                                {data.learning_outcomes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLearningOutcome(index)}
                                        className="inline-flex items-center rounded-full border border-transparent p-1 text-red-600 hover:bg-red-100"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {/* Display validation errors for learning_outcomes */}
                        <InputError message={errors.learning_outcomes} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="difficulty_level" value="Difficulty Level" />
                        <select
                            id="difficulty_level"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.difficulty_level}
                            onChange={(e) => setData('difficulty_level', e.target.value)}
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <InputError message={errors.difficulty_level} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="duration" value="Duration (in hours)" />
                        <TextInput
                            id="duration"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.duration}
                            onChange={(e) => setData('duration', e.target.value)}
                        />
                        <InputError message={errors.duration} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="price" value="Price" />
                        <TextInput
                            id="price"
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_published"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                        />
                        <InputLabel htmlFor="is_published" value="Publish Course" className="ml-2" />
                        <InputError message={errors.is_published} className="mt-2" />
                    </div>
                    {/* ... rest of the form fields and buttons ... */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-900 disabled:opacity-25"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
