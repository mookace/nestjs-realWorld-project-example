import {
  Get,
  Post,
  Req,
  Body,
  Controller,
  UsePipes,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { UserEntity } from './user.entity';
import { Request } from 'express';
import { User } from '../shared/user.decorator';
import { UserRoleUpdateDto } from './dto/update-user.dto';
import { ActivateVendorDto } from './dto/activate-vendor.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiBearerAuth()
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  //Vendor section

  //vendor create new user
  @UsePipes(new ValidationPipe())
  @Post('vendor/create-user')
  async VendorUser(
    @User('id') id: number,
    @Body() userData: CreateUserDto
  ): Promise<{ msg; data; status }> {
    const data = await this.userService.vendorCreateNewUser(userData, id);
    return { msg: 'User Created Successfully', data, status: 'success' };
  }

  //Get Vendor Users
  @Get('vendor/users')
  async GetVendorUser(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.userService.usersByVendor(id);
    return { msg: 'Get Users Successfully', data, status: 'success' };
  }

  //vendor Change roles
  @Post('roles')
  async updateRoles(
    @User('id') id: number,
    @Body() userData: UserRoleUpdateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.userService.update(userData, id);
    return { msg: 'Role Changed Successfully', data, status: 'success' };
  }

  //end of vendor section

  // Get all users
  @Get('all')
  async findAllUsers(@Req() req: Request): Promise<{ msg; data; status }> {
    const data = await this.userService.findAll(req);
    return { msg: 'Get All Users Successfully', data, status: 'success' };
  }

  // Get free services vendor
  @Get('free-vendor')
  async freeVendor(): Promise<{ msg; data; status }> {
    const data = await this.userService.freeVendor();
    return { msg: 'Get Free Vendor Successfully', data, status: 'success' };
  }

  // Get Premium services vendor
  @Get('premium-vendor')
  async premiumVendor(): Promise<{ msg; data; status }> {
    const data = await this.userService.premiumVendor();
    return { msg: 'Get Premium Vendor Successfully', data, status: 'success' };
  }

  // Get Gold services vendor
  @Get('gold-vendor')
  async GoldVendor(): Promise<{ msg; data; status }> {
    const data = await this.userService.GoldVendor();
    return { msg: 'Get Gold Vendor Successfully', data, status: 'success' };
  }

  //Get Total Users(Customer Only)
  @Get('total-users')
  async TotalUsers(): Promise<{ msg; data; status }> {
    const data = await this.userService.FindCustomerOnly();
    return { msg: 'Get Total Users Successfully', data, status: 'success' };
  }

  //Get Users(Customer Only)
  @Get('users-only')
  async UsersOnly(): Promise<{ msg; data; status }> {
    const data = await this.userService.CustomerOnly();
    return { msg: 'Get Users Successfully', data, status: 'success' };
  }

  //New Users Today
  @Get('new-users-today')
  async NewUsersToday(): Promise<{ msg; data; status }> {
    const data = await this.userService.NewCustomerOnly();
    return { msg: 'Get Total Users Successfully', data, status: 'success' };
  }

  //Get total Vendors
  @Get('total-vendor')
  async TotalVendors(): Promise<{ msg; data; status }> {
    const data = await this.userService.TotalVendors();
    return { msg: 'Get Total Vendors Successfully', data, status: 'success' };
  }

  //Get all Vendors list
  @Get('all-vendor')
  async findAllVendors(): Promise<{ msg; data; status }> {
    const data = await this.userService.AllVendors();
    return { msg: 'Get All Vendors Successfully', data, status: 'success' };
  }

  //Activate vendor by admin
  @Post('activate')
  async ActivateVendor(
    @Body() userData: ActivateVendorDto
  ): Promise<{ msg; data; status }> {
    const data = await this.userService.ActivateVendor(userData);
    return { msg: 'Vendor Activated Successfully', data, status: 'success' };
  }

  //Delete vendor
  @Post('delete-vendor')
  async deleteVendor(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.userService.deleteVendor(id);
    return { msg: 'User Deleted Successfully', data, status: 'success' };
  }

  //Delete user
  @Post('delete')
  async delete(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.userService.delete(id);
    return { msg: 'User Deleted Successfully', data, status: 'success' };
  }

  // admin login
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ msg; data; status }> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { msg: ' Incorrect Email or Password !' };
    if (!_user) {
      throw new HttpException(
        { msg: 'Incorrect Email or Pawword !', errors, status: 'errors' },
        401
      );
    }

    if (_user.roles == 2) {
      if (_user.is_active != 1) {
        throw new HttpException(
          {
            msg: 'Need To Activate User !',
            errors: { msg: 'Need To Activate User !' },
            status: 'errors',
          },
          HttpStatus.BAD_REQUEST
        );
      }
    }
    if (_user.roles == 1 || _user.roles == 2) {
      _user.is_logged = 1;

      const token = await this.userService.generateJWT(_user);
      await this.userService.logIn(_user, token);
      const { slug, email, username, roles, profile, id } = _user;
      let data = {
        slug,
        email,
        token,
        username,
        roles,
        profile,
        id,
      };
      return { msg: 'Login Successfully', data, status: 'success' };
    } else {
      throw new HttpException(
        {
          msg: 'UnAuthorized Email',
          errors: 'UnAuthorized Email',
          status: 'errors',
        },
        401
      );
    }
  }
}
