import { FileAdapterModel } from '@/presentation/protocols';
import { promises as fs } from 'fs';
import { join } from 'path';

type AllowedPaths = 'uploads' | 'temp';

export class FileManager {
  private static readonly PATHS: Record<AllowedPaths, string> = {
    uploads: './uploads',
    temp: './temp',
  };

  static async moveToPath(
    file: FileAdapterModel,
    bucket: AllowedPaths,
    dir?: string,
  ): Promise<FileAdapterModel> {
    const baseDir = dir ? join(this.PATHS[bucket], dir) : this.PATHS[bucket];
    const targetPath = join(baseDir, file.filename);

    await fs.mkdir(baseDir, { recursive: true });
    await fs.rename(file.path, targetPath);

    return {
      ...file,
      path: targetPath,
      destination: targetPath,
    };
  }

  static async delete(path: FileAdapterModel['path']): Promise<void> {
    await fs.unlink(path);
  }
}
