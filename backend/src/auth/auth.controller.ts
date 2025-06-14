import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Grequest, Irequest } from 'src/globals/Req.dto';
import { OnBoardingDTO, SignInDTO, SignUpDTO } from 'src/user/dtos/user.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard/jwtGuard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @HttpCode(200)
  @Get('google')
  async googleAuth() {
    // initiates Google OAuth
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @HttpCode(200)
  async googleAuthRedirect(@Req() req: Grequest, @Res() res: Response) {
    try {
      if (!req.user) {
        throw new Error('No user found in request');
      }

      const { user } = req;

      const token = await this.authService.createGoogleUser(user);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });

      res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:3000');
    } catch (error) {
      console.error('Error in Google callback:', error);

      // Send error page instead of JSON
      res.status(500).send(`
        <html>
          <body>
            <script>
              window.location.href = '${process.env.FRONTEND_URL}/login?error=oauth_failed';
            </script>
            <p>Authentication failed. Redirecting...</p>
          </body>
        </html>
      `);
    }
  }

  //SIGNUP
  @ApiOperation({ summary: 'Register API' })
  @HttpCode(201)
  @Post('signup')
  async singup(@Body() userDto: SignUpDTO, @Res() res: Response) {
    const token = await this.authService.singup(userDto);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    return res.status(201).json({ token, success: true });
  }

  //SIGNIN
  @ApiOperation({ summary: 'Login API' })
  @Post('signin')
  async signin(@Body() userDto: SignInDTO, @Res() res: Response) {
    const token = await this.authService.sigin(userDto);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    return res.status(201).json({ token, success: true });
  }

  //LOGOUT
  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout' })
  logout(@Res() res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    return res
      .status(201)
      .json({ success: true, message: 'Successfully Logged out' });
  }

  //ME
  @UseGuards(JwtGuard)
  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get me' })
  getLoggedInUser(@Req() req: Irequest) {
    return this.authService.getMe(req.user.id);
  }

  @Delete()
  @HttpCode(200)
  delAllUser() {
    return this.authService.delAll();
  }

  @UseGuards(JwtGuard)
  @Post('onboard')
  @ApiOperation({ summary: 'Complete onboarding' })
  onboard(@Req() req: Irequest, @Body() onBoardingDto: OnBoardingDTO) {
    const { id, email } = req.user;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      onBoardingDto;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location)
      throw new BadRequestException('Enter values for given fields');
    return this.authService.onboard(id, email, onBoardingDto);
  }
}
