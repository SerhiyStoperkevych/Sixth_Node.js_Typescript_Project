import express from 'express';
import bodyParser from 'body-parser';
import { corsMiddleware } from './middlewares/corsMiddleware';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const port = 3001;

// Use middlewares
app.use(corsMiddleware);
app.use(bodyParser.json());

// Use routes
app.use(messageRoutes);
app.use(userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
