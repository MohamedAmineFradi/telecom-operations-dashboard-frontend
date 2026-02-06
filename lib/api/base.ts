// Base API client for all requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export class BaseApiClient {
  protected async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (process.env.NODE_ENV !== 'production') {
      const method = options?.method ?? 'GET'
      // eslint-disable-next-line no-console
      console.info(`[API] ${method} ${API_BASE_URL}${endpoint}`)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }
}
