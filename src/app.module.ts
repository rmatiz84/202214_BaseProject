import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from './aerolinea/aerolinea.entity';
import { AeropuertoAerolineaModule } from './aeropuerto-aerolinea/aeropuerto-aerolinea.module';
import { AerolineaAeropuertoModule } from './aerolinea-aeropuerto/aerolinea-aeropuerto.module';

@Module({
  imports: [AerolineaModule, AeropuertoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'aeropuerto',
      entities: [AeropuertoEntity, AerolineaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    AeropuertoAerolineaModule,
    AerolineaAeropuertoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
