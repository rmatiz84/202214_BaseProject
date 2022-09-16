import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {

    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ){}

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find();
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id} } );
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        return aeropuerto;
    }    

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        if (aeropuerto.codigo.length != 3)
            throw new BusinessLogicException("El código del aeropuerto debe tener 3 carácteres", BusinessError.PRECONDITION_FAILED);
            
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const aeropuertoPersistida: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!aeropuertoPersistida)
          throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        
        if (aeropuerto.codigo.length != 3)
            throw new BusinessLogicException("El código del aeropuerto debe tener 3 carácteres", BusinessError.PRECONDITION_FAILED);
        
        
        return await this.aeropuertoRepository.save({...aeropuertoPersistida, ...aeropuerto});
    }

    async delete(id: string) {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
      
        await this.aeropuertoRepository.remove(aeropuerto);
    }

}
