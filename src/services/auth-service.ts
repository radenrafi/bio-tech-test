import { APP_SECRET } from '../config/environment';
import { User } from '../entities/user-entity';
import { ResponseError } from '../error/response-error';
import { AuthValidation } from '../validation/auth-validation';
import { Validation } from '../validation/validation';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export default class AuthService {
	static async login(body: any): Promise<any> {
		const payload = Validation.validate(AuthValidation.LOGIN, body);

		const user = await User.findOne({ 
			where: { username: payload.username },
			relations: ['role']
		 });

		if (!user) {
			throw new ResponseError(401, 'Username or password is wrong');
		}

		const isPasswordValid = await bcrypt.compare(payload.password, user.password);
		if (!isPasswordValid || !user.id) {
			throw new ResponseError(401, 'Username or password is wrong');
		}

		const expireIn = 60 * 60 * 1;

		const claims = {
			id: user.id,
			role: user.role,
			username: user.username,
			email: user.email,
		};
		const token = jwt.sign(claims, APP_SECRET, { expiresIn: expireIn });

		return {
			...claims,
			token,
		};
	}

	static async me(id: string): Promise<any> {
		const user = await User.findOne({ where: { id }, relations: ['role'] });
		return user;
	}
}
