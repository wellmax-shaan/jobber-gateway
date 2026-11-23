import { SignIn } from '@gateway/controller/auth/signin';
import { SignUp } from '@gateway/controller/auth/signup';
import { VerifyEmail } from '@gateway/controller/auth/verify-email';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/signup', SignUp.prototype.create);
    this.router.post('/auth/signin', SignIn.prototype.read);
    this.router.post('/auth/verify-email', VerifyEmail.prototype.update);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();