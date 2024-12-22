// rollup.config.js

import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: 'src/store.ts', // TypeScript 入口文件
    output: {
      file: 'dist/store.js', // 输出文件
      format: 'es', // 输出格式设置为 ES 模块
    },
    plugins: [
      resolve({ browser: true }), // 使用 @rollup/plugin-node-resolve 解析 node_modules 中的模块
      commonjs(), // 使用 @rollup/plugin-commonjs 解析 CommonJS 模块
      typescript(), // 使用 @rollup/plugin-typescript 处理 TypeScript 文件
    ],
  },
  {
    input: 'src/store.ts',
    output: {
      file: 'dist/store.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
  {
    input: 'src/web-env.ts',
    output: {
      file: 'dist/web-config.js',
      format: 'es',
    },
    plugins: [resolve({ browser: true }), commonjs(), typescript()],
  },
  {
    input: 'src/web-env.ts',
    output: {
      file: 'dist/web-config.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
  {
    input: 'src/page.ts',
    output: {
      file: 'dist/web-page.js',
      format: 'es',
    },
    plugins: [resolve({ browser: true }), commonjs(), typescript()],
  },
  {
    input: 'src/page.ts',
    output: {
      file: 'dist/web-page.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
  {
    input: 'src/web.ts',
    output: {
      file: 'dist/web.js',
      format: 'es',
    },
    plugins: [resolve({ browser: true }), commonjs(), typescript()],
  },
  {
    input: 'src/web.ts',
    output: {
      file: 'dist/web.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
  {
    input: 'src/app.ts',
    output: {
      file: 'dist/app.js',
      format: 'iife',
    },
    plugins: [resolve({ browser: true }), commonjs(), typescript(), terser()],
  },
  {
    input: 'src/app.ts',
    output: {
      file: 'dist/app.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
