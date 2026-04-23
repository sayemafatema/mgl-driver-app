import { defineConfig } from 'tsup';
import { cpSync, mkdirSync } from 'fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    'react',
    'react-native',
    'react-native-svg',
    'lucide-react-native',
    '@react-navigation/native',
    '@react-navigation/stack',
    '@react-navigation/bottom-tabs',
  ],
  onSuccess: async () => {
    mkdirSync('dist/assets', { recursive: true });
    cpSync('src/assets', 'dist/assets', { recursive: true });
  },
});
