import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { EnquiryEntity } from './enquiry.entity';
import { EnquiryDto } from './dto/enquiry.dto';
import { EnquiryUpdateIdDto } from './dto/updateId.dto';
import { MailService } from '../mail/mail.service';
import { UserEntity } from '../user/user.entity';
import { ProductEntity } from '../product/product.entity';
import { EnquiryReplyDto } from './dto/reply.dto';

@Injectable()
export class EnquiryService {
  constructor(
    // private readonly caslCrud: CaslCRUD,

    private readonly mailSystem: MailService,

    @InjectRepository(EnquiryEntity)
    private readonly enquiryRepository: Repository<EnquiryEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  //create enquiry user to vendor
  async create(data: EnquiryDto, id: number): Promise<EnquiryEntity> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    const product = await this.productRepository.findOne({
      where: { id: data.product_id },
    });

    const vendor_email = await this.userRepository.findOne({
      where: { id: data.vendor },
    });

    const newEnquiry = new EnquiryEntity();
    newEnquiry.slug = slugify('enquiry');
    newEnquiry.sender_email = user.email;
    newEnquiry.receiver_email = vendor_email.email;
    newEnquiry.parent_id = data.parent_id;
    newEnquiry.description = data.description;
    newEnquiry.phone = data.phone;
    newEnquiry.vendor = data.vendor;
    newEnquiry.user_id = user;
    newEnquiry.product_id = product;
    newEnquiry.qty = data.qty;
    newEnquiry.receiver_status = data.receiver_status;

    const newSaveData = await this.enquiryRepository.save(newEnquiry);

    newSaveData.code = '#' + process.env.Enquiry_CODE + newSaveData.id;
    const saveData = await this.enquiryRepository.save(newSaveData);

    const admin = await this.userRepository.find({
      where: { is_deleted: false, roles: 1 },
    });

    const allAdmin = admin.map((item) => item.email);

    //send email to vendor
    this.mailSystem.sendEmail(vendor_email.email, 'Enquiry', data.description);

    //send email to all admin
    this.mailSystem.sendEmail(allAdmin, 'Enquiry', data.description);

    return saveData;
  }

  //reply to customer
  async reply(data: EnquiryReplyDto, id: number): Promise<EnquiryEntity> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    const product = await this.productRepository.findOne({
      where: { id: data.product_id },
    });

    const newEnquiry = new EnquiryEntity();
    newEnquiry.slug = slugify('enquiry');
    newEnquiry.sender_email = user.email;
    newEnquiry.receiver_email = data.email;
    newEnquiry.parent_id = data.parent_id;
    newEnquiry.description = data.description;
    newEnquiry.phone = data.phone;
    newEnquiry.vendor = data.vendor;
    newEnquiry.user_id = user;
    newEnquiry.product_id = product;
    newEnquiry.qty = data.qty;
    newEnquiry.receiver_status = data.receiver_status;
    if (!data.send_reply_status) {
      newEnquiry.send_reply_status = 1;
    } else {
      newEnquiry.send_reply_status = data.send_reply_status;
    }

    const newSaveData = await this.enquiryRepository.save(newEnquiry);

    newSaveData.code = '#' + process.env.Enquiry_CODE + newSaveData.id;
    const saveData = await this.enquiryRepository.save(newSaveData);

    const admin = await this.userRepository.find({
      where: { is_deleted: false, roles: 1 },
    });

    const allAdmin = admin.map((item) => item.email);

    //send email to customer
    this.mailSystem.sendEmail(data.email, 'Enquiry', data.description);

    //send email to all admin
    this.mailSystem.sendEmail(allAdmin, 'Enquiry', data.description);

    return saveData;
  }

  //find all according to user roles
  async findAll(roles: number, id: number): Promise<EnquiryEntity[]> {
    if (roles === 1 && id) {
      const data = await this.enquiryRepository.find({
        where: { is_deleted: false },
        order: { created_at: 'ASC' },
      });

      return data;
    } else if (roles === 2 && id) {
      const data = await this.enquiryRepository.find({
        where: { is_deleted: false, vendor: id },
        order: { created_at: 'ASC' },
      });
      return data;
    } else if (roles === 0 && id) {
      const data = await this.enquiryRepository.find({
        where: { is_deleted: false, user_id: { id: id } },
        order: { created_at: 'ASC' },
      });
      return data;
    } else {
      throw new HttpException(
        {
          msg: 'Bad Request',
          errors: { msg: 'Bad Request' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //find By parent_id
  async parentId(id: number): Promise<EnquiryEntity[]> {
    const data = await this.enquiryRepository.find({
      where: { parent_id: id, is_deleted: false },
      order: { id: 'ASC' },
    });
    return data;
  }

  //find One By Id
  async findOneById(id: number): Promise<EnquiryEntity> {
    const data = await this.enquiryRepository.findOne({
      where: { is_deleted: false, id: id },
    });
    return data;
  }

  //update with id
  async updateId(data: EnquiryUpdateIdDto): Promise<EnquiryEntity> {
    let toUpdate = await this.enquiryRepository.findOne({
      where: { id: data.id, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: `No Data Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!toUpdate.slug) {
      toUpdate.slug = slugify('enquiry');
    }

    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, data);
    return await this.enquiryRepository.save(update);
  }

  //delete with Id
  async deleteId(id: number): Promise<EnquiryEntity> {
    let toDelete = await this.enquiryRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (!toDelete) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: `No Data Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    let deleted = Object.assign(toDelete, {
      is_deleted: true,
      deleted_at: new Date(),
    });
    return await this.enquiryRepository.save(deleted);
  }
}
