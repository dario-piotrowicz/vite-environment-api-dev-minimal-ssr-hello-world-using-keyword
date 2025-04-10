import {
  type Connect,
  type Plugin,
  type PluginOption,
  createServerModuleRunner,
  defineConfig,
} from "vite";

export default defineConfig({
  appType: "custom",
  plugins: [vitePluginSsrMiddleware({ entry: "/src/index" })],
  environments: {
    ssr: {},
  },
});

// vavite-style ssr middleware plugin
function vitePluginSsrMiddleware({ entry }: { entry: string }): PluginOption[] {
  const plugin: Plugin = {
    name: vitePluginSsrMiddleware.name,

    configureServer(server) {
      const runner = createServerModuleRunner(server.environments.ssr, {
        hmr: { logger: false },
      });
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        try {
          const mod = await runner.import(entry);
          await mod["default"](req, res, next);
        } catch (e) {
          next(e);
        }
      };
      return () => server.middlewares.use(handler);
    },
  };
  return [plugin];
}
