import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-guards';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
  @Get('test')
  test() {
    return 'Auth Service is reachable';
  }
}
