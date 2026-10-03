import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { supabase } from './src/supabase';

const PURPLE = '#9B7BFF';
const BG = '#100C1B';
const PANEL = '#1C162B';

type Profile = { display_name?: string | null; role?: string | null; status?: string | null; username?: string | null };
type ChatMessage = { id: string | number; sender_id: string; body: string; created_at?: string };

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) { setProfile(null); setMessages([]); return; }
    let active = true;
    (async () => {
      const { data } = await supabase.from('profiles').select('display_name, role, status, username').eq('id', session.user.id).maybeSingle();
      if (active) setProfile((data as Profile | null) ?? null);
      // Read only the existing group_messages table. If your deployed schema differs,
      // this screen reports the database error instead of silently changing your schema.
      const result = await supabase.from('group_messages').select('id, sender_id, body, created_at').eq('room_key', 'orders').order('created_at', { ascending: true }).limit(100);
      if (active && !result.error) setMessages((result.data ?? []) as ChatMessage[]);
      if (active && result.error) console.warn('Group messages could not be loaded:', result.error.message);
    })();
    return () => { active = false; };
  }, [session?.user?.id]);

  async function signIn() {
    if (!email.trim() || !password) { Alert.alert('بيانات ناقصة', 'اكتب البريد الإلكتروني وكلمة المرور.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) Alert.alert('تعذر تسجيل الدخول', error.message);
  }

  async function sendMessage() {
    const body = draft.trim();
    if (!body || !session?.user || sending) return;
    setSending(true);
    const { data, error } = await supabase.from('group_messages').insert({ room_key: 'orders', sender_id: session.user.id, body }).select('id, sender_id, body, created_at').single();
    setSending(false);
    if (error) { Alert.alert('لم تُرسل الرسالة', error.message); return; }
    if (data) setMessages(prev => [...prev, data as ChatMessage]);
    setDraft('');
  }

  if (loading) return <SafeAreaView style={styles.center}><ActivityIndicator color={PURPLE} size="large"/><Text style={styles.muted}>جاري فتح App Trusted…</Text></SafeAreaView>;

  if (!session) return <SafeAreaView style={styles.safe}><ExpoStatusBar style="light"/><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.loginWrap} keyboardShouldPersistTaps="handled">
    <View style={styles.logo}><Text style={styles.logoMark}>✓</Text></View><Text style={styles.brand}>App Trusted</Text><Text style={styles.egypt}>ERDOGAN 🇪🇬</Text><Text style={styles.subtitle}>مساحة التجار الخاصة</Text>
    <View style={styles.card}><Text style={styles.heading}>تسجيل الدخول</Text><Text style={styles.label}>البريد الإلكتروني</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="name@example.com" placeholderTextColor="#8D849F" style={styles.input}/><Text style={styles.label}>كلمة المرور</Text><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="كلمة المرور" placeholderTextColor="#8D849F" style={styles.input}/><Pressable onPress={signIn} disabled={busy} style={styles.primary}>{busy ? <ActivityIndicator color="white"/> : <Text style={styles.primaryText}>دخول</Text>}</Pressable><Text style={styles.hint}>استخدم حسابك الحالي؛ لن ينشئ التطبيق حسابًا جديدًا.</Text></View>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ExpoStatusBar style="light"/><View style={styles.header}><View style={styles.groupAvatar}><Text style={styles.avatarText}>AT</Text></View><View style={styles.headerText}><Text style={styles.brandSmall}>App Trusted</Text><Text style={styles.mutedSmall}>شات تجار ترستد</Text></View><Pressable onPress={() => Alert.alert('الحساب', profile?.display_name || session.user.email || 'حسابي', [{text:'تسجيل الخروج', style:'destructive', onPress:()=>supabase.auth.signOut()},{text:'إلغاء',style:'cancel'}])} style={styles.logout}><Text style={styles.logoutText}>خروج</Text></Pressable></View>
    <View style={styles.notice}><Text style={styles.noticeText}>نسخة Android التجريبية — بنبدأ بتوصيل الحساب والشات</Text></View>
    <ScrollView style={styles.flex} contentContainerStyle={styles.chatList} ref={ref => { (globalThis as any).__trustedChatScroll = ref; }} onContentSizeChange={() => { const ref=(globalThis as any).__trustedChatScroll; ref?.scrollToEnd?.({animated:true}); }}>
      {messages.map(m => { const mine = m.sender_id === session.user.id; return <View key={String(m.id)} style={[styles.bubble, mine ? styles.mine : styles.theirs]}><Text style={styles.messageText}>{m.body}</Text><Text style={styles.time}>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</Text></View>; })}
      {messages.length === 0 && <View style={styles.empty}><Text style={styles.emptyTitle}>أهلًا بيك في App Trusted</Text><Text style={styles.muted}>لو الرسائل لم تظهر، سنراجع توافق جدول الجروب وصلاحياته قبل أي تعديل.</Text></View>}
    </ScrollView>
    <View style={styles.composer}><TextInput value={draft} onChangeText={setDraft} placeholder="اكتب رسالة…" placeholderTextColor="#958BA8" style={styles.messageInput} multiline/><Pressable onPress={sendMessage} disabled={sending || !draft.trim()} style={[styles.send, (!draft.trim() || sending) && styles.disabled]}><Text style={styles.sendText}>➤</Text></Pressable></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({safe:{flex:1,backgroundColor:BG},flex:{flex:1},center:{flex:1,backgroundColor:BG,alignItems:'center',justifyContent:'center',gap:12},loginWrap:{flexGrow:1,justifyContent:'center',padding:24,paddingTop:48,paddingBottom:48},logo:{width:76,height:76,borderRadius:25,backgroundColor:'#30224A',borderWidth:1,borderColor:'#7055B9',alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:12},logoMark:{color:'#C9B8FF',fontSize:42,fontWeight:'800'},brand:{color:'#F7F3FF',fontSize:30,fontWeight:'800',textAlign:'center'},egypt:{color:'#BDAAFF',fontWeight:'700',textAlign:'center',marginTop:4,letterSpacing:1},subtitle:{color:'#A69BB9',textAlign:'center',marginTop:10,marginBottom:28},card:{backgroundColor:PANEL,borderRadius:24,padding:20,borderWidth:1,borderColor:'#342847'},heading:{color:'#F6F1FF',fontSize:22,fontWeight:'700',textAlign:'right',marginBottom:20},label:{color:'#D8CFF0',textAlign:'right',marginBottom:7,marginTop:8},input:{backgroundColor:'#100C1B',borderColor:'#3B2D52',borderWidth:1,borderRadius:14,paddingHorizontal:14,paddingVertical:13,color:'white',textAlign:'left'},primary:{backgroundColor:PURPLE,borderRadius:14,padding:15,alignItems:'center',marginTop:22,minHeight:50,justifyContent:'center'},primaryText:{color:'white',fontWeight:'800',fontSize:16},hint:{color:'#8D849F',fontSize:12,textAlign:'center',marginTop:14},muted:{color:'#9B91AB',textAlign:'center',lineHeight:21},header:{height:72,flexDirection:'row',alignItems:'center',paddingHorizontal:16,borderBottomColor:'#30253F',borderBottomWidth:1,gap:11},groupAvatar:{width:44,height:44,borderRadius:22,backgroundColor:'#39275B',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#8062CE'},avatarText:{color:'#E1D7FF',fontWeight:'900'},headerText:{flex:1},brandSmall:{color:'#F6F1FF',fontSize:17,fontWeight:'800'},mutedSmall:{color:'#9D91B2',fontSize:12,marginTop:2},logout:{borderWidth:1,borderColor:'#4A3B61',borderRadius:12,paddingHorizontal:12,paddingVertical:8},logoutText:{color:'#D8C9FF',fontWeight:'700'},notice:{paddingHorizontal:14,paddingVertical:9,backgroundColor:'#1D1630'},noticeText:{color:'#BFB0E9',textAlign:'center',fontSize:11},chatList:{padding:14,gap:10,flexGrow:1,justifyContent:'flex-end'},bubble:{maxWidth:'84%',paddingHorizontal:14,paddingVertical:10,borderRadius:18,borderWidth:1},mine:{alignSelf:'flex-end',backgroundColor:'#4C3477',borderColor:'#6B4CA2',borderBottomRightRadius:5},theirs:{alignSelf:'flex-start',backgroundColor:'#211B2D',borderColor:'#3B304D',borderBottomLeftRadius:5},messageText:{color:'#F7F2FF',fontSize:15,lineHeight:22},time:{color:'#C5B5E2',fontSize:10,marginTop:5,textAlign:'right'},empty:{alignSelf:'center',marginTop:60,backgroundColor:'#1B1527',borderColor:'#352846',borderWidth:1,borderRadius:20,padding:20,maxWidth:300,gap:8},emptyTitle:{color:'#F2ECFF',fontSize:17,fontWeight:'700',textAlign:'center'},composer:{flexDirection:'row',alignItems:'flex-end',gap:9,padding:12,borderTopColor:'#30253F',borderTopWidth:1,backgroundColor:'#151020'},messageInput:{flex:1,maxHeight:110,minHeight:46,backgroundColor:'#241B35',borderRadius:18,borderWidth:1,borderColor:'#45335F',color:'white',paddingHorizontal:15,paddingVertical:12,textAlign:'right'},send:{width:46,height:46,borderRadius:16,backgroundColor:PURPLE,alignItems:'center',justifyContent:'center'},sendText:{color:'white',fontSize:23,fontWeight:'800'},disabled:{opacity:0.45},empty2:{},});
