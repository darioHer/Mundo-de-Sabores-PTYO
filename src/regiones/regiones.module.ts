
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from 'src/models/region.entity';
import { RegionController } from './regiones.controller';
import { RegionService } from './regiones.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService], 
})
export class RegionesModule {}
