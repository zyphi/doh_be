import { Request, Response } from 'express';
import { IHttpResponse } from '#types/types.http';
import { IStoredRecipe } from '#types/types.recipes';
import { IStoredUser } from '#types/types.users';

export interface IJwtPayload {
	id: string;
}

export type APIReq<T = {}, U = {}, V = any> = Request<T, {}, U, V>;

export type APIRes<T> = Response<IHttpResponse<T>>;

export type AuthLoginResponseBody = IHttpResponse<{ token: string } | null>;

export type GetUserResponseBody = IHttpResponse<{ user: IStoredUser } | null>;

export type GetRecipesResponseBody = {
	recipes: IStoredRecipe[];
};
