import * as path from "node:path";
import {readdirSync, appendFileSync} from "node:fs";

import CleanCSS from "clean-css";

import {HTMLMinify} from "./utils.js";

console.info("Global dir:", import.meta.dir);

const PRODUCTION_ENV = Bun.env.NODE_ENV === "production";
console.info("Production:", PRODUCTION_ENV);

const PUBLIC_PATH = path.join(import.meta.dir, "public");
const SRC_PATH = path.join(import.meta.dir, "src");

console.info("PUBLIC_PATH:", PUBLIC_PATH);
console.info("SRC_PATH:", SRC_PATH);

/*********************
* JS Builds
**********************/
{
    const config_build = {
        entrypoints: ["./src/main.js"],
        outdir: PUBLIC_PATH,
        minify: PRODUCTION_ENV,
    };

    const general_build = await Bun.build(config_build);
    if (!general_build.success) {
        console.error(general_build);
        throw Error("Se rompio esta vaina wacho, el js build. Fijate que ondera");
    }
    console.info("JS Build Successful");
}
{ //service worker

    const config_serviceworker = {
        entrypoints: ["./src/serviceworker.js"],
        outdir: PUBLIC_PATH,
        minify: PRODUCTION_ENV
    };

    const build = await Bun.build(config_serviceworker);
    if (!build.success) {
        console.error(build);
        throw Error("Se rompio esta vaina wacho, el js build. Fijate que ondera");
    }
    console.info("JS service worker Build Successful");
}

/*********************
* CSS Builds
**********************/
{
    const CSS_FILE = "style.css";
    const default_css_file = path.join(SRC_PATH, CSS_FILE);
    const public_css_file = path.join(PUBLIC_PATH, CSS_FILE);
    const cleanCSS = (
        PRODUCTION_ENV
        ? new CleanCSS()
        : null
    );
    if (PRODUCTION_ENV) {
        const file = await Bun.file(default_css_file).text();
        const s = cleanCSS?.minify(file).styles;
        await Bun.write(Bun.file(public_css_file), s);
    } else {
        await Bun.write(Bun.file(public_css_file), Bun.file(default_css_file));
    }

    const read_dir_path = path.join(SRC_PATH, "components");
    const read_dir = readdirSync(read_dir_path);

    for (const file_name of read_dir) {
        const extname = path.extname(file_name);
        if (extname !== ".css") {
            continue;
        }
        const read_file = path.join(read_dir_path, file_name);
        const file = await Bun.file(read_file).text();
        if (PRODUCTION_ENV) {
            let s = cleanCSS?.minify(file).styles;
            appendFileSync(public_css_file, s);
        } else {
            appendFileSync(public_css_file, file);
        }
    }
    console.info("CSS Build Successful");
}

/*********************
* HTML Builds
**********************/
{
    let html_index = (
        await import("./src/index.html.js")
    )?.default;

    if (PRODUCTION_ENV) {
        html_index = HTMLMinify(html_index);
    }
    // create index.html in PUBLIC_PATH
    const public_html_path = path.join(PUBLIC_PATH, "index.html");
    await Bun.write(public_html_path, html_index);

    console.info("HTML Build Successful");
}


/*********************
* MANIFEST Builds
**********************/
{
    const src_file = path.join(SRC_PATH, "manifest.json");
    const public_file = path.join(PUBLIC_PATH, "app.webmanifest");
    Bun.write(Bun.file(public_file), Bun.file(src_file));
}
