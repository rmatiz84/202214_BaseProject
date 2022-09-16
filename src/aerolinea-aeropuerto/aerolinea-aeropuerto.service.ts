import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';


@Injectable()
export class AerolineaAeropuertoService {

    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,

        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) { }

    async addAeropuertoAerolinea(codigoAerolinea: string, codigoAeropuerto: string): Promise<AerolineaEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: codigoAeropuerto }})
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id: codigoAerolinea }, relations: ["aeropuertos"] })
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
    }

    async findAeropuertoByAerolineaIdAeropuertoId(codigoAerolinea: string, codigoAeropuerto: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: codigoAeropuerto }});
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id: codigoAerolinea }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const aeropuertoaerolinea: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);

        if (!aeropuertoaerolinea)
            throw new BusinessLogicException("El aeropuerto con el ID dado no se encuentra asociado a la aerolinea", BusinessError.PRECONDITION_FAILED)

        return aeropuertoaerolinea;
    }

    async findAeropuertosByAerolineaId(codigoAerolinea: string): Promise<AeropuertoEntity[]> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id: codigoAerolinea }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        return aerolinea.aeropuertos;
    }

    async associateAeropuertosAerolinea(codigoAerolinea: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id: codigoAerolinea }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < aeropuertos.length; i++) {
          const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertos[i].id}});
          if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
      }
    
    async deleteAeropuertoAerolinea(codigoAerolinea: string, codigoAeropuerto: string){
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: codigoAeropuerto}});
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: codigoAerolinea}, relations: ["aeropuertos"]});
        if (!aerolinea)
          throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrado", BusinessError.PRECONDITION_FAILED)
       
        const aeropuertoaerolinea: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);
    
        if (!aeropuertoaerolinea)
            throw new BusinessLogicException("El aeropuerto con el ID dado no se encuentra asociado a la aerolinea", BusinessError.PRECONDITION_FAILED)
 
        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(e => e.id !== codigoAeropuerto);
        await this.aerolineaRepository.save(aerolinea);
    } 

}
