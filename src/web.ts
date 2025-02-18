import { Page } from './page.ts';
import * as WebEnv from './web-env.ts';

import { nanoid } from 'nanoid';
import * as PathToREgexp from 'path-to-regexp';
import * as Load from '@kevisual/load/browser';

export const WebModule = {
  Page,
  WebEnv,
  nanoid,
  PathToREgexp,
  Load,
};
