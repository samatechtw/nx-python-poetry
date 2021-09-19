import { GeneratorCallback } from '@nrwl/devkit';
import * as shell from 'shelljs';

export function runPoetryCommand(root, ...args: string[]): GeneratorCallback {
  return (): void => {
    const cmd = `poetry ${args.join(' ')}`;
    console.info(`Running: ${cmd}`);
    if (!shell.which('poetry')) {
      console.error(`Poetry must be installed to run:\n> ${cmd}`);
      throw new Error();
    }
    if (!shell.pwd().endsWith(root)) {
      shell.cd(root);
    }
    if (shell.exec(cmd).code !== 0) {
      console.error(`Poetry command failed:\n> ${cmd}`);
      throw new Error();
    }
  };
}
