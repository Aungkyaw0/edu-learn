import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { InputLabel, TextInput, InputError } from "@/Components/Forms";
import ModuleModal from '@/Components/Modals/ModuleModal';
import LessonModal from '@/Components/Modals/LessonModal';
import AssessmentModal from '@/Components/AssessmentModal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EditCourse({ course }) {
    const [selectedImage, setSelectedImage] = useState(course.thumbnail || null);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [currentModuleForLesson, setCurrentModuleForLesson] = useState(null);
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        thumbnail: null,
        learning_outcomes: course.learning_outcomes || [''],
        difficulty_level: course.difficulty_level || 'beginner',
        duration: course.duration || '',
        price: course.price || '',
        is_published: course.is_published || false,
        _method: 'PUT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create FormData object
        const formData = new FormData();
        
        // Append all form fields to FormData
        Object.keys(data).forEach(key => {
            if (key === 'learning_outcomes') {
                // Handle array data
                data[key].forEach((outcome, index) => {
                    formData.append(`learning_outcomes[${index}]`, outcome);
                });
            } else if (key === 'thumbnail' && data[key] === null) {
                // Don't append thumbnail if it hasn't changed
                return;
            } else {
                formData.append(key, data[key]);
            }
        });

        post(route('instructor.courses.update', course.id), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                router.visit(route('instructor.courses.index'));
            },
            preserveFiles: true,
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
        const newOutcomes = data.learning_outcomes.filter((_, i) => i !== index);
        setData('learning_outcomes', newOutcomes);
    };

    const updateLearningOutcome = (index, value) => {
        const newOutcomes = [...data.learning_outcomes];
        newOutcomes[index] = value;
        setData('learning_outcomes', newOutcomes);
    };

    const openModuleModal = (module = null) => {
        setSelectedModule(module);
        setIsModuleModalOpen(true);
    };

    const closeModuleModal = () => {
        setSelectedModule(null);
        setIsModuleModalOpen(false);
    };

    const openLessonModal = (module, lesson = null) => {
        if (!module?.id) {
            console.error('No module ID provided');
            return;
        }
        setCurrentModuleForLesson(module);
        setSelectedLesson(lesson);
        setIsLessonModalOpen(true);
    };

    const closeLessonModal = () => {
        setCurrentModuleForLesson(null);
        setSelectedLesson(null);
        setIsLessonModalOpen(false);
    };

    const handleDeleteModule = (moduleId) => {
        if (confirm('Are you sure you want to delete this module? This will also delete all lessons within this module.')) {
            router.delete(route('instructor.modules.destroy', moduleId), {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteLesson = (lessonId) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            router.delete(route('instructor.lessons.destroy', lessonId), {
                preserveScroll: true,
            });
        }
    };

    const handleCreateAssessment = () => {
        setEditingAssessment(null);
        setShowAssessmentModal(true);
    };

    const handleEditAssessment = (assessment) => {
        setEditingAssessment(assessment);
        setShowAssessmentModal(true);
    };

    const handleDeleteAssessment = () => {
        if (confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
            router.delete(route('courses.assessments.destroy', [course.id, course.assessment.id]));
        }
    };

    return (
        <AppLayout>
            <div className="py-12 text-black">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-semibold mb-6">Edit Course: {course.title}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                                {/* Course Title */}
                                <div>
                                    <InputLabel htmlFor="title" value="Course Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="mt-1 block w-full"
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
                                    />
                                    <InputError message={errors.category} className="mt-2" />
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
                                    />
                                    <InputError message={errors.price} className="mt-2" />
                                </div>

                                {/* Thumbnail */}
                                <div>
                                    <InputLabel htmlFor="thumbnail" value="Course Thumbnail" />
                                    <div className="mt-2 flex items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={selectedImage || '/images/default-course.jpg'}
                                                alt="Course thumbnail preview"
                                                className="h-32 w-32 object-cover rounded-lg"
                                            />
                                        </div>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                                    {data.learning_outcomes && data.learning_outcomes.map((outcome, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <TextInput
                                                value={outcome}
                                                onChange={e => updateLearningOutcome(index, e.target.value)}
                                                className="flex-1"
                                                placeholder={`Learning outcome ${index + 1}`}
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

                                {/* Difficulty Level */}
                                <div>
                                    <InputLabel htmlFor="difficulty_level" value="Difficulty Level" />
                                    <select
                                        id="difficulty_level"
                                        value={data.difficulty_level}
                                        onChange={e => setData('difficulty_level', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    <InputError message={errors.difficulty_level} className="mt-2" />
                                </div>

                                {/* Published Status */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={data.is_published}
                                        onChange={e => setData('is_published', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                                        Publish this course
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Modules Section */}
                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Course Modules</h3>
                                <button
                                    onClick={() => openModuleModal()}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                                >
                                    Add Module
                                </button>
                            </div>

                            {course.modules && course.modules.length > 0 ? (
                                <div className="space-y-4">
                                    {course.modules.map((module) => (
                                        <div key={module.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900">{module.title}</h4>
                                                    <p className="text-sm text-gray-500">{module.description}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openModuleModal(module)}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Edit Module
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteModule(module.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Lessons */}
                                            <div className="mt-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h5 className="text-sm font-medium text-gray-700">Lessons</h5>
                                                    <button
                                                        onClick={() => openLessonModal(module)}
                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                                    >
                                                        Add Lesson
                                                    </button>
                                                </div>
                                                {module.lessons && module.lessons.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {module.lessons.map((lesson) => (
                                                            <div key={lesson.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                                <span className="text-sm text-gray-900">{lesson.title}</span>
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => openLessonModal(module, lesson)}
                                                                        className="text-sm text-indigo-600 hover:text-indigo-900"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteLesson(lesson.id)}
                                                                        className="text-sm text-red-600 hover:text-red-900"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No lessons yet</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No modules yet. Add your first module to get started.</p>
                            )}
                        </div>
                    </div>

                    {/* Assessment Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Final Assessment</h2>
                                {!course.assessment ? (
                                    <button
                                        onClick={handleCreateAssessment}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Create Assessment
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditAssessment(course.assessment)}
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-500 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            Edit Assessment
                                        </button>
                                        <button
                                            onClick={handleDeleteAssessment}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Delete Assessment
                                        </button>
                                    </div>
                                )}
                            </div>

                            {course.assessment ? (
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-lg mb-2">{course.assessment.title}</h3>
                                    <p className="text-gray-600 mb-4">{course.assessment.description}</p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium mb-2">Assessment Details:</h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            <li>10 Multiple Choice Questions</li>
                                            <li>Passing Score: 8/10</li>
                                            <li>No time limit</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-600">
                                    No assessment has been created for this course yet. Create one to test your students' knowledge.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ModuleModal
                isOpen={isModuleModalOpen}
                onClose={closeModuleModal}
                course={course}
                module={selectedModule}
            />
            {currentModuleForLesson && (
                <LessonModal
                    isOpen={isLessonModalOpen}
                    onClose={closeLessonModal}
                    module={currentModuleForLesson}
                    lesson={selectedLesson}
                />
            )}
            <AssessmentModal
                show={showAssessmentModal}
                onClose={() => {
                    setShowAssessmentModal(false);
                    setEditingAssessment(null);
                }}
                course={course}
                assessment={editingAssessment}
            />
        </AppLayout>
    );
} 