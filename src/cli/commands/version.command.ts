import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { Command } from './command.interface.js';

type PackageJSONConfig = {
  version: string;
}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = 'package.json',
  ) { }

  private isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.hasOwn(value, 'version')
    );
  }

  public getName(): string {
    return '--version';
  }

  private async readVersion(): Promise<string> {
    const jsonContent = await readFile(resolve(this.filePath), { encoding: 'utf-8' });
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!this.isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content');
    }

    return importedContent.version;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = await this.readVersion();
      console.log(version);
    } catch (error: unknown) {
      console.error('Failed to get version');

      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
