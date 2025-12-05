import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiErrorResponse, ApiSuccessResponse, ResponseMessage } from '../types/http';
import { getDataFromRequest, getQueryParam } from '../utils/general';
import { type AllEndpoints, ENDPOINTS } from '../constants/endpoints';
import { getRouter } from '../utils/navigation';
import { useInitAuthStore } from '../store/useAuthStore';

// Base URL for API routes - using relative path since we're using Next.js API routes
const BASE_URL = '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  withCredentials: true, // Include credentials (cookies) with requests
});

export const callApi = async <T extends keyof AllEndpoints>(
  endpoint: T,
  options: Omit<AllEndpoints[T], 'response'>,
  isServerCall?: boolean
): Promise<ResponseMessage<T>> => {
  const { path, method } = ENDPOINTS[endpoint];

  const source = axios.CancelToken.source();

  let redirectPath = '';

  try {
    const requestConfig: AxiosRequestConfig = {
      url: path + (options.query || ''),
      method,
      cancelToken: source.token,
    };

    if (options.payload) {
      requestConfig.data = options.payload;
    }

    const response: AxiosResponse<ApiSuccessResponse<T>> =
      await api.request<ApiSuccessResponse<T>>(requestConfig);

    return getDataFromRequest({ data: response.data }, endpoint);
  } catch (error) {
    if (isServerCall) {
      const thisErr = error as unknown as {
        response?: { data?: ApiErrorResponse };
        message?: string;
      };

      return getDataFromRequest(
        {
          error: thisErr.response?.data || {
            message: thisErr.message || thisErr.response?.data?.message || 'Some error occurred',
            error: {},
            success: false,
            responseCode: 550,
          },
        },
        endpoint
      );
    }

    let apiError: ApiErrorResponse | undefined;

    if (axios.isCancel(error)) {
      console.info('Request cancelled', error.message);
      apiError = {
        message: error.message || 'Request cancelled',
        error: {},
        success: false,
        responseCode: 600,
      };
    }

    if (axios.isAxiosError(error) && error.response) {
      console.log({ errRes: error.response.data });
      apiError = error.response.data as ApiErrorResponse;

      if (error.response.status === 401) {
        // Clear session on 401
        try {
          useInitAuthStore.getState().actions.clearSession();
        } catch (e) {
          // Auth store not available, continue
          console.error('Auth store not available', e);
        }

        const redirectQueryValue = getQueryParam('redirectTo');
        const loginRoute = '/admin/auth/login'; // Update this to match your auth route

        switch (true) {
          case Boolean(redirectQueryValue):
            redirectPath = `${loginRoute}?redirectTo=${redirectQueryValue}`;
            break;

          default:
            redirectPath = `${loginRoute}`;
            break;
        }
      }
      if (error.response.status === 429) {
        // Rate limit exceeded - could be handled by a modal/store
        console.warn('Rate limit exceeded');
      }
      if (error.response.status === 403) {
        console.error({ _403Err: error.message });
      }
      if (error.response.status === 500) {
        const errMessage = error.response.data.message;
        console.error({ err: errMessage });
      }
      if (error.response.status == null) {
        console.log('null status');
      }

      apiError = error.response.data;
    } else if (error instanceof Error) {
      apiError = {
        message: error.message,
        error: {},
        success: false,
        responseCode: 600,
      };
    }

    return getDataFromRequest({ error: apiError }, endpoint);
  } finally {
    if (redirectPath && !isServerCall) {
      const router = getRouter();

      if (router) {
        router.replace(redirectPath);
      }
    }
  }
};

export default api;
