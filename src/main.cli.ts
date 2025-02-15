import { CLIApplication, VersionCommand, HelpCommand } from "./cli/index.js";

function bootstrap() {
  const cliApplication = new CLIApplication();

  cliApplication.registerCommands([
    new VersionCommand,
    new HelpCommand,
  ]);

  cliApplication.processComand(process.argv);
}

bootstrap();
