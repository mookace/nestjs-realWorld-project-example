import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory/ability.factory';
import { CaslCRUD } from './casl';

@Module({
  providers: [AbilityFactory, CaslCRUD],
  exports: [AbilityFactory, CaslCRUD],
})
export class AbilityModule {}
