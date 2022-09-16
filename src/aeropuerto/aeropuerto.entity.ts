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

    @ManyToMany(() => AerolineaEntity)
    @JoinTable({
        name: "aerolinea_aeropuerto",
        joinColumn: {
            name: "AeropuertoId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "AerolineaId",
            referencedColumnName: "id"
        }
    })
    aerolineas: AerolineaEntity[];

}
