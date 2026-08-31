// Side-effect-only module: shim localStorage for Node test runs.
// Imported first by every test file that touches the store.

const _ls = new Map<string, string>()

if (typeof (globalThis as any).localStorage === 'undefined') {
  ;(globalThis as any).localStorage = {
    getItem: (k: string) => _ls.get(k) ?? null,
    setItem: (k: string, v: string) => { _ls.set(k, v) },
    removeItem: (k: string) => { _ls.delete(k) },
    clear: () => { _ls.clear() },
    key: (i: number) => Array.from(_ls.keys())[i] ?? null,
    get length() { return _ls.size },
  }
}

export {}
