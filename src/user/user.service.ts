import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ProfileEntity } from '../profile/profile.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CompanyEntity } from '../company/company.entity';
import { UserRoleUpdateDto } from './dto/update-user.dto';
import { Pagination, slugify } from '../shared/other-helper';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ActivateVendorDto } from './dto/activate-vendor.dto';
const jwt = require('jsonwebtoken');
const slug = require('slug');

@Injectable()
export class UserService {
  constructor(
    private readonly mailSystem: MailService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>
  ) {}

  //Create New User
  async create(dto: CreateUserDto): Promise<UserEntity> {
    // check uniqueness of username/email
    let { email, password } = dto;
    email = email.toLowerCase();
    const qb = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      const errors = { msg: 'Email must be unique.' };
      throw new HttpException(
        { msg: 'Input data validation failed', errors, status: 'errors' },
        HttpStatus.BAD_REQUEST
      );
    }

    let newUser = new UserEntity();
    newUser.email = email;
    newUser.password = password;
    newUser.username = email.split('@')[0];
    newUser.slug = slugify(email.split('@')[0]);

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new HttpException(
        {
          msg: 'Input data validation failed',
          errors: { msg: `User input is not valid.` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // create vendor user
    if (dto.vendor == 1) {
      if (dto.service == null || dto.service == undefined) {
        throw new HttpException(
          {
            msg: 'service should not be empty',
            errors: { msg: 'service should not be empty' },
            status: 'errors',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      newUser.service = dto.service;
      newUser.roles = 2;
      const savedUser = await this.userRepository.save(newUser);

      let profileUser = new ProfileEntity();
      profileUser.slug = await slugify(email.split('@')[0]);
      profileUser.user_slug = savedUser.slug;
      profileUser.user_id = savedUser.id;
      profileUser.email = savedUser.email;
      profileUser.username = savedUser.username;
      profileUser.roles = 2;
      profileUser.user = savedUser;

      const profileData = await this.profileRepository.save(profileUser);

      this.mailSystem.sendEmail(
        savedUser.email,
        'Account',
        'Account Created Successfully'
      );

      delete savedUser.password;

      let companyUser = new CompanyEntity();
      companyUser.slug = slugify('company');
      companyUser.user = savedUser.id;
      companyUser.user_id = savedUser.id;
      await this.companyRepository.save(companyUser);
      return savedUser;
    }

    //create normal user
    newUser.is_active = 1;
    const savedUser = await this.userRepository.save(newUser);

    let profileUser = new ProfileEntity();
    profileUser.user_slug = savedUser.slug;
    profileUser.user_id = savedUser.id;
    profileUser.email = savedUser.email;
    profileUser.username = savedUser.username;
    profileUser.slug = slugify(email.split('@')[0]);
    profileUser.user = savedUser;
    await this.profileRepository.save(profileUser);

    this.mailSystem.sendEmail(
      savedUser.email,
      'Account',
      'Account Created Successfully'
    );
    delete savedUser.password;
    return savedUser;
  }

  //Get users by vendor id
  async usersByVendor(id: number): Promise<UserEntity[]> {
    const users = await this.userRepository.find({
      where: { vendor_id: id, is_deleted: false },
      order: { created_at: 'DESC' },
    });

    return users;
  }

  //vendor create new User
  async vendorCreateNewUser(
    dto: CreateUserDto,
    vendor_id: number
  ): Promise<UserEntity> {
    // check uniqueness of username/email
    let { email, password } = dto;
    email = email.toLowerCase();
    const qb = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      const errors = { msg: 'Email must be unique.' };
      throw new HttpException(
        { msg: 'Input data validation failed', errors, status: 'errors' },
        HttpStatus.BAD_REQUEST
      );
    }

    let newUser = new UserEntity();
    newUser.email = email;
    newUser.password = password;
    newUser.username = email.split('@')[0];
    newUser.slug = slugify(email.split('@')[0]);

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new HttpException(
        {
          msg: 'Input data validation failed',
          errors: { msg: `User input is not valid.` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    } else {
      newUser.is_active = 1;
      newUser.vendor_id = vendor_id;
      const savedUser = await this.userRepository.save(newUser);

      let profileUser = new ProfileEntity();
      profileUser.user_slug = newUser.slug;
      profileUser.user_id = newUser.id;
      profileUser.email = newUser.email;
      profileUser.username = newUser.username;
      profileUser.slug = slugify(email.split('@')[0]);
      profileUser.user = savedUser;
      await this.profileRepository.save(profileUser);

      delete savedUser.password;
      return savedUser;
    }
  }

  //change password
  async changePassword(
    data: ChangePasswordDto,
    id: number
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
    });

    if (await argon2.verify(user.password, data.old_password)) {
      user.password = await argon2.hash(data.password);
      user.pass_code = null;
      user.updated_at = new Date();

      const saveUser = await this.userRepository.save(user);
      //   this.mailSystem.sendEmail(
      //     saveUser.email,
      //     'Password Changed',
      //     'Password Changed Successfully'
      //   );
      delete saveUser.password;

      return saveUser;
    } else {
      throw new HttpException(
        {
          msg: 'Invalid old Password',
          errors: { msg: 'Invalid old Password' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Forget password
  async ForgetPassword(data: ForgetPasswordDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        email: data.email,
        is_deleted: false,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errore: { msg: 'No Data Found' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    let random = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);
    user.pass_code = random;
    const code = await this.userRepository.save(user);

    this.mailSystem.sendEmail(
      user.email,
      'Forget Password',
      `Your Forget PassWord Code id ${code.pass_code}`
    );

    return code.pass_code;
  }

  // verify code
  async VerifyCode(userData: VerifyCodeDto): Promise<{
    username;
    email;
    token;
    roles;
  }> {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
        is_deleted: false,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errore: { msg: 'No Data Found' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    if (user.pass_code != userData.code) {
      throw new HttpException(
        {
          msg: 'Wrong Code',
          errore: { msg: 'Wrong Code' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const token = this.generateJWT(user);
    const { email, username, roles } = user;
    let data = {
      username,
      email,
      token,
      roles,
    };

    return data;
  }

  //change password
  async resetPassword(data: ResetPasswordDto, id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: 'No Data Found' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    user.password = await argon2.hash(data.password);
    user.pass_code = null;
    user.updated_at = new Date();

    const saveUser = await this.userRepository.save(user);
    this.mailSystem.sendEmail(
      saveUser.email,
      'Password Changed',
      'Password Changed Successfully'
    );
    delete saveUser.password;

    return saveUser;
  }

  //Find All Users
  async findAll(req: any): Promise<{ data: UserEntity[]; page: number }> {
    const data = await Pagination(req, this.userRepository, null, {
      created_at: 'DESC',
    });

    return data;
  }

  // Free Vendor
  async freeVendor(): Promise<UserEntity[]> {
    const data = await this.userRepository.find({ where: { service: 0 } });
    return data;
  }

  // Premium Vendor
  async premiumVendor(): Promise<UserEntity[]> {
    const data = await this.userRepository.find({ where: { service: 1 } });
    return data;
  }

  // Gold Vendor
  async GoldVendor(): Promise<UserEntity[]> {
    const data = await this.userRepository.find({ where: { service: 2 } });
    return data;
  }

  // Total users (customer only)
  async FindCustomerOnly(): Promise<number> {
    const [users, count] = await this.userRepository.findAndCount({
      where: { roles: 0, is_deleted: false },
      order: { created_at: 'DESC' },
    });

    return count;
  }

  // Total users (customer only)
  async CustomerOnly(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({
      where: { roles: 0, is_deleted: false },
      order: { created_at: 'DESC' },
    });

    return users;
  }

  // Total new User Today
  async NewCustomerOnly(): Promise<number> {
    const todayDate = new Date().toISOString().split('T')[0];

    const data = await this.userRepository.find({
      where: { roles: 0, is_deleted: false },
    });

    const allData = data.filter((item) => {
      if (item.created_at.toString() == todayDate) return item;
    });

    return allData.length;
  }

  //Find total vendors
  async TotalVendors(): Promise<number> {
    const [users, count] = await this.userRepository.findAndCount({
      where: { is_deleted: false, roles: 2 },
      order: { created_at: 'DESC' },
    });

    return count;
  }

  //Find All vendors list
  async AllVendors(): Promise<UserEntity[]> {
    const [users, count] = await this.userRepository.findAndCount({
      where: { is_deleted: false, roles: 2 },
      order: { created_at: 'DESC' },
    });

    return users;
  }

  async findOne({ email, password }: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { is_deleted: false, email: email },
    });
    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }

  async logIn(user: UserEntity, token: string): Promise<UserEntity> {
    const saveUser = Object.assign(user, { is_logged: 1, token: token });
    return await this.userRepository.save(saveUser);
  }

  async passedToken(decoded: any, token: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { is_deleted: false, id: decoded.id, token: token, is_logged: 1 },
    });
    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      const errors = { msg: 'User not found' };
      throw new HttpException(
        { msg: 'User not found', errors, status: 'errors' },
        401
      );
    }

    return user;
  }

  async delete(id: number): Promise<UserEntity> {
    let toDelete = await this.userRepository.findOne({
      where: { id: id, is_deleted: false, roles: 0 },
    });
    if (!toDelete) {
      throw new HttpException(
        { msg: 'No Data Found', errors: 'No Data Found', status: 'errors' },
        HttpStatus.BAD_REQUEST
      );
    }
    let deleted = Object.assign(toDelete, {
      is_deleted: true,
      deleted_at: new Date(),
    });
    return await this.userRepository.save(deleted);
  }

  //Delete Vendor
  async deleteVendor(id: number): Promise<UserEntity> {
    let toDelete = await this.userRepository.findOne({
      where: { id: id, is_deleted: false, roles: 2 },
    });
    if (!toDelete) {
      throw new HttpException(
        { msg: 'No Data Found', errors: 'No Data Found', status: 'errors' },
        HttpStatus.BAD_REQUEST
      );
    }
    let deleted = Object.assign(toDelete, {
      is_active: 2,
      is_deleted: true,
      deleted_at: new Date(),
    });
    return await this.userRepository.save(deleted);
  }

  // update roles
  async update(
    userData: UserRoleUpdateDto,
    vendor: number
  ): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOne({
      where: { id: userData.id, vendor_id: vendor, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        { msg: 'No Data Found', errors: 'No Data Found', status: 'errors' },
        HttpStatus.BAD_REQUEST
      );
    }

    console.log('toupdate', toUpdate);

    toUpdate.updated_at = new Date();

    let ProfileData = await this.profileRepository.findOne({
      where: { user_id: userData.id, is_deleted: false },
    });

    ProfileData.updated_at = new Date();

    console.log('profile', ProfileData);
    delete userData.id;

    let update = Object.assign(toUpdate, userData);
    const userSavedData = await this.userRepository.save(update);

    let profileUpdate = Object.assign(ProfileData, userData);
    await this.profileRepository.save(profileUpdate);

    return userSavedData;
  }

  //Logout user
  async Logout(req: any): Promise<any> {
    let token =
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.headers.authorization ||
      req.headers.token;

    console.log('token', token);
    token = token.split(' ')[1];

    const UserId = jwt.verify(token, process.env.JWT_SECRET).id;

    const user = await this.userRepository.findOne({
      where: { id: UserId, is_deleted: false, token: token, is_logged: 1 },
    });

    if (!user) {
      throw new HttpException(
        {
          msg: 'You Are Not Allowed To LogOut',
          errors: { msg: 'You Are Not Allowed To LogOut' },
          status: 'errors',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const saveData = Object.assign(user, { token: null, is_logged: 0 });
    const logOutData = await this.userRepository.save(saveData);
    delete logOutData.password;
    return logOutData;
  }

  //activate vendor
  async ActivateVendor(userData: ActivateVendorDto): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOne({
      where: { id: userData.id, is_deleted: false },
    });
    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, userData);
    const data = await this.userRepository.save(update);
    this.mailSystem.sendEmail(
      data.email,
      'Activate Account',
      'Your Account Has Been Activate Successfully'
    );
    return data;
  }

  //Generate Jwt Token
  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        slug: user.slug,
        roles: user.roles,
        gender: user.gender,
        // exp: exp.getTime() / 1000,
      },
      process.env.JWT_SECRET
    );
  }
}
