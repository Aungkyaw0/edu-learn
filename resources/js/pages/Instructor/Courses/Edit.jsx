import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ModuleModal from '@/Components/Modals/ModuleModal';
import LessonModal from '@/Components/Modals/LessonModal';
import AssessmentModal from '@/Components/AssessmentModal';
import CourseModal from '@/Components/Modals/CourseModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EditCourse({ course }) {
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [currentModuleForLesson, setCurrentModuleForLesson] = useState(null);
    const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);
    const [generatingAssessment, setGeneratingAssessment] = useState(false);

    const handleDeleteCourse = () => {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            router.delete(route('instructor.courses.destroy', course.id));
        }
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
        setIsAssessmentModalOpen(true);
    };

    const handleEditAssessment = (assessment) => {
        setEditingAssessment(assessment);
        setIsAssessmentModalOpen(true);
    };

    const handleCloseAssessmentModal = () => {
        setIsAssessmentModalOpen(false);
        setEditingAssessment(null);
    };

    const handleDeleteAssessment = () => {
        if (confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
            router.delete(route('courses.assessments.destroy', [course.id, course.assessment.id]));
        }
    };

    const handleGenerateAssessment = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (confirm('Are you sure you want to generate an AI assessment for this course? This cannot be undone.')) {
            setGeneratingAssessment(true);
            router.post(route('instructor.assessment.generate', course.id), {}, {
                onSuccess: () => {
                    setGeneratingAssessment(false);
                    window.location.reload();
                },
                onError: (errors) => {
                    setGeneratingAssessment(false);
                    alert(errors.message || 'Failed to generate assessment. Please try again.');
                }
            });
        }
    };

    return (
        <AppLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Course Information Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-gray-800">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-semibold">Course Information</h2>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setIsCourseModalOpen(true)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        Edit Course
                                    </button>
                                    <button
                                        onClick={handleDeleteCourse}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-2" />
                                        Delete Course
                                    </button>
                                </div>
                                </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Title</h4>
                                            <p className="mt-1">{course.title}</p>
                                </div>
                                <div>
                                            <h4 className="text-sm font-medium text-gray-500">Description</h4>
                                            <p className="mt-1">{course.description}</p>
                                </div>
                                <div>
                                            <h4 className="text-sm font-medium text-gray-500">Category</h4>
                                            <p className="mt-1">{course.category}</p>
                                </div>
                                <div>
                                            <h4 className="text-sm font-medium text-gray-500">Difficulty Level</h4>
                                            <p className="mt-1 capitalize">{course.difficulty_level}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-2">Additional Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                                            <p className="mt-1">{course.duration} hours</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Price</h4>
                                            <p className="mt-1">${course.price}</p>
                                    </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                            <p className="mt-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    course.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {course.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                </div>

                            {course.thumbnail && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-2">Thumbnail</h3>
                                    <img
                                        src={course.thumbnail}
                                        alt="Course thumbnail"
                                        className="w-48 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-2">Learning Outcomes</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {course.learning_outcomes?.map((outcome, index) => (
                                        <li key={index} className="text-gray-600">{outcome}</li>
                                    )) || (
                                        <li className="text-gray-500">No learning outcomes defined</li>
                                    )}
                                </ul>
                                </div>
                        </div>
                    </div>

                    {/* Modules Section */}
                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Course Modules</h3>
                                <button
                                    type="button"
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
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium text-gray-900">Final Assessment</h2>
                                {!course.assessment ? (
                                    <div className="flex space-x-4">
                                    <button
                                            type="button"
                                        onClick={handleGenerateAssessment}
                                            disabled={generatingAssessment}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                            {generatingAssessment ? 'Generating...' : 'Generate Assessment with AI'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCreateAssessment}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Create Assessment
                                    </button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-4">
                                    <button
                                            type="button"
                                            onClick={() => handleEditAssessment(course.assessment)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Edit Assessment
                                    </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteAssessment}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Delete Assessment
                                        </button>
                                    </div>
                                )}
                            </div>

                            {course.assessment && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">
                                        Assessment Title: {course.assessment.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Number of Questions: {course.assessment.questions.length}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CourseModal
                show={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                course={course}
            />
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
                show={isAssessmentModalOpen}
                onClose={handleCloseAssessmentModal}
                course={course}
                assessment={editingAssessment}
            />
        </AppLayout>
    );
} 