import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from '../../models/rol.entity';
import { RolesService } from '../service/roles.service';
import { RolesController } from '../controller/roles.controller';


@Module({
  imports: [TypeOrmModule.forFeature([RolEntity])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [TypeOrmModule],
})
export class RolesModule {}
