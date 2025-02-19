#!/usr/bin/env node

import { CLIApplication, VersionCommand, HelpCommand, ImportCommand } from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();

  cliApplication.registerCommands([
    new VersionCommand(),
    new HelpCommand(),
    new ImportCommand(),
  ]);

  cliApplication.processComand(process.argv);
}

bootstrap();
