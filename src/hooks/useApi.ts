import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/api/axiosInstance";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  baseURL?: string; // 기본 URL을 재정의
}

interface UseApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetch: (url: string, options?: FetchOptions) => Promise<void>;
}

export const useApi = <T>(id: string): UseApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // fetch 호출 전에 초기 상태를 설정
    setData(null);
    setError(null);
    setLoading(false);
  }, [id]);

  const fetch = useCallback(async (url: string, options?: FetchOptions) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance(url, {
        method: options?.method || "GET",
        headers: options?.headers,
        data: options?.body,
        baseURL: options?.baseURL || axiosInstance.defaults.baseURL,
      });
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, fetch };
};
