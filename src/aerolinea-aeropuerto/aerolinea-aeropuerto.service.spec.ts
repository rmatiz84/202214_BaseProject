import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';


describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertoList : AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aerolineaRepository.clear();
    aeropuertoRepository.clear();

    aeropuertoList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
          nombre: faker.lorem.sentence(),
          codigo: "PAS",
          pais: faker.lorem.sentence(),
          ciudad: faker.lorem.sentence(),
          aerolineas: null
        });
        aeropuertoList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.birthdate(),
        paginaWeb: faker.lorem.sentence(),
        aeropuertos: aeropuertoList
    });

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoAerolinea deberia agregar un aeropuerto a una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "PAS",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      paginaWeb: faker.lorem.sentence()
    });

    const result: AerolineaEntity = await service.addAeropuertoAerolinea(newAerolinea.id, newAeropuerto.id);
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);

  });

  it('addAeropuertoAerolinea deberia lanzar una excepcion por un aeropuerto inválido', async () => {
    const newAerolinea = await aerolineaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      paginaWeb: faker.lorem.sentence()
    });

    await expect(() => service.addAeropuertoAerolinea(newAerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado");

  });


  it('addAeropuertoAerolinea deberia lanzar una excepcion por una aerolinea inválida', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "PAS",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });

    await expect(() => service.addAeropuertoAerolinea("0", newAeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");

  });


  it('findAeropuertoByAerolineaIdAeropuertoId deberia retornar un aeropuerto de una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    const storedaeropuerto: AeropuertoEntity = await service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, aeropuerto.id);
    expect(storedaeropuerto).not.toBeNull();
    expect(storedaeropuerto.nombre).toBe(aeropuerto.nombre);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId deberia lanzar una excepcion por un aeropuerto invalido', async () => {
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado");
  });


  it('findAeropuertoByAerolineaIdAeropuertoId deberia lanzar una excepcion por una aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId("0", aeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");
  });


  it('findAeropuertoByAerolineaIdAeropuertoId deberia lanzar una excepcion por un aeropuerto que no esta asociado a una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "PAS",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });
 
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no se encuentra asociado a la aerolinea");
  });


  it('findAeropuertosByAerolineaId deberia retornar los aeropuertos de una aerolinea', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAeropuertosByAerolineaId(aerolinea.id);
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos.length).toBe(5);
  });


  it('findAeropuertosByAerolineaId deberia lanzar una execepcion por una aerolinea invalida', async () => {
    await expect(()=> service.findAeropuertosByAerolineaId("0")).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");
  });


  it('associateAeropuertosAerolinea deberia actualizar los aeropuertos para una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertoList[0];

    const updatedAerolinea: AerolineaEntity = await service.associateAeropuertosAerolinea(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea).not.toBeNull();
    expect(updatedAerolinea.aeropuertos).not.toBeNull();
    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
  });

  it('associateAeropuertosAerolinea deberia arrojar una excepcion por una aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "PAS",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });

    await expect(() => service.associateAeropuertosAerolinea("0", [aeropuerto])).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");
  });

  it('associateAeropuertosAerolinea deberia arrojar una escepcion por un aeropuerto invalido', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertoList[0];
    newAeropuerto.id = "0";

    await expect(() => service.associateAeropuertosAerolinea(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado");
  });

  it('deleteAeropuertoAerolinea deberia eliminar un aeropuerto de una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];

    await service.deleteAeropuertoAerolinea(aerolinea.id, aeropuerto.id);

    const storedaerolinea: AerolineaEntity = await aerolineaRepository.findOne({ where: { id: aerolinea.id }, relations: ["aeropuertos"] });
    const deletedaeropuerto: AeropuertoEntity = storedaerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

    expect(deletedaeropuerto).toBeUndefined();

  });

  it('deleteAeropuertoAerolinea deberia lanzar una excepcion por un aeropuerto invalido', async () => {
    await expect(() => service.deleteAeropuertoAerolinea(aerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no fue encontrado");
  });


  it('deleteAeropuertoAerolinea deberia lanzar una excepcion por una aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await expect(() => service.deleteAeropuertoAerolinea("0", aeropuerto.id)).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrado");
  });

  it('deleteAeropuertoAerolinea deberia lanzar una excepcion por un aeropuerto no asociado', async () => {
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: "PAS",
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence()
    });

    await expect(() => service.deleteAeropuertoAerolinea(aerolinea.id, aeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el ID dado no se encuentra asociado a la aerolinea");
  });





});

