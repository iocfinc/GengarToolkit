export function loadStoredValue<T>(storageKey: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveStoredValue<T>(storageKey: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

type VersionedStoredValue<T> = {
  version: number;
  data: T;
};

export function loadVersionedStoredValue<T>(storageKey: string, version: number, fallback: T): T {
  const stored = loadStoredValue<VersionedStoredValue<T> | null>(storageKey, null);

  if (!stored || typeof stored !== 'object' || !('version' in stored) || !('data' in stored)) {
    return fallback;
  }

  return stored.version === version ? stored.data : fallback;
}

export function saveVersionedStoredValue<T>(storageKey: string, version: number, value: T) {
  saveStoredValue(storageKey, {
    version,
    data: value
  });
}
