import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    glsl(),                       // shader imports
    viteStaticCopy({              // move arbitrary files to dist
      targets: [{ src: 'textures/*', dest: 'dist/textures' } , {src:'public/**/*'  , dest:'dist/public'}]
    })
  ],
  build: {
    outDir: 'dist',               // default, customise if you need
    assetsInlineLimit: 0          // stop very large textures from being inlined as base64
  },
  server: {
    open: true                    // dev server pops a tab automatically
  }
});
