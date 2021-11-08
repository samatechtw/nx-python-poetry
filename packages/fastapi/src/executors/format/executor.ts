import { ExecutorContext } from '@nrwl/devkit';
import { FormatExecutorSchema } from './schema';
import { getProjectRoot } from '../../utils';
import { runPoetryCommand } from '../../poetry';

export default function runExecutor(
  options: FormatExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for format', options);

  const projectRoot = getProjectRoot(context);

  try {
    const command = runPoetryCommand(
      projectRoot,
      'run',
      'black',
      'src',
      '--check'
    );

    if (!command) {
      return { success: false };
    }
    command();

    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
