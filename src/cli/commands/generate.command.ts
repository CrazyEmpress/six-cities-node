import { Command } from './command.interface.js';

import { MockServerData } from '../../shared/types/index.js';

import got from 'got';

export class GenerateCommand implements Command {
  private readonly RADIX = 10;
  private initialData: MockServerData;

  public getName(): string {
    return '--generate';
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [rowsCount, filePath, serverUrl] = parameters;
    const count = Number.parseInt(rowsCount, this.RADIX);

    try {
      await this.load(serverUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
