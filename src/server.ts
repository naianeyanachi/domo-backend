import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import citadel from './routes/citadel';

const app: Express = express();
const port: number = 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/api/citadels', citadel);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});