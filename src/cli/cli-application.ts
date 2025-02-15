import { Command } from "./commands/command.interface.js";

type CommandCollection = Record<string, Command>;

export class CLIApplication {

  /** Коллекция всех команд имеющихся в приложении */
  private commands: CommandCollection = {};

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
    })
  }
}
