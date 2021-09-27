import { ExecutorContext } from '@nrwl/devkit';
import { LintExecutorSchema } from './schema';
import { getProjectRoot } from '../../utils';
import { CmdStatus, runPoetryCommandAsync, waitForCommand } from '../../poetry';

export default async function* runExecutor(
  options: LintExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for lint', options);
  const projectRoot = getProjectRoot(context);

  try {
    const lintStatus = (data): CmdStatus => {
      if (/ F\d+: /.test(data) || data.includes('Your code has been rated')) {
        return CmdStatus.Done;
      } else if (/ E\d+: /.test(data)) {
        return CmdStatus.Error;
      }
      return CmdStatus.Continue;
    };
    const child = await runPoetryCommandAsync(
      projectRoot,
      ['run', 'pylint', 'src'],
      lintStatus
    );

    if (!child) {
      return { success: false };
    }
    yield { success: true };

    return waitForCommand(child);
  } catch (e) {
    return { success: false };
  }
}
