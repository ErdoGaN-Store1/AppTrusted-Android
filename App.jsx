import { useEffect, useRef, useState } from 'react';
import {
  BadgeCheck, Camera, Check, CheckCircle2, ChevronLeft, CircleHelp, Crown,
  LogIn, LogOut, MessageCircle, Send, ShieldCheck, ShoppingBag, Store,
  UserRound, Users, X, ImagePlus, LockKeyhole, LoaderCircle, Sparkles
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
`;
const ROOMS = [
  { id: 'orders', label: 'الطلبات', icon: ShoppingBag, hint: 'طلبات التجار واحتياجاتهم' },
  { id: 'sales', label: 'البيع', icon: Store, hint: 'العروض والمنتجات المتاحة' }
];

function Brand({ compact = false }) {
  return <><style>{PREMIUM_CSS}</style><div className={`brand-lockup ${compact ? 'compact' : ''}`} aria-label="App Trusted Erdogan">
    <div className="brand-e">AT</div>
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
      <div className="splash-e">AT</div>
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
  const [profiles, setProfiles] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [myVerification, setMyVerification] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
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
      setProfile(data || null);
      setEditName(data?.display_name || '');
      setEditBio(data?.bio || '');
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [session]);

  const activeRoomRef = useRef(tab);
  useEffect(() => { activeRoomRef.current = tab; }, [tab]);

  useEffect(() => {
    if (!supabase || !session || !isActive || !['orders', 'sales'].includes(tab)) return;
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
    if (!supabase || !['orders', 'sales'].includes(room)) return;
    const { data, error } = await supabase.from('group_messages')
      .select('id, room, body, created_at, sender_id, profiles(display_name, avatar_url, verified)')
      .eq('room', room).order('created_at', { ascending: true }).limit(300);
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

  async function sendMessage(e) {
    e.preventDefault();
    if (!supabase || !session || !isActive || !messageText.trim()) return;
    const body = messageText.trim();
    setMessageText('');
    const { error } = await supabase.from('group_messages').insert({
      room: tab, body, sender_id: session.user.id
    });
    if (error) {
      setMessageText(body);
      setNotice(`لم تُرسل الرسالة: ${error.message}`);
    } else {
      await loadMessages(tab);
    }
  }

  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !session) return;
    if (!file.type.startsWith('image/')) return setNotice('اختار صورة فقط.');
    if (file.size > 4 * 1024 * 1024) return setNotice('حجم الصورة لازم يكون أقل من 4 ميجابايت.');
    setAvatarBusy(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${session.user.id}/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) { setNotice(`تعذر رفع الصورة: ${uploadError.message}`); setAvatarBusy(false); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const { error } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id);
    if (error) setNotice(`تم رفع الصورة لكن تعذر حفظها: ${error.message}`);
    else setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
    setAvatarBusy(false);
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
      <h1>{authMode === 'login' ? 'أهلاً بعودتك' : 'طلب حساب تاجر'}</h1>
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
        {authMode === 'login' ? <>لسه معندكش حساب؟ <button onClick={() => {setAuthMode('signup');setMode('trader');}} type="button">اطلب حساب تاجر</button></> :
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
        <span className="header-name">{profile?.display_name || 'تاجر'}{profile?.verified && <BadgeCheck size={14} className="verified-icon"/>}{isOwner && <Crown size={13}/>}</span>
        <button className="glass-icon" onClick={logout} title="تسجيل الخروج"><LogOut size={17}/></button>
      </div>
    </header>

    <main className="app-main">
      <section className="welcome-strip glass">
        <div><span className="eyebrow"><span className="live-dot"/> ONLINE TRADERS NETWORK</span><h1>أهلاً، {profile?.display_name || 'تاجر'}</h1><p>مساحتك الخاصة للتواصل وتبادل الطلبات والعروض.</p></div>
        <div className="welcome-seal"><ShieldCheck size={25}/><span>APP TRUSTED</span><small>ERDOGAN 🇪🇬</small></div>
      </section>

      {notice && <div className="notice-bar"><CircleHelp size={16}/><span>{notice}</span><button onClick={() => setNotice('')}><X size={15}/></button></div>}

      <div className="room-tabs">
        {ROOMS.map(room => { const Icon = room.icon; return <button key={room.id} className={tab === room.id ? 'active' : ''} onClick={() => setTab(room.id)}><Icon size={18}/><span>{room.label}</span><small>{room.hint}</small></button>; })}
      </div>

      {(tab === 'orders' || tab === 'sales') && <section className="chat-card glass">
        <div className="chat-heading"><div><span className="live-dot"/><h2>{tab === 'orders' ? 'شات الطلبات' : 'شات البيع'}</h2><p>رسائل مباشرة محفوظة في قاعدة البيانات</p></div><span className="online-pill"><span className="live-dot"/> مباشر</span></div>
        <div className="messages-list">
          {messages.length === 0 && <div className="empty-chat"><MessageCircle size={29}/><strong>ابدأ المحادثة</strong><span>أول رسالة هنا هتظهر لكل التجار المفعّلين في نفس الشات.</span></div>}
          {messages.map(m => <article className={`message ${m.sender_id === session.user.id ? 'mine' : ''}`} key={m.id}>
            <div className="message-avatar">{m.profiles?.avatar_url ? <img src={m.profiles.avatar_url} alt="" /> : (m.profiles?.display_name || 'ت').slice(0,1)}</div>
            <div className="message-content"><div className="message-meta"><strong>{m.profiles?.display_name || 'تاجر'} {m.profiles?.verified && <BadgeCheck size={14} className="verified-icon"/>}</strong><time>{new Date(m.created_at).toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'})}</time></div><p>{m.body}</p></div>
          </article>)}
          <div ref={bottomRef} />
        </div>
        <form className="send-form" onSubmit={sendMessage}><input value={messageText} onChange={e => setMessageText(e.target.value)} maxLength={4000} placeholder={tab === 'orders' ? 'اكتب طلبك هنا...' : 'اكتب عرض البيع هنا...'} /><button className="send-button" disabled={!messageText.trim()} aria-label="إرسال"><Send size={19}/></button></form>
        <div className="retention-note">الرسائل محفوظة حتى تحذفها الإدارة يدويًا. لا توجد عملية حذف أسبوعية مفعّلة.</div>
      </section>}

      {tab === 'profile' && <section className="profile-card glass">
        <div className="profile-cover"><div className="profile-avatar">{profile?.avatar_url ? <img src={profile.avatar_url} alt="الصورة الشخصية"/> : <UserRound size={38}/>}</div>
          <label className="camera-button" title="تغيير الصورة">{avatarBusy ? <LoaderCircle className="spin"/> : <Camera size={17}/>}<input type="file" accept="image/*" onChange={uploadAvatar} hidden /></label>
        </div>
        <div className="profile-body"><span className="eyebrow">YOUR PROFILE</span><h2>{profile?.display_name || 'حسابي'} {profile?.verified && <BadgeCheck className="verified-icon"/>}</h2><p className="muted">{isOwner ? 'المالك' : profile?.verified ? 'تاجر موثق' : 'تاجر'} · {profile?.verified ? 'حساب موثّق' : 'غير موثّق'}</p>
          <form onSubmit={saveProfile} className="profile-form"><label>الاسم<input value={editName} onChange={e => setEditName(e.target.value)} maxLength={80} required /></label><label>نبذة عنك<textarea value={editBio} onChange={e => setEditBio(e.target.value)} maxLength={500} placeholder="اكتب نبذة بسيطة عن نشاطك التجاري" /></label><button className="btn-primary"><Check size={17}/> حفظ التعديلات</button></form>
          {!isOwner && !profile?.verified && <button className="btn-secondary verify-request" onClick={requestVerification}><BadgeCheck size={17}/> طلب توثيق الحساب</button>}
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
        <button className={['orders', 'sales'].includes(tab) ? 'active' : ''} onClick={() => setTab('orders')}><MessageCircle/><span>Chat</span></button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}><UserRound/><span>Profile</span></button>
        {isOwner && <button className={tab === 'owner' ? 'active' : ''} onClick={() => {setTab('owner');loadOwnerData();}}><Crown/><span>المالك</span></button>}
      </nav>
    </main>
  </div>;
}