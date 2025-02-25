import { Command } from './command.interface.js';

import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';

import { appendFile } from 'node:fs/promises';

import got from 'got';
import chalk from 'chalk';

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
      await this.write(filePath, count);
      console.info(chalk.bgWhiteBright(`File ${filePath} was created!`));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  private async write(filePath: string, offerCount: number): Promise<void> {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);

    for (let i = 0; i < offerCount; i++) {
      await appendFile(
        filePath,
        `${tsvOfferGenerator.generate()}\n`,
        { encoding: 'utf-8' }
      );
    }
  }
}
