import axios from 'axios';
import { Message } from './Message';

const BASE_URL = 'http://localhost:3001/messages';

export const fetchMessages = async (): Promise<Message[]> => {
    const response = await axios.get<Message[]>(BASE_URL);
    return response.data;
};

export const createMessage = async (message: Omit<Message, 'id'>): Promise<Message> => {
    const response = await axios.post<Message>(BASE_URL, message);
    return response.data;
};

export const deleteMessage = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
};
