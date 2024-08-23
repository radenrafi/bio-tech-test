import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BaseEntity, ManyToOne, JoinColumn, Column } from 'typeorm'
import { v7 as uuid } from 'uuid'
import { Role } from './role-entity'
import { Asset } from './asset-entity'


@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
	@PrimaryColumn({
		name: 'id',
		type: 'uuid',
	})
	id?: string

    @ManyToOne(() => Asset, (asset) => asset.id)
	@JoinColumn({ name: 'asset_id' })
	asset!: Asset

	@ManyToOne(() => Role, (role) => role.id)
	@JoinColumn({ name: 'role_id' })
	role!: Role

	@Column('text')
	status!: string

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@BeforeInsert()
	generateId() {
		this.id = uuid()
	}
}
