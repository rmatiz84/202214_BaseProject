import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';


@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {

    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService){}

    @Post(':aerolineaCodigo/airports/:aeropuertoCodigo')
    async addAeropuertoAerolinea(@Param('aerolineaCodigo') aerolineaCodigo: string, @Param('aeropuertoCodigo') aeropuertoCodigo: string){
        return await this.aerolineaAeropuertoService.addAeropuertoAerolinea(aerolineaCodigo, aeropuertoCodigo);
    }

    @Get(':aerolineaCodigo/airports/:aeropuertoCodigo')
    async findAeropuertoByAerolineaIdAeropuertoId(@Param('aerolineaCodigo') aerolineaCodigo: string, @Param('aeropuertoCodigo') aeropuertoCodigo: string){
        return await this.aerolineaAeropuertoService.findAeropuertoByAerolineaIdAeropuertoId(aerolineaCodigo, aeropuertoCodigo);
    }

    @Get(':aerolineaCodigo/airports')
    async findAeropuertosByAerolineaId(@Param('aerolineaCodigo') aerolineaCodigo: string){
        return await this.aerolineaAeropuertoService.findAeropuertosByAerolineaId(aerolineaCodigo);
    }

    @Put(':aerolineaCodigo/airports')
    async associateAeropuertosAerolinea(@Body() aeropuertosDto: AeropuertoDto[], @Param('aerolineaCodigo') aerolineaCodigo: string){
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto)
        return await this.aerolineaAeropuertoService.associateAeropuertosAerolinea(aerolineaCodigo, aeropuertos);
    }
    
    @Delete(':aerolineaCodigo/airports/:aeropuertoCodigo')
    @HttpCode(204)
    async deleteAeropuertoAerolinea(@Param('aerolineaCodigo') aerolineaCodigo: string, @Param('aeropuertoCodigo') aeropuertoCodigo: string){
        return await this.aerolineaAeropuertoService.deleteAeropuertoAerolinea(aerolineaCodigo, aeropuertoCodigo);
    }

}
