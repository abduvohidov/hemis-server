import 'reflect-metadata';
import passport from 'passport';
import { TYPES } from './../../../types';
import { UserModel } from '@prisma/client';
import { Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { IUsersRepository } from '../../../modules/users';
import { IGoogleAuthService } from './googleAuthService.interface';
import { IConfigService } from '../../../config/config.service.interface';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUsersRepository,
	) {}
	initialize(): void {
		passport.use(
			new GoogleStrategy(
				{
					clientID: this.configService.get('GOOGLE_CLIENT_ID'),
					clientSecret: this.configService.get('GOOGLE_SECRET_ID'),
					callbackURL: this.configService.get('GOOGLE_CALLBACK_URL') as string,
				},
				async (accessToken: string, refreshToken: string, profile: Profile, done: Function) => {
					try {
						const { email, given_name } = profile._json;

						if (!email || !given_name) {
							return null;
						}
						let user: UserModel | null = await this.userRepository.findByEmail(email);

						if (!user) {
							user = await this.userRepository.create({
								email,
								name: given_name,
							});
						}

						done(null, user);
					} catch (error) {
						done(error, null);
					}
				},
			),
		);
	}
	async handleCallback(req: Request, res: Response): Promise<UserModel> {
		return new Promise((resolve, reject) => {
			try {
				passport.authenticate(
					'google',
					{ failureRedirect: '/login' },
					(err: Error, user: UserModel | null) => {
						if (err || !user) {
							return reject(err || 'User not Found');
						}
						resolve(user);
					},
				)(req, res);
			} catch (error) {
				reject(error || 'Something went wrong in google auth service');
			}
		});
	}
}
