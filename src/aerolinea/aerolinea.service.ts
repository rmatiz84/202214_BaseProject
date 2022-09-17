import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find();
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id} } );
        if (!aerolinea)
          throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
        return aerolinea;
    }    

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const date = new Date();
        Logger.log('fecha actual', date)
        const dateAerolinea = new Date(aerolinea.fechaFundacion)
        Logger.log('fecha aero', dateAerolinea)
        
        if (dateAerolinea > date)
            throw new BusinessLogicException("La fecha de fundación del aeropuerto debe ser inferior a la fecha actual", BusinessError.PRECONDITION_FAILED);      
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const aerolineaPersistida: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolineaPersistida)
          throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
        
        if (aerolinea.fechaFundacion > new Date())
          throw new BusinessLogicException("La fecha de fundación del aeropuerto debe ser inferior a la fecha actual", BusinessError.PRECONDITION_FAILED); 

        return await this.aerolineaRepository.save({...aerolineaPersistida, ...aerolinea});
    }

    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
          throw new BusinessLogicException("La aerolinea con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
      
        await this.aerolineaRepository.remove(aerolinea);
    }  

}
