export async function apiRequest<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error('Falha ao processar a requisicao.');
  }

  return (await response.json()) as T;
}
