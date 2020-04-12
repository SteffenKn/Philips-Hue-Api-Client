import fetch, {RequestInit} from 'node-fetch';

import {Response} from './../types/index';

export class HueFetchClient {
  private _baseUrl: string;

  constructor(ip: string) {
    this._baseUrl = `http://${ip}/api`;
  }

  public async get<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'GET';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = Array.isArray(responseValue) && responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }

  public async head<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'HEAD';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }

  public async post<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'POST';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }

  public async put<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'PUT';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }

  public async delete<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'DELETE';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }

  public async connect<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'CONNECT';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }

  public async options<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'OPTIONS';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }

  public async trace<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'TRACE';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }

  public async patch<TResponse>(path: string, options: RequestInit = {}): Promise<Response<TResponse>> {
    const url: string = `${this._baseUrl}${path}`;

    options.method = 'PATCH';

    const response = await fetch(url, options);

    let responseValue = await response.json();
    let responseError;

    const requestFailed: boolean = responseValue[0].error !== undefined;
    if (requestFailed) {
      responseError = responseValue[0].error;
      responseValue = undefined;
    }

    return {
      statusCode: response.status,
      error: responseError,
      value: responseValue,
    };
  }
}
