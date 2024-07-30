import React, { useState, useEffect } from 'react';
import { Message } from './Message';
import { fetchMessages, createMessage, deleteMessage } from './api';

const List: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
    const [sortBy, setSortBy] = useState<"time" | "head" | "body" | "date" | "importance" | "up" | "down">("time");
    const [lists, setLists] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const messages = await fetchMessages();
                setLists(messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setError('Failed to load messages.');
            }
        };

        fetchLists();
    }, []);

    const handleSendMessage = async () => {
        if (text.trim() && title.trim()) {
            try {
                const newMessage = await createMessage({ title, text, dueDate, priority, completed: false });
                setLists(prevLists => [...prevLists, newMessage]);
                setTitle('');
                setText('');
                setDueDate('');
                setPriority("Medium");
                window.location.reload();
            } catch (error) {
                console.error('Error sending message:', error);
                setError('Failed to send message.');
            }
        } else {
            setError('Title and text are required.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMessage(id);
            setLists(prevLists => prevLists.filter(msg => msg.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
            setError('Failed to delete message.');
        }
    };

    const handleComplete = (id: number) => {
        setLists(prevLists => prevLists.map(msg =>
            msg.id === id ? { ...msg, completed: !msg.completed } : msg
        ));
    };

    const sortedTasks = [...lists].sort((a, b) => {
        switch (sortBy) {
            case 'time':
                return a.id - b.id;
            case 'head':
                return a.title.localeCompare(b.title);
            case 'body':
                return a.text.localeCompare(b.text);
            case 'date':
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            case 'importance':
                const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                return (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
            case 'up':
                return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
            case 'down':
                return a.completed === b.completed ? 0 : b.completed ? 1 : -1;
            default:
                return 0;
        }
    });

    return (
        <div>
            <h1>Messages</h1>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "time" | "head" | "body" | "date" | "importance" | "up" | "down")}>
                <option value="time">Time</option>
                <option value="head">Title</option>
                <option value="body">Text</option>
                <option value="date">Due Date</option>
                <option value="importance">Priority</option>
                <option value="up">Completed Up</option>
                <option value="down">Completed Down</option>
            </select>

            <ul>
                {sortedTasks.length > 0 ? (
                    sortedTasks.map((msg) => (
                        <li key={msg.id}>
                            <h1 style={{ textDecoration: msg.completed ? 'line-through' : 'none' }}>{msg.title}</h1>
                            <p style={{ textDecoration: msg.completed ? 'line-through' : 'none' }}>{msg.text}</p>
                            <p style={{ textDecoration: msg.completed ? 'line-through' : 'none' }}>{msg.dueDate}</p>
                            <p style={{ textDecoration: msg.completed ? 'line-through' : 'none' }}>{msg.priority}</p>
                            <button onClick={() => handleComplete(msg.id)}>
                                {msg.completed ? 'Undo' : 'Complete'}
                            </button>
                            <button onClick={() => handleDelete(msg.id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </ul>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Title'
            />
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Text"
            />
            <input
                type='date'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default List;
