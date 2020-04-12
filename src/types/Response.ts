import {ResponseError} from './Hue/ResponseError';

export type Response<TResponse> = {
  statusCode: number,
  error?: ResponseError,
  value?: TResponse,
};
