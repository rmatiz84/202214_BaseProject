import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaService } from './aerolinea.service';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';


@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    
      constructor(private readonly aerolineaService: AerolineaService) {}
    
      @Get()
      async findAll() {
        return await this.aerolineaService.findAll();
      }
    
      @Get(':aerolineaCodigo')
      async findOne(@Param('aerolineaCodigo') aerolineaCodigo: string) {
        return await this.aerolineaService.findOne(aerolineaCodigo);
      }
    
      @Post()
      async create(@Body() aerolineaDto: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.aerolineaService.create(aerolinea);
      }
    
      @Put(':aerolineaCodigo')
      async update(@Param('aerolineaCodigo') aerolineaCodigo: string, @Body() aerolineaDto: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.aerolineaService.update(aerolineaCodigo, aerolinea);
      }
    
      @Delete(':aerolineaCodigo')
      @HttpCode(204)
      async delete(@Param('aerolineaCodigo') aerolineaCodigo: string) {
        return await this.aerolineaService.delete(aerolineaCodigo);
      }

}
