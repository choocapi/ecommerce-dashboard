import { queryOptions, type QueryFunction } from "@tanstack/react-query";

/**
 * Generic factory to create query options
 * Reduce boilerplate code when creating query options for services
 */
export function createQueryOptions<TData, TParams = void>(
  key: readonly string[],
  queryFn: TParams extends void ? QueryFunction<TData> : (params: TParams) => Promise<TData>,
  options?: {
    enabled?: (params: TParams) => boolean;
    staleTime?: number;
    gcTime?: number;
  },
) {
  return (params?: TParams) => {
    const fn: QueryFunction<TData> =
      params === undefined
        ? (queryFn as QueryFunction<TData>)
        : () => (queryFn as (params: TParams) => Promise<TData>)(params);

    return queryOptions({
      queryKey: params ? [...key, params] : [...key],
      queryFn: fn,
      enabled: params && options?.enabled ? options.enabled(params) : true,
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
      gcTime: options?.gcTime ?? 10 * 60 * 1000,
    });
  };
}
