import { Router } from 'express';

const router = new Router();

router.get('/ping', (req, res) => res.data({ res: 'pong' }));

export default router;
