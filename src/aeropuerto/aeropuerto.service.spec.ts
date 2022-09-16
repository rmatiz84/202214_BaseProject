import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let listaAeropuertos: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaAeropuertos = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        codigo: "PAS",
        pais: faker.lorem.sentence(),
        ciudad: faker.lorem.sentence(),
        aerolineas: []
        })
        listaAeropuertos.push(aeropuerto);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(listaAeropuertos.length);
  });  

  it('findOne deberia retornar un aeropuertos por ID', async () => {
    const aeropuertosAlmacenado: AeropuertoEntity = listaAeropuertos[0];
    const aeropuertos: AeropuertoEntity = await service.findOne(aeropuertosAlmacenado.id);
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos.nombre).toEqual(aeropuertosAlmacenado.nombre)
  }); 

  it('findOne deberia arrojar una excepcion por un aeropuertos invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado")
  });  

  it('create deberia retornar un nuevo aeropuertos', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      codigo: "PAS",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),
      aerolineas: []
    }

    const nuevaaeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(nuevaaeropuerto).not.toBeNull();

    const aeropuertosAlmacenado: AeropuertoEntity = await repository.findOne({where: {id: nuevaaeropuerto.id}})
    expect(aeropuertosAlmacenado).not.toBeNull();
    expect(aeropuertosAlmacenado.nombre).toEqual(nuevaaeropuerto.nombre)
  });  

  it('update deberia modificar un aeropuerto', async () => {
    const aeropuertos: AeropuertoEntity = listaAeropuertos[0];
    aeropuertos.nombre = "New name";
  
    const aeropuertosActualizado: AeropuertoEntity = await service.update(aeropuertos.id, aeropuertos);
    expect(aeropuertosActualizado).not.toBeNull();
  
    const aeropuertosAlmacenado: AeropuertoEntity = await repository.findOne({ where: { id: aeropuertos.id } })
    expect(aeropuertosAlmacenado).not.toBeNull();
    expect(aeropuertosAlmacenado.nombre).toEqual(aeropuertos.nombre)
  });

  it('update deberia arrojar una excepcion por un aeropuertos invalido', async () => {
    let aeropuertos: AeropuertoEntity = listaAeropuertos[0];
    aeropuertos = {
      ...aeropuertos, nombre: "New name"
    }
    await expect(() => service.update("0", aeropuertos)).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado")
  });  

  it('delete deberia eliminar un aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity = listaAeropuertos[0];
    await service.delete(aeropuertos.id);
  
    const aeropuertosBorrado: AeropuertoEntity = await repository.findOne({ where: { id: aeropuertos.id } })
    expect(aeropuertosBorrado).toBeNull();
  });

  it('delete deberia arrojar una excepcion por un aeropuertos invalido', async () => {
    const aeropuertos: AeropuertoEntity = listaAeropuertos[0];
    await service.delete(aeropuertos.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado")
  });

});

