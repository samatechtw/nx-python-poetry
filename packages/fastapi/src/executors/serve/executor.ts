import { DevServerExecutorSchema } from './schema';

export default async function runExecutor(options: DevServerExecutorSchema) {
  console.log('Executor ran for dev server', options);
  return {
    success: true,
  };
}
