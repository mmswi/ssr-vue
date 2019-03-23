const fs = require("fs");
const path = require("path");
const server = require("express")();
const resolvePath = file => path.resolve(__dirname, file);
const { createBundleRenderer } = require("vue-server-renderer");
const setupDevServer = require("./build/setup-dev-server");

const isProd = process.env.NODE_ENV === "production";

let renderer;
let devServerPromise;
const templatePath = resolvePath("./src/index.template.html");

// creating different renderers depending if is prod or not
if (isProd) {
  const template = fs.readFileSync(templatePath, "utf-8");
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");
  renderer = createRenderer(serverBundle, {
    template,
    clientManifest
  });
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  devServerPromise = setupDevServer(server, templatePath, (bundle, options) => {
    renderer = createRenderer(bundle, options);
  });
}

// ================== rendering the app for any path ======================= //
server.get(
  "*",
  isProd
    ? renderApp
    : (req, res) => {
        devServerPromise.then(() => renderApp(req, res));
      }
);

// ================== createRenderer function - start ======================= //
function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      // this is only needed when vue-server-renderer is npm-linked
      basedir: resolvePath("./dist"),
      // recommended for performance
      runInNewContext: false
    })
  );
}
// ================== createRenderer function - start ======================= //

// ================== renderApp function - start ======================= //
function renderApp(req, res) {
  const context = {
    url: req.url,
    title: "my vue ssr"
  };

  // No need to pass an app here because it is auto-created by
  // executing the bundle. Now our server is decoupled from our Vue app!
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err);
    } else {
      res.end(html);
    }
  });

  // error handler function
  function handleError(err) {
    if (err.url) {
      res.redirect(err.url);
    } else if (err.code === 404) {
      res.status(404).end("404 | Page Not Found");
    } else {
      // Render Error Page or Redirect
      res.status(500).send("500 | Internal Server Error");
      console.error(`error during render : ${req.url}`);
      console.error(err.stack);
    }
  }
}
// ================== renderApp function - end ======================= //

// ================== listening to port ======================= //
server.listen(8080, () => {
  console.log("listening to 8080");
});
