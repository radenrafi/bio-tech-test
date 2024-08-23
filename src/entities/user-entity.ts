import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'
import { v7 as uuid } from 'uuid'
import { Role } from './role-entity'


@Entity({ name: 'users' })
export class User extends BaseEntity {
	@PrimaryColumn({
		name: 'id',
		type: 'uuid',
	})
	id?: string

	@Column('text')
	name!: string

	@Column('text')
	username!: string

	@Column('text')
	email!: string

	@Column('text')
	password!: string

	@ManyToOne(() => Role, (role) => role.id)
	@JoinColumn({ name: 'role_id' })
	role!: Role

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@BeforeInsert()
	generateId() {
		this.id = uuid()
	}
}
