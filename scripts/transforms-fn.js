import { parseFiles } from '@ast-grep/napi';
import MagicString from 'magic-string';
import { chalk, fs, path } from 'zx';
import { I18N_RE, COMMENT_HEAD } from '../scripts/prepare/constants.js';

const argv = process.argv
const { default:lang } = await import(`../src/lang-template/${argv[2]}.js`)

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
      const rawText = node.text();
      const matchStr = rawText.trim();
      if(keyMap.has(matchStr)){
        no = keyMap.get(matchStr);
        keyMap.set(matchStr, ++no);
      }else{
        keyMap.set(matchStr, no);
      }
      const key = `${matchStr}__I18N_${no}`;
      if (key in component) {
        const countLeadingWhitespace = rawText.length - rawText.trimStart().length
        const countTrailingWhitespace = rawText.length - rawText.trimEnd().length
        const newStr = [
          countLeadingWhitespace ? `'${' '.repeat(countLeadingWhitespace)}' + ` : '',
          `${component[key]}`,
          countTrailingWhitespace ? `+ '${' '.repeat(countTrailingWhitespace)}'` : '',
        ].join('');
        const range = node.range();
        
        source.remove(range.start.index-1, range.end.index+1);
        source.appendRight(range.start.index-1, newStr);
      }
    });

    console.log(`${chalk.blue(filename + ':')} ${chalk.bold.green('match')}`);
  } else {
    console.log(`${chalk.blue(filename + ':')} ${chalk.bold.red('mismatch')}`);
  }

  task_queue.push(fs.writeFile(`./${ast.filename()}`, source.toString(), 'utf-8'));
});
task_queue.push(task);

await Promise.all(task_queue);

console.log('done');

