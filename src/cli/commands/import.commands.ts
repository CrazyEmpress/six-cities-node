import { Command } from './command.interface.js';
import { TSVFileReader } from '../shared/libs/file-reader/index.js';
import { chalkError } from '../shared/libs/chalk/chalk.variables.js';


export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    if (!filename) {
      throw new Error(chalkError('Filename is not specified'));
    }
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalkError(`Can not import data from file: ${filename}`));
      console.error(chalkError(`Details: ${error.message}`));
    }
  }
}
