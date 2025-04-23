const AssessmentSection = ({ course, assessment }) => {
    const isInstructor = auth.user.id === course.instructor_id;

    if (!isInstructor) return null;

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-6">
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Final Assessment</h2>
                    {!assessment ? (
                        <Link
                            href={route('courses.assessments.create', course.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Create Assessment
                        </Link>
                    ) : (
                        <div className="space-x-2">
                            <Link
                                href={route('courses.assessments.edit', [course.id, assessment.id])}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                            >
                                Edit Assessment
                            </Link>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this assessment?')) {
                                        Inertia.delete(route('courses.assessments.destroy', [course.id, assessment.id]));
                                    }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                            >
                                Delete Assessment
                            </button>
                        </div>
                    )}
                </div>

                {assessment && (
                    <div className="mt-4">
                        <h3 className="font-medium text-lg mb-2">{assessment.title}</h3>
                        <p className="text-gray-600">{assessment.description}</p>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                • 10 Multiple Choice Questions
                                <br />
                                • Passing Score: 8/10
                                <br />
                                • No time limit
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

<div className="py-12">
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Other course sections */}
        
        {/* Add the Assessment Section */}
        <AssessmentSection course={course} assessment={course.assessment} />
    </div>
</div> 