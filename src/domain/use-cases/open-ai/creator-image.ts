export interface CreatorImage {
  createImage(input: string): Promise<{ b64_json: string; url: string }>;
}
