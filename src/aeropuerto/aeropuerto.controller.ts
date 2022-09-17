import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoDto } from './aeropuerto.dto';
import { AeropuertoEntity } from './aeropuerto.entity';


@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {

    constructor(private readonly AeropuertoService: AeropuertoService) {}
    
      @Get()
      async findAll() {
        return await this.AeropuertoService.findAll();
      }
    
      @Get(':aeropuertoCodigo')
      async findOne(@Param('aeropuertoCodigo') aeropuertoCodigo: string) {
        return await this.AeropuertoService.findOne(aeropuertoCodigo);
      }
    
      @Post()
      async create(@Body() AeropuertoDto: AeropuertoDto) {
        const aerolinea: AeropuertoEntity = plainToInstance(AeropuertoEntity, AeropuertoDto);
        return await this.AeropuertoService.create(aerolinea);
      }
    
      @Put(':aeropuertoCodigo')
      async update(@Param('aeropuertoCodigo') aeropuertoCodigo: string, @Body() AeropuertoDto: AeropuertoDto) {
        const aerolinea: AeropuertoEntity = plainToInstance(AeropuertoEntity, AeropuertoDto);
        return await this.AeropuertoService.update(aeropuertoCodigo, aerolinea);
      }
    
      @Delete(':aeropuertoCodigo')
      @HttpCode(204)
      async delete(@Param('aeropuertoCodigo') aeropuertoCodigo: string) {
        return await this.AeropuertoService.delete(aeropuertoCodigo);
      }

}
