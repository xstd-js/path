import { parseArgs } from 'node:util';
import { buildAndPublish } from '../build-and-publish.js';

const { values } = parseArgs({
  options: {
    mode: {
      type: 'string',
      short: 'm',
      default: 'prod',
    },
  },
});

buildAndPublish(values);
