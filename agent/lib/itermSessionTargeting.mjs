function normalizeText(value) {
  return typeof value === 'string' ? value : '';
}

function parseWindowId(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    throw new Error('Invalid --window-id value. Provide a numeric window id.');
  }

  return parsed;
}

function includesInsensitive(haystack, needle) {
  if (!needle) return true;
  return normalizeText(haystack).toLowerCase().includes(needle.toLowerCase());
}

export function buildSessionSelectors(options = {}) {
  return {
    sessionId: options.sessionId ? String(options.sessionId) : null,
    windowId: parseWindowId(options.windowId),
    titleContains: options.titleContains ? String(options.titleContains) : null,
    textContains: options.textContains ? String(options.textContains) : null,
    tty: options.tty ? String(options.tty) : null
  };
}

export function hasSelector(selectors) {
  return Boolean(
    selectors.sessionId ||
      Number.isFinite(selectors.windowId) ||
      selectors.titleContains ||
      selectors.textContains ||
      selectors.tty
  );
}

export function filterSessions(sessions, selectors) {
  return sessions.filter((session) => {
    if (selectors.sessionId && String(session.sessionId) !== selectors.sessionId) {
      return false;
    }

    if (Number.isFinite(selectors.windowId) && Number(session.windowId) !== selectors.windowId) {
      return false;
    }

    if (selectors.tty && normalizeText(session.tty) !== selectors.tty) {
      return false;
    }

    if (!includesInsensitive(session.title, selectors.titleContains)) {
      return false;
    }

    if (!includesInsensitive(session.textPreview, selectors.textContains)) {
      return false;
    }

    return true;
  });
}

export function describeSession(session) {
  return `window=${session.windowId} session=${session.sessionId} title=${JSON.stringify(
    session.title
  )} tty=${JSON.stringify(session.tty)}`;
}

export function selectSession(sessions, options = {}) {
  const selectors = buildSessionSelectors(options);

  if (!hasSelector(selectors)) {
    throw new Error(
      'Refusing to guess a target session. Provide one selector: --session-id, --window-id, --title-contains, --text-contains, or --tty.'
    );
  }

  const matches = filterSessions(sessions, selectors);

  if (matches.length === 0) {
    throw new Error('No iTerm session matched the provided selectors.');
  }

  if (matches.length > 1) {
    const details = matches.map(describeSession).join('\n');
    throw new Error(`Ambiguous iTerm session selection. Narrow selectors.\n${details}`);
  }

  return matches[0];
}

export function normalizeSession(session) {
  return {
    windowId: Number(session.windowId),
    sessionId: String(session.sessionId),
    title: normalizeText(session.title),
    tty: normalizeText(session.tty),
    textPreview: normalizeText(session.textPreview)
  };
}
