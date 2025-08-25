// https://www.conventionalcommits.org/en/v1.0.0/
// https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
export default { extends: ['@commitlint/config-conventional'] }

/*
  <type>[optional scope]: <description>
  feat(api,lang/types\misc)!: subject

  [optional body]

  [optional body]

  [optional footer(s)]
  Task-refs: #123
  BREAKING CHANGE: description

  ---

  https://commitlint.js.org/reference/prompt.html#questions
  https://karma-runner.github.io/6.3/dev/git-commit-msg.html

  <type>! - MAJOR, BREAKING CHANGE

  feat - MINOR, a new feature for the user
  fix - PATCH, a bug fix for the user
  docs - changes to the documentation
  test - adding missing tests, refactoring tests; no production code change
  build - updating build configuration, development tools (irrelevant to the user)
  ci
  chore - maintenance, housekeeping
  perf - PATCH, performance improvements
  refactor - refactoring production code
  revert
  style - formatting changes, missing semicolons
*/
