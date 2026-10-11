import { open, readFile, writeFile, rename, unlink } from "node:fs/promises";

export async function initializeUsage(path) {
  const file = await open(path, "wx", 0o600);
  try {
    await file.writeFile(
      JSON.stringify({ version: 1, providers: {}, days: {} }),
    );
  } finally {
    await file.close();
  }
}

// One persistent ledger, shared by requests. Refuse to spend if missing/corrupt/locked.
export class BudgetStore {
  constructor(path, now = () => Date.now()) {
    this.path = path;
    this.now = now;
  }
  async transaction(update) {
    const lock = await open(`${this.path}.lock`, "wx", 0o600);
    try {
      const state = JSON.parse(await readFile(this.path, "utf8"));
      if (state.version !== 1 || !state.providers || !state.days)
        throw new Error("Invalid budget ledger");
      for (const item of Object.values(state.providers)) {
        if (
          !Number.isSafeInteger(item.used) ||
          item.used < 0 ||
          !Number.isFinite(item.cooldownUntil)
        )
          throw new Error("Invalid provider counter");
      }
      for (const used of Object.values(state.days))
        if (!Number.isSafeInteger(used) || used < 0)
          throw new Error("Invalid daily counter");
      const result = update(state);
      await writeFile(`${this.path}.tmp`, JSON.stringify(state), {
        mode: 0o600,
      });
      await rename(`${this.path}.tmp`, this.path);
      return result;
    } finally {
      await lock.close();
      await unlink(`${this.path}.lock`);
    }
  }
  async reserve(name, limit, dailyLimit) {
    return this.transaction((state) => {
      const now = this.now(),
        day = new Date(now).toISOString().slice(0, 10);
      const provider = state.providers[name] || { used: 0, cooldownUntil: 0 };
      if (
        provider.used >= limit ||
        provider.cooldownUntil > now ||
        (state.days[day] || 0) >= dailyLimit
      )
        return false;
      provider.used++;
      state.providers[name] = provider;
      state.days[day] = (state.days[day] || 0) + 1;
      // Count attempts before making a request, including timeouts and errors.
      return true;
    });
  }
  async coolDown(name, until) {
    return this.transaction((state) => {
      const provider = state.providers[name] || { used: 0, cooldownUntil: 0 };
      provider.cooldownUntil = Math.max(provider.cooldownUntil, until);
      state.providers[name] = provider;
    });
  }
}
