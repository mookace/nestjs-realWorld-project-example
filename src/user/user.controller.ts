import {
  Get,
  Post,
  Body,
  Controller,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserEntity } from './user.entity';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../shared/user.decorator';
import { LoginUserDto } from './dto/login-user.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Create New User
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @Body() userData: CreateUserDto
  ): Promise<{ msg; data; status }> {
    console.log('create', userData);
    const data = await this.userService.create(userData);
    return { msg: 'User Created Successfully', data, status: 'success' };
  }

  // change password
  @UsePipes(new ValidationPipe())
  @Post('change-password')
  async ChangePassword(
    @User('id') id: number,
    @Body() userData: ChangePasswordDto
  ): Promise<{ msg; data; status }> {
    const data = await this.userService.changePassword(userData, id);
    return { msg: 'Password Changed Successfully', data, status: 'success' };
  }

  //Forget Password
  @UsePipes(new ValidationPipe())
  @Post('forget-password')
  async ForgetPassword(
    @Body() userData: ForgetPasswordDto
  ): Promise<{ msg; data; status }> {
    const data = await this.userService.ForgetPassword(userData);
    return { msg: 'Forget Password COde', data, status: 'success' };
  }

  //Password code verify
  @UsePipes(new ValidationPipe())
  @Post('verify-code')
  async VerifyCode(
    @Body() userData: VerifyCodeDto
  ): Promise<{ msg; data; status }> {
    const data = await this.userService.VerifyCode(userData);
    return { msg: 'Code Verified', data, status: 'success' };
  }

  // Reset password
  @UsePipes(new ValidationPipe())
  @Post('reset-password')
  async ResetPassword(
    @User('id') id: number,
    @Body() userData: ResetPasswordDto
  ): Promise<{ msg; data; status }> {
    const data = await this.userService.resetPassword(userData, id);
    return { msg: 'Password Changed Successfully', data, status: 'success' };
  }

  //Login User
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ msg; data; status }> {
    const _user = await this.userService.findOne(loginUserDto);
    const errors = { msg: ' Incorrect Email or Password !' };
    if (!_user) {
      throw new HttpException(
        { msg: 'Incorrect Email or Password !', errors, status: 'errors' },
        401
      );
    }

    if (_user.roles == 0) {
      _user.is_logged = 1;

      const token = await this.userService.generateJWT(_user);
      await this.userService.logIn(_user, token);
      const { email, username, roles, profile } = _user;
      let data = {
        username,
        email,
        token,
        roles,
        profile,
      };
      return { msg: 'Login Successfully', data, status: 'success' };
    } else {
      throw new HttpException(
        {
          msg: 'UnAuthorized Email',
          errors: 'UnAuthorized Email',
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //Logout User
  @Post('logout')
  async logout(@Req() req: Request): Promise<{ msg; data; status }> {
    const data = await this.userService.Logout(req);
    return { msg: 'Logout Successfully', data, status: 'success' };
  }
}
