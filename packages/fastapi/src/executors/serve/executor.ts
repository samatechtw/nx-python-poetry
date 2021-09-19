import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { DevServerExecutorSchema } from './schema';
import { getProjectRoot } from '../../utils';
import { runPoetryCommandAsync } from '../../poetry';

export default async function* runExecutor(
  options: DevServerExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for DevServer', options);

  const projectRoot = getProjectRoot(context);
  const { host, port } = options;
  const baseUrl = `http://${host}:${port}`;

  try {
    const child = await runPoetryCommandAsync(
      joinPathFragments(projectRoot, 'src'),
      'run',
      'uvicorn',
      'main:app',
      '--reload',
      '--port',
      port.toString(),
      '--host',
      host
    );

    if (!child) {
      return { success: false };
    }
    yield {
      success: true,
      baseUrl,
    };

    return new Promise<{ success: boolean; baseUrl?: string }>((res) => {
      child.on('exit', (code) => {
        res({
          success: code === 0,
          baseUrl,
        });
      });
    });
  } catch (e) {
    console.error('Executor failed: ', e);
    return { success: false };
  }
}
