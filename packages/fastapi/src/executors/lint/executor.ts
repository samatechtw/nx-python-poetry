import { ExecutorContext } from '@nrwl/devkit';
import { LintExecutorSchema } from './schema';
import { getProjectRoot } from '../../utils';
import { runPoetryCommand } from '../../poetry';

export default async function runExecutor(
  options: LintExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for lint', options);

  const projectRoot = getProjectRoot(context);

  try {
    runPoetryCommand(projectRoot, 'run', 'pylint', 'src');
    return { success: true };
  } catch (e) {
    console.error('Executor failed: ', e);
    return { success: false };
  }
}
