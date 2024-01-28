import { parseFiles } from '@ast-grep/napi';
import MagicString from 'magic-string';
import { chalk, fs, path } from 'zx';
import { I18N_RE, COMMENT_HEAD } from '../scripts/prepare/constants.js';

const argv = process.argv
const lang = (await import(`../src/lang-template/${argv[2]}.js`)).default

await fs.emptyDir('./out')
await fs.ensureDir('./out/layui/src/modules')

const task_queue = [];
const task = await parseFiles(['layui/src'], (err, ast) => {
  if (!ast.filename().endsWith('.js')) return;
  const filename = path.basename(ast.filename(), '.js');
  //console.log(filename, ast.filename());

  const source = new MagicString(ast.root().text());
  const component = lang[filename];
  if (component) {
    const matchNodes = ast.root().findAll({
      rule: {
        kind: 'string_fragment',
        regex: I18N_RE
      }
    });
    const keyMap = new Map();
    matchNodes.forEach((node) => {
      let no = 0;
      const matchStr = node.text().trim();
      if(keyMap.has(matchStr)){
        no = keyMap.get(matchStr);
        keyMap.set(matchStr, ++no);
      }else{
        keyMap.set(matchStr, no);
      }
      const key = `${matchStr}__I18N_${no}`;
      if (key in component) {
        const newStr = node.text().replace(matchStr, component[key]);
        const range = node.range();
        
        source.update(range.start.index, range.end.index, newStr);
      }
    });

    console.log(`${chalk.blue(filename + ':')} ${chalk.bold.green('match')}`);
  } else {
    console.log(`${chalk.blue(filename + ':')} ${chalk.bold.red('mismatch')}`);
  }

  task_queue.push(fs.writeFile(`./out/${ast.filename()}`, source.toString(), 'utf-8'));
});
task_queue.push(task);

await Promise.all(task_queue);

console.log('done');

