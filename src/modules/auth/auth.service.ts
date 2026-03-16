import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

interface FacebookProfile {
  id: string;
  name: string;
  email?: string;
  picture?: { data: { url: string } };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async facebookLogin(accessToken: string) {
    const fbRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
    );

    if (!fbRes.ok) {
      throw new UnauthorizedException('Invalid Facebook access token');
    }

    const profile: FacebookProfile = await fbRes.json();

    let user = await this.usersRepository.findOne({
      where: { facebookUserId: profile.id },
    });

    if (!user) {
      user = this.usersRepository.create({
        facebookUserId: profile.id,
        name: profile.name,
        email: profile.email ?? null,
        avatarUrl: profile.picture?.data?.url ?? null,
      });
      await this.usersRepository.save(user);
    }

    const payload = { sub: user.id, facebookUserId: user.facebookUserId };
    return { accessToken: this.jwtService.sign(payload), user };
  }
}
