import { ExecutorContext } from '@nrwl/devkit';
import { FormatExecutorSchema } from './schema';
import { getProjectRoot } from '../../utils';
import { runPoetryCommand } from '../../poetry';

export default async function runExecutor(
  options: FormatExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for format', options);

  const projectRoot = getProjectRoot(context);

  try {
    runPoetryCommand(projectRoot, 'run', 'black', 'src');
    return { success: true };
  } catch (e) {
    console.error('Executor failed: ', e);
    return { success: false };
  }
}
