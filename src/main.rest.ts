import { RestApplication } from './rest/rest.application.js';
import { RestConfig } from './shared/libs/config/rest.config.js';
import { PinoLogger } from './shared/libs/logger/index.js';

async function boostrap() {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);

  const application = new RestApplication(logger, config);

  await application.init();
}

boostrap();
