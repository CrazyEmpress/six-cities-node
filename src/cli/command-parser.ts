type ParsedCommand = Record<string, string[]>;

export class CommandParser {

  /**
   * Парсит (разбирает) переданную массивом строк команду и возвращает объект команды с параметрами
   * @param cliArguments Массив строковых значений потенциально являющийся командой с аргументами
   * @returns Объект типа ParsedCommand, где ключ это название команды, а значение - массив аргументов команды
   */
  static parse(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let currentCommand = '';

    for (const argument of cliArguments) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = [];
        currentCommand = argument;
      } else if (currentCommand && argument) {
        parsedCommand[currentCommand].push(argument);
      }
    }

    return parsedCommand;
  }
}
