import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport/dist/passport.module';

import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/roles.entity';
import { User } from 'src/entities/user.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { RolePermission } from 'src/entities/role-permissions.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-guards';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      RolePermission,
      RefreshToken,
    ]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'testSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
