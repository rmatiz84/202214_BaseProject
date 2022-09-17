import { IsNotEmpty, IsString } from "class-validator";

export class AerolineaDto {

    id: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    fechaFundacion: Date;

    @IsString()
    @IsNotEmpty()
    paginaWeb: string;

}
