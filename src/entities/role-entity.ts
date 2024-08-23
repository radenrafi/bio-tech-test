import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';

export enum RoleEnum {
    Operator = 'operator',
    Supervisor = 'supervisor',
    Manager = 'manager',
}

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
    @PrimaryColumn({
        name: 'id',
        type: 'uuid',
    })
    id?: string;

    @Column('text')
    name!: string;

    @Column('int')
    order!: number;
}