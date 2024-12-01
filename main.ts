import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';

const modelName = 'gpt-4o-mini';

const stagehand = new Stagehand({
  env: 'LOCAL',
  enableCaching: true,
});
await stagehand.init({
  modelName,
});
await stagehand.page.goto('https://github.com/browserbase/stagehand');
await stagehand.act({ action: 'click on the contributors', modelName });
const contributor = await stagehand.extract({
  instruction: 'extract the top contributor',
  schema: z.object({
    username: z.string(),
    url: z.string(),
  }),
  modelName,
});
console.log(`Our favorite contributor is ${contributor.username}`);
