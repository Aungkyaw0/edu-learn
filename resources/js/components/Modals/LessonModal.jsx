import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { InputLabel, TextInput, InputError } from "@/Components/Forms";

export default function LessonModal({ isOpen, onClose, module, lesson = null }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        module_id: module?.id || '',
        title: lesson?.title || '',
        content: lesson?.content || '',
        order_index: lesson?.order_index || (module?.lessons?.length || 0),
        duration: lesson?.duration || '',
        resources: lesson?.resources || [],
    });

    // Update form data when module changes
    useEffect(() => {
        setData('module_id', module?.id || '');
    }, [module]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (lesson) {
            put(route('instructor.lessons.update', lesson.id), {
                onSuccess: () => handleClose(),
                preserveScroll: true,
            });
        } else {
            post(route('instructor.lessons.store'), {
                onSuccess: () => handleClose(),
                preserveScroll: true,
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto text-gray-800">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                        {lesson ? 'Edit Lesson' : 'Create New Lesson'}
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                        <input type="hidden" name="module_id" value={data.module_id} />
                                        
                                        <div>
                                            <InputLabel htmlFor="title" value="Lesson Title" />
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

                                        <div>
                                            <InputLabel htmlFor="content" value="Content" />
                                            <textarea
                                                id="content"
                                                value={data.content}
                                                onChange={e => setData('content', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                rows={6}
                                                required
                                            />
                                            <InputError message={errors.content} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="duration" value="Duration (minutes)" />
                                            <TextInput
                                                id="duration"
                                                type="number"
                                                value={data.duration}
                                                onChange={e => setData('duration', e.target.value)}
                                                className="mt-1 block w-full"
                                                min="1"
                                                required
                                            />
                                            <InputError message={errors.duration} className="mt-2" />
                                        </div>

                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            <button
                                                type="submit"
                                                disabled={processing || !data.module_id}
                                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:opacity-50"
                                            >
                                                {processing ? 'Saving...' : (lesson ? 'Save Changes' : 'Create Lesson')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 