export interface IHttpResponse<T> {
	message: string;
	success: boolean;
	data: T;
}

export interface IHttpError {
	message: string;
	statusCode: number;
}
