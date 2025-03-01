export interface OpenAiUseCase<T, K> {
  handle(data: T): Promise<K>;
}
