export async function apiRequest<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, init);
  const data = (await response.json()) as T | { message?: string };

  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' && data !== null && 'message' in data && data.message
        ? data.message
        : 'Falha ao processar a requisicao.';
    throw new Error(errorMessage);
  }

  return data as T;
}
