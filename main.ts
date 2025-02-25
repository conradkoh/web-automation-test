import { CryptoGetRatesTest } from './tests/crypto';
import process from 'process';
import { GithubTopContributorsTest } from './tests/github';

(async function main() {
  process.loadEnvFile('.env.local');
  const test = new CryptoGetRatesTest();
  await test.init();
  await test.run();
})();
