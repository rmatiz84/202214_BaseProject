import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('AeropuertoAerolineaService', () => {
  let service: AeropuertoAerolineaService;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuerto: AeropuertoEntity;
  let aerolineaList : AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoAerolineaService],
    }).compile();

    service = module.get<AeropuertoAerolineaService>(AeropuertoAerolineaService);
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aerolineaList = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await aerolineaRepository.save({
          nombre: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence(),
          fechaFundacion: faker.date.birthdate(),
          paginaWeb: faker.lorem.sentence()
        });
        aerolineaList.push(aerolinea);
    }

    aeropuerto = await aeropuertoRepository.save({
        nombre: faker.lorem.sentence(),
        codigo: "PAS",
        pais: faker.lorem.sentence(),
        ciudad: faker.lorem.sentence(),
        aerolineas: aerolineaList
    });

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAerolineaAeropuerto deberia agregar un aerolinea a una aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      paginaWeb: faker.lorem.sentence()
    });

    const newaeropuerto = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "PAS",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });

    const result: AeropuertoEntity = await service.addAerolineaAeropuerto(newaeropuerto.id, newAerolinea.id);
    expect(result.aerolineas.length).toBe(1);
    expect(result.aerolineas[0]).not.toBeNull();
    expect(result.aerolineas[0].nombre).toBe(newAerolinea.nombre);

  });

  it('addAerolineaAeropuerto deberia lanzar una excepcion por un aerolinea inválido', async () => {
    const newaeropuerto = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "PAS",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),
    });

    await expect(() => service.addAerolineaAeropuerto(newaeropuerto.id, "0")).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");

  });


  it('addAerolineaAeropuerto deberia lanzar una excepcion por una aeropuerto inválida', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      paginaWeb: faker.lorem.sentence()
    });

    await expect(() => service.addAerolineaAeropuerto("0", newAerolinea.id)).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrada");

  });


  it('findAerolineaByAeropuertoIdAerolineaId deberia retornar un aerolinea de una aeropuerto', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    const storedaerolinea: AerolineaEntity = await service.findAerolineaByAeropuertoIdAerolineaId(aeropuerto.id, aerolinea.id);
    expect(storedaerolinea).not.toBeNull();
    expect(storedaerolinea.nombre).toBe(aerolinea.nombre);
  });

  it('findAerolineaByAeropuertoIdAerolineaId deberia lanzar una excepcion por un aerolinea invalido', async () => {
    await expect(()=> service.findAerolineaByAeropuertoIdAerolineaId(aeropuerto.id, "0")).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");
  });


  it('findAerolineaByAeropuertoIdAerolineaId deberia lanzar una excepcion por una aeropuerto invalida', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await expect(()=> service.findAerolineaByAeropuertoIdAerolineaId("0", aerolinea.id)).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado");
  });


  it('findAerolineaByAeropuertoIdAerolineaId deberia lanzar una excepcion por un aerolinea que no esta asociado a una aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      paginaWeb: faker.lorem.sentence()
    });
 
    await expect(()=> service.findAerolineaByAeropuertoIdAerolineaId(aeropuerto.id, newAerolinea.id)).rejects.toHaveProperty("message", "La aerolinea con el ID dado no se encuentra asociado al aeropuerto");
  });


  it('findAerolineasByAeropuertoId deberia retornar los aerolineas de una aeropuerto', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAerolineasByAeropuertoId(aeropuerto.id);
    expect(aerolineas).not.toBeNull();
    expect(aerolineas.length).toBe(5);
  });


  it('findAerolineasByAeropuertoId deberia lanzar una execepcion por una aeropuerto invalida', async () => {
    await expect(()=> service.findAerolineasByAeropuertoId("0")).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado");
  });


  it('associateAerolineasAeropuerto deberia actualizar los aerolineas para una aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = aerolineaList[0];

    const updatedaeropuerto: AeropuertoEntity = await service.associateAerolineasAeropuerto(aeropuerto.id, [newAerolinea]);
    expect(updatedaeropuerto).not.toBeNull();
    expect(updatedaeropuerto.aerolineas).not.toBeNull();
    expect(updatedaeropuerto.aerolineas[0].nombre).toBe(newAerolinea.nombre);
  });

  it('associateAerolineasAeropuerto deberia arrojar una excepcion por una aeropuerto invalida', async () => {
    const aerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      paginaWeb: faker.lorem.sentence()
    });

    await expect(() => service.associateAerolineasAeropuerto("0", [aerolinea])).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado");
  });

  it('associateAerolineasAeropuerto deberia arrojar una escepcion por un aerolinea invalido', async () => {
    const newAerolinea: AerolineaEntity = aerolineaList[0];
    newAerolinea.id = "0";

    await expect(() => service.associateAerolineasAeropuerto(aeropuerto.id, [newAerolinea])).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");
  });

  it('deleteAerolineaAeropuerto deberia eliminar un aerolinea de una aeropuerto', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];

    await service.deleteAerolineaAeropuerto(aeropuerto.id, aerolinea.id);

    const storedaeropuerto: AeropuertoEntity = await aeropuertoRepository.findOne({ where: { id: aeropuerto.id }, relations: ["aerolineas"] });
    const deletedaerolinea: AerolineaEntity = storedaeropuerto.aerolineas.find(a => a.id === aerolinea.id);

    expect(deletedaerolinea).toBeUndefined();

  });

  it('deleteAerolineaAeropuerto deberia lanzar una excepcion por un aerolinea invalido', async () => {
    await expect(() => service.deleteAerolineaAeropuerto(aeropuerto.id, "0")).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");
  });


  it('deleteAerolineaAeropuerto deberia lanzar una excepcion por una aeropuerto invalida', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await expect(() => service.deleteAerolineaAeropuerto("0", aerolinea.id)).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado");
  });

  it('deleteAerolineaAeropuerto deberia lanzar una excepcion por un aerolinea no asociado', async () => {
    const aerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      paginaWeb: faker.lorem.sentence()
    });

    await expect(() => service.deleteAerolineaAeropuerto(aeropuerto.id, aerolinea.id)).rejects.toHaveProperty("message", "La aerolinea con el ID dado no se encuentra asociado al aeropuerto");
  });


});

