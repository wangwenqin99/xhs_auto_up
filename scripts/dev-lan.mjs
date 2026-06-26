import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

function pickLanAddress(addresses) {
  const priority = (address) => {
    if (address.startsWith("192.168.")) return 0;
    if (address.startsWith("10.")) return 1;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(address)) return 2;
    return 3;
  };
  const match = addresses
    .filter((address) =>
      (address.family === "IPv4" || address.family === 4) &&
      !address.internal
    )
    .sort((a, b) => priority(a.address) - priority(b.address))[0];
  return match?.address ?? null;
}

function getLanAddress() {
  const interfaces = networkInterfaces();
  const allAddresses = Object.values(interfaces).flatMap((addresses) => addresses ?? []);
  return pickLanAddress(allAddresses);
}

const port = process.env.PORT || "3000";
const lanAddress = getLanAddress();

if (!lanAddress) {
  console.error("No external IPv4 LAN address was found. Use npm run dev instead.");
  process.exit(1);
}

const appUrl = `http://${lanAddress}:${port}`;
const command = process.execPath;
const nextBin = join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const args = [nextBin, "dev", "--hostname", "0.0.0.0", "--port", port];

console.log(`LAN app URL: ${appUrl}`);
console.log("Use this URL on your phone when both devices are on the same network.");

const child = spawn(command, args, {
  cwd: repoRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    APP_URL: appUrl
  }
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 0);
});
