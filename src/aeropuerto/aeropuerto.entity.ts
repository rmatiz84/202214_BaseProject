import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';


@Entity()
export class AeropuertoEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    codigo: string;

    @Column()
    pais: string;

    @Column()
    ciudad: string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    @JoinTable({name:'aeropuerto_aerolinea'})
    aerolineas: AerolineaEntity[];

}
