import { Router } from 'express';
import { getMessages, postMessage, deleteMessage } from '../controllers/messageController';

const router = Router();

router.get('/messages', getMessages);
router.post('/messages', postMessage);
router.delete('/messages/:id', deleteMessage);

export default router;
