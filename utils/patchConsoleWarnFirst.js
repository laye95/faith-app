/**
 * Must run before any react-native / expo-modules import.
 * ExpoModulesCore registers `action: console.warn` for native jsLogger.warn;
 * if we patch after that, native logs still use the unpatched function.
 */
(function patchConsoleWarnFirst() {
  const g = globalThis;
  if (g.__faithConsoleWarnPatched) return;
  g.__faithConsoleWarnPatched = true;

  const origWarn = console.warn;
  console.warn = function filteredWarn(...args) {
    const text = args
      .map((a) => {
        if (typeof a === 'string') return a;
        if (a instanceof Error) return a.message + (a.stack || '');
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(' ');

    if (
      /Failed to load available (audio|subtitle) tracks for https:\/\/player\.vimeo\.com/i.test(
        text,
      )
    ) {
      return;
    }
    if (/CoreMediaErrorDomain Code=-19583/.test(text)) return;
    if (/AVErrorFailedDependenciesKey/.test(text)) return;
    if (/🟡\s+MediaSelectionArray/.test(text)) return;
    if (/🟡\s+LocalizedMSODisplayNames/.test(text)) return;
    if (/🟡\s+CustomMediaSelectionScheme/.test(text)) return;
    if (/🟡\s*\)\s*\}\s*$/.test(text)) return;
    if (/SafeAreaView has been deprecated/.test(text)) return;
    if (/InteractionManager has been deprecated/.test(text)) return;
    if (/\[Reanimated\] Property "opacity" of AnimatedComponent/.test(text)) return;

    return origWarn.apply(console, args);
  };
})();
