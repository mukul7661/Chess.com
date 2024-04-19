import { Request, Response, Router } from 'express';
const router = Router();
const passport = require('passport');
import jwt from 'jsonwebtoken';

const CLIENT_URL = 'http://localhost:5173/game';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

interface User {
  _id: string;
}

router.get('/auth/refresh', (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as User;

    // Token is issued so it can be shared b/w HTTP and ws server
    // Todo: Make this temporary and add refresh logic here
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({
      token
    });
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

router.get('/login/failed', (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: 'failure' });
});

router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).json({ error: 'Failed to log out' });
    } else {
      res.clearCookie('jwt');
      res.redirect('http://localhost:5173/');
    }
  });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: CLIENT_URL,
  failureRedirect: '/login/failed',
}));

router.get('/github', passport.authenticate('github', { scope: ['profile', 'email'] }));

router.get('/github/callback', passport.authenticate('github', {
  successRedirect: CLIENT_URL,
  failureRedirect: '/login/failed',
}));

router.get('/facebook', passport.authenticate('facebook', { scope: ['profile'] }));

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: CLIENT_URL,
  failureRedirect: '/login/failed',
}));

export default router;