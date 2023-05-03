import { ForbiddenException } from '@nestjs/common/exceptions';
import { AbilityFactory, Action } from './ability.factory/ability.factory';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CaslCRUD {
  constructor(private readonly abilityFactory: AbilityFactory) {}

  GetSection = (user, data) => {
    const checkAbility = this.abilityFactory.defineAbility(user);
    const isAllowed = checkAbility.can(Action.Read, data);
    if (!isAllowed) {
      throw new ForbiddenException({
        msg: 'You Are Not Allowed',
        errors: { msg: 'You Are Not Allowed' },
        status: 'errors',
      });
    }
  };

  // createSection = (user, data) => {
  //   const checkAbility = this.abilityFactory.defineAbility(user);
  //   const isAllowed = checkAbility.can(Action.Create, data);
  //   if (!isAllowed) {
  //     throw new ForbiddenException({
  //       msg: 'You Are Not Allowed To Update',
  //       errors: { msg: 'You Are Not Allowed To Update' },
  //       status: 'errors',
  //     });
  //   }
  // };

  updateSection = (user, data) => {
    const checkAbility = this.abilityFactory.defineAbility(user);
    const isAllowed = checkAbility.can(Action.Update, data);
    if (!isAllowed) {
      throw new ForbiddenException({
        msg: 'You Are Not Allowed',
        errors: { msg: 'You Are Not Allowed' },
        status: 'errors',
      });
    }
  };

  deleteSection = (user, data) => {
    const checkAbility = this.abilityFactory.defineAbility(user);
    const isAllowed = checkAbility.can(Action.Delete, data);
    if (!isAllowed) {
      throw new ForbiddenException({
        msg: 'You Are Not Allowed',
        errors: { msg: 'You Are Not Allowed' },
        status: 'errors',
      });
    }
  };
}
