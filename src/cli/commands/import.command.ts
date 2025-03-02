import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Offer } from '../../shared/types/index.js';
import { getErrorMessage } from '../../shared/helpers/common.js';


export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedOffer(offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;

    if (!filename) {
      throw new Error('Filename is not specified');
    }

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error: unknown) {

      console.error(`Can not import data from file: ${filename}`);
      getErrorMessage(error);
    }
  }
}
