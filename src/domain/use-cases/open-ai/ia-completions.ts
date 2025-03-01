export interface IaCompletion {
  createCompletion(input: string): Promise<string>;
}
