import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';
type AvailableModel = 'gpt-4o-mini';
export abstract class UITest {
  protected _modelName: AvailableModel;
  protected _stagehand: Stagehand;
  constructor() {
    this._stagehand = new Stagehand({
      env: 'LOCAL',
      enableCaching: true,
    });
  }
  async init() {
    await this._stagehand.init({
      modelName: this._modelName,
    });
  }
  async act(...p: Parameters<Stagehand['act']>) {
    return await this._stagehand.act(...p);
  }
  async extract<T extends z.AnyZodObject>(
    ...p: [
      {
        instruction: string;
        schema: T;
        modelName?: AvailableModel;
        domSettleTimeoutMs?: number;
      }
    ]
  ): Promise<z.infer<T>> {
    return await this._stagehand.extract(...p);
  }

  async observe(...p: Parameters<Stagehand['observe']>) {
    return await this._stagehand.observe(...p);
  }

  get page() {
    return this._stagehand.page;
  }
  abstract run(): Promise<void>;
}
