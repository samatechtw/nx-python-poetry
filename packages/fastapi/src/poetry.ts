import { GeneratorCallback } from '@nrwl/devkit';
import { ChildProcess } from 'child_process';
import * as shell from 'shelljs';

function commandSetup(root: string, args: string[]): string {
  const cmd = `poetry ${args.join(' ')}`;
  console.info(`Running: ${cmd}`);

  if (!shell.which('poetry')) {
    console.error(`Poetry must be installed to run:\n> ${cmd}`);
    throw new Error();
  }
  if (!shell.pwd().endsWith(root)) {
    shell.pushd('-q', root);
  }
  return cmd;
}

export function runPoetryCommandAsync(
  root: string,
  ...args: string[]
): Promise<ChildProcess> {
  const cmd = commandSetup(root, args);
  const child = shell.exec(cmd, { async: true });
  shell.popd('-q');
  return new Promise((resolve, reject) => {
    child.stderr.on('data', (data) => {
      if (data.includes('Application startup complete.')) {
        resolve(child);
      } else if (data.includes('ERROR:')) {
        console.error('Poetry command failed, exiting');
        child.kill('SIGHUP');
        reject();
      }
    });
  });
}

export function runPoetryCommand(
  root: string,
  ...args: string[]
): GeneratorCallback {
  return (): void => {
    const cmd = commandSetup(root, args);

    if (shell.exec(cmd).code !== 0) {
      shell.popd();
      console.error(`Poetry command failed:\n> ${cmd}`);
      throw new Error();
    }
    shell.popd();
  };
}
