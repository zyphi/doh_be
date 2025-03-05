import { Router } from 'express';

import { v0SignupController } from '#app/controllers/api/auth/v0.signup.controllers';
import { v0LoginController } from '#app/controllers/api/auth/v0.login.controllers';
import { v0ResetPasswordController } from '#app/controllers/api/auth/v0.resetPassword.controllers';
import { v0SetNewPasswordController } from '#app/controllers/api/auth/v0.SetNewPassword.controllers';
import { v0RefreshTokenController } from '#app/controllers/api/auth/v0.refreshToken.controllers';
import { v0LogoutController } from '#app/controllers/api/auth/v0.logout.controllers';

const v0AuthRouter = Router();

v0AuthRouter.post('/signup', v0SignupController());

v0AuthRouter.post('/login', v0LoginController());

v0AuthRouter.get('/logout', v0LogoutController());

v0AuthRouter.post('/reset-password', v0ResetPasswordController());

v0AuthRouter.patch('/set-new-password', v0SetNewPasswordController());

v0AuthRouter.post('/refresh-token/:id', v0RefreshTokenController());

export default v0AuthRouter;
