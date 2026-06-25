const moduleName = 'cookieGardenHelper';
const modName = 'Cookie Garden Helper';
const enableStartupLogging = false;

if (!window.cookieGardenHelperDiagnostics) {
  window.cookieGardenHelperDiagnostics = {
    sourceEvaluations: 0,
    initCalls: 0,
    starts: 0,
    initialized: false,
    timerId: null,
    loggingEnabled: enableStartupLogging,
  };
} else if (typeof window.cookieGardenHelperDiagnostics.loggingEnabled === 'undefined') {
  window.cookieGardenHelperDiagnostics.loggingEnabled = enableStartupLogging;
}
const diagnostics = window.cookieGardenHelperDiagnostics;
diagnostics.sourceEvaluations += 1;

const log = (event, details = {}) => {
  if (!diagnostics.loggingEnabled) return;

  console.log(`[${modName}] ${event}`, {
    ...details,
    sourceEvaluations: diagnostics.sourceEvaluations,
    initCalls: diagnostics.initCalls,
    starts: diagnostics.starts,
    at: new Date().toISOString(),
  });
};

log('source evaluated', {
  href: window.location && window.location.href,
  gameReady: typeof Game !== 'undefined' && Game.ready,
});

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1);
const uncapitalize = word => word.charAt(0).toLowerCase() + word.slice(1);
const clone = x => JSON.parse(JSON.stringify(x));
const doc = {
  elId: document.getElementById.bind(document),
  qSel: document.querySelector.bind(document),
  qSelAll: document.querySelectorAll.bind(document),
};
