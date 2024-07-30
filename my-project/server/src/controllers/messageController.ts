import { Request, Response } from 'express';
import { loadMessages, saveMessages } from '../utils/fileUtils';
import { Message } from '../models/message';

export const getMessages = (req: Request, res: Response) => {
    const { sortBy } = req.query;

    // Load messages from file
    const messages = loadMessages();
    
    console.log('Messages before sorting:', messages);

    // Sorting logic
    const sortedMessages = [...messages].sort((a, b) => {
        console.log('Sorting by:', sortBy);
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

    console.log('Messages after sorting:', sortedMessages);

    res.json(sortedMessages);
};

export const postMessage = (req: Request, res: Response) => {
    const { title, text, dueDate, priority, completed } = req.body;

    // Validate required fields
    if (!title || !text) {
        return res.status(400).json({ error: 'Complete all requirements' });
    }

    // Validate priority
    const validPriorities: Array<Message['priority']> = ["Low", "Medium", "High"];
    if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority' });
    }

    const newMessage: Message = {
        id: Date.now(),
        title,
        text,
        dueDate,
        priority,
        completed: completed ?? false // Ensure completed is boolean, default to false if undefined
    };

    const messages = loadMessages();
    messages.push(newMessage);
    saveMessages(messages);

    res.status(201).json({ message: 'Message saved' });
};

export const deleteMessage = (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate ID
    const messageId = parseInt(id, 10);
    if (isNaN(messageId)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    let messages = loadMessages();
    messages = messages.filter(message => message.id !== messageId);
    saveMessages(messages);

    res.status(204).send();
};
