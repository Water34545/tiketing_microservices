import express from 'express';

const router = express.Router();

router.post('/api/users/singin', (req, res) => {
  res.send('Hi there');
});

export { router as singInRouter };