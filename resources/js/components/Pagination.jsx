import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    // If no links are provided, don't render anything
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-center mt-4 space-x-2">
            {links.map((link, key) => {
                if (!link.url) {
                    return (
                        <span
                            key={key}
                            className="px-4 py-2 text-gray-500 bg-green-500 rounded-md cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 rounded-md ${
                            link.active
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
} 