import { Command } from './command.interface.js';
import { chalkInfo } from '../shared/libs/chalk/chalk.variables.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public execute(..._parameters: string[]): void {
    console.info(chalkInfo(`
      Программа для подготовки данных для REST API сервера.

      Пример: cli.js --<command> [--arguments]

      Команды:

      --version:                   # выводит номер версии проекта из package.json
      --help:                      # печатает данную подсказку
      --import <path>:             # импортирует данные из TSV файла указанного в <path>
      --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных
    `));
  }
}
