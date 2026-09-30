import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase.js';
import {
  BadgeCheck, Bell, BriefcaseBusiness, Check, CircleHelp, Crown, Globe2,
  Home, LogIn, LogOut, MessageCircle, Moon, Plus, Send, Settings, ShieldAlert,
  ShoppingBag, Store, Sun, UserRound, X
} from 'lucide-react';

const categories = ['الكل', 'طلبات', 'بيع'];
const money = (v) => new Intl.NumberFormat('ar-EG').format(v || 0);

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('home');
  const [filter, setFilter] = useState('الكل');
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [postText, setPostText] = useState('');
  const [postKind, setPostKind] = useState('طلب');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user) { setProfile(null); return; }
    supabase.from('profiles').select('id, display_name, role, status, verified, avatar_url, banner_url')
      .eq('id', session.user.id).maybeSingle()
      .then(({ data, error }) => { if (error) setNotice(error.message); else setProfile(data); });
  }, [session]);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    const load = async () => {
      const { data, error } = await supabase.from('posts')
        .select('id, body, kind, created_at, author_id, profiles(display_name, verified, avatar_url)')
        .eq('status', 'published').order('created_at', { ascending: false }).limit(60);
      if (!alive) return;
      if (error) setNotice('تعذّر تحميل المنشورات: ' + error.message);
      else setPosts(data || []);
    };
    load();
    const channel = supabase.channel('public-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, load)
      .subscribe();
    return () => { alive = false; supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => posts.filter(p =>
    filter === 'الكل' || (filter === 'طلبات' ? p.kind === 'طلب' : p.kind === 'بيع')
  ), [posts, filter]);

  async function login(e) {
    e.preventDefault();
    if (!supabase) return setNotice('أضف بيانات Supabase في ملف .env أولًا.');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setNotice('تعذّر تسجيل الدخول: ' + error.message);
    else { setShowLogin(false); setNotice('تم تسجيل الدخول.'); }
  }

  async function logout() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setNotice(error ? error.message : 'تم تسجيل الخروج.');
    setTab('home');
  }

  async function publish(e) {
    e.preventDefault();
    if (!supabase || !session) return setNotice('سجّل الدخول أولًا لنشر عرض.');
    if (!postText.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('posts').insert({
      body: postText.trim(), kind: postKind, author_id: session.user.id
    });
    setLoading(false);
    if (error) setNotice('لم يتم النشر: ' + error.message);
    else { setPostText(''); setNotice('تم نشر المنشور.'); }
  }

  const configured = Boolean(supabase);
  const isOwner = profile?.role === 'owner' && profile?.status === 'active';

  return <div className={dark ? 'app dark' : 'app light'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
    <header className="topbar">
      <a className="brand" href="#" onClick={e => {e.preventDefault();setTab('home')}}>
        <span className="brand-mark"><Crown size={22}/></span>
        <span><strong>شات أردغان</strong><small>CHAT ERDOGAN <i>OWNER</i></small></span>
      </a>
      <div className="top-actions">
        <button className="icon-btn" title="تغيير المظهر" onClick={() => setDark(!dark)}>{dark ? <Sun/> : <Moon/>}</button>
        <button className="icon-btn" title="اللغة" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}><Globe2/></button>
        {session ? <button className="avatar" title="الحساب" onClick={() => setTab('profile')}>{(profile?.display_name || session.user.email || 'ت').slice(0,1).toUpperCase()}</button> :
          <button className="login-btn" onClick={() => setShowLogin(true)}><LogIn size={17}/> دخول</button>}
      </div>
    </header>

    <main className="shell">
      <section className="hero">
        <div className="hero-glow"/>
        <div className="hero-copy">
          <span className="eyebrow"><span className="pulse"/> مجتمع التجار المتصل</span>
          <h1>أهلاً بيك في <span>شات التجار</span></h1>
          <p>مكان واحد لطلباتك وعروضك ومحادثاتك التجارية — ببساطة ووضوح.</p>
          <div className="hero-tags"><span><Check size={14}/> طلب دولار</span><span><Check size={14}/> بيع حسابات</span><span><Check size={14}/> تخليص شحنات</span></div>
        </div>
        <div className="hero-emblem"><Crown size={44}/><span>ERDOGAN</span><small>TRADERS NETWORK</small></div>
      </section>

      {!configured && <div className="notice warning"><ShieldAlert size={18}/><span>المعاينة جاهزة، لكن قاعدة البيانات غير متصلة. راجع ملف README لإعداد Supabase.</span></div>}
      {notice && <div className="notice"><CircleHelp size={18}/><span>{notice}</span><button onClick={() => setNotice('')}><X size={16}/></button></div>}

      <div className="content-grid">
        <section className="main-column">
          {tab === 'home' || tab === 'chat' ? <>
            <div className="section-heading">
              <div><span className="eyebrow">TRADERS BOARD</span><h2>{tab === 'chat' ? 'شات التجار' : 'آخر الطلبات والعروض'}</h2></div>
              <span className="live-pill"><span className="pulse"/> مباشر</span>
            </div>
            <div className="filter-row">{categories.map(c => <button key={c} className={filter === c ? 'filter active' : 'filter'} onClick={() => setFilter(c)}>{c}</button>)}</div>
            {session && profile?.status === 'active' && <form className="composer card" onSubmit={publish}>
              <div className="composer-title"><span className="avatar">{(profile?.display_name || 'ت').slice(0,1)}</span><div><strong>اكتب عرضك أو طلبك</strong><small>خليك واضح في التفاصيل</small></div></div>
              <div className="kind-switch">{['طلب','بيع'].map(k => <button type="button" key={k} className={postKind === k ? 'selected' : ''} onClick={() => setPostKind(k)}>{k === 'طلب' ? <ShoppingBag size={15}/> : <Store size={15}/>} {k}</button>)}</div>
              <textarea value={postText} onChange={e => setPostText(e.target.value)} maxLength={1500} placeholder="مثال: مطلوب أباجورة بسعر 550 جنيه... ممنوع نشر الروابط."/>
              <div className="composer-footer"><small>{postText.length}/1500</small><button className="primary-btn" disabled={loading || !postText.trim()}><Send size={16}/> نشر</button></div>
            </form>}
            <div className="posts">
              {filtered.length ? filtered.map(p => <article className="post card" key={p.id}>
                <div className="post-top"><div className="avatar">{(p.profiles?.display_name || 'ت').slice(0,1)}</div><div className="post-author"><strong>{p.profiles?.display_name || 'تاجر'}</strong><small>{new Date(p.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</small></div>
                  {p.profiles?.verified && <span className="verified"><BadgeCheck size={15}/> موثّق</span>}<span className={'kind '+(p.kind === 'طلب' ? 'request' : 'sale')}>{p.kind}</span></div>
                <p className="post-body">{p.body}</p>
                <div className="post-footer"><span><MessageCircle size={15}/> تواصل بخصوص العرض</span><button onClick={() => session ? setNotice('المحادثات الخاصة المرتبطة بالعرض ضمن المرحلة التالية من التطوير.') : setShowLogin(true)}>رد على العرض <Send size={14}/></button></div>
              </article>) : <div className="empty card"><MessageCircle size={28}/><strong>لسه مفيش منشورات هنا</strong><span>أول عرض هيبدأ الحركة.</span></div>}
            </div>
          </> : tab === 'profile' ? <section className="card page-card"><span className="eyebrow">YOUR ACCOUNT</span><h2>حسابي</h2>{session ? <><p>{profile?.display_name || session.user.email}</p><p className="muted">الحالة: {profile?.status || 'قيد التحميل'} · الدور: {profile?.role || 'trader'}</p><button className="secondary-btn" onClick={logout}><LogOut size={16}/> تسجيل الخروج</button></> : <><p>سجّل الدخول للوصول لحسابك.</p><button className="primary-btn" onClick={() => setShowLogin(true)}>تسجيل الدخول</button></>}</section> : <section className="card page-card"><span className="eyebrow">PREFERENCES</span><h2>الإعدادات</h2><button className="secondary-btn" onClick={() => setDark(!dark)}>{dark ? <Sun size={16}/> : <Moon size={16}/>} {dark ? 'الوضع الفاتح' : 'الوضع الداكن'}</button><button className="secondary-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}><Globe2 size={16}/> {lang === 'ar' ? 'English' : 'العربية'}</button></section>}
        </section>

        <aside className="side-column">
          <div className="owner-card card"><div className="owner-icon"><Crown size={23}/></div><div><span className="eyebrow">OWNER CONTROL</span><h3>إدارة بأمان</h3></div><p>صلاحيات المالك محفوظة في قاعدة البيانات، مش في واجهة الموقع.</p>{isOwner ? <span className="owner-state"><Check size={14}/> تم التعرف على حساب الأونر</span> : <span className="muted small">لوحة الإدارة الكاملة قيد الإنشاء</span>}</div>
          <div className="rules-card card"><div className="rules-heading"><ShieldAlert size={18}/><h3>قواعد المجتمع</h3></div>{['ممنوع السب أو الشتائم','ممنوع الروابط المخالفة','احترم التجار في النقاش','راجع تفاصيل الصفقة قبل الاتفاق'].map((r,i)=><div className="rule" key={r}><span>{String(i+1).padStart(2,'0')}</span>{r}</div>)}</div>
          <div className="stats card"><div><span>المنشورات المعروضة</span><strong>{money(posts.length)}</strong></div><div><span>نوع الحساب</span><strong>{isOwner ? 'OWNER' : session ? 'TRADER' : 'GUEST'}</strong></div></div>
          <div className="security-note"><ShieldAlert size={17}/><span>لا ترسل كلمة مرورك لأي شخص. إدارة الحسابات تتم من خلال تسجيل دخول آمن.</span></div>
        </aside>
      </div>
    </main>

    <nav className="bottom-nav">
      <button className={tab === 'home' ? 'nav-active' : ''} onClick={() => setTab('home')}><Home/><span>الرئيسية</span></button>
      <button className={tab === 'chat' ? 'nav-active' : ''} onClick={() => setTab('chat')}><MessageCircle/><span>الشات</span></button>
      <button className={tab === 'profile' ? 'nav-active' : ''} onClick={() => setTab('profile')}><UserRound/><span>حسابي</span></button>
      <button className={tab === 'settings' ? 'nav-active' : ''} onClick={() => setTab('settings')}><Settings/><span>الإعدادات</span></button>
    </nav>

    {showLogin && <div className="modal-backdrop" onClick={() => setShowLogin(false)}><form className="login-modal card" onSubmit={login} onClick={e => e.stopPropagation()}>
      <button type="button" className="modal-close icon-btn" onClick={() => setShowLogin(false)}><X/></button>
      <div className="modal-brand"><span className="brand-mark"><Crown/></span><h2>أهلاً بعودتك</h2><p>سجّل دخولك إلى شات أردغان</p></div>
      <label>البريد الإلكتروني<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com"/></label>
      <label>كلمة المرور<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"/></label>
      <button className="primary-btn full" disabled={loading}>{loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'} <LogIn size={17}/></button>
      <small className="muted">التسجيل الذاتي مغلق؛ اطلب إنشاء حساب من الأونر.</small>
    </form></div>}
  </div>;
}
