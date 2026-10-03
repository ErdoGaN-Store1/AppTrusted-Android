import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Role = "owner" | "merchant";
type Screen = "splash" | "login" | "home" | "chat" | "settings";

type Chat = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  verified?: boolean;
};

type Message = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
};

const SUPPORT_WHATSAPP = "201091902522";

const INITIAL_CHATS: Chat[] = [
  { id: "1", name: "App Trusted", preview: "مرحبًا بك في App Trusted", time: "12:40", unread: 2, verified: true },
  { id: "2", name: "التاجر التجريبي", preview: "تمام، شكرًا", time: "11:25" },
  { id: "3", name: "الدعم", preview: "يمكنك التواصل معنا من الإعدادات", time: "09:10" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<Role>("merchant");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      { id: "1", text: "مرحبًا بك في App Trusted 👋", mine: false, time: "12:39" },
      { id: "2", text: "دي نسخة تجريبية للمراسلة.", mine: false, time: "12:40" },
    ],
    "2": [{ id: "1", text: "أهلًا 👋", mine: false, time: "11:20" }],
    "3": [{ id: "1", text: "أهلًا بك في الدعم.", mine: false, time: "09:10" }],
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setScreen("login"), 1600);
    return () => clearTimeout(timer);
  }, []);

  const filteredChats = useMemo(
    () =>
      INITIAL_CHATS.filter((chat) =>
        chat.name.toLowerCase().includes(search.toLowerCase().trim())
      ),
    [search]
  );

  const openBusinessRequest = async () => {
    const text = "أريد إنشاء حساب تجاري للتطبيق App Trusted.";
    const url = `whatsapp://send?phone=${SUPPORT_WHATSAPP}&text=${encodeURIComponent(text)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "واتساب غير متاح",
        `ثبّت واتساب على الهاتف أو تواصل مع الدعم على الرقم +${SUPPORT_WHATSAPP}.`
      );
    }
  };

  const login = () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert("بيانات ناقصة", "اكتب الـ ID أو البريد وكلمة المرور.");
      return;
    }
    setScreen("home");
  };

  const sendMessage = () => {
    const text = message.trim();
    if (!text || !selectedChat) return;

    const item: Message = {
      id: Date.now().toString(),
      text,
      mine: true,
      time: new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((old) => ({
      ...old,
      [selectedChat.id]: [...(old[selectedChat.id] || []), item],
    }));
    setMessage("");
  };

  if (screen === "splash") {
    return (
      <View style={styles.splash}>
        <StatusBar barStyle="light-content" backgroundColor="#0B141A" />
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>AT</Text>
        </View>
        <Text style={styles.splashTitle}>App Trusted</Text>
        <Text style={styles.splashSub}>Trusted Business Messenger</Text>
      </View>
    );
  }

  if (screen === "login") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F6F8FA" />
        <ScrollView contentContainerStyle={styles.loginWrap}>
          <View style={styles.brandSmall}>
            <View style={styles.smallLogo}>
              <Text style={styles.smallLogoText}>AT</Text>
            </View>
            <Text style={styles.brandTitle}>App Trusted</Text>
          </View>

          <Text style={styles.heading}>تسجيل الدخول</Text>
          <Text style={styles.muted}>ادخل بيانات حسابك للمتابعة</Text>

          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleButton, role === "merchant" && styles.roleActive]}
              onPress={() => setRole("merchant")}
            >
              <Text style={[styles.roleText, role === "merchant" && styles.roleTextActive]}>
                🏪 تاجر
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === "owner" && styles.roleActive]}
              onPress={() => setRole("owner")}
            >
              <Text style={[styles.roleText, role === "owner" && styles.roleTextActive]}>
                👑 مالك
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="ID أو البريد الإلكتروني"
            placeholderTextColor="#8A969C"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            placeholderTextColor="#8A969C"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.primary} onPress={login}>
            <Text style={styles.primaryText}>تسجيل الدخول</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.businessCard} onPress={openBusinessRequest}>
            <Text style={styles.businessTitle}>🏢 إنشاء حساب تجاري</Text>
            <Text style={styles.businessSub}>
              اضغط هنا لإرسال طلب الحساب على واتساب الدعم
            </Text>
          </TouchableOpacity>

          <Text style={styles.version}>نسخة تجريبية • App Trusted</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "chat" && selectedChat) {
    const chatMessages = messages[selectedChat.id] || [];
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{selectedChat.name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.chatName}>
              {selectedChat.name} {selectedChat.verified ? "✓" : ""}
            </Text>
            <Text style={styles.online}>متصل الآن</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.messages}>
          {chatMessages.map((item) => (
            <View
              key={item.id}
              style={[styles.messageBubble, item.mine ? styles.mine : styles.theirs]}
            >
              <Text style={item.mine ? styles.mineText : styles.theirText}>{item.text}</Text>
              <Text style={item.mine ? styles.mineTime : styles.theirTime}>{item.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            style={styles.messageInput}
            placeholder="اكتب رسالة..."
            placeholderTextColor="#879197"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.send} onPress={sendMessage}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "settings") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>الإعدادات</Text>
        </View>

        <ScrollView contentContainerStyle={styles.settings}>
          <View style={styles.profileCard}>
            <View style={styles.bigAvatar}><Text style={styles.bigAvatarText}>A</Text></View>
            <View>
              <Text style={styles.profileName}>{role === "owner" ? "مالك App Trusted" : "حساب تجاري"}</Text>
              <Text style={styles.muted}>{identifier || "الحساب التجريبي"}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={openBusinessRequest}>
            <Text style={styles.settingIcon}>🏢</Text>
            <View>
              <Text style={styles.settingTitle}>إنشاء حساب تجاري</Text>
              <Text style={styles.settingSub}>إرسال طلب إلى دعم App Trusted</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("حالة الحساب", "هذه نسخة تجريبية. التحقق الحقيقي سيضاف مع قاعدة البيانات.")}
          >
            <Text style={styles.settingIcon}>✓</Text>
            <View>
              <Text style={styles.settingTitle}>التحقق من الحساب</Text>
              <Text style={styles.settingSub}>نظام التحقق سيُربط بالـBackend لاحقًا</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logout}
            onPress={() => {
              setIdentifier("");
              setPassword("");
              setScreen("login");
            }}
          >
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNav active="settings" onHome={() => setScreen("home")} onSettings={() => setScreen("settings")} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.homeTitle}>المحادثات</Text>
          <Text style={styles.homeSub}>App Trusted</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon} onPress={() => setScreen("settings")}>
          <Text>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="بحث في المحادثات"
          placeholderTextColor="#8A969C"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.chatList}>
        {filteredChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatRow}
            onPress={() => {
              setSelectedChat(chat);
              setScreen("chat");
            }}
          >
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>{chat.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listName}>
                {chat.name} {chat.verified ? <Text style={styles.check}>✓</Text> : null}
              </Text>
              <Text style={styles.preview} numberOfLines={1}>{chat.preview}</Text>
            </View>
            <View style={styles.chatMeta}>
              <Text style={styles.time}>{chat.time}</Text>
              {!!chat.unread && (
                <View style={styles.unread}><Text style={styles.unreadText}>{chat.unread}</Text></View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav active="home" onHome={() => setScreen("home")} onSettings={() => setScreen("settings")} />
    </SafeAreaView>
  );
}

function BottomNav({
  active,
  onHome,
  onSettings,
}: {
  active: "home" | "settings";
  onHome: () => void;
  onSettings: () => void;
}) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navButton} onPress={onHome}>
        <Text style={styles.navIcon}>{active === "home" ? "💬" : "▫️"}</Text>
        <Text style={[styles.navText, active === "home" && styles.navActive]}>المحادثات</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={onSettings}>
        <Text style={styles.navIcon}>{active === "settings" ? "⚙️" : "▫️"}</Text>
        <Text style={[styles.navText, active === "settings" && styles.navActive]}>الإعدادات</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FA" },
  splash: { flex: 1, backgroundColor: "#0B141A", alignItems: "center", justifyContent: "center" },
  logoCircle: { width: 92, height: 92, borderRadius: 46, backgroundColor: "#25D366", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  logoText: { fontSize: 30, fontWeight: "800", color: "#fff" },
  splashTitle: { color: "#fff", fontSize: 30, fontWeight: "800" },
  splashSub: { color: "#AAB5BA", marginTop: 7, fontSize: 14 },
  loginWrap: { padding: 24, paddingTop: 50, flexGrow: 1 },
  brandSmall: { alignItems: "center", marginBottom: 35 },
  smallLogo: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#25D366", alignItems: "center", justifyContent: "center" },
  smallLogoText: { color: "#fff", fontSize: 22, fontWeight: "800" },
  brandTitle: { marginTop: 10, fontSize: 21, fontWeight: "800", color: "#172027" },
  heading: { fontSize: 28, fontWeight: "800", color: "#172027", textAlign: "right" },
  muted: { color: "#77838A", fontSize: 14, marginTop: 5, textAlign: "right" },
  roleRow: { flexDirection: "row-reverse", gap: 10, marginTop: 24, marginBottom: 14 },
  roleButton: { flex: 1, borderWidth: 1, borderColor: "#DCE2E5", padding: 13, borderRadius: 12, alignItems: "center", backgroundColor: "#fff" },
  roleActive: { borderColor: "#25D366", backgroundColor: "#EAF9F0" },
  roleText: { color: "#667278", fontWeight: "700" },
  roleTextActive: { color: "#168B46" },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#DDE3E6", borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14, marginTop: 10, textAlign: "right", fontSize: 15 },
  primary: { backgroundColor: "#25D366", borderRadius: 12, padding: 15, alignItems: "center", marginTop: 14 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  businessCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#DDE3E6", borderRadius: 14, padding: 16, marginTop: 16 },
  businessTitle: { textAlign: "right", color: "#172027", fontSize: 16, fontWeight: "800" },
  businessSub: { textAlign: "right", color: "#77838A", marginTop: 5, fontSize: 13 },
  version: { textAlign: "center", color: "#9AA5AA", marginTop: "auto", paddingTop: 35 },
  homeHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 },
  homeTitle: { fontSize: 27, fontWeight: "800", color: "#172027", textAlign: "right" },
  homeSub: { color: "#7D898F", textAlign: "right", marginTop: 2 },
  headerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  searchBox: { marginHorizontal: 18, backgroundColor: "#E9EEF0", borderRadius: 12, paddingHorizontal: 12, flexDirection: "row-reverse", alignItems: "center" },
  searchIcon: { fontSize: 22, color: "#6E797E" },
  searchInput: { flex: 1, paddingVertical: 11, textAlign: "right", paddingHorizontal: 8, color: "#172027" },
  chatList: { paddingTop: 8, paddingBottom: 90 },
  chatRow: { flexDirection: "row-reverse", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 18, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#EEF1F2" },
  listAvatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#D9F7E5", alignItems: "center", justifyContent: "center", marginLeft: 13 },
  listAvatarText: { color: "#168B46", fontSize: 20, fontWeight: "800" },
  listName: { fontSize: 16, fontWeight: "800", color: "#172027", textAlign: "right" },
  check: { color: "#168B46" },
  preview: { color: "#7C888E", marginTop: 4, textAlign: "right", fontSize: 13 },
  chatMeta: { alignItems: "flex-end", marginRight: 8 },
  time: { color: "#8B969B", fontSize: 11 },
  unread: { backgroundColor: "#25D366", borderRadius: 10, minWidth: 20, height: 20, alignItems: "center", justifyContent: "center", marginTop: 5 },
  unreadText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 68, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#E7EBED", flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  navButton: { alignItems: "center", minWidth: 100 },
  navIcon: { fontSize: 18 },
  navText: { fontSize: 11, color: "#8A959A", marginTop: 3 },
  navActive: { color: "#168B46", fontWeight: "800" },
  chatHeader: { flexDirection: "row-reverse", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E7EBED", gap: 10 },
  back: { fontSize: 38, color: "#172027", lineHeight: 38 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#D9F7E5", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#168B46", fontSize: 18, fontWeight: "800" },
  chatName: { fontSize: 16, fontWeight: "800", color: "#172027", textAlign: "right" },
  online: { color: "#25A95A", fontSize: 12, marginTop: 2, textAlign: "right" },
  messages: { padding: 12, paddingBottom: 20, flexGrow: 1, justifyContent: "flex-end" },
  messageBubble: { maxWidth: "82%", borderRadius: 12, paddingHorizontal: 11, paddingVertical: 8, marginVertical: 3 },
  mine: { alignSelf: "flex-end", backgroundColor: "#D9FDD3", borderTopRightRadius: 4 },
  theirs: { alignSelf: "flex-start", backgroundColor: "#fff", borderTopLeftRadius: 4 },
  mineText: { color: "#172027", fontSize: 15, textAlign: "right" },
  theirText: { color: "#172027", fontSize: 15, textAlign: "right" },
  mineTime: { color: "#6E8A6B", fontSize: 9, textAlign: "left", marginTop: 3 },
  theirTime: { color: "#879197", fontSize: 9, textAlign: "left", marginTop: 3 },
  composer: { flexDirection: "row-reverse", alignItems: "flex-end", padding: 8, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#E7EBED" },
  messageInput: { flex: 1, backgroundColor: "#F0F3F4", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 9, maxHeight: 100, textAlign: "right" },
  send: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#25D366", alignItems: "center", justifyContent: "center", marginRight: 7 },
  sendText: { color: "#fff", fontSize: 21, fontWeight: "800" },
  pageHeader: { backgroundColor: "#fff", padding: 18, borderBottomWidth: 1, borderBottomColor: "#E7EBED" },
  pageTitle: { fontSize: 24, fontWeight: "800", color: "#172027", textAlign: "right" },
  settings: { padding: 16, paddingBottom: 100 },
  profileCard: { backgroundColor: "#fff", borderRadius: 15, padding: 16, flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  bigAvatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#D9F7E5", alignItems: "center", justifyContent: "center" },
  bigAvatarText: { color: "#168B46", fontSize: 24, fontWeight: "800" },
  profileName: { color: "#172027", fontWeight: "800", fontSize: 16, textAlign: "right" },
  settingItem: { backgroundColor: "#fff", borderRadius: 14, padding: 15, marginTop: 10, flexDirection: "row-reverse", alignItems: "center", gap: 13 },
  settingIcon: { fontSize: 22 },
  settingTitle: { fontWeight: "800", color: "#172027", textAlign: "right" },
  settingSub: { color: "#7D898F", fontSize: 12, marginTop: 4, textAlign: "right" },
  logout: { marginTop: 20, borderRadius: 12, padding: 14, alignItems: "center", backgroundColor: "#FFECEC" },
  logoutText: { color: "#C62828", fontWeight: "800" },
});
