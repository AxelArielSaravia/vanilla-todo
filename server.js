import * as path from "path";
import {statSync} from "fs";

const DIR = path.resolve(import.meta.dir, "public");
const PORT = 3000;

const response_OPTIONS = {status: 404};
const statSync_OPTIONS = {bigint: false, throwIfNoEntry: false};

const gzip_HEADER = {
    headers: {
        "content-type": "text/html",
        "content-encoding": "gzip"
    }
};
const gzipTypes = [".html", ".css",".js",".json",".xml"];
const mimeTypes = [
    "text/html",
    "text/css",
    "text/javascript",
    "application/json",
    "application/xml"
];

const badResponse = new Response("File not found", response_OPTIONS);

const server = Bun.serve({
    port: PORT,
    fetch(request) {
        console.info("New request URL:", request.url);

        const encoding = request.headers.get("accept-encoding");
        const allowsGzip = encoding !== null && encoding.includes("gzip");

        let reqPath = new URL(request.url).pathname;
        console.info(request.method, reqPath);

        if (reqPath === "/") {
            reqPath = "/index.html";
        }
        let extension = path.extname(reqPath);
        if (extension.length === 0) {
            console.warn("The request path is bad:", reqPath);
            return badResponse;
        }

        let basePath = "";
        /**
        @type {Stats | BigIntStats | undefined} */
        let stat;
        const gzipTypeIndex = gzipTypes.indexOf(extension);
        if (allowsGzip && gzipTypeIndex !== -1) {
            let reqGzipPath = reqPath + ".gz";
            basePath = path.join(DIR, reqGzipPath);

            try { stat = statSync(basePath, statSync_OPTIONS); }
            catch {}

            if (stat !== undefined && stat.isFile()) {
                gzip_HEADER.headers["content-type"] = mimeTypes[gzipTypeIndex];
                console.info("Request path exist. Sending:", reqPath);
                return new Response(Bun.file(basePath), gzip_HEADER);
            }
        }

        basePath = path.join(DIR, reqPath);
        try {
            stat = statSync(basePath, statSync_OPTIONS);
        } catch {
            console.error("Error in statSync");
            return badResponse;
        };

        if (stat !== undefined && stat.isFile()) {
            console.info("Request path exist. Sending:", reqPath);
            return new Response(Bun.file(basePath));
        } else {
            console.warn(`WARNING: No such file or directory: ${basePath}`);
        }
        return badResponse;
    }
});

console.log(`Server listening on http://localhost:${server.port}`);
