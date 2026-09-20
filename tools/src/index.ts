import * as path from "node:path";
import { buildPipeline } from "./pipeline";
console.log(JSON.stringify(buildPipeline(path.resolve(__dirname, "../..")), null, 2));
