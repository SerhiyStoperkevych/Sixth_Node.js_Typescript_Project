import cors from 'cors';

export const corsMiddleware = cors({
  origin: 'http://localhost:3000', // Allow requests from React frontend
});
