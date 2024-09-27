import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ConfigService } from './config.service';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'reflect-metadata';
import { UserService } from '../../modules/users';

@injectable()
export class ConfigPassportService {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		this.configureGoogleStrategy();
	}

	private configureGoogleStrategy(): void {
		const googleClientID = this.configService.get('GOOGLE_CLIENT_ID');
		const googleClientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
		const googleCallbackURL = this.configService.get('GOOGLE_CALLBACK_URL');

		if (!googleClientID || !googleClientSecret || !googleCallbackURL) {
			throw new Error('Google OAuth configuration is missing in environment variables.');
		}

		passport.use(
			new GoogleStrategy(
				{
					clientID: googleClientID,
					clientSecret: googleClientSecret,
					callbackURL: googleCallbackURL,
					passReqToCallback: true,
				},
				async (
					req: Request,
					accessToken: string,
					refreshToken: string,
					profile: any,
					done: Function,
				) => {
					try {
						const user = await this.userService.findOrCreate(profile.id, profile);
						return done(null, user);
					} catch (err) {
						return done(err);
					}
				},
			),
		);

		passport.serializeUser((user: any, done: Function) => {
			done(null, user.id);
		});

		passport.deserializeUser(async (id: string, done: Function) => {
			try {
				const user = await this.userService.findById(id);
				done(null, user);
			} catch (err) {
				done(err);
			}
		});
	}
}
