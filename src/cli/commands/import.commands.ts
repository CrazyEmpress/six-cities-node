import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';


export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (!filename) {
      throw new Error('Filename is not specified');
    }
    const fileReader = new TSVFileReader(filename.trim());

    try {
      await fileReader.read();
      console.log(fileReader.toArray());
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`Can not import data from file: ${filename}`);
      console.error(`Details: ${error.message}`);
    }
  }
}
