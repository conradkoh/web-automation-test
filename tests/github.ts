import { z } from 'zod';
import { UITest } from './base';

export class GithubTopContributorsTest extends UITest {
  async run() {
    await this.page.goto('https://github.com/browserbase/stagehand');
    await this.act({
      action: 'click on the contributors',
      modelName: this._modelName,
    });
    const contributor = await this.extract({
      instruction: 'extract the top contributor',
      schema: z.object({
        username: z.string(),
        url: z.string(),
      }),
      modelName: this._modelName,
    });
    console.log(`Our favorite contributor is ${contributor.username}`);
  }
}
