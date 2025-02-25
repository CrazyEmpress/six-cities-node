import { Command } from './command.interface.js';

export class GenerateCommand implements Command {
  private readonly RADIX = 10;

  public getName(): string {
    return '--generate';
  }

  public execute(...parameters: string[]): void {
    const [rowsCount, filePath, serverUrl] = parameters;
    const count = Number.parseInt(rowsCount, this.RADIX);
  }
}
