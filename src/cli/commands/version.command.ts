import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Command } from './command.interface.js';
import { chalkError } from '../shared/libs/chalk/chalk.variables.js';

type PackageJSONConfig = {
  version: string;
}

/**
 * Проверяет, является ли переданное значение JSON. Если функция возвращает true, то за счёт type guard "value is PackageJSONConfig" TypeScript понимает, что у value есть свойство "version"
 * @param value Неизвестное значение принадлежность которого к JSON необходимо проверить
 * @returns true, в случае, если полученный аргумент value является JSON
 */
function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = 'package.json',
  ) { }


  public getName(): string {
    return '--version';
  }

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), { encoding: 'utf-8' });
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content');
    }

    return importedContent.version;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.log(version);
    } catch (error: unknown) {
      console.error(chalkError('Failed to get version'));

      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
