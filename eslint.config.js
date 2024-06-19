import { rational } from 'eslint-config-rational';

export default rational({
  ignores: ['**/{.git,node_modules,out,dist}'],
  override: {
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
});
