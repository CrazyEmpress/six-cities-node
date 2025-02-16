import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.interface.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {

  /** Коллекция всех команд имеющихся в приложении */
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help',
  ) { }

  /**
   * "Регистрирует" переданные команды предварительно проверяя не были ли они уже зарегистрированы
   * @param commandsList Массив типа Command[] являющийся массивом экземпляров команд
   */
  public registerCommands(commandsList: Command[]): void {
    commandsList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }

      this.commands[command.getName()] = command;
    });
  }

  private getDefaltCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`The default command ${this.defaultCommand} is not registered`);
    }

    return this.commands[this.defaultCommand];
  }

  private getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaltCommand();
  }

  /**
   * Исполняет полученную команду. В качестве аргумента получает
   * массив строк (пользовательский ввод из process.argv)
   * который при помощи статического метода parse класса CommandParser
   * будет преобразован в объект ParsedCommand
   * из названия которого далее находится и исполняется зарегестрированная команда
   * @param argv Массив строк, предполагаемая команда
   */
  public processComand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
