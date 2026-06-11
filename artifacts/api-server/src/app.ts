import express, { Request, Response } from 'express';
import cors from 'cors';
import { geminiRouter } from './routes/gemini';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', geminiRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default app;
