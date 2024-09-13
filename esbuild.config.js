require('esbuild').build({
  entryPoints: ['app/javascript/application.js'],
  bundle: true,
  outdir: 'app/assets/builds',
  watch: process.env.RAILS_ENV === 'development',
  sourcemap: true,  // Optional: Add source maps for easier debugging
}).catch(() => process.exit(1))
