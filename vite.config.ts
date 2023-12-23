import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react(),
      dts({
        insertTypesEntry: true,
      }),],
    
    // To access env vars here use process.env.TEST_VAR
  });
}

// export default defineConfig(({ mode }) => {

//   rocess.env = {...process.env, ...loadEnv(mode, process.cwd())};

//     return defineConfig({
//       // To access env vars here use process.env.TEST_VAR
//     });
//   return {
//     // configuração de vite
    
//     define: {
//       __APP_ENV__: JSON.stringify(env.APP_ENV),
//     }
//   }
// })
