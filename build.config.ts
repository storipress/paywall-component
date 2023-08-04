import fs from 'fs-extra'
import { defineBuildConfig } from 'unbuild'

let style

export default defineBuildConfig({
  declaration: true,
  entries: [
    {
      builder: 'mkdist',
      input: 'src',
      format: 'esm',
    },
  ],
  hooks: {
    'build:prepare': () => {
      style = fs.readFileSync('dist/style.css', { encoding: 'utf8' })
    },
    'mkdist:done': () => {
      fs.writeFileSync('dist/style.css', style)
    },
  },
})
