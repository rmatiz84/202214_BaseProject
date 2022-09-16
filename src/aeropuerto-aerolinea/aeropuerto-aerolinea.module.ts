import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  providers: [AeropuertoAerolineaService]
})
export class AeropuertoAerolineaModule {}
