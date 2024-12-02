import { GithubTopContributorsTest } from './tests/github';

(async function main() {
  const test = new GithubTopContributorsTest();
  await test.init();
  await test.run();
})();
