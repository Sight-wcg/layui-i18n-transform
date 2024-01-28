import {fs} from 'zx'
import { generateBaseTemplate } from './prepare/base-template.js'

await fs.ensureDir('./src/base-template')
await fs.emptyDir('./src/base-template')
await generateBaseTemplate()