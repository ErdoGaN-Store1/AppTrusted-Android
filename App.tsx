import React, { useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView, Platform
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

type Screen = "splash" | "login" | "home" | "chat" | "merchant";

const chats = [
  { id: "1", name: "Ahmed Store", message: "أهلاً بك في App Trusted", time: "14:30", unread: 2 },
  { id: "2", name: "محمد للتجارة", message: "تم إرسال الطلب", time: "13:18", unread: 0 },
  { id: "3", name: "خدمة العملاء", message: "كيف يمكننا مساعدتك؟", time: "12:02", unread: 0 },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<"owner" | "merchant" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", text: "أهلاً بك في App Trusted 👋", mine: false },
    { id: "2", text: "دي النسخة التجريبية للمحادثات.", mine: false },
  ]);

  React.useEffect(() => {
    const timer = setTimeout(() => setScreen("login"), 1600);
    return () => clearTimeout(timer);
  }, []);

  if (screen === "splash") return (
    <SafeAreaView style={styles.splash}>
      <StatusBar style="light" />
      <View style={styles.logoCircle}><Ionicons name="shield-checkmark" size={48} color="#fff" /></View>
      <Text style={styles.logo}>App Trusted</Text>
      <Text style={styles.tagline}>تواصل بثقة</Text>
    </SafeAreaView>
  );

  if (screen === "login") return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.loginWrap}>
        <View style={styles.smallLogo}><Ionicons name="shield-checkmark" size={30} color="#fff" /></View>
        <Text style={styles.title}>مرحباً بك في App Trusted</Text>
        <Text style={styles.subtitle}>اختر طريقة الدخول</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => { setRole("merchant"); setScreen("merchant"); }}>
          <Ionicons name="storefront-outline" size={21} color="#fff" />
          <Text style={styles.primaryText}>دخول التاجر</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => { setRole("owner"); setScreen("merchant"); }}>
          <Ionicons name="shield-outline" size={21} color="#0B7A62" />
          <Text style={styles.secondaryText}>دخول المالك</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>إنشاء حساب تجاري</Text>
        </TouchableOpacity>

        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>للتواصل وإنشاء حساب تجاري</Text>
          <Text style={styles.contactText}>واتساب: ضع رقم التواصل هنا</Text>
          <Text style={styles.contactText}>سيتم إضافة رابط واتساب هنا</Text>
        </View>
      </View>
    </SafeAreaView>
  );

  if (screen === "merchant") return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.authHeader}>
          <TouchableOpacity onPress={() => setScreen("login")}><Ionicons name="arrow-back" size={25} color="#111" /></TouchableOpacity>
          <Text style={styles.authHeaderTitle}>{role === "owner" ? "دخول المالك" : "دخول التاجر"}</Text>
        </View>
        <View style={styles.authBody}>
          <Text style={styles.authTitle}>تسجيل الدخول</Text>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="example@email.com" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry style={styles.input} />
          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("home")}>
            <Text style={styles.primaryText}>متابعة</Text>
          </TouchableOpacity>
          <Text style={styles.note}>النسخة التجريبية: التحقق الحقيقي وOTP سيتم ربطهما بالـBackend.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  if (screen === "chat") return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => setScreen("home")}><Ionicons name="arrow-back" size={25} color="#111" /></TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.chatName}>{selectedChat.name}</Text>
          <Text style={styles.online}>متصل الآن</Text>
        </View>
        <Ionicons name="videocam-outline" size={24} color="#111" />
        <Ionicons name="call-outline" size={23} color="#111" style={{ marginLeft: 18 }} />
      </View>
      <FlatList
        style={{ flex: 1, backgroundColor: "#E9DED5" }}
        contentContainerStyle={{ padding: 14 }}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.mine ? styles.mine : styles.theirs]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.composer}>
        <Ionicons name="happy-outline" size={24} color="#657078" />
        <TextInput value={message} onChangeText={setMessage} placeholder="اكتب رسالة" style={styles.messageInput} />
        <TouchableOpacity onPress={() => {
          if (!message.trim()) return;
          setMessages([...messages, { id: String(Date.now()), text: message.trim(), mine: true }]);
          setMessage("");
        }}>
          <Ionicons name={message.trim() ? "send" : "mic"} size={24} color="#0B7A62" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.homeHeader}>
        <Text style={styles.homeTitle}>App Trusted</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={23} color="#111" />
          <Ionicons name="ellipsis-vertical" size={22} color="#111" style={{ marginLeft: 18 }} />
        </View>
      </View>
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>الدردشات</Text>
        <Text style={styles.tab}>التحديثات</Text>
        <Text style={styles.tab}>المكالمات</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatRow} onPress={() => { setSelectedChat(item); setScreen("chat"); }}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowTop}><Text style={styles.chatRowName}>{item.name}</Text><Text style={styles.time}>{item.time}</Text></View>
              <View style={styles.rowBottom}><Text style={styles.preview}>{item.message}</Text>{item.unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View>}</View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.fab}><Ionicons name="chatbubble" size={25} color="#fff" /></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  splash: { flex: 1, backgroundColor: "#0B141A", alignItems: "center", justifyContent: "center" },
  logoCircle: { width: 92, height: 92, borderRadius: 46, backgroundColor: "#0B7A62", alignItems: "center", justifyContent: "center" },
  logo: { color: "#fff", fontSize: 30, fontWeight: "800", marginTop: 20 },
  tagline: { color: "#B6C1C7", fontSize: 15, marginTop: 8 },
  loginWrap: { padding: 24, flex: 1, justifyContent: "center" },
  smallLogo: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#0B7A62", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 18 },
  title: { fontSize: 25, fontWeight: "800", textAlign: "center", color: "#111" },
  subtitle: { textAlign: "center", color: "#69747A", marginTop: 8, marginBottom: 28 },
  primaryButton: { height: 52, borderRadius: 14, backgroundColor: "#0B7A62", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  secondaryButton: { height: 52, borderRadius: 14, borderWidth: 1, borderColor: "#0B7A62", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 },
  secondaryText: { color: "#0B7A62", fontWeight: "800", fontSize: 16 },
  linkButton: { alignItems: "center", padding: 18 },
  linkText: { color: "#0B7A62", fontWeight: "700" },
  contactBox: { marginTop: 10, padding: 16, backgroundColor: "#F4F7F6", borderRadius: 14 },
  contactTitle: { fontWeight: "800", color: "#111", marginBottom: 7 },
  contactText: { color: "#56636A", marginTop: 3 },
  authHeader: { height: 60, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: "#eee" },
  authHeaderTitle: { fontSize: 18, fontWeight: "800", marginLeft: 22 },
  authBody: { padding: 24, marginTop: 20 },
  authTitle: { fontSize: 28, fontWeight: "800", marginBottom: 25 },
  label: { fontWeight: "700", marginBottom: 7, marginTop: 14 },
  input: { height: 52, borderWidth: 1, borderColor: "#D5DADC", borderRadius: 12, paddingHorizontal: 14, fontSize: 16 },
  note: { textAlign: "center", color: "#7A858B", fontSize: 12, marginTop: 18, lineHeight: 18 },
  homeHeader: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  homeTitle: { fontSize: 24, fontWeight: "800" },
  headerIcons: { flexDirection: "row" },
  tabs: { flexDirection: "row", justifyContent: "space-around", borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10 },
  activeTab: { color: "#0B7A62", fontWeight: "800" },
  tab: { color: "#657078", fontWeight: "700" },
  chatRow: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 13, alignItems: "center" },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#D8E8E3", alignItems: "center", justifyContent: "center", marginRight: 13 },
  avatarText: { color: "#0B7A62", fontSize: 22, fontWeight: "800" },
  rowTop: { flexDirection: "row", justifyContent: "space-between" },
  chatRowName: { fontSize: 16, fontWeight: "800" },
  time: { color: "#7C878C", fontSize: 12 },
  rowBottom: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  preview: { color: "#657078", flex: 1 },
  badge: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#0B7A62", alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  fab: { position: "absolute", right: 20, bottom: 20, width: 58, height: 58, borderRadius: 29, backgroundColor: "#0B7A62", alignItems: "center", justifyContent: "center", elevation: 6 },
  chatHeader: { height: 62, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  chatName: { fontWeight: "800", fontSize: 16 },
  online: { color: "#0B7A62", fontSize: 12, marginTop: 2 },
  bubble: { maxWidth: "80%", paddingHorizontal: 13, paddingVertical: 9, borderRadius: 14, marginBottom: 8 },
  mine: { backgroundColor: "#D8F0E7", alignSelf: "flex-end", borderTopRightRadius: 4 },
  theirs: { backgroundColor: "#fff", alignSelf: "flex-start", borderTopLeftRadius: 4 },
  bubbleText: { fontSize: 15, color: "#182025" },
  composer: { minHeight: 60, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 10, borderTopWidth: 1, borderTopColor: "#eee", backgroundColor: "#fff" },
  messageInput: { flex: 1, backgroundColor: "#F3F5F5", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9, fontSize: 15 }
});
