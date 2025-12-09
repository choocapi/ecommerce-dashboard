export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  succeeded: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
}

export type IApiError = ApiError;
export type IApiResponse<T> = ApiResponse<T>;
