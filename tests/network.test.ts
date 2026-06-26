import { describe, expect, test } from "vitest";

import { pickLanAddress } from "../lib/network/lan-url";

describe("LAN URL helpers", () => {
  test("picks the first external IPv4 address", () => {
    const address = pickLanAddress([
      { address: "127.0.0.1", family: "IPv4", internal: true },
      { address: "fe80::1", family: "IPv6", internal: false },
      { address: "192.168.31.88", family: "IPv4", internal: false },
      { address: "10.0.0.12", family: "IPv4", internal: false }
    ]);

    expect(address).toBe("192.168.31.88");
  });

  test("prefers common LAN addresses over virtual adapter addresses", () => {
    const address = pickLanAddress([
      { address: "172.17.16.1", family: "IPv4", internal: false },
      { address: "192.168.1.7", family: "IPv4", internal: false }
    ]);

    expect(address).toBe("192.168.1.7");
  });

  test("returns null when no external IPv4 address exists", () => {
    const address = pickLanAddress([
      { address: "127.0.0.1", family: "IPv4", internal: true },
      { address: "::1", family: "IPv6", internal: true }
    ]);

    expect(address).toBeNull();
  });
});
