import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

process.chdir(projectRoot);

const child = spawn(process.execPath, [nextBin, "dev", "-p", "5000"], {
  stdio: "inherit",
  cwd: projectRoot,
});

child.on("exit", (code) => process.exit(code ?? 0));
