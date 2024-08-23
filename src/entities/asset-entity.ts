import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BaseEntity, OneToMany } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Transaction } from './transaction-entity';

@Entity({ name: 'assets' })
export class Asset extends BaseEntity {
	@PrimaryColumn({
		name: 'id',
		type: 'uuid',
	})
	id!: string;

	@Column('text')
	name!: string;

	@OneToMany(() => Transaction, (transaction) => transaction.asset)
	transactions?: Transaction[]

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;

	@BeforeInsert()
	generateId() {
		this.id = uuid();
	}
}
