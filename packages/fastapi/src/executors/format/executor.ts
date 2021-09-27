import { ExecutorContext } from '@nrwl/devkit';
import { FormatExecutorSchema } from './schema';
import { getProjectRoot } from '../../utils';
import { CmdStatus, runPoetryCommandAsync, waitForCommand } from '../../poetry';

export default async function* runExecutor(
  options: FormatExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for format', options);

  const projectRoot = getProjectRoot(context);

  try {
    const checkStatus = (data): CmdStatus => {
      if (
        data.includes('files reformatted') ||
        data.includes('files left unchanged')
      ) {
        return CmdStatus.Done;
      }
      return CmdStatus.Continue;
    };
    const child = await runPoetryCommandAsync(
      projectRoot,
      ['run', 'black', 'src'],
      checkStatus
    );

    if (!child) {
      return { success: false };
    }
    yield { success: true };

    return waitForCommand(child);
  } catch (e) {
    console.error('Executor failed: ', e);
    return { success: false };
  }
}
