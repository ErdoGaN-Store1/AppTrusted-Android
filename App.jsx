import { useEffect, useRef, useState } from 'react';
import {
  BadgeCheck, Camera, Check, CheckCircle2, ChevronLeft, CircleHelp, Crown,
  LogIn, LogOut, MessageCircle, Send, ShieldCheck, ShoppingBag, Store,
  UserRound, Users, X, ImagePlus, LockKeyhole, LoaderCircle, Sparkles
} from 'lucide-react';
import { supabase } from './supabase.js';

const WHATSAPP_NUMBER = '201091902522'; // رقم واتساب المالك بصيغة دولية بدون + أو مسافات
const ROOMS = [
  { id: 'orders', label: 'شات الطلبات', icon: ShoppingBag, hint: 'طلبات التجار واحتياجاتهم' },
  { id: 'sales', label: 'شات البيع', icon: Store, hint: 'العروض والمنتجات المتاحة' }
];

function Brand({ compact = false }) {
  return <div className={`brand-lockup ${compact ? 'compact' : ''}`} aria-label="Erdogan Store">
    <div className="brand-e">E</div>
    <div className="brand-word"><strong>أردغان</strong><span>ERDOGAN STORE</span></div>
  </div>;
}

function Splash({ done }) {
  useEffect(() => {
    const timer = setTimeout(done, 2900);
    return () => clearTimeout(timer);
  }, [done]);
  return <div className="splash">
    <div className="splash-orbit orbit-one" /><div className="splash-orbit orbit-two" />
    <div className="splash-center">
      <div className="splash-e">E</div>
      <div className="splash-name">أردغان</div>
      <div className="splash-store">ERDOGAN STORE</div>
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
      <p className="auth-description">{authMode === 'login' ? 'سجّل دخولك للوصول إلى مجتمع أردغان ستور.' : 'أنشئ طلبك؛ لن تتمكن من دخول الشات حتى يوافق المالك.'}</p>
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
        <span className="header-name">{profile?.display_name || 'تاجر'}{isOwner && <Crown size={13}/>}</span>
        <button className="glass-icon" onClick={logout} title="تسجيل الخروج"><LogOut size={17}/></button>
      </div>
    </header>

    <main className="app-main">
      <section className="welcome-strip glass">
        <div><span className="eyebrow"><span className="live-dot"/> ONLINE TRADERS NETWORK</span><h1>أهلاً، {profile?.display_name || 'تاجر'}</h1><p>مساحتك الخاصة للتواصل وتبادل الطلبات والعروض.</p></div>
        <div className="welcome-seal"><Crown size={25}/><span>ERDOGAN</span><small>STORE</small></div>
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
        <div className="profile-body"><span className="eyebrow">YOUR PROFILE</span><h2>{profile?.display_name || 'حسابي'} {profile?.verified && <BadgeCheck className="verified-icon"/>}</h2><p className="muted">{isOwner ? 'OWNER' : 'TRADER'} · {profile?.verified ? 'حساب موثّق' : 'غير موثّق'}</p>
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

      <nav className="bottom-dock glass">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><ShoppingBag/><span>الطلبات</span></button>
        <button className={tab === 'sales' ? 'active' : ''} onClick={() => setTab('sales')}><Store/><span>البيع</span></button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}><UserRound/><span>حسابي</span></button>
        {isOwner && <button className={tab === 'owner' ? 'active' : ''} onClick={() => {setTab('owner');loadOwnerData();}}><Crown/><span>المالك</span></button>}
      </nav>
    </main>
  </div>;
}