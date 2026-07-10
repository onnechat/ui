import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/styles/globals.css'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  // Sem sourcemaps no pacote publicado — corta ~metade do peso no npm.
  sourcemap: false,
  treeshake: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  // Processar CSS com PostCSS (Tailwind)
  async onSuccess() {
    await import('postcss').then(async (postcss) => {
      const tailwindPostCSS = await import('@tailwindcss/postcss');
      const autoprefixer = await import('autoprefixer');

      const css = await import('fs').then((fs) =>
        fs.default.readFileSync('src/styles/globals.css', 'utf8')
      );

      const result = await postcss
        .default([tailwindPostCSS.default(), autoprefixer.default])
        .process(css, { from: 'src/styles/globals.css' });

      await import('fs').then((fs) => {
        fs.default.writeFileSync('dist/styles.css', result.css);
      });
    });
  },
});
