import { useState, useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [dimensions, setDimensions] = useState({ width: 384, height: 500 }); // 384px = w-96
    const resizingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const startDimensionsRef = useRef({ width: 384, height: 500 });
    
    const { data, setData, post, processing, errors } = useForm({
        message: ''
    });
    const { flash } = usePage().props;

    // Watch for new responses from the server
    useEffect(() => {
        if (flash.chat_response) {
            const botResponse = flash.chat_response.content || flash.chat_response;
            if (botResponse && typeof botResponse === 'string') {
                setMessages(prev => [...prev, { 
                    type: 'bot', 
                    content: botResponse
                }]);
            }
        }
    }, [flash.chat_response]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        resizingRef.current = true;
        startPosRef.current = { x: e.clientX, y: e.clientY };
        startDimensionsRef.current = { ...dimensions };
        
        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!resizingRef.current) return;

        const deltaX = e.clientX - startPosRef.current.x;
        const deltaY = e.clientY - startPosRef.current.y;

        // Calculate new dimensions with minimum sizes
        const newWidth = Math.max(300, startDimensionsRef.current.width - deltaX);
        const newHeight = Math.max(400, startDimensionsRef.current.height - deltaY);

        setDimensions({
            width: newWidth,
            height: newHeight
        });
    };

    const handleMouseUp = () => {
        resizingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Cleanup event listeners
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.message.trim() || processing) return;

        const userMessage = data.message.trim();
        
        // Add user message immediately
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        
        // Send message to server
        post(route('chatbot.chat'), {
            data: { message: userMessage },
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData('message', '');
            },
            onError: (errors) => {
                console.error('Chat error:', errors);
                setMessages(prev => [...prev, { 
                    type: 'bot', 
                    content: 'Sorry, I encountered an error. Please try again.' 
                }]);
            }
        });
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Interface */}
            {isOpen && (
                <div 
                    style={{ 
                        width: `${dimensions.width}px`, 
                        height: `${dimensions.height}px` 
                    }}
                    className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200"
                >
                    {/* Resize Handle */}
                    <div 
                        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize group"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="absolute top-0 left-0 w-2 h-2 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-tl" />
                    </div>

                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-indigo-600 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">EduLearn Assistant</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500">
                                <p>👋 Hi! How can I help you today?</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.type === 'user'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.type === 'bot' ? (
                                        <div className="prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                                            <ReactMarkdown
                                                components={{
                                                    h3: ({node, ...props}) => <h3 style={{fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem', marginBottom: '0.25rem'}} {...props} />,
                                                    strong: ({node, ...props}) => <strong style={{color: '#4338ca', fontWeight: 600}} {...props} />,
                                                    ul: ({node, ...props}) => <ul style={{listStyleType: 'disc', paddingLeft: '1rem', marginTop: '0.25rem', marginBottom: '0.25rem'}} {...props} />,
                                                    ol: ({node, ...props}) => <ol style={{listStyleType: 'decimal', paddingLeft: '1rem', marginTop: '0.25rem', marginBottom: '0.25rem'}} {...props} />,
                                                    li: ({node, ...props}) => <li style={{marginTop: '0.125rem', marginBottom: '0.125rem'}} {...props} />
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <span className="whitespace-pre-wrap">{message.content}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {processing && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 text-gray-700">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Chat Bot Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <img
                    src="/images/chat-bot.png"
                    alt="Chat Bot"
                    className="w-8 h-8"
                />
            </button>
        </div>
    );
} 