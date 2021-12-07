import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import inject from '@rollup/plugin-inject'
import path from 'path'

export default defineConfig({
  plugins: [
    reactRefresh(),
    inject({
      Buffer: ['buffer', 'Buffer']
    }),
  ],
  server: {
    host: 'localhost',
    hmr: {
      port: 3000,
    }
  },
  define: {
    "global": {},
    "process.env.NODE_DEBUG": JSON.stringify("")
  },
  optimizeDeps: {
    include: [
      'buffer',
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
