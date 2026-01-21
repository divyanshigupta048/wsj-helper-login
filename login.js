const SUPABASE_URL = "https://ignsoydnuninobhqjjnc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XixBaV9m2XestJ4Utiy_NQ_zZqtDvfG";
const EXTENSION_ID = "mlinkgnfcfkjddkalhcankomocndolpc";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

const loginButton = document.getElementById("login");

function sendSessionToExtension(session) {
  if (!window.chrome?.runtime?.sendMessage) {
    return;
  }
  window.chrome.runtime.sendMessage(
    EXTENSION_ID,
    { type: "SUPABASE_SESSION", session },
    () => {}
  );
}

loginButton.addEventListener("click", async () => {
  await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.href
    }
  });
});

client.auth.onAuthStateChange((_event, session) => {
  if (session) {
    sendSessionToExtension(session);
  }
});

client.auth.getSession().then(({ data }) => {
  if (data?.session) {
    sendSessionToExtension(data.session);
  }
});
