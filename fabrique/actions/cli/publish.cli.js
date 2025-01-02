import { parseArgs } from 'node:util';
import { publish } from '../publish.js';

const { values } = parseArgs({
  options: {
    mode: {
      type: 'string',
      short: 'm',
      default: 'prod',
    },
  },
});

publish(values);
