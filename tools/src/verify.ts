import * as path from "node:path";
import { verifyPipeline } from "./pipeline";
console.log(JSON.stringify({ verified: true, ...verifyPipeline(path.resolve(__dirname, "../..")) }, null, 2));
