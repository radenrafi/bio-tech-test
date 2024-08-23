import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '../src/config/app';
import { DataSource } from 'typeorm';
import options from '../src/config/db-options';
import { RoleEnum } from '../src/entities/role-entity';

let manager: DataSource;
let tokenOperator: string = '';
let tokenSupervisor: string = '';
let tokenManager: string = '';
let assetId: string = '';
let rejectedAssetId: string = '';

beforeAll(async (): Promise<DataSource> => {
	const dataSource = new DataSource({ ...options, logging: false });
	manager = await dataSource.initialize();
	return manager;
});

afterAll(async (): Promise<void> => {
	if (manager) {
		await manager.destroy();
	}
});

const login = async (username: string, password: string) => {
	const res = await supertest(app).post('/v1/auth/login').send({
		username,
		password,
	});
	return res;
};

describe('POST /v1/auth/login', () => {
	it('should be able login as Operator with valid credentials', async () => {
		const res = await login('user_operator', 'password');
		expect(res.statusCode).toBe(200);
		expect(res.body.data.username).toBe('user_operator');
		expect(res.body.data.role.name).toBe(RoleEnum.Operator);
		expect(res.body.data.token).toBeDefined();
		tokenOperator = res.body.data.token
	});
	it('should reject login as Operator with invalid credentials', async () => {
		const res = await login('user_operator', 'passwor');
		expect(res.statusCode).toBe(401);
		expect(res.body.error).toBeDefined();
	});
	it('should be able login as Supervisor with valid credentials', async () => {
		const res = await login('user_supervisor', 'password');
		expect(res.statusCode).toBe(200);
		expect(res.body.data.username).toBe('user_supervisor');
		expect(res.body.data.role.name).toBe(RoleEnum.Supervisor);
		expect(res.body.data.token).toBeDefined();
		tokenSupervisor = res.body.data.token
	});
	it('should reject login as Supervisor with invalid credentials', async () => {
		const res = await login('user_supervisor', 'passwor');
		expect(res.statusCode).toBe(401);
		expect(res.body.error).toBeDefined();
	});
	it('should be able login as Manager with valid credentials', async () => {
		const res = await login('user_manager', 'password');
		expect(res.statusCode).toBe(200);
		expect(res.body.data.username).toBe('user_manager');
		expect(res.body.data.role.name).toBe(RoleEnum.Manager);
		expect(res.body.data.token).toBeDefined();
		tokenManager = res.body.data.token
	});
	it('should reject login as Manager with invalid credentials', async () => {
		const res = await login('user_manager', 'passwor');
		expect(res.statusCode).toBe(401);
		expect(res.body.error).toBeDefined();
	});
});

describe('POST /v1/assets', () => {
	it('should be able create asset', async () => {
		const response = await supertest(app)
		.post('/v1/assets')
		.set('Authorization', `Bearer ${tokenOperator}`)
		.send({
			name: 'test'
		})
		expect(response.statusCode).toBe(200);
		assetId = response.body.data.id
	});

	it('should reject if user not Operator', async () => {
		const response = await supertest(app)
		.post('/v1/assets')
		.set('Authorization', `Bearer ${tokenSupervisor}`)
		.send({
			name: 'test'
		})
		expect(response.statusCode).toBe(403);
	});
})

describe('GET /v1/assets', () => {
	it('should be able get assets', async () => {
		const response = await supertest(app)
		.get('/v1/assets')
		expect(response.statusCode).toBe(200);
	});
});

describe('GET /v1/assets/:id', () => {
	it('should be able get asset', async () => {
		const response = await supertest(app)
		.get(`/v1/assets/${assetId}`)
		expect(response.statusCode).toBe(200);
	});
});

describe('POST /v1/assets/:id/approve', () => {
	it('should not be able approve asset with Operator', async () => {
		const response = await supertest(app)
		.post(`/v1/assets/${assetId}/approve`)
		.set('Authorization', `Bearer ${tokenOperator}`)
		expect(response.statusCode).toBe(403);
	})

	it('should not be able approve asset with Manager if Supervisor not approved or rejected', async () => {
		const response = await supertest(app)
		.post(`/v1/assets/${assetId}/approve`)
		.set('Authorization', `Bearer ${tokenManager}`)
		expect(response.statusCode).toBe(403);
	})

	it('should be able approve asset with Supervisor', async () => {
		const response = await supertest(app)
		.post(`/v1/assets/${assetId}/approve`)
		.set('Authorization', `Bearer ${tokenSupervisor}`)
		expect(response.statusCode).toBe(200);
	})

	it('should be able approve asset with Manager if Supervisor approved', async () => {
		const response = await supertest(app)
		.post(`/v1/assets/${assetId}/approve`)
		.set('Authorization', `Bearer ${tokenManager}`)
		expect(response.statusCode).toBe(200);
	})
})

describe('POST /v1/assets/:id/reject', () => {
	it('should not be able reject asset with Operator', async () => {
		// create asset to reject
		const responseReject = await supertest(app)
		.post('/v1/assets')
		.set('Authorization', `Bearer ${tokenOperator}`)
		.send({
			name: 'test reject'
		})
		rejectedAssetId = responseReject.body.data.id

		const response = await supertest(app)
		.post(`/v1/assets/${rejectedAssetId}/reject`)
		.set('Authorization', `Bearer ${tokenOperator}`)
		expect(response.statusCode).toBe(403);
	})

	it('should not be able reject asset with Manager if Supervisor not approved or rejected', async () => {
		const response = await supertest(app)
		.post(`/v1/assets/${rejectedAssetId}/reject`)
		.set('Authorization', `Bearer ${tokenManager}`)
		expect(response.statusCode).toBe(403);
	})

	it('should be able reject asset with Supervisor', async () => {
		const response = await supertest(app)
		.post(`/v1/assets/${rejectedAssetId}/reject`)
		.set('Authorization', `Bearer ${tokenSupervisor}`)
		expect(response.statusCode).toBe(200);
	})

	it('should be able reject asset with Manager if Supervisor approved', async () => {
		// create asset to reject
		const responseReject = await supertest(app)
		.post('/v1/assets')
		.set('Authorization', `Bearer ${tokenOperator}`)
		.send({
			name: 'test reject'
		})
		rejectedAssetId = responseReject.body.data.id
		
		// approve asset with supervisor
		await supertest(app)
		.post(`/v1/assets/${rejectedAssetId}/approve`)
		.set('Authorization', `Bearer ${tokenSupervisor}`)

		// reject asset with manager
		const response = await supertest(app)
		.post(`/v1/assets/${rejectedAssetId}/reject`)
		.set('Authorization', `Bearer ${tokenManager}`)
		expect(response.statusCode).toBe(200);
	})
})