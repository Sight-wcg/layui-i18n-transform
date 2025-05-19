import { parseFiles } from '@ast-grep/napi';
import { fs, path } from 'zx';
import {I18N_RE, COMMENT_HEAD} from './constants.js'

export async function generateBaseTemplate(){
  const baseTemplate = {};
  const metaData = {};
  await parseFiles(['layui/src'], (err, ast) => {
    if(!ast.filename().endsWith('.js')) return;
    const filename = path.basename(ast.filename(), '.js');
    if(filename === 'jquery') return;
    //console.log(filename, ast.filename());
    const matchNodes = ast.root().findAll({
      rule: {
        kind: 'string_fragment',
        regex: I18N_RE
      }
    });
    if (matchNodes.length) {
      if (!(filename in baseTemplate)) baseTemplate[filename] = {};
      if (!(filename in metaData)) metaData[filename] = {};
      const keyMap = new Map();
      matchNodes.forEach((node) => {
        const matchStr = node.text().trim();
        if(keyMap.has(matchStr)){
          var no = keyMap.get(matchStr);
          keyMap.set(matchStr, ++no);
        }else{
          keyMap.set(matchStr, 0);
        }
        const key = `${matchStr}__I18N_${keyMap.get(matchStr)}`;
        baseTemplate[filename][key] = matchStr;
        metaData[filename][key] = {
          file: ast.filename().replace(/\\/g, '/'),
          raw: node.text(),
          range: node.range()
        }
      });
    }
  });

  let sortedTplObj = Object.fromEntries(
    Object.entries(baseTemplate).sort((a, b) => a[0].localeCompare(b[0]))
  );
  let sortedMetaDataObj = Object.fromEntries(
    Object.entries(metaData).sort((a, b) => a[0].localeCompare(b[0]))
  );
  
  await fs.writeFile(
    `./src/base-template/index.js`,
`${COMMENT_HEAD}
export default {${Object.entries(sortedTplObj).map(([compName,obj]) =>`
  ${compName}: {
${Object.entries(obj).map(([key,val]) => `    '${key}': '${val}'`).join(',\n')}
  },`
).join('')}
}`, 
    {encoding: 'utf-8'}
  )

  await fs.writeFile('./src/base-template/meta.json', `${JSON.stringify(sortedMetaDataObj, null, 2)}`,{encoding: 'utf-8'})
}


