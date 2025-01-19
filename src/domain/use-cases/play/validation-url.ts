export interface ValidationUrl {
  validate(url: string): Promise<string>;
}
