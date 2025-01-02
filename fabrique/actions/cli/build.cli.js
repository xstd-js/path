import { parseArgs } from 'node:util';
import { build } from '../build.js';

const { values } = parseArgs({
  options: {
    mode: {
      type: 'string',
      short: 'm',
      default: 'prod',
    },
  },
});

build(values);
