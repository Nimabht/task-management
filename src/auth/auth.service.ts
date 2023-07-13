import {
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const existingUser = await this.userRepository.findOneBy({ username });
    if (!!existingUser) {
      throw new ConflictException('Username already exists.');
    }
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    await newUser.hashPassword();
    await this.userRepository.save(newUser);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const existingUser = await this.userRepository.findOneBy({ username });
    if (!existingUser || !(await existingUser.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
