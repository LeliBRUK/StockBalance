// Sign-in and shared data for the self-hosted version. Talks to the home server's API (/api/stock)
// in place of Firebase. The server holds the one true copy of the data; this browser keeps a cached copy.
(() => {
  const API = "/api/stock", KEY = "stockbalance.v1";
  const SB = window.SB = window.SB || {};
  const onLoginPage = /\/login(\.html)?$/.test(location.pathname);
  const show = () => { document.documentElement.style.display = ""; };
  const status = (t, bad) => { if (SB.status) SB.status(t, bad); };
  const local = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const call = (path, opt = {}) => fetch(API + path, {
    credentials: "same-origin", cache: "no-store",
    headers: opt.body ? { "Content-Type": "application/json" } : {}, ...opt
  });
  const loaded = v => { const f = SB.done || window.SBdone; if (f) f(v); };

  SB.signIn = async (user, pw, keep) => {
    try {
      const r = await call("/login", { method: "POST", body: JSON.stringify({ username: user, password: pw, keep: !!keep }) });
      if (r.ok) return { ok: true };
      if (r.status === 401) return { ok: false, msg: "That username or password isn't right. Try again." };
      if (r.status === 429) return { ok: false, msg: "Too many wrong passwords. Wait 15 minutes and try again." };
      return { ok: false, msg: "The server couldn't sign you in. Try again in a moment." };
    } catch (e) {
      return { ok: false, msg: "Can't reach the server. Check your connection and try again." };
    }
  };

  if (onLoginPage) {
    call("/me").then(r => { if (r.ok) location.replace("./"); }).catch(() => {});
    loaded(true);
    return;
  }

  let rev = null, synced = null, ready = false, dirty = false, busy = false, timer = null;

  // Called by the pages every time they save.
  SB.push = () => {
    if (!ready) return;                 // nothing goes up until the server's copy has been read once
    const cur = local();
    if (!cur || cur === synced) return;
    dirty = true;
    status("Saving…");
    clearTimeout(timer); timer = setTimeout(flush, 400);
  };

  async function flush() {
    if (busy) { timer = setTimeout(flush, 300); return; }
    const cur = local();
    if (!cur || cur === synced) { dirty = false; status("Saved to your server"); return; }
    busy = true;
    try {
      const r = await call("/state", { method: "PUT", body: JSON.stringify({ data: JSON.parse(cur) }) });
      if (r.status === 401) { location.replace("login"); return; }
      if (!r.ok) throw new Error(r.status);
      rev = (await r.json()).rev; synced = cur;
      dirty = local() !== synced;
      if (dirty) timer = setTimeout(flush, 400); else status("Saved to your server");
    } catch (e) {
      status("Not saved to the server yet. Retrying…", true);
      timer = setTimeout(flush, 5000);
    } finally { busy = false; }
  }

  async function pull() {
    if (busy || dirty) return;
    const first = !ready;
    try {
      const r = await call("/state");
      if (r.status === 401) { location.replace("login"); return; }
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      if (!first && (busy || dirty)) return;   // something changed here while we were asking
      ready = true; show();
      if (j.data == null) { if (first) SB.push(); }            // empty server: this browser's data becomes the shared copy
      else if (j.rev !== rev) {
        rev = j.rev; synced = JSON.stringify(JSON.parse(j.data));
        try { localStorage.setItem(KEY, synced); } catch (e) {}
        if (SB.onRemote) SB.onRemote();                        // page reloads its data; today's usage drop is pushed back if needed
      }
      if (!dirty) status("Saved to your server");
    } catch (e) {
      show();
      status(first ? "Can't reach the server. Changes made now will not be kept." : "Server unreachable. Retrying…", true);
    }
  }

  document.addEventListener("click", async e => {
    if (e.target.id !== "signout") return;
    try { await call("/logout", { method: "POST" }); } catch (x) {}
    location.href = "login";
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) pull(); });
  setInterval(pull, 8000);
  pull().then(() => loaded(true));
})();
