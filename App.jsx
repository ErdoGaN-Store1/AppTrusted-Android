import { useEffect, useRef, useState } from 'react';
import {
  BadgeCheck, Camera, Check, CheckCircle2, ChevronLeft, CircleHelp, Crown,
  LogIn, LogOut, MessageCircle, Send, ShieldCheck, ShoppingBag, Store,
  UserRound, Users, X, ImagePlus, LockKeyhole, LoaderCircle, Sparkles, Smile, Mic, Square, Play, Trash2
} from 'lucide-react';
import { supabase } from './supabase.js';

const WHATSAPP_NUMBER = '201091902522'; // رقم واتساب المالك بصيغة دولية بدون + أو مسافات
/* Up Trasid / App Trusted visual refresh: CSS is embedded so only App.jsx needs replacing. */
const PREMIUM_CSS = `
:root{--premium-bg:#090910;--premium-panel:#15151f;--premium-line:rgba(255,255,255,.09);--premium-violet:#7957f5;--premium-red:#fa3157;--premium-text:#f6f5fb;--premium-muted:#a3a1b4}
.app-shell{background:radial-gradient(ellipse at 50% -15%,#28183d 0%,#101019 42%,#08080d 100%)!important;color:var(--premium-text)!important;padding-bottom:108px!important;min-height:100dvh}
.app-shell .app-header{background:rgba(17,17,27,.88)!important;border-bottom:1px solid var(--premium-line)!important;backdrop-filter:blur(18px);height:72px!important}
.brand-lockup{gap:10px!important}.brand-e{background:linear-gradient(145deg,#ff4569,#7957f5)!important;border:1px solid #ffffff35!important;box-shadow:0 5px 24px #7957f544!important;border-radius:15px!important}.brand-word strong{font-size:20px!important;letter-spacing:.2px!important}.brand-word span{font-size:9px!important;letter-spacing:2px!important;color:#b9aaff!important}
.splash{background:radial-gradient(ellipse at 50% 35%,#322047 0%,#0b0b12 58%,#050507 100%)!important}.splash-e{background:linear-gradient(145deg,#ff4569,#7957f5)!important;border-radius:25px!important;box-shadow:0 0 55px #7957f566!important}.splash-name{font-size:26px!important}.splash-store{letter-spacing:3px!important;color:#b9aaff!important}
.app-shell .welcome-strip{background:linear-gradient(135deg,rgba(121,87,245,.16),rgba(250,49,87,.07),rgba(255,255,255,.025))!important;border:1px solid var(--premium-line)!important;border-radius:25px!important;box-shadow:0 18px 50px #0003!important}
.app-shell .welcome-strip h1{color:#fff!important}.app-shell .welcome-strip p{color:#b5b2c7!important}.app-shell .welcome-seal{background:linear-gradient(145deg,#261d3e,#17131f)!important;border-color:#8068d8!important;color:#c7baff!important;box-shadow:0 0 30px #7957f52a!important}
.app-shell .room-tabs{display:flex!important;gap:9px!important;margin:16px 0!important}.app-shell .room-tabs button{flex:1;display:flex!important;align-items:center;justify-content:center;gap:8px!important;min-height:48px;padding:12px!important;background:#171720!important;border:1px solid var(--premium-line)!important;border-radius:15px!important;color:#c5c2d3!important;text-align:center!important}.app-shell .room-tabs button span{font-size:12px!important;color:inherit!important}.app-shell .room-tabs button small{display:none!important}.app-shell .room-tabs button svg{color:#b6a5ff!important;grid-row:auto!important}.app-shell .room-tabs button.active{background:linear-gradient(120deg,#7957f5,#5d3bc8)!important;border-color:#a18cff!important;color:#fff!important;box-shadow:0 8px 28px #7957f53d!important}.app-shell .room-tabs button.active svg{color:#fff!important}
.app-shell .chat-card{background:rgba(19,19,29,.96)!important;border:1px solid var(--premium-line)!important;border-radius:25px!important;box-shadow:0 20px 55px #0004!important}.app-shell .chat-heading{background:linear-gradient(100deg,rgba(121,87,245,.13),transparent)!important;border-bottom:1px solid var(--premium-line)!important;padding:20px!important}.app-shell .chat-heading h2{color:#fff!important;font-size:17px!important}.app-shell .messages-list{background:radial-gradient(ellipse at 50% 0%,#1c172b55,transparent 65%)!important;padding:18px!important}.app-shell .message-avatar{border-radius:50%!important;background:linear-gradient(145deg,#7957f5,#302047)!important;border:1px solid #ffffff20!important;cursor:pointer}.app-shell .message-content{background:#20202d!important;border:1px solid #ffffff12!important;border-radius:18px 6px 18px 18px!important;padding:11px 13px!important}.app-shell .message.mine .message-content{background:linear-gradient(135deg,#5936b5,#3c2a70)!important;border-color:#a28aff3b!important;border-radius:6px 18px 18px 18px!important}.app-shell .message-meta strong{color:#f6f3ff!important;font-size:11px!important}.app-shell .message-content p{color:#f2efff!important;font-size:13px!important;line-height:1.9!important}.app-shell .send-form{background:#11111a!important;border-top:1px solid var(--premium-line)!important;padding:14px!important}.app-shell .send-form input{background:#20202c!important;border:1px solid #ffffff14!important;border-radius:17px!important;min-height:46px!important;color:#fff!important}.app-shell .send-button{background:linear-gradient(135deg,#ff4569,#7957f5)!important;border-radius:15px!important;min-height:45px!important;box-shadow:0 7px 20px #7957f544!important}
.app-shell .profile-card{background:#12121b!important;border:1px solid var(--premium-line)!important;border-radius:27px!important;box-shadow:0 20px 60px #0005!important}.app-shell .profile-cover{height:190px!important;background:linear-gradient(120deg,#fa3157 0%,#a52d7d 43%,#6f4cf0 100%)!important;overflow:visible!important}.app-shell .profile-cover:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 80% 15%,#ffffff45,transparent 35%),linear-gradient(0deg,#09091030,transparent);pointer-events:none}.app-shell .profile-avatar{right:24px!important;bottom:-45px!important;width:104px!important;height:104px!important;border:5px solid #12121b!important;border-radius:30px!important;background:#272137!important;box-shadow:0 12px 30px #0006!important;color:#cbbfff!important}.app-shell .camera-button{right:101px!important;bottom:-36px!important;width:35px!important;height:35px!important;border:3px solid #12121b!important;border-radius:12px!important;background:linear-gradient(135deg,#ff4569,#7957f5)!important}.app-shell .profile-body{padding:61px 24px 25px!important}.app-shell .profile-body .eyebrow{color:#b7a5ff!important;letter-spacing:2px!important}.app-shell .profile-body h2{font-size:24px!important;display:flex;align-items:center;flex-wrap:wrap;gap:8px!important;color:#fff!important}.app-shell .profile-body h2 .verified-icon,.app-shell .verified-icon{color:#35a7ff!important;filter:drop-shadow(0 0 5px #35a7ff35)}.app-shell .profile-body .muted{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border:1px solid #7957f555;border-radius:20px;background:#7957f518;color:#c9bcff!important;font-size:11px!important}.app-shell .profile-form{margin-top:20px!important;gap:14px!important}.app-shell .profile-form label{color:#e8e5f4!important}.app-shell .profile-form input,.app-shell .profile-form textarea{background:#1b1b27!important;border:1px solid #ffffff16!important;border-radius:14px!important;color:#fff!important;padding:13px!important}.app-shell .profile-form input:focus,.app-shell .profile-form textarea:focus{border-color:#8c73ff!important;outline:none!important;box-shadow:0 0 0 3px #7957f51f!important}.app-shell .btn-primary{background:linear-gradient(120deg,#fa3157,#7957f5)!important;border-radius:14px!important;box-shadow:0 8px 25px #7957f52b!important}.app-shell .btn-secondary{background:#20202c!important;border:1px solid #ffffff16!important;border-radius:13px!important;color:#e9e4ff!important}.app-shell .verify-request{display:flex;align-items:center;justify-content:center;gap:8px;width:100%!important}.app-shell .disclaimer{color:#a3a1b4!important;line-height:1.9!important}
.app-shell .bottom-dock{width:min(calc(100% - 28px),430px)!important;height:72px!important;bottom:max(12px,env(safe-area-inset-bottom))!important;border-radius:24px!important;background:rgba(21,20,32,.92)!important;border:1px solid #ffffff1a!important;box-shadow:0 15px 50px #0009,0 0 25px #7957f51a!important;backdrop-filter:blur(20px)}.app-shell .bottom-dock button{width:48%!important;height:56px!important;flex-direction:row!important;gap:9px!important;border-radius:17px!important;font-size:12px!important;color:#a6a2b8!important}.app-shell .bottom-dock button svg{width:21px!important;height:21px!important}.app-shell .bottom-dock button.active{color:#fff!important;background:linear-gradient(120deg,#7957f5,#5d3bc8)!important;border-color:#a18cff45!important;box-shadow:0 6px 24px #7957f53d!important}
@media(max-width:520px){.app-shell .app-main{width:calc(100% - 22px)!important;margin:13px auto!important}.app-shell .welcome-strip{padding:16px!important;border-radius:21px!important}.app-shell .welcome-strip h1{font-size:19px!important}.app-shell .welcome-seal{width:64px!important;height:64px!important}.app-shell .profile-cover{height:165px!important}.app-shell .profile-body{padding:59px 17px 21px!important}.app-shell .profile-body h2{font-size:21px!important}.app-shell .messages-list{height:52vh!important;min-height:250px!important}.app-shell .bottom-dock{width:calc(100% - 24px)!important}}
/* Chat-first layout */
.app-shell .welcome-strip,.app-shell .room-tabs{display:none!important}
.app-shell .app-main{margin-top:12px!important}
.app-shell .chat-heading{display:flex;align-items:center;justify-content:space-between;gap:10px}
.app-shell .chat-heading p,.app-shell .chat-heading .live-dot,.app-shell .online-pill{display:none!important}
.app-shell .messages-list{display:flex;flex-direction:column;direction:ltr;overflow-y:auto;overscroll-behavior:contain}
.app-shell .message{display:flex;align-items:flex-end;direction:ltr;max-width:88%;align-self:flex-end;flex-direction:row-reverse}
.app-shell .message .message-content{direction:rtl;text-align:right}
.app-shell .message.mine{align-self:flex-start;flex-direction:row}
.app-shell .message-photo{display:block;max-width:min(100%,260px);max-height:300px;border-radius:12px;object-fit:cover}
.app-shell .composer-tools{display:flex;align-items:center;gap:7px;padding:9px 11px 0;background:#100d17}
.app-shell .composer-tool{display:grid;place-items:center;width:36px;height:36px;border:1px solid #ffffff12;border-radius:50%;background:#211a2b;color:#e6d8ff}
.app-shell .emoji-panel{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:5px;padding:10px;background:#191421;border-top:1px solid #ffffff12;max-height:180px;overflow:auto}
.app-shell .emoji-panel button{font-size:23px;line-height:1.3;padding:3px;border:0;border-radius:8px;background:transparent}
.app-shell .send-form{display:flex;align-items:center}
.app-shell .send-form input{direction:rtl;text-align:right;min-width:0;flex:1}
.app-shell .brand-e{display:grid;place-items:center;font-size:0!important;transform:none!important}
.app-shell .splash-e{display:grid;place-items:center;width:100px;height:100px;border-radius:30px;font-size:0!important}
.app-shell .splash-e svg{width:58px;height:58px}
.auth-screen,.status-screen{background:radial-gradient(ellipse at 50% 10%,#322047 0%,#100d18 45%,#07060b 100%)!important}
.auth-panel,.status-card{background:linear-gradient(150deg,rgba(27,21,37,.97),rgba(13,11,18,.98))!important;border:1px solid #ffffff13!important;border-radius:27px!important;box-shadow:0 24px 75px #0008,0 0 40px #8b5cf51c!important}
.brand-e{background:linear-gradient(145deg,#fb7185,#9b5de5 62%,#5b42c7)!important;border:1px solid #ffffff24!important;box-shadow:0 7px 28px #9b5de544!important}
.brand-word strong{color:#fff!important}.brand-word span{color:#c4b5fd!important}
.auth-panel h1,.status-card h1{color:#fff!important}.auth-description,.privacy-note{color:#aaa1ba!important}
.auth-form input{background:#100d17!important;border-color:#393044!important;border-radius:13px!important;color:#fff!important}
.role-tabs button.selected{background:linear-gradient(135deg,#39234f,#241631)!important;border-color:#a56bce!important}
.auth-panel .btn-primary{background:linear-gradient(110deg,#fb7185,#a855d8 62%,#7154e8)!important;border-radius:14px!important}
.owner-chat-tag,.media-status{display:inline-flex;align-items:center;gap:5px;color:#c4b5fd;font-size:10px}
@media(max-width:520px){.app-shell .message{max-width:94%}.app-shell .emoji-panel{grid-template-columns:repeat(7,minmax(0,1fr))}.app-shell .chat-card{min-height:calc(100dvh - 170px)}.app-shell .messages-list{height:calc(100dvh - 340px);min-height:240px}}
.app-shell .profile-cover{position:relative!important}
.app-shell .profile-avatar{right:50%!important;transform:translateX(50%)!important;bottom:-48px!important;border-radius:50%!important;width:112px!important;height:112px!important}
.app-shell .camera-button{right:calc(50% - 68px)!important;bottom:-37px!important}
.app-shell .banner-upload{position:absolute;top:12px;left:12px;z-index:3;display:flex;align-items:center;gap:6px;background:#11111acc;border:1px solid #ffffff30;color:white;border-radius:12px;padding:9px 11px;font-size:12px;cursor:pointer}
.app-shell .profile-socials{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.app-shell .social-chip{display:inline-flex;align-items:center;gap:7px;border-radius:13px;padding:9px 12px;text-decoration:none;color:white!important;font-size:12px;border:1px solid #ffffff20}
.app-shell .social-editor{display:grid;grid-template-columns:1fr;gap:9px;padding:14px;margin-top:12px;background:#1b1825;border:1px solid #ffffff14;border-radius:16px}
.app-shell .social-editor input,.app-shell .social-editor select{width:100%;padding:11px;border-radius:11px;background:#100d17;color:#fff;border:1px solid #393044}
.app-shell .social-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.app-shell .audio-player{width:220px;max-width:100%;height:38px}
.app-shell .recording-dot{color:#ff5475!important}
@media(max-width:520px){.app-shell .profile-avatar{width:98px!important;height:98px!important;bottom:-43px!important}.app-shell .camera-button{right:calc(50% - 61px)!important;bottom:-34px!important}.app-shell .profile-body{padding-top:59px!important}}

`;
const ROOMS = [
  // Keep existing room key to preserve messages already stored in Supabase.
  { id: 'orders', label: 'شات تجار ترستد', icon: MessageCircle, hint: 'المحادثة الجماعية' }
];
const CHAT_EMOJIS = '😀 😃 😄 😁 😆 😅 😂 🤣 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😋 😛 😜 🤪 🤔 🫡 🤨 😎 🥳 😏 😢 😭 😤 😡 🤯 😱 🥶 🥵 🤗 🫶 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 💔 💯 🔥 ✨ ⭐ 🌟 💫 🎉 🎊 🙏 👍 👎 👌 ✌️ 🤝 👏 💪 🫰 👀 💸 💵 🛒 📦 🚀 🏆 ✅ ❌ ⚡ 🎮 🎧 📱 💻 🧠 🐱 🐶 🌹 🌷 🌍 ☕ 🍕 🍔 🍟 🍓 🍉'.split(' ');

function Brand({ compact = false }) {
  return <><style>{PREMIUM_CSS}</style><div className={`brand-lockup ${compact ? 'compact' : ''}`} aria-label="App Trusted Erdogan">
    <div className="brand-e"><ShieldCheck size={compact ? 23 : 29} strokeWidth={2.4}/></div>
    <div className="brand-word"><strong>App Trusted</strong><span>ERDOGAN 🇪🇬</span></div>
  </div></>;
}

function Splash({ done }) {
  useEffect(() => {
    const timer = setTimeout(done, 2900);
    return () => clearTimeout(timer);
  }, [done]);
  return <div className="splash">
    <div className="splash-orbit orbit-one" /><div className="splash-orbit orbit-two" />
    <div className="splash-center">
      <div className="splash-e"><ShieldCheck size={58} strokeWidth={2.1}/></div>
      <div className="splash-name">App Trusted</div>
      <div className="splash-store">ERDOGAN 🇪🇬</div>
      <div className="splash-line" />
    </div>
    <span className="splash-caption">PRIVATE TRADERS NETWORK</span>
  </div>;
}

export default function App() {
  const [splash, setSplash] = useState(!sessionStorage.getItem('erdogan-splash-seen'));
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState('trader');
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('orders');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [myVerification, setMyVerification] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [bannerBusy, setBannerBusy] = useState(false);
  const [socialEditorOpen, setSocialEditorOpen] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState('WhatsApp');
  const [socialValue, setSocialValue] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const bottomRef = useRef(null);
  const configured = Boolean(supabase);
  const isOwner = profile?.role === 'owner' && profile?.status === 'active';
  const isActive = profile?.status === 'active';

  const finishSplash = () => {
    sessionStorage.setItem('erdogan-splash-seen', '1');
    setSplash(false);
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      if (!supabase || !session?.user) { setProfile(null); return; }
      const { data, error } = await supabase.from('profiles')
        .select('id, display_name, role, status, verified, avatar_url, bio, created_at')
        .eq('id', session.user.id).maybeSingle();
      if (cancelled) return;
      if (error) setNotice(`تعذر تحميل الحساب: ${error.message}`);
      const metadata = session.user.user_metadata || {};
      const mergedProfile = data ? { ...data, banner_url: metadata.banner_url || '', social_links: Array.isArray(metadata.social_links) ? metadata.social_links : [] } : null;
      setProfile(mergedProfile);
      setSocialLinks(mergedProfile?.social_links || []);
      setEditName(data?.display_name || '');
      setEditBio(data?.bio || '');
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [session]);

  const activeRoomRef = useRef(tab);
  useEffect(() => { activeRoomRef.current = tab; }, [tab]);

  useEffect(() => {
    if (!supabase || !session || !isActive || tab !== 'orders') return;
    let disposed = false;
    const refresh = () => { if (!disposed) loadMessages(tab); };
    refresh();
    // Poll as a fallback so messages still appear if Realtime is not enabled in Supabase.
    const poll = setInterval(refresh, 3000);
    const channel = supabase.channel(`room-${tab}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_messages', filter: `room=eq.${tab}` }, refresh)
      .subscribe();
    return () => {
      disposed = true;
      clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [session, isActive, tab]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages]);

  useEffect(() => {
    if (!supabase || !isOwner) return;
    loadOwnerData();
  }, [session, isOwner]);

  async function loadMessages(room = tab) {
    if (!supabase || room !== 'orders') return;
    const { data, error } = await supabase.from('group_messages')
      .select('id, room, body, created_at, sender_id, profiles(display_name, avatar_url, verified)')
      .in('room', ['orders', 'sales']).order('created_at', { ascending: true }).limit(500);
    if (error) {
      if (activeRoomRef.current === room) setNotice(`تعذر تحميل الشات: ${error.message}`);
    } else if (activeRoomRef.current === room) {
      setMessages(data || []);
    }
  }

  async function loadOwnerData() {
    if (!supabase || !isOwner) return;
    // Fetch profiles and requests separately: the embedded profiles join is ambiguous
    // because verification_requests has more than one relationship to profiles.
    const [p, v] = await Promise.all([
      supabase.from('profiles').select('id, display_name, role, status, verified, created_at, avatar_url').order('created_at', { ascending: false }),
      supabase.from('verification_requests').select('id, user_id, note, status, created_at').eq('status', 'pending').order('created_at', { ascending: false })
    ]);
    if (p.error) setNotice(`تعذر تحميل طلبات التجار: ${p.error.message}`);
    else setProfiles(p.data || []);
    if (v.error) {
      setNotice(`تعذر تحميل طلبات التوثيق: ${v.error.message}`);
      setVerificationRequests([]);
    } else {
      const profileById = new Map((p.data || []).map(item => [item.id, item]));
      setVerificationRequests((v.data || []).map(req => ({ ...req, profiles: profileById.get(req.user_id) || null })));
    }
  }

  async function submitAuth(e) {
    e.preventDefault();
    if (loading) return;
    if (!supabase) {
      setNotice('قاعدة البيانات غير متصلة. راجع إعدادات Supabase في GitHub Actions.');
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setNotice('اكتب البريد الإلكتروني وكلمة المرور أولًا.');
      return;
    }

    setLoading(true);
    setNotice('جارٍ التحقق من بيانات الدخول...');
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { display_name: displayName.trim() } }
        });
        if (error) throw error;
        setNotice('وصل طلبك. الحساب سيظل قيد المراجعة حتى يوافق المالك. راجع بريدك لو طُلب تأكيده.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) throw error;

        // Verify the selected role after authentication; never trust the UI selection alone.
        const { data: account, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, status')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          await supabase.auth.signOut();
          throw new Error(`تم تسجيل الدخول لكن تعذر قراءة ملف الحساب: ${profileError.message}`);
        }
        if (!account) {
          await supabase.auth.signOut();
          throw new Error('تم تسجيل الدخول لكن ملف الحساب غير موجود في profiles. راجع إعداد قاعدة البيانات.');
        }
        if (mode === 'owner' && !(account.role === 'owner' && account.status === 'active')) {
          await supabase.auth.signOut();
          throw new Error('الحساب ده مش مالك نشط. تأكد من role = owner وstatus = active.');
        }
        if (mode === 'trader' && account.role !== 'trader') {
          await supabase.auth.signOut();
          throw new Error('اختار «دخول المالك» لهذا الحساب.');
        }
        setNotice('تم التحقق من الحساب. جارٍ فتح الموقع...');
      }
    } catch (err) {
      setNotice(`تعذر إكمال العملية: ${err?.message || 'خطأ غير معروف'}`);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null); setProfile(null); setMessages([]); setTab('orders');
  }

  async function insertChatBody(body) {
    if (!supabase || !session || !isActive || !body) return false;
    const { error } = await supabase.from('group_messages').insert({ room: 'orders', body, sender_id: session.user.id });
    if (error) { setNotice(`لم تُرسل الرسالة: ${error.message}`); return false; }
    await loadMessages('orders');
    return true;
  }

  async function sendMessage(e) {
    e.preventDefault();
    const body = messageText.trim();
    if (!body) return;
    setMessageText('');
    const sent = await insertChatBody(body);
    if (!sent) setMessageText(body);
  }

  function addEmoji(emoji) { setMessageText(value => `${value}${emoji}`); }

  async function uploadBanner(e) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file || !supabase || !session) return;
    if (!file.type.startsWith('image/')) return setNotice('اختار صورة بانر فقط.');
    if (file.size > 6 * 1024 * 1024) return setNotice('حجم البانر لازم يكون أقل من 6 ميجابايت.');
    setBannerBusy(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${session.user.id}/banner-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const { error: metaError } = await supabase.auth.updateUser({ data: { ...(session.user.user_metadata || {}), banner_url: data.publicUrl } });
      if (metaError) throw metaError;
      setProfile(prev => ({ ...prev, banner_url: data.publicUrl }));
      setNotice('تم تحديث البانر وحفظه في الحساب.');
    } catch (err) {
      setNotice(`تعذر رفع البانر: ${err?.message || 'خطأ غير معروف'}. تأكد من وجود Storage bucket باسم avatars وسياسات الرفع.`);
    } finally { setBannerBusy(false); }
  }

  async function persistSocialLinks(nextLinks) {
    const { error } = await supabase.auth.updateUser({ data: { ...(session.user.user_metadata || {}), social_links: nextLinks } });
    if (error) { setNotice(`تعذر حفظ روابط التواصل: ${error.message}`); return false; }
    setSocialLinks(nextLinks); setProfile(prev => ({ ...prev, social_links: nextLinks })); return true;
  }

  async function addSocialLink() {
    const value = socialValue.trim();
    if (!value) return setNotice('اكتب رابط الحساب أو رقم واتساب أولًا.');
    const links = socialLinks.filter(item => item.platform !== socialPlatform);
    links.push({ platform: socialPlatform, value });
    if (await persistSocialLinks(links)) { setSocialValue(''); setSocialEditorOpen(false); setNotice('تم حفظ وسيلة التواصل.'); }
  }

  async function removeSocialLink(platform) {
    if (await persistSocialLinks(socialLinks.filter(item => item.platform !== platform))) setNotice('تم حذف وسيلة التواصل.');
  }

  async function startVoiceRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return setNotice('تسجيل الصوت غير مدعوم في المتصفح ده. افتح الموقع من متصفح حديث وباتصال آمن HTTPS.');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      const chunks = [];
      recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop()); streamRef.current = null; setRecording(false);
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        if (!blob.size) return setNotice('التسجيل الصوتي فارغ، جرّب مرة تانية.');
        if (blob.size > 12 * 1024 * 1024) return setNotice('التسجيل طويل جدًا؛ سجّل رسالة أقصر من 12 ميجابايت.');
        setMediaBusy(true);
        try {
          const ext = (blob.type.includes('mp4') ? 'm4a' : 'webm');
          const path = `${session.user.id}/voice-${Date.now()}.${ext}`;
          const { error } = await supabase.storage.from('avatars').upload(path, blob, { upsert: false, contentType: blob.type || 'audio/webm' });
          if (error) throw error;
          const { data } = supabase.storage.from('avatars').getPublicUrl(path);
          const sent = await insertChatBody(`__UPTRASID_AUDIO__:${data.publicUrl}`);
          if (sent) setNotice('تم إرسال الرسالة الصوتية.');
        } catch (err) { setNotice(`تعذر إرسال التسجيل: ${err?.message || 'خطأ غير معروف'}. راجع صلاحيات Storage.`); }
        finally { setMediaBusy(false); }
      };
      recorder.start(); setRecording(true); setNotice('التسجيل شغال؛ اضغط الزر الأحمر لإيقافه وإرساله.');
    } catch (err) { setNotice(`لم نقدر نفتح الميكروفون: ${err?.message || 'تأكد من السماح باستخدام الميكروفون.'}`); }
  }

  function stopVoiceRecording() { if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop(); }

  async function uploadChatImage(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !supabase || !session) return;
    if (!file.type.startsWith('image/')) return setNotice('اختار صورة فقط.');
    if (file.size > 5 * 1024 * 1024) return setNotice('حجم الصورة لازم يكون أقل من 5 ميجابايت.');
    setMediaBusy(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${session.user.id}/chat-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const sent = await insertChatBody(`__UPTRASID_IMAGE__:${data.publicUrl}`);
      if (sent) setNotice('تم إرسال الصورة.');
    } catch (err) {
      const detail = err?.message || 'خطأ غير معروف';
      setNotice(`تعذر رفع الصورة: ${detail}. لو ظهرت رسالة bucket أو policy، فالمشكلة في إعدادات Storage في Supabase وليست في شكل الصفحة.`);
    } finally { setMediaBusy(false); }
  }

  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !supabase || !session) return;
    if (!file.type.startsWith('image/')) return setNotice('اختار صورة فقط.');
    if (file.size > 4 * 1024 * 1024) return setNotice('حجم الصورة لازم يكون أقل من 4 ميجابايت.');
    setAvatarBusy(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${session.user.id}/avatar-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const { error } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id);
      if (error) throw error;
      setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
      setNotice('تم تحديث الصورة الشخصية.');
    } catch (err) {
      const detail = err?.message || 'خطأ غير معروف';
      setNotice(`تعذر رفع الصورة: ${detail}. تأكد أن Storage يحتوي bucket باسم avatars وأن صلاحيات الرفع والقراءة والتحديث مضبوطة.`);
    } finally { setAvatarBusy(false); }
  }

  async function saveProfile(e) {
    e.preventDefault();
    const { error } = await supabase.from('profiles').update({
      display_name: editName.trim(), bio: editBio.trim()
    }).eq('id', session.user.id);
    if (error) setNotice(`تعذر حفظ الملف الشخصي: ${error.message}`);
    else { setProfile(prev => ({ ...prev, display_name: editName.trim(), bio: editBio.trim() })); setNotice('تم حفظ الملف الشخصي.'); }
  }

  async function requestVerification() {
    const { error } = await supabase.from('verification_requests').insert({ user_id: session.user.id, note: 'طلب توثيق من الملف الشخصي' });
    if (error) setNotice(`تعذر إرسال طلب التوثيق: ${error.message}`);
    else { setMyVerification(true); setNotice('تم إرسال طلب التوثيق للمالك. التوثيق لا يعني ضمانًا مطلقًا للصفقات.'); }
  }

  async function verifyOwnerSelf() {
    if (!isOwner || !session?.user?.id) return;
    const { error } = await supabase.from('profiles').update({ verified: true }).eq('id', session.user.id);
    if (error) return setNotice(`تعذر توثيق حساب المالك: ${error.message}. قد تحتاج سياسة RLS تسمح للمالك النشط بتحديث verified.`);
    setProfile(prev => ({ ...prev, verified: true }));
    setNotice('تم توثيق حساب المالك.');
    await loadOwnerData();
  }

  async function approveTrader(id) {
    const { error } = await supabase.from('profiles').update({ status: 'active' }).eq('id', id);
    if (error) setNotice(`تعذرت الموافقة: ${error.message}`);
    else { setNotice('تم تفعيل حساب التاجر.'); loadOwnerData(); }
  }
  async function suspendTrader(id) {
    const { error } = await supabase.from('profiles').update({ status: 'suspended' }).eq('id', id);
    if (error) setNotice(`تعذر إيقاف الحساب: ${error.message}`);
    else { setNotice('تم إيقاف الحساب.'); loadOwnerData(); }
  }
  async function reviewVerification(req, approve) {
    const { error: reqError } = await supabase.from('verification_requests').update({
      status: approve ? 'approved' : 'rejected', reviewed_by: session.user.id, reviewed_at: new Date().toISOString()
    }).eq('id', req.id);
    if (reqError) return setNotice(`تعذر مراجعة الطلب: ${reqError.message}`);
    if (approve) {
      const { error } = await supabase.from('profiles').update({ verified: true }).eq('id', req.user_id);
      if (error) return setNotice(`تمت مراجعة الطلب لكن تعذر تحديث التوثيق: ${error.message}`);
    }
    setNotice(approve ? 'تم توثيق الحساب.' : 'تم رفض طلب التوثيق.');
    loadOwnerData();
  }

  const waUrl = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : '';

  if (splash) return <Splash done={finishSplash} />;

  if (!session) return <div className="auth-screen" dir="rtl">
    <div className="auth-glow glow-a" /><div className="auth-glow glow-b" />
    <div className="auth-panel glass">
      <Brand />
      <div className="auth-kicker"><LockKeyhole size={14} /> مساحة خاصة للتجار المعتمدين</div>
      <h1>{authMode === 'login' ? 'أهلاً بعودتك' : 'إنشاء حساب تجاري'}</h1>
      <p className="auth-description">{authMode === 'login' ? 'سجّل دخولك للوصول إلى مجتمع App Trusted.' : 'أنشئ طلبك؛ لن تتمكن من دخول الشات حتى يوافق المالك.'}</p>
      <div className="role-tabs">
        <button className={mode === 'owner' ? 'selected' : ''} onClick={() => setMode('owner')} type="button"><Crown size={17}/> دخول المالك</button>
        <button className={mode === 'trader' ? 'selected' : ''} onClick={() => setMode('trader')} type="button"><Store size={17}/> دخول التاجر</button>
      </div>
      <form onSubmit={submitAuth} className="auth-form">
        {authMode === 'signup' && <label>اسم التاجر<input value={displayName} onChange={e => setDisplayName(e.target.value)} required maxLength={80} placeholder="اسمك أو اسم المتجر" /></label>}
        <label>البريد الإلكتروني<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" placeholder="name@example.com" dir="ltr" /></label>
        <label>كلمة المرور<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} placeholder="8 أحرف على الأقل" dir="ltr" /></label>
        <button type="submit" className="btn-primary wide" disabled={loading}>{loading ? <LoaderCircle className="spin" size={18}/> : authMode === 'login' ? <LogIn size={18}/> : <Users size={18}/>} {loading ? 'لحظة واحدة...' : authMode === 'login' ? `دخول ${mode === 'owner' ? 'المالك' : 'التاجر'}` : 'إرسال طلب الحساب'}</button>
      </form>
      <div className="auth-switch">
        {authMode === 'login' ? <>لسه معندكش حساب؟ <button onClick={() => {setAuthMode('signup');setMode('trader');}} type="button">إنشاء حساب تجاري</button></> :
          <>عندك حساب بالفعل؟ <button onClick={() => setAuthMode('login')} type="button">تسجيل الدخول</button></>}
      </div>
      <div className="whatsapp-help">
        <MessageCircle size={18} />
        <div><strong>لطلب حساب تجاري</strong><span>تواصل مع المالك عبر واتساب</span></div>
        {waUrl ? <a href={waUrl} target="_blank" rel="noreferrer" className="wa-button">واتساب</a> :
          <button className="wa-button" onClick={() => setNotice('أضف رقم واتساب المالك في WHATSAPP_NUMBER أعلى App.jsx.')} type="button">واتساب</button>}
      </div>
      {notice && <div className="inline-notice"><CircleHelp size={16}/>{notice}<button onClick={() => setNotice('')} type="button"><X size={15}/></button></div>}
      {!configured && <div className="inline-notice warning"><CircleHelp size={16}/> قاعدة البيانات غير متصلة. أكمل الإعدادات في SETUP.md.</div>}
      <p className="privacy-note"><ShieldCheck size={14}/> لا يظهر محتوى الموقع قبل تسجيل الدخول.</p>
    </div>
  </div>;

  if (!profile || profile.status === 'pending') return <div className="status-screen" dir="rtl">
    <div className="status-card glass"><div className="status-icon"><ShieldCheck size={30}/></div><Brand compact />
      <h1>طلبك قيد المراجعة</h1><p>حسابك لسه مستني موافقة المالك. الشات والمحتوى مش متاحين قبل التفعيل.</p>
      {notice && <p className="inline-notice">{notice}</p>}
      <button className="btn-secondary" onClick={logout}><LogOut size={17}/> تسجيل الخروج</button>
    </div>
  </div>;

  if (!isActive && !isOwner) return <div className="status-screen" dir="rtl"><div className="status-card glass"><ShieldCheck size={30}/><h1>الحساب غير نشط</h1><p>تواصل مع المالك لمراجعة حالة الحساب.</p><button className="btn-secondary" onClick={logout}>تسجيل الخروج</button></div></div>;

  return <div className="app-shell" dir="rtl">
    <header className="app-header glass">
      <Brand compact />
      <div className="header-user">
        <button className="avatar-button" onClick={() => setTab('profile')} title="الملف الشخصي">
          {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : <UserRound size={19}/>}
        </button>
        <span className="header-name">{profile?.display_name || 'حسابي'}{profile?.verified && <BadgeCheck size={14} className="verified-icon"/>}{isOwner && <Crown size={13}/>}</span>
        <button className="glass-icon" onClick={logout} title="تسجيل الخروج"><LogOut size={17}/></button>
      </div>
    </header>

    <main className="app-main">
      {notice && <div className="notice-bar"><CircleHelp size={16}/><span>{notice}</span><button onClick={() => setNotice('')}><X size={15}/></button></div>}

      {tab === 'orders' && <section className="chat-card glass">
        <div className="chat-heading"><div><h2>شات تجار ترستد</h2><p>المحادثة الجماعية</p></div>{isOwner && <span className="owner-chat-tag"><Crown size={14}/> المالك</span>}</div>
        <div className="messages-list">
          {messages.length === 0 && <div className="empty-chat"><MessageCircle size={29}/><strong>ابدأ المحادثة</strong><span>أول رسالة هنا هتظهر لكل التجار المفعّلين في نفس الشات.</span></div>}
          {messages.map(m => <article className={`message ${m.sender_id === session.user.id ? 'mine' : ''}`} key={m.id}>
            <div className="message-avatar">{m.profiles?.avatar_url ? <img src={m.profiles.avatar_url} alt="" /> : (m.profiles?.display_name || 'ت').slice(0,1)}</div>
            <div className="message-content"><div className="message-meta"><strong>{m.profiles?.display_name || 'تاجر'} {m.profiles?.verified && <BadgeCheck size={14} className="verified-icon"/>}</strong><time>{new Date(m.created_at).toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'})}</time></div>{typeof m.body === 'string' && m.body.startsWith('__UPTRASID_IMAGE__:') ? <a href={m.body.slice('__UPTRASID_IMAGE__:'.length)} target="_blank" rel="noreferrer"><img className="message-photo" src={m.body.slice('__UPTRASID_IMAGE__:'.length)} alt="صورة مرسلة في الشات" loading="lazy"/></a> : typeof m.body === 'string' && m.body.startsWith('__UPTRASID_AUDIO__:') ? <audio className="audio-player" controls preload="metadata" src={m.body.slice('__UPTRASID_AUDIO__:'.length)} /> : <p>{m.body}</p>}</div>
          </article>)}
          <div ref={bottomRef} />
        </div>
        {emojiOpen && <div className="emoji-panel" aria-label="لوحة الإيموجي">{CHAT_EMOJIS.map((emoji, index) => <button type="button" key={`${emoji}-${index}`} onClick={() => addEmoji(emoji)} aria-label={`إضافة ${emoji}`}>{emoji}</button>)}</div>}
        <div className="composer-tools">
          <button className="composer-tool" type="button" onClick={() => setEmojiOpen(value => !value)} title="الإيموجي" aria-label="فتح لوحة الإيموجي"><Smile size={19}/></button>
          <label className="composer-tool" title="إرسال صورة" aria-label="إرسال صورة"><ImagePlus size={19}/><input type="file" accept="image/*" onChange={uploadChatImage} hidden disabled={mediaBusy}/></label>
          <button className={`composer-tool ${recording ? 'recording-dot' : ''}`} type="button" onClick={recording ? stopVoiceRecording : startVoiceRecording} title={recording ? 'إيقاف التسجيل وإرساله' : 'تسجيل رسالة صوتية'} aria-label={recording ? 'إيقاف التسجيل' : 'تسجيل صوت'}>{recording ? <Square size={17} fill="currentColor"/> : <Mic size={19}/>}</button>
          {mediaBusy && <span className="media-status"><LoaderCircle size={14} className="spin"/> جارٍ رفع الملف</span>}
        </div>
        <form className="send-form" onSubmit={sendMessage}><input value={messageText} onChange={e => setMessageText(e.target.value)} maxLength={4000} placeholder="اكتب رسالتك..." /><button className="send-button" disabled={!messageText.trim()} aria-label="إرسال"><Send size={19}/></button></form>
        <div className="retention-note">المحادثة الجماعية · الرسائل محفوظة في قاعدة البيانات.</div>
      </section>}

      {tab === 'profile' && <section className="profile-card glass">
        <div className="profile-cover" style={profile?.banner_url ? {backgroundImage: `linear-gradient(0deg,#09091035,transparent),url(${profile.banner_url})`, backgroundSize:'cover', backgroundPosition:'center'} : undefined}><label className="banner-upload" title="رفع بانر">{bannerBusy ? <LoaderCircle size={15} className="spin"/> : <ImagePlus size={15}/>} {bannerBusy ? 'جارٍ الرفع' : 'إضافة بانر'}<input type="file" accept="image/*" onChange={uploadBanner} hidden disabled={bannerBusy}/></label><div className="profile-avatar">{profile?.avatar_url ? <img src={profile.avatar_url} alt="الصورة الشخصية"/> : <UserRound size={38}/>}</div>
          <label className="camera-button" title="تغيير الصورة">{avatarBusy ? <LoaderCircle className="spin"/> : <Camera size={17}/>}<input type="file" accept="image/*" onChange={uploadAvatar} hidden /></label>
        </div>
        <div className="profile-body"><span className="eyebrow">YOUR PROFILE</span><h2>{profile?.display_name || 'حسابي'} {profile?.verified && <BadgeCheck className="verified-icon"/>}</h2><p className="muted">{isOwner ? 'المالك' : profile?.verified ? 'تاجر موثق' : 'عضو'} · {profile?.verified ? 'حساب موثّق' : 'حساب غير موثّق'}</p>
          <form onSubmit={saveProfile} className="profile-form"><label>الاسم<input value={editName} onChange={e => setEditName(e.target.value)} maxLength={80} required /></label><label>نبذة عنك<textarea value={editBio} onChange={e => setEditBio(e.target.value)} maxLength={500} placeholder="اكتب نبذة بسيطة عن نشاطك التجاري" /></label><button className="btn-primary"><Check size={17}/> حفظ التعديلات</button></form>
          {isOwner && !profile?.verified && <button className="btn-secondary verify-request" onClick={verifyOwnerSelf}><BadgeCheck size={17}/> توثيق حساب المالك</button>}
          {!isOwner && !profile?.verified && <button className="btn-secondary verify-request" onClick={requestVerification}><BadgeCheck size={17}/> طلب توثيق الحساب</button>}
          <div className="profile-socials">{socialLinks.map(link => { const value = link.value || ''; const clean = value.replace(/^@/, ''); const href = value.startsWith('http') ? value : link.platform === 'WhatsApp' ? `https://wa.me/${value.replace(/[^0-9]/g, '')}` : link.platform === 'Telegram' ? `https://t.me/${clean}` : link.platform === 'TikTok' ? `https://www.tiktok.com/@${clean}` : link.platform === 'Facebook' ? `https://www.facebook.com/${clean}` : `https://www.instagram.com/${clean}`; const colors = { WhatsApp:'#168b52', Telegram:'#168fca', TikTok:'#24212d', Facebook:'#1769d2', Instagram:'#a53a9a' }; return <a key={link.platform} className="social-chip" style={{background:colors[link.platform] || '#343044'}} href={href} target="_blank" rel="noreferrer">{link.platform === 'WhatsApp' ? '🟢' : link.platform === 'Telegram' ? '✈️' : link.platform === 'TikTok' ? '♪' : link.platform === 'Facebook' ? 'f' : '◎'} {link.platform}</a>; })}</div>
          <div className="social-editor"><button type="button" className="btn-secondary" onClick={() => setSocialEditorOpen(value => !value)}>{socialEditorOpen ? 'إغلاق' : '＋ إضافة موقع للتواصل'}</button>{socialEditorOpen && <><div className="social-row"><select value={socialPlatform} onChange={e => setSocialPlatform(e.target.value)}><option>WhatsApp</option><option>Telegram</option><option>TikTok</option><option>Facebook</option><option>Instagram</option></select><input value={socialValue} onChange={e => setSocialValue(e.target.value)} placeholder={socialPlatform === 'WhatsApp' ? 'رقم دولي بدون +' : 'رابط حسابك أو اسم المستخدم'} dir="ltr" /></div><button type="button" className="btn-primary" onClick={addSocialLink}>حفظ وسيلة التواصل</button></>}{socialLinks.length > 0 && <div className="social-row">{socialLinks.map(link => <button type="button" key={link.platform} className="btn-secondary" onClick={() => removeSocialLink(link.platform)}><Trash2 size={14}/> حذف {link.platform}</button>)}</div>}</div>
          <p className="disclaimer">التوثيق يوضح أن المالك راجع الحساب فقط، ولا يمثل ضمانًا بنسبة 100% لأي صفقة.</p>
        </div>
      </section>}

      {tab === 'owner' && isOwner && <section className="owner-dashboard glass">
        <div className="dashboard-heading"><div><span className="eyebrow">OWNER CONTROL CENTER</span><h2>إدارة التجار</h2></div><button className="btn-secondary" onClick={loadOwnerData}>تحديث</button></div>
        <h3>طلبات الحسابات ({profiles.filter(p => p.role === 'trader' && p.status === 'pending').length})</h3>
        <div className="owner-list">{profiles.filter(p => p.role === 'trader').map(p => <div className="owner-row" key={p.id}><div><strong>{p.display_name}</strong><small>{p.status} · {p.verified ? 'موثّق' : 'غير موثّق'}</small></div><div className="owner-actions">{p.status === 'pending' ? <button className="mini-approve" onClick={() => approveTrader(p.id)}>قبول</button> : p.status === 'active' ? <button className="mini-reject" onClick={() => suspendTrader(p.id)}>إيقاف</button> : null}</div></div>)}</div>
        <h3>طلبات التوثيق ({verificationRequests.length})</h3>
        <div className="owner-list">{verificationRequests.map(req => <div className="owner-row" key={req.id}><div><strong>{req.profiles?.display_name || 'تاجر'}</strong><small>طلب توثيق · {new Date(req.created_at).toLocaleDateString('ar-EG')}</small></div><div className="owner-actions"><button className="mini-approve" onClick={() => reviewVerification(req, true)}>توثيق</button><button className="mini-reject" onClick={() => reviewVerification(req, false)}>رفض</button></div></div>)}</div>
      </section>}

      <nav className="bottom-dock glass" aria-label="التنقل الرئيسي">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><MessageCircle/><span>Chat</span></button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}><UserRound/><span>Profile</span></button>
        {isOwner && <button className={tab === 'owner' ? 'active' : ''} onClick={() => {setTab('owner');loadOwnerData();}}><Crown/><span>المالك</span></button>}
      </nav>
    </main>
  </div>;
}