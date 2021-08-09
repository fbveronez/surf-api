import * as path from 'path';
import moduleAlias from 'node:module';
import { addAlias, addAliases } from 'module-alias';

const files = path.resolve(__dirname, '../..');

moduleAlias;addAliases({
  '@src': path.join(files,'src'),
  '@test': path.join(files, 'test')
});