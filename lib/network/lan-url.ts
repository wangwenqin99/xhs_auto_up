export type NetworkAddress = {
  address: string;
  family: string | number;
  internal: boolean;
};

function isIPv4(address: NetworkAddress): boolean {
  return address.family === "IPv4" || address.family === 4;
}

function priority(address: string): number {
  if (address.startsWith("192.168.")) return 0;
  if (address.startsWith("10.")) return 1;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(address)) return 2;
  return 3;
}

export function pickLanAddress(addresses: NetworkAddress[]): string | null {
  const match = addresses
    .filter((address) => isIPv4(address) && !address.internal)
    .sort((a, b) => priority(a.address) - priority(b.address))[0];
  return match?.address ?? null;
}
