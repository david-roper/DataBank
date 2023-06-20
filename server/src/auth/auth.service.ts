import { randomInt } from 'crypto';

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CurrentUser, Locale, VerificationProcedureInfo } from '@databank/types';
import bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';

import { CreateAccountDto } from './dto/create-account.dto.js';
import { VerifyAccountDto } from './dto/verify-account.dto.js';
import { VerificationCode } from './schemas/verification-code.schema.js';

import { I18nService } from '@/i18n/i18n.service.js';
import { MailService } from '@/mail/mail.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService
  ) {}

  async login(email: string, password: string, locale?: Locale) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(this.i18n.translate(locale, 'errors.unauthorized.invalidCredentials'));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(this.i18n.translate(locale, 'errors.unauthorized.invalidCredentials'));
    }

    const payload: CurrentUser = {
      email,
      role: user.role,
      isVerified: user.isVerified
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /** Create a new standard account with verification required */
  async createAccount(createAccountDto: CreateAccountDto): Promise<CurrentUser> {
    return this.usersService.createUser({ ...createAccountDto, role: 'standard', isVerified: false });
  }

  async sendVerificationCode({ email }: CurrentUser, locale?: Locale): Promise<VerificationProcedureInfo> {
    const user = (await this.usersService.findByEmail(email))!;

    // If there is an existing, non-expired code, use that since we record attempts for security
    let verificationCode: VerificationCode;
    if (user.verificationCode && user.verificationCode.expiry > Date.now()) {
      verificationCode = user.verificationCode;
    } else {
      // set expiry to 6 min from now - 5 is shown to user + 1 for network latency
      verificationCode = {
        expiry: Date.now() + 360000,
        value: randomInt(100000, 1000000)
      };
      await user.updateOne({ verificationCode });
    }

    await this.mailService.sendMail({
      to: user.email,
      subject: this.i18n.translate(locale, 'verificationEmail.body'),
      text: this.i18n.translate(locale, 'verificationEmail.body') + '\n\n' + `Code : ${verificationCode.value}`
    });
    return { expiry: verificationCode.expiry };
  }

  async verifyAccount({ email }: CurrentUser, { code }: VerifyAccountDto) {
    const user = await this.usersService.findByEmail(email);
    if (user?.verificationCode.value === code && user.verificationCode.expiry > Date.now()) {
      await user.updateOne({ verificationCode: undefined, verifiedAt: Date.now(), isVerified: true });
      return;
    }
    throw new ForbiddenException();
  }
}
