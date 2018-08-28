import babel from 'rollup-plugin-babel'
import { dependencies } from './package.json'

const cjs = {
  exports: 'named',
  format: 'cjs'
}

const esm = {
  format: 'es'
}

const getCJS = override => Object.assign({}, cjs, override)
const getESM = override => Object.assign({}, esm, override)

const config = {
  input: './index.js',
  output: [
    getESM({ file: './dist/page-wrapping.es.js' }),
    getCJS({ file: './dist/page-wrapping.cjs.js' }),
  ],
  plugins: [
    babel({
      babelrc: false,
      presets: [["env", { modules: false, loose: true }]],
      plugins: ["external-helpers"],
      exclude: 'node_modules/**'
    })
  ]
}

export default [config]
