import type { AllEndpoints } from '../constants/endpoints';

export type Protocol = 'http://' | 'https://';

interface ApiResponse {
  success: boolean;
  message: string;
  responseCode: number;
}

export interface ApiSuccessResponse<T extends keyof AllEndpoints> extends ApiResponse {
  data: AllEndpoints[T]['response'];
}

export interface ApiErrorResponse extends ApiResponse {
  error?: { [key: string]: string | string[] } | string | null;
}

export interface ApiError {
  message: string;
  status: string;
  error?: Record<string, string[]>;
  headers?: Record<string, unknown>;
}

export type CallApiResponse<T extends keyof AllEndpoints> =
  | { data?: never; error?: ApiErrorResponse }
  | { data?: ApiSuccessResponse<T>; error?: never };

export interface BaseResponseMessage<T extends keyof AllEndpoints> {
  message: string;
  requestName: T;
  type: 'error' | 'success';
  error?: ApiErrorResponse;
  data?: AllEndpoints[T]['response'];
}

export type ErrorResponseMessage<T extends keyof AllEndpoints> = BaseResponseMessage<T> & {
  type: 'error';
  error: ApiErrorResponse;
};

export type SuccessResponseMessage<T extends keyof AllEndpoints> = BaseResponseMessage<T> & {
  type: 'success';
  data: AllEndpoints[T]['response'];
};

export type ResponseMessage<T extends keyof AllEndpoints> =
  | ErrorResponseMessage<T>
  | SuccessResponseMessage<T>;
