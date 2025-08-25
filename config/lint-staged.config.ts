import type { Configuration } from 'lint-staged'

// https://github.com/lint-staged/lint-staged?tab=readme-ov-file#using-js-configuration-files
export default {
  '**/*': ['prettier --write --ignore-unknown', 'eslint --cache --max-warnings 0 --no-warn-ignored'],
} as Configuration
