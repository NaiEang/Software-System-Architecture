import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permissions.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Role } from 'src/entities/roles.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,

    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,

    @InjectRepository(UserRole)
    private readonly userRoles: Repository<UserRole>,

    @InjectRepository(RolePermission)
    private readonly rolePerms: Repository<RolePermission>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
  ) {}

  async register(email: string, password: string) {
    // TODO: check if email exists
    const existingEmail = await this.users.findOne({ where: { email } });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // TODO: create user
    const user = this.users.create({ email, passwordHash });
    await this.users.save(user);

    // TODO: assign default role (user)
    const defaultRole = await this.rolesRepo.findOne({
      where: { name: 'user' },
    });
    if (defaultRole) {
      await this.userRoles.save(
        this.userRoles.create({ user, role: defaultRole }),
      );
    }
    return { messgage: 'User registered successfully', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Fetch roles
    const roles = await this.userRoles.find({
      where: { user: { id: user.id } },
      relations: ['role'],
    });
    const roleNames = roles.map((r) => r.role.name);

    // Fetch permissions via roles
    const roleIds = roles.map((r) => r.role.id);

    let permissionKeys: string[] = [];
    if (roleIds.length > 0) {
      const perms = await this.rolePerms
        .createQueryBuilder('rp')
        .leftJoinAndSelect('rp.permission', 'permission')
        .where('rp.roleId IN (:...roleIds)', { roleIds })
        .getMany();
      permissionKeys = [...new Set(perms.map((x) => x.permission.key))];
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
      permissions: permissionKeys,
    };

    const accessToken = await this.jwt.signAsync(payload);

    const refreshToken = randomBytes(48).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // TODO: store refresh token hash
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokens.save(
      this.refreshTokens.create({
        user,
        tokenHash: refreshTokenHash,
        expiresAt,
      }),
    );
    // expiresAt should be computed (ex: now + 7 days)

    return { accessToken, refreshToken };
  }
}
