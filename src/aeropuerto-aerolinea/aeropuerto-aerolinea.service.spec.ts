import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';

describe('AeropuertoAerolineaService', () => {
  let service: AeropuertoAerolineaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AeropuertoAerolineaService],
    }).compile();

    service = module.get<AeropuertoAerolineaService>(AeropuertoAerolineaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
