import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoAerolineaService {

    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,

        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) { }

    async addAerolineaAeropuerto(codigoAeropuerto: string, codigoAerolinea: string): Promise<AeropuertoEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id: codigoAerolinea } });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: codigoAeropuerto }, relations: ["aerolineas"] })
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        aeropuerto.aerolineas = [...aeropuerto.aerolineas, aerolinea];
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async findAerolineaByAeropuertoIdAerolineaId(codigoAeropuerto: string, codigoAerolinea: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id: codigoAerolinea } });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: codigoAeropuerto }, relations: ["aerolineas"] });
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const aeropuertoaerolinea: AerolineaEntity = aeropuerto.aerolineas.find(e => e.id === aerolinea.id);

        if (!aeropuertoaerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no se encuentra asociado al aeropuerto", BusinessError.PRECONDITION_FAILED)

        return aeropuertoaerolinea;
    }

    async findAerolineasByAeropuertoId(codigoAeropuerto: string): Promise<AerolineaEntity[]> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: codigoAeropuerto }, relations: ["aerolineas"] });
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        return aeropuerto.aerolineas;
    }

    async associateAerolineasAeropuerto(codigoAeropuerto: string, aerolineas: AerolineaEntity[]): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: codigoAeropuerto}, relations: ["aerolineas"]});
    
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < aerolineas.length; i++) {
          const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineas[i].id}});
          if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        aeropuerto.aerolineas = aerolineas;
        return await this.aeropuertoRepository.save(aeropuerto);
      }
    
    async deleteAerolineaAeropuerto(codigoAeropuerto: string, codigoAerolinea: string){
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: codigoAerolinea}});
        if (!aerolinea)
          throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.PRECONDITION_FAILED)
    
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: codigoAeropuerto}, relations: ["aerolineas"]});
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const aeropuertoaerolinea: AerolineaEntity = aeropuerto.aerolineas.find(e => e.id === aerolinea.id);
    
        if (!aeropuertoaerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no se encuentra asociado al aeropuerto", BusinessError.PRECONDITION_FAILED)
 
        aeropuerto.aerolineas = aeropuerto.aerolineas.filter(e => e.id !== codigoAerolinea);
        await this.aeropuertoRepository.save(aeropuerto);
    } 


}
