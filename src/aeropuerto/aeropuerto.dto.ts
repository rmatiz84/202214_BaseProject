import { IsNotEmpty, IsString } from "class-validator";

export class AeropuertoDto {

    id: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsString()
    @IsNotEmpty()
    pais: string;

    @IsString()
    @IsNotEmpty()
    ciudad: string;

}
