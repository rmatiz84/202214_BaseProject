import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';


describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let listaAerolineas: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaAerolineas = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.birthdate(),
        paginaWeb: faker.lorem.sentence(),
        aeropuertos: []
        })
        listaAerolineas.push(aerolinea);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(listaAerolineas.length);
  });  

  it('findOne deberia retornar un aerolinea por ID', async () => {
    const aerolineaAlmacenado: AerolineaEntity = listaAerolineas[0];
    const aerolinea: AerolineaEntity = await service.findOne(aerolineaAlmacenado.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(aerolineaAlmacenado.nombre)
  }); 

  it('findOne deberia arrojar una excepcion por un aerolinea invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrada")
  });  

  it('create deberia retornar un nuevo aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      paginaWeb: faker.lorem.sentence(),
      aeropuertos: []
    }

    const nuevaaerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(nuevaaerolinea).not.toBeNull();

    const aerolineaAlmacenado: AerolineaEntity = await repository.findOne({where: {id: nuevaaerolinea.id}})
    expect(aerolineaAlmacenado).not.toBeNull();
    expect(aerolineaAlmacenado.nombre).toEqual(nuevaaerolinea.nombre)
  });  

  it('update deberia modificar un aerolinea', async () => {
    const aerolinea: AerolineaEntity = listaAerolineas[0];
    aerolinea.nombre = "New name";
  
    const aerolineaActualizado: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(aerolineaActualizado).not.toBeNull();
  
    const aerolineaAlmacenado: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(aerolineaAlmacenado).not.toBeNull();
    expect(aerolineaAlmacenado.nombre).toEqual(aerolinea.nombre)
  });

  it('update deberia arrojar una excepcion por un aerolinea invalido', async () => {
    let aerolinea: AerolineaEntity = listaAerolineas[0];
    aerolinea = {
      ...aerolinea, nombre: "New name"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrada")
  });  

  it('delete deberia eliminar un aerolinea', async () => {
    const aerolinea: AerolineaEntity = listaAerolineas[0];
    await service.delete(aerolinea.id);
  
    const aerolineaBorrado: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(aerolineaBorrado).toBeNull();
  });

  it('delete deberia arrojar una excepcion por un aerolinea invalido', async () => {
    const aerolinea: AerolineaEntity = listaAerolineas[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La aerolinea con el ID dado no fue encontrada")
  });

});

