import { useEffect, useRef, useState } from 'react';
import {
  BadgeCheck, Camera, Check, CheckCircle2, ChevronLeft, CircleHelp, Crown,
  LogIn, LogOut, MessageCircle, Send, ShieldCheck, ShoppingBag, Store,
  UserRound, Users, X, ImagePlus, LockKeyhole, LoaderCircle, Sparkles, Smile, Mic, Square, Play, Trash2, Type, Crop, Eraser, PenLine, UserPlus, Globe, MessageSquareReply, ArrowDown
} from 'lucide-react';
import { supabase } from './supabase.js';

const WHATSAPP_NUMBER = '201091902522'; // رقم واتساب المالك بصيغة دولية بدون + أو مسافات
/* Up Trasid / App Trusted visual refresh: CSS is embedded so only App.jsx needs replacing. */
const PREMIUM_CSS = `
:root{--premium-bg:#090910;--premium-panel:#15151f;--premium-line:rgba(255,255,255,.09);--premium-violet:#7957f5;--premium-red:#fa3157;--premium-text:#f6f5fb;--premium-muted:#a3a1b4}
.app-shell{background:radial-gradient(ellipse at 50% -15%,#28183d 0%,#101019 42%,#08080d 100%)!important;color:var(--premium-text)!important;padding-bottom:108px!important;min-height:100dvh}
.app-shell .app-header{background:rgba(17,17,27,.88)!important;border-bottom:1px solid var(--premium-line)!important;backdrop-filter:blur(18px);height:62px!important;justify-content:flex-end!important;padding-inline:16px!important}.app-shell .app-header>.brand-lockup,.app-shell .header-name{display:none!important}.app-shell .header-user{margin-inline-start:auto!important}
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
.app-shell .messages-list{display:flex;flex-direction:column;direction:ltr;overflow-y:auto;overscroll-behavior:contain;overflow-anchor:auto;scroll-behavior:auto}
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
.image-editor-backdrop{position:fixed;inset:0;z-index:9999;background:#05040beF;display:grid;place-items:center;padding:12px}.image-editor{width:min(100%,720px);max-height:94dvh;overflow:auto;background:#15131f;border:1px solid #ffffff20;border-radius:22px;padding:14px;color:#fff;box-shadow:0 25px 80px #000b}.image-editor-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}.image-editor-preview{position:relative;display:grid;place-items:center;max-height:58dvh;min-height:180px;background:#08080d;border-radius:14px;overflow:hidden}.image-editor-preview img{display:block;max-width:100%;max-height:58dvh;object-fit:contain}.image-editor-preview canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}.image-editor-tools{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.image-editor-tools button,.image-editor-tools select,.image-editor-tools input{border:1px solid #ffffff20;background:#252132;color:#fff;border-radius:10px;padding:9px;font-size:12px}.image-editor-tools button.selected{background:#6844cc;border-color:#b5a2ff}.image-editor-actions{display:flex;gap:9px}.image-editor-actions button{flex:1;min-height:44px}.owner-create-form{display:grid;grid-template-columns:1fr;gap:10px;padding:15px;margin:14px 0 20px;background:#1b1825;border:1px solid #ffffff14;border-radius:17px}.owner-create-form input{width:100%;padding:12px;border-radius:11px;background:#100d17;color:#fff;border:1px solid #393044}.owner-create-form h3{margin:0}.app-shell .message-photo{background:#252132;min-height:35px}.app-shell .message-photo:after{content:''}@media(max-width:520px){.app-shell .message{max-width:94%}.app-shell .emoji-panel{grid-template-columns:repeat(7,minmax(0,1fr))}.app-shell .chat-card{min-height:calc(100dvh - 170px)}.app-shell .messages-list{height:calc(100dvh - 340px);min-height:240px}}
.app-shell .profile-cover{position:relative!important}
.app-shell .profile-avatar{left:50%!important;right:auto!important;transform:translateX(-50%)!important;bottom:-48px!important;border-radius:50%!important;width:112px!important;height:112px!important}
.app-shell .camera-button{left:calc(50% + 28px)!important;right:auto!important;bottom:-37px!important}
.app-shell .banner-upload{position:absolute;top:12px;left:12px;z-index:3;display:flex;align-items:center;gap:6px;background:#11111acc;border:1px solid #ffffff30;color:white;border-radius:12px;padding:9px 11px;font-size:12px;cursor:pointer}
.app-shell .profile-socials{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.app-shell .social-chip{display:inline-flex;align-items:center;gap:7px;border-radius:13px;padding:9px 12px;text-decoration:none;color:white!important;font-size:12px;border:1px solid #ffffff20}
.app-shell .social-editor{display:grid;grid-template-columns:1fr;gap:9px;padding:14px;margin-top:12px;background:#1b1825;border:1px solid #ffffff14;border-radius:16px}
.app-shell .social-editor input,.app-shell .social-editor select{width:100%;padding:11px;border-radius:11px;background:#100d17;color:#fff;border:1px solid #393044}
.app-shell .social-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.app-shell .audio-player{width:220px;max-width:100%;height:38px}
.app-shell .recording-dot{color:#ff5475!important}
@media(max-width:520px){.app-shell .profile-avatar{width:98px!important;height:98px!important;bottom:-43px!important}.app-shell .camera-button{left:calc(50% + 23px)!important;right:auto!important;bottom:-34px!important}.app-shell .profile-body{padding-top:59px!important}}
/* Final mobile fixes: full-width owner form, centered profile photo, stable chat scroll. */
.app-shell,.app-shell *{box-sizing:border-box}
.app-shell .owner-dashboard{width:100%;min-width:0;overflow:hidden}
.app-shell .owner-create-form{width:100%;min-width:0;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr);direction:rtl}
.app-shell .owner-create-form input{display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;text-align:right;direction:rtl}
.app-shell .owner-create-form input[type=email],.app-shell .owner-create-form input[type=password]{direction:ltr;text-align:left}
.app-shell .messages-list{overflow-anchor:none!important;scroll-behavior:auto!important;overscroll-behavior-y:contain!important;touch-action:pan-y!important}
.app-shell .chat-card{min-width:0;overflow:hidden}
.app-shell .message{min-width:0}
.app-shell .message-content{overflow-wrap:anywhere;word-break:break-word;min-width:0}
.app-shell .message-photo{height:auto;object-fit:contain}
.app-shell .profile-cover{overflow:visible!important}
.app-shell .profile-body{min-width:0;overflow-wrap:anywhere}
.app-shell .profile-form{display:grid!important;grid-template-columns:minmax(0,1fr)!important;width:100%!important;min-width:0!important}
.app-shell .profile-form label{display:block!important;width:100%!important;min-width:0!important}
.app-shell .profile-form input,.app-shell .profile-form textarea{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}
.app-shell button.composer-tool,.app-shell label.composer-tool{appearance:none!important;-webkit-appearance:none!important;background:#211a2b!important;color:#e6d8ff!important;border:1px solid #ffffff22!important;box-shadow:none!important;border-radius:50%!important}
.app-shell .composer-tools{direction:rtl!important;background:#100d17!important;border-top:1px solid #ffffff12!important}
.app-shell .send-form{direction:rtl!important}
@media(max-width:520px){.app-shell .owner-dashboard{padding:15px!important}.app-shell .owner-create-form{padding:12px!important}.app-shell .chat-card{height:calc(100dvh - 184px);min-height:390px;display:flex;flex-direction:column}.app-shell .messages-list{flex:1 1 auto;height:auto!important;min-height:0!important;max-height:none!important}.app-shell .composer-tools,.app-shell .send-form{flex-shrink:0}.app-shell .bottom-dock{z-index:1000}}
/* Final restoration: violet chat, compact media, branded header, editor-ready banner. */
.app-shell .app-header{justify-content:space-between!important;direction:rtl!important;gap:10px!important;padding:8px 14px!important}
.app-shell .app-header>.brand-lockup{display:flex!important;flex-shrink:0!important;gap:7px!important}
.app-shell .app-header .brand-e{width:34px!important;height:34px!important;border-radius:11px!important}
.app-shell .app-header .brand-e svg{width:21px!important;height:21px!important}
.app-shell .app-header .brand-word strong{font-size:14px!important;white-space:nowrap!important}
.app-shell .app-header .brand-word span{font-size:8px!important;letter-spacing:1px!important;white-space:nowrap!important}
.app-shell .header-user{display:flex!important;align-items:center!important;gap:8px!important;margin:0!important}
.app-shell .language-placeholder{display:flex!important;align-items:center!important;gap:6px!important;min-height:38px!important;padding:0 10px!important;border-radius:12px!important;background:#211a32!important;border:1px solid #8b6cff45!important;color:#d7caff!important;font-size:12px!important}
.app-shell .glass-icon{display:grid!important;place-items:center!important;width:40px!important;height:40px!important;border-radius:13px!important;background:#171525!important;color:#d7caff!important;border:1px solid #ffffff18!important}
.app-shell .messages-list{overflow-anchor:none!important;scrollbar-gutter:stable!important}
.app-shell .message{width:fit-content!important;max-width:86%!important;flex:0 0 auto!important}
.app-shell .message .message-content{width:fit-content!important;max-width:100%!important;background:linear-gradient(145deg,#211a33,#191525)!important;border:1px solid #8065cf42!important;border-radius:17px!important;box-shadow:0 5px 16px #0002!important}
.app-shell .message.mine .message-content{background:linear-gradient(135deg,#6441c5,#473080)!important;border-color:#b7a1ff55!important;border-radius:17px!important}
.app-shell .message-photo-link{display:inline-block!important;width:fit-content!important;max-width:190px!important;line-height:0!important;overflow:hidden!important;border-radius:12px!important}
.app-shell .message-photo{display:block!important;width:auto!important;height:auto!important;max-width:190px!important;max-height:190px!important;object-fit:contain!important;border-radius:12px!important;background:#100d17!important}
.app-shell .composer-tools{background:#110d1d!important}
.app-shell button.composer-tool,.app-shell label.composer-tool{color:#c9b8ff!important;background:linear-gradient(145deg,#28203d,#1b152b)!important;border:1px solid #8e72df55!important}
.app-shell .composer-tool svg{color:#c9b8ff!important;stroke:#c9b8ff!important}
.app-shell .owner-create-form{background:linear-gradient(145deg,#211832,#15111f)!important;border:1px solid #8c6bdb55!important;box-shadow:0 12px 35px #0003!important}
.app-shell .owner-create-form h3,.app-shell .owner-dashboard h3{color:#f5efff!important}
.app-shell .owner-create-form input,.app-shell .owner-create-form input[type=email],.app-shell .owner-create-form input[type=password]{appearance:none!important;-webkit-appearance:none!important;background:#100d19!important;color:#fff!important;border:1px solid #69538f!important;border-radius:12px!important;min-height:46px!important;color-scheme:dark!important}
.app-shell .owner-create-form .btn-primary{background:linear-gradient(120deg,#7652e8,#5733ba)!important;border:1px solid #a58cff55!important;color:#fff!important}
.image-editor{color:#f8f4ff!important;background:linear-gradient(145deg,#211832,#100d18)!important;border-color:#8c6bdb66!important}
.image-editor-preview{width:100%!important;max-height:48dvh!important;min-height:160px!important}
.image-editor-preview img{max-width:100%!important;max-height:48dvh!important;object-fit:contain!important}
@media(max-width:520px){.app-shell .app-header{height:60px!important}.app-shell .app-header .brand-word strong{font-size:12px!important}.app-shell .app-header .brand-word span{font-size:7px!important}.app-shell .language-placeholder{padding:0 7px!important}.app-shell .message{max-width:90%!important}.app-shell .message-photo{max-width:160px!important;max-height:160px!important}.app-shell .message-photo-link{max-width:160px!important}}

/* Glassy message actions, reactions and violet microphone controls */
.app-shell .chat-card,.app-shell .message-action-popover,.app-shell .reaction-picker,.app-shell .message-confirm{backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}
.app-shell .message{position:relative;touch-action:pan-y;}
.app-shell .message-content{position:relative;overflow:visible;}
.app-shell .message-reactions{display:flex;flex-wrap:wrap;gap:5px;margin:5px 2px 0;}
.app-shell .reaction-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;border:1px solid #a78bfa55;background:rgba(31,24,48,.88);color:#fff;font-size:15px;box-shadow:inset 0 1px #ffffff14;}
.app-shell .reaction-chip small{font-size:10px;color:#e9ddff;}
.app-shell .reaction-chip.mine-reaction{background:linear-gradient(135deg,#6941c6aa,#9b5de555);border-color:#c4b5fd;}
.app-shell .message-action-popover{position:absolute;z-index:50;top:calc(100% + 7px);left:0;min-width:220px;max-width:min(300px,85vw);padding:9px;border:1px solid #c4b5fd44;border-radius:18px;background:rgba(20,15,32,.94);box-shadow:0 16px 45px #0009;display:flex;flex-direction:column;gap:5px;direction:rtl;}
.app-shell .message.mine .message-action-popover{left:auto;right:0;}
.app-shell .quick-reactions{display:flex;align-items:center;justify-content:space-between;gap:3px;padding:3px 2px 8px;border-bottom:1px solid #ffffff17;}
.app-shell .quick-reactions button{width:34px;height:34px;border:0;border-radius:11px;background:rgba(255,255,255,.06);font-size:21px;}
.app-shell .quick-reactions .reaction-more{color:#e9ddff;font-size:22px;background:linear-gradient(135deg,#7957f5aa,#9b5de566);border:1px solid #c4b5fd55;}
.app-shell .message-action-popover>button{display:flex;align-items:center;gap:9px;text-align:right;width:100%;border:0;border-radius:10px;padding:10px;background:rgba(255,255,255,.045);color:#f5f0ff;font-size:13px;}
.app-shell .message-action-popover>button.danger-action{color:#ffb7c7;}
.app-shell .message-action-popover>button.close-message-menu{justify-content:center;color:#bdb4d3;background:transparent;padding:6px;}
.app-shell .reaction-picker{border:1px solid #ffffff1b;border-radius:12px;padding:7px;background:rgba(8,7,15,.65);}
.app-shell .reaction-picker input{width:100%;box-sizing:border-box;background:#211a30;border:1px solid #ffffff20;border-radius:9px;padding:9px;color:white;outline:none;}
.app-shell .reaction-picker>div{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:3px;max-height:145px;overflow:auto;margin-top:7px;}
.app-shell .reaction-picker>div button{background:transparent;border:0;border-radius:7px;font-size:22px;padding:5px 0;}
.app-shell .chat-action-toast{display:flex;align-items:center;gap:8px;padding:9px 12px;margin:5px 12px;border:1px solid #a78bfa55;border-radius:12px;background:rgba(71,48,128,.8);color:#f8f5ff;font-size:12px;}
.app-shell .chat-action-toast svg{color:#c4b5fd;}
.app-shell .chat-action-toast button{margin-inline-start:auto;border:0;background:transparent;color:#fff;font-size:20px;}
.app-shell .message-confirm-backdrop{position:fixed;inset:0;z-index:10020;display:grid;place-items:center;padding:18px;background:#05040bc9;backdrop-filter:blur(8px);}
.app-shell .message-confirm{width:min(100%,360px);box-sizing:border-box;padding:20px;border:1px solid #a78bfa55;border-radius:22px;background:linear-gradient(145deg,rgba(35,26,54,.97),rgba(13,11,21,.98));box-shadow:0 20px 70px #000b;color:#fff;}
.app-shell .message-confirm strong{font-size:16px;}
.app-shell .message-confirm p{font-size:13px;line-height:1.8;color:#c9c2d9;}
.app-shell .message-confirm>div{display:flex;gap:9px;margin-top:14px;}
.app-shell .message-confirm>div button{flex:1;display:flex;justify-content:center;align-items:center;gap:7px;min-height:43px;}
.app-shell .composer-tool{background:rgba(121,87,245,.16)!important;border:1px solid #a78bfa66!important;color:#d9ccff!important;box-shadow:inset 0 1px #ffffff15,0 5px 18px #0003!important;backdrop-filter:blur(16px);}
.app-shell .composer-tool svg{color:#d9ccff!important;stroke:#d9ccff!important;}
@media(max-width:520px){.app-shell .message-action-popover{max-width:82vw}.app-shell .message-confirm{border-radius:20px}}


/* Telegram-inspired message layout, reply bar, jump-to-latest and compact dark voice notes */
.app-shell .chat-card{border:0!important;border-radius:20px!important;box-shadow:none!important;background:rgba(12,12,20,.72)!important}
.app-shell .messages-list{position:relative!important;min-width:0!important;overflow-x:hidden!important;padding:14px 10px 18px!important;gap:8px!important}
.app-shell .message{position:relative!important;flex-wrap:wrap!important;align-items:flex-end!important;column-gap:7px!important;max-width:92%!important}
.app-shell .message-content{min-width:0!important;max-width:calc(100% - 38px)!important;overflow:hidden!important}
.app-shell .message-reactions{flex:0 0 auto!important;width:auto!important;max-width:100%!important;margin-inline:40px 0!important;order:3!important}
.app-shell .message-action-popover{z-index:500!important;max-height:min(55dvh,420px)!important;overflow-y:auto!important;overscroll-behavior:contain!important}
.app-shell .audio-message-wrap{width:min(235px,100%);max-width:100%;display:flex;flex-direction:column;gap:5px;min-width:0;padding-top:4px}
.app-shell .audio-message-label{display:flex;align-items:center;gap:6px;color:#d7caff;font-size:11px}
.app-shell audio.audio-player{display:block!important;width:min(235px,100%)!important;max-width:100%!important;min-width:0!important;height:42px!important;border-radius:14px!important;color-scheme:dark!important;background:#29213d!important;accent-color:#9b7bff!important;filter:none!important}
.app-shell .reply-message-content{display:flex;flex-direction:column;gap:7px;min-width:0}.app-shell .reply-message-quote{border-inline-start:3px solid #a78bfa;padding:5px 8px;border-radius:7px;background:rgba(167,139,250,.13);color:#d9ccff;font-size:11px;line-height:1.6;overflow-wrap:anywhere}.app-shell .reply-composer-bar{display:flex;align-items:center;gap:9px;margin:7px 12px 0;padding:9px 11px;border-inline-start:3px solid #9b7bff;border-radius:12px;background:rgba(121,87,245,.13);color:#e9e0ff;min-width:0}
.app-shell .reply-composer-bar>div{display:flex;flex-direction:column;min-width:0;flex:1;gap:3px}
.app-shell .reply-composer-bar strong{font-size:11px;color:#c4b5fd}
.app-shell .reply-composer-bar span{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#c6c0d7}
.app-shell .reply-composer-bar button{display:grid;place-items:center;border:0;background:transparent;color:#d9ccff;padding:6px}
.app-shell .scroll-bottom-btn{position:absolute!important;z-index:450!important;bottom:12px!important;left:14px!important;width:42px!important;height:42px!important;display:grid!important;place-items:center!important;border:1px solid #c4b5fd77!important;border-radius:50%!important;background:rgba(78,54,143,.88)!important;color:#fff!important;box-shadow:0 7px 22px #0007!important;backdrop-filter:blur(14px)!important}
.app-shell .composer-tool{color:#d7caff!important;background:rgba(121,87,245,.2)!important}
@media(max-width:520px){.app-shell .message{max-width:96%!important}.app-shell .message-content{max-width:calc(100% - 34px)!important}.app-shell .audio-message-wrap{width:min(210px,100%)}.app-shell audio.audio-player{width:min(210px,100%)!important}.app-shell .messages-list{padding-inline:7px!important}}
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
  const [reactionRows, setReactionRows] = useState([]);
  const [messageMenu, setMessageMenu] = useState(null);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [reactionSearch, setReactionSearch] = useState('');
  const [pendingMessageAction, setPendingMessageAction] = useState(null);
  const [actionToast, setActionToast] = useState('');
  const [hiddenMessageIds, setHiddenMessageIds] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const longPressTimerRef = useRef(null);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [myVerification, setMyVerification] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [bannerBusy, setBannerBusy] = useState(false);
  const [newTraderName, setNewTraderName] = useState('');
  const [newTraderEmail, setNewTraderEmail] = useState('');
  const [newTraderPassword, setNewTraderPassword] = useState('');
  const [creatingTrader, setCreatingTrader] = useState(false);
  const [imageDraft, setImageDraft] = useState(null);
  const [imageTarget, setImageTarget] = useState('chat');
  const [imageBlur, setImageBlur] = useState(false);
  const [imageText, setImageText] = useState('');
  const [imageRatio, setImageRatio] = useState('original');
  const [imageDrawMode, setImageDrawMode] = useState('pen');
  const imageCanvasRef = useRef(null);
  const imageDrawingRef = useRef(false);
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
  const messagesListRef = useRef(null);
  const forceScrollToBottomRef = useRef(false);
  const hasLoadedChatOnceRef = useRef(false);
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
    if (!session?.user?.id) { setHiddenMessageIds([]); return; }
    try { setHiddenMessageIds(JSON.parse(localStorage.getItem(`trusted-hidden-messages-${session.user.id}`) || '[]')); }
    catch { setHiddenMessageIds([]); }
  }, [session?.user?.id]);

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

  // انزل لآخر الشات عند فتحه أو وصول رسالة جديدة وإنت بالفعل قريب من الأسفل؛ لا تقاطع التصفح القديم.
  useEffect(() => {
    if (tab !== 'orders') return;
    forceScrollToBottomRef.current = true;
    const frame = requestAnimationFrame(() => { if (messagesListRef.current) messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight; });
    return () => cancelAnimationFrame(frame);
  }, [tab]);

  useEffect(() => {
    if (tab !== 'orders' || !forceScrollToBottomRef.current) return;
    forceScrollToBottomRef.current = false;
    const frame = requestAnimationFrame(() => {
      if (messagesListRef.current) messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, tab]);

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
      const nextMessages = data || [];
      // Keep the same array on unchanged polling; follow new messages only if the user is near the bottom.
      setMessages(previous => {
        const unchanged = previous.length === nextMessages.length && previous.every((item, index) =>
          item.id === nextMessages[index]?.id && item.body === nextMessages[index]?.body && item.created_at === nextMessages[index]?.created_at
        );
        if (unchanged) return previous;
        const list = messagesListRef.current;
        const nearBottom = !list || (list.scrollHeight - list.scrollTop - list.clientHeight < 140);
        if (!hasLoadedChatOnceRef.current || nearBottom) forceScrollToBottomRef.current = true;
        hasLoadedChatOnceRef.current = true;
        return nextMessages;
      });
      loadMessageReactions(nextMessages.map(item => String(item.id)));
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
    forceScrollToBottomRef.current = true;
    await loadMessages('orders');
    return true;
  }

  function getReplyPreview(message) {
    const body = typeof message?.body === 'string' ? message.body : '';
    if (body.startsWith('__UPTRASID_IMAGE__:')) return '📷 صورة';
    if (body.startsWith('__UPTRASID_AUDIO__:')) return '🎙 رسالة صوتية';
    return body.length > 110 ? `${body.slice(0, 110)}…` : (body || 'رسالة');
  }

  function chooseReply(message) {
    setReplyTo({ id: message.id, name: message.profiles?.display_name || 'تاجر', preview: getReplyPreview(message) });
    setMessageMenu(null); setReactionPickerOpen(false);
  }

  function scrollChatToBottom(smooth = true) {
    const list = messagesListRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    setShowScrollDown(false);
  }

  function handleMessagesScroll(event) {
    const list = event.currentTarget;
    setShowScrollDown(list.scrollHeight - list.scrollTop - list.clientHeight > 180);
  }

  async function sendMessage(e) {
    e.preventDefault();
    const text = messageText.trim();
    if (!text) return;
    const body = replyTo ? `↪ رد على ${replyTo.name}: ${replyTo.preview}\n\n${text}` : text;
    setMessageText('');
    const sent = await insertChatBody(body);
    if (sent) setReplyTo(null); else setMessageText(text);
  }

  function addEmoji(emoji) { setMessageText(value => `${value}${emoji}`); }
  async function loadMessageReactions(messageIds) {
    if (!supabase || !session?.user?.id || !messageIds.length) { setReactionRows([]); return; }
    const { data, error } = await supabase.from('group_message_reactions')
      .select('message_id,user_id,emoji').in('message_id', messageIds);
    if (error) {
      if (!window.__trustedReactionSchemaWarned) {
        window.__trustedReactionSchemaWarned = true;
        setNotice(`الرياكت مش متصل بقاعدة البيانات: ${error.message}. افتح ملف AppTrusted-chat-reactions.sql ونفّذه في Supabase، وبعدها انتظر ثواني وحدّث الموقع.`);
      }
      return;
    }
    setReactionRows(data || []);
  }

  function openMessageMenu(id) {
    setMessageMenu({ id });
    setReactionPickerOpen(false);
    setReactionSearch('');
  }

  function beginMessageLongPress(id) {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => openMessageMenu(id), 480);
  }

  function endMessageLongPress() {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }

  async function reactToMessage(message, emoji) {
    if (!supabase || !session?.user?.id) return;
    const messageId = String(message.id);
    const current = reactionRows.find(row => row.message_id === messageId && row.user_id === session.user.id);
    let result;
    if (current?.emoji === emoji) {
      result = await supabase.from('group_message_reactions').delete().eq('message_id', messageId).eq('user_id', session.user.id);
    } else {
      result = await supabase.from('group_message_reactions').upsert({ message_id: messageId, user_id: session.user.id, emoji }, { onConflict: 'message_id,user_id' });
    }
    if (result.error) { setNotice(`تعذر حفظ الرياكت: ${result.error.message}`); return; }
    setMessageMenu(null); setReactionPickerOpen(false); setActionToast('تم تسجيل الرياكت ✓');
    await loadMessageReactions(messages.map(item => String(item.id)));
  }

  function requestMessageAction(type, message) {
    setPendingMessageAction({ type, message });
    setMessageMenu(null);
    setReactionPickerOpen(false);
  }

  async function confirmMessageAction() {
    if (!pendingMessageAction || !session?.user?.id) return;
    const { type, message } = pendingMessageAction;
    if (type === 'hide') {
      const next = [...new Set([...hiddenMessageIds, String(message.id)])];
      setHiddenMessageIds(next);
      try { localStorage.setItem(`trusted-hidden-messages-${session.user.id}`, JSON.stringify(next)); } catch {}
      setActionToast('تم حذف الرسالة من عندك ✓');
      setPendingMessageAction(null);
      return;
    }
    if (type === 'delete') {
      if (message.sender_id !== session.user.id && !isOwner) {
        setNotice('حذف رسائل الآخرين متاح للمالك فقط.'); setPendingMessageAction(null); return;
      }
      let query = supabase.from('group_messages').delete().eq('id', message.id);
      if (!isOwner) query = query.eq('sender_id', session.user.id);
      const { data, error } = await query.select('id');
      if (error || !data?.length) {
        setNotice(`تعذر حذف الرسالة: ${error?.message || 'تحقق من سياسة الحذف في Supabase.'}`);
        setPendingMessageAction(null); return;
      }
      setMessages(previous => previous.filter(item => String(item.id) !== String(message.id)));
      setReactionRows(previous => previous.filter(item => item.message_id !== String(message.id)));
      setActionToast('تم حذف الرسالة للجميع ✓');
      setPendingMessageAction(null);
    }
  }

  const QUICK_REACTIONS = ['❤️', '🫂', '😂', '😭', '👍'];
  const SEARCHABLE_REACTIONS = [
    ['❤️','قلب'],['🫂','حضن صاحب'],['😂','ضحك'],['😭','عياط'],['👍','إيد إعجاب'],['🥰','حب'],['😍','إعجاب'],['🤣','ضحك قوي'],['😢','حزين'],['😮','مندهش'],['😡','غضب'],['🙏','دعاء'],['👏','تصفيق'],['🔥','نار'],['💯','مية'],['🤝','اتفاق'],['🥹','متأثر'],['😎','كول'],['🎉','احتفال'],['✨','لمعة'],['💜','قلب بنفسجي'],['🫶','قلب بالإيد'],['🤔','تفكير'],['🙌','إيدين مرفوعين'],['👀','عيون'],['💪','قوة'],['💔','قلب مكسور'],['😴','نوم'],['🤗','حضن'],['😇','ملاك']
  ];
  const visibleReactionChoices = SEARCHABLE_REACTIONS.filter(([emoji, label]) => `${emoji} ${label}`.toLowerCase().includes(reactionSearch.trim().toLowerCase()));

  function uploadBanner(e) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setNotice('اختار صورة بانر فقط.');
    if (file.size > 8 * 1024 * 1024) return setNotice('حجم الصورة لازم يكون أقل من 8 ميجابايت.');
    const url = URL.createObjectURL(file);
    setImageTarget('banner');
    setImageDraft({ file, url });
    setImageBlur(false); setImageText(''); setImageRatio('landscape'); setImageDrawMode('pen');
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

  function uploadChatImage(e) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setNotice('اختار صورة فقط.');
    if (file.size > 8 * 1024 * 1024) return setNotice('حجم الصورة لازم يكون أقل من 8 ميجابايت.');
    const url = URL.createObjectURL(file);
    setImageTarget('chat'); setImageDraft({ file, url }); setImageBlur(false); setImageText(''); setImageRatio('original'); setImageDrawMode('pen');
  }

  function closeImageEditor() {
    if (imageDraft?.url) URL.revokeObjectURL(imageDraft.url);
    setImageDraft(null); setImageBlur(false); setImageText(''); setImageTarget('chat');
  }

  function beginImageDraw(e) {
    const canvas = imageCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * canvas.width / rect.width;
    const y = (e.clientY - rect.top) * canvas.height / rect.height;
    imageDrawingRef.current = true; canvas.setPointerCapture?.(e.pointerId);
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineWidth = Math.max(5, canvas.width / 120); ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.strokeStyle = imageDrawMode === 'blur' ? 'rgba(10,10,15,.78)' : '#ff3158';
    if (imageDrawMode === 'blur') { ctx.shadowColor = '#08080d'; ctx.shadowBlur = 14; }
    else { ctx.shadowBlur = 0; }
  }

  function moveImageDraw(e) {
    if (!imageDrawingRef.current) return;
    const canvas = imageCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const rect = canvas.getBoundingClientRect();
    ctx.lineTo((e.clientX - rect.left) * canvas.width / rect.width, (e.clientY - rect.top) * canvas.height / rect.height); ctx.stroke();
  }

  async function sendEditedImage() {
    if (!imageDraft || !supabase || !session) return;
    setMediaBusy(true);
    if (imageTarget === 'banner') setBannerBusy(true);
    try {
      const img = new Image(); img.src = imageDraft.url;
      await new Promise((resolve,reject) => { if (img.complete && img.naturalWidth) resolve(); else { img.onload=resolve; img.onerror=reject; } });
      let sx=0, sy=0, sw=img.naturalWidth, sh=img.naturalHeight;
      if (imageRatio === 'square') { sw=sh=Math.min(img.naturalWidth,img.naturalHeight); sx=(img.naturalWidth-sw)/2; sy=(img.naturalHeight-sh)/2; }
      if (imageRatio === 'landscape') { const ratio=16/9; if (sw/sh>ratio) { const nw=sh*ratio; sx=(sw-nw)/2; sw=nw; } else { const nh=sw/ratio; sy=(sh-nh)/2; sh=nh; } }
      const out=document.createElement('canvas'); out.width=Math.max(1,Math.round(sw)); out.height=Math.max(1,Math.round(sh)); const ctx=out.getContext('2d');
      ctx.filter=imageBlur?'blur(4px)':'none'; ctx.drawImage(img,sx,sy,sw,sh,0,0,out.width,out.height); ctx.filter='none';
      const overlay=imageCanvasRef.current; if (overlay) ctx.drawImage(overlay,sx,sy,sw,sh,0,0,out.width,out.height);
      if (imageText.trim()) { ctx.font=`bold ${Math.max(22,Math.round(out.width/18))}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.lineWidth=Math.max(3,out.width/220); ctx.strokeStyle='#000'; ctx.fillStyle='#fff'; const tx=imageText.trim().slice(0,120); ctx.strokeText(tx,out.width/2,out.height-22); ctx.fillText(tx,out.width/2,out.height-22); }
      const blob=await new Promise(resolve=>out.toBlob(resolve,'image/jpeg',0.9)); if (!blob) throw new Error('تعذر تجهيز الصورة بعد التعديل');
      const kind = imageTarget === 'banner' ? 'banner' : 'chat';
      const path=`${session.user.id}/${kind}-${Date.now()}.jpg`;
      const {error:uploadError}=await supabase.storage.from('avatars').upload(path,blob,{upsert:false,contentType:'image/jpeg'}); if(uploadError) throw uploadError;
      const {data}=supabase.storage.from('avatars').getPublicUrl(path);
      if (imageTarget === 'banner') {
        const { error: metaError } = await supabase.auth.updateUser({ data: { ...(session.user.user_metadata || {}), banner_url: data.publicUrl } });
        if (metaError) throw metaError;
        setProfile(prev => ({ ...prev, banner_url: data.publicUrl }));
        setNotice('تم تعديل البانر وحفظه بنجاح.');
        closeImageEditor();
      } else {
        const sent=await insertChatBody(`__UPTRASID_IMAGE__:${data.publicUrl}`);
        if(sent){setNotice('تم إرسال الصورة بعد التعديل.');closeImageEditor();}
      }
    } catch(err) { setNotice(`تعذر ${imageTarget === 'banner' ? 'حفظ البانر' : 'إرسال الصورة'}: ${err?.message || 'خطأ غير معروف'}.`); }
    finally { setMediaBusy(false); setBannerBusy(false); }
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

  async function createTraderAccount(e) {
    e.preventDefault();
    if (!supabase || !isOwner) return setNotice('إنشاء الحساب متاح للمالك فقط.');
    const name=newTraderName.trim(), traderEmail=newTraderEmail.trim().toLowerCase();
    if (!name || !traderEmail || newTraderPassword.length < 8) return setNotice('اكتب اسم التاجر والبريد وكلمة مرور من 8 أحرف على الأقل.');
    setCreatingTrader(true); setNotice('جارٍ إنشاء حساب التاجر...');
    try {
      const {data,error}=await supabase.functions.invoke('owner-create-trader',{body:{displayName:name,email:traderEmail,password:newTraderPassword}});
      if(error) {
        let detail = '';
        // Supabase hides the JSON response behind error.context for non-2xx Edge Function responses.
        try {
          const response = error.context;
          if (response && typeof response.clone === 'function') {
            const payload = await response.clone().json();
            detail = payload?.error || payload?.message || '';
          }
        } catch (_) {}
        throw new Error(detail || error.message || 'تعذر الاتصال بوظيفة إنشاء الحساب');
      }
      if(data?.error) throw new Error(data.error);
      if(!data?.ok) throw new Error('الوظيفة لم تؤكد نجاح إنشاء الحساب. راجع سجلات Edge Function في Supabase.');
      setNewTraderName(''); setNewTraderEmail(''); setNewTraderPassword('');
      setNotice('تم إنشاء حساب التاجر.'); await loadOwnerData();
    } catch(err) { setNotice(`تعذر إنشاء الحساب: ${err?.message || 'خطأ غير معروف'}`); }
    finally { setCreatingTrader(false); }
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
        <button className="language-placeholder" type="button" title="تغيير اللغة قريبًا"><Globe size={17}/><span>العربية</span></button>
        <button className="glass-icon" onClick={logout} title="تسجيل الخروج" aria-label="تسجيل الخروج"><LogOut size={17}/></button>
      </div>
    </header>

    <main className="app-main">
      {notice && <div className="notice-bar"><CircleHelp size={16}/><span>{notice}</span><button onClick={() => setNotice('')}><X size={15}/></button></div>}

      {tab === 'orders' && <section className="chat-card glass">
        <div className="chat-heading"><div><h2>شات تجار ترستد</h2><p>المحادثة الجماعية</p></div>{isOwner && <span className="owner-chat-tag"><Crown size={14}/> المالك</span>}</div>
        <div className="messages-list" ref={messagesListRef} onScroll={handleMessagesScroll}>
          {messages.length === 0 && <div className="empty-chat"><MessageCircle size={29}/><strong>ابدأ المحادثة</strong><span>أول رسالة هنا هتظهر لكل التجار المفعّلين في نفس الشات.</span></div>}
          {messages.filter(m => !hiddenMessageIds.includes(String(m.id))).map(m => {
            const mine = m.sender_id === session.user.id;
            const reactions = reactionRows.filter(row => row.message_id === String(m.id)).reduce((acc, row) => {
              if (!acc[row.emoji]) acc[row.emoji] = { count: 0, mine: false };
              acc[row.emoji].count += 1;
              if (row.user_id === session.user.id) acc[row.emoji].mine = true;
              return acc;
            }, {});
            const canDeleteEveryone = mine || isOwner;
            return <article className={`message ${mine ? 'mine' : ''} ${messageMenu?.id === m.id ? 'message-menu-active' : ''}`} key={m.id}
              onTouchStart={() => beginMessageLongPress(m.id)} onTouchEnd={endMessageLongPress} onTouchMove={endMessageLongPress}
              onContextMenu={event => { event.preventDefault(); openMessageMenu(m.id); }}>
              <div className="message-avatar">{m.profiles?.avatar_url ? <img src={m.profiles.avatar_url} alt="" /> : (m.profiles?.display_name || 'ت').slice(0,1)}</div>
              <div className="message-content"><div className="message-meta"><strong>{m.profiles?.display_name || 'تاجر'} {m.profiles?.verified && <BadgeCheck size={14} className="verified-icon"/>}</strong><time>{new Date(m.created_at).toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'})}</time></div>{typeof m.body === 'string' && m.body.startsWith('__UPTRASID_IMAGE__:') ? <a className="message-photo-link" href={m.body.slice('__UPTRASID_IMAGE__:'.length)} target="_blank" rel="noreferrer"><img className="message-photo" src={m.body.slice('__UPTRASID_IMAGE__:'.length)} alt="صورة مرسلة في الشات" loading="lazy" onError={e => { e.currentTarget.style.display='none'; setNotice('الصورة محفوظة كرابط لكن المتصفح لم يستطع عرضها؛ راجع أن bucket avatars عام وأن الرابط يعمل.'); }}/></a> : typeof m.body === 'string' && m.body.startsWith('__UPTRASID_AUDIO__:') ? <div className="audio-message-wrap"><span className="audio-message-label"><Mic size={14}/> رسالة صوتية</span><audio className="audio-player" controls preload="metadata" src={m.body.slice('__UPTRASID_AUDIO__:'.length)} /></div> : typeof m.body === 'string' && m.body.startsWith('↪ رد على ') && m.body.includes('\n\n') ? <div className="reply-message-content"><div className="reply-message-quote">{m.body.split('\n\n')[0]}</div><p>{m.body.slice(m.body.indexOf('\n\n') + 2)}</p></div> : <p>{m.body}</p>}</div>
              {Object.keys(reactions).length > 0 && <div className="message-reactions">{Object.entries(reactions).map(([emoji, data]) => <button key={emoji} type="button" className={`reaction-chip ${data.mine ? 'mine-reaction' : ''}`} onClick={() => reactToMessage(m, emoji)}>{emoji}<small>{data.count}</small></button>)}</div>}
              {messageMenu?.id === m.id && <div className="message-action-popover" onTouchStart={event => event.stopPropagation()} onContextMenu={event => event.stopPropagation()}>
                <div className="quick-reactions">{QUICK_REACTIONS.map(emoji => <button type="button" key={emoji} onClick={() => reactToMessage(m, emoji)} aria-label={`رياكت ${emoji}`}>{emoji}</button>)}<button type="button" className="reaction-more" onClick={() => setReactionPickerOpen(value => !value)} aria-label="المزيد من الإيموجي">＋</button></div>
                {reactionPickerOpen && <div className="reaction-picker"><input aria-label="ابحث عن إيموجي" placeholder="ابحث عن إيموجي..." value={reactionSearch} onChange={event => setReactionSearch(event.target.value)} /><div>{visibleReactionChoices.map(([emoji, label]) => <button type="button" key={`${emoji}-${label}`} title={label} onClick={() => reactToMessage(m, emoji)}>{emoji}</button>)}</div></div>}
                <button type="button" onClick={() => chooseReply(m)}><MessageSquareReply size={15}/> رد على الرسالة</button>
                <button type="button" onClick={() => requestMessageAction('hide', m)}><span aria-hidden="true">◉</span> حذف لدي</button>
                {canDeleteEveryone && <button type="button" className="danger-action" onClick={() => requestMessageAction('delete', m)}><Trash2 size={15}/> حذف لدى الجميع</button>}
                <button type="button" className="close-message-menu" onClick={() => { setMessageMenu(null); setReactionPickerOpen(false); }}>إغلاق</button>
              </div>}
            </article>;
          })}
          <div ref={bottomRef} />
          {showScrollDown && <button type="button" className="scroll-bottom-btn" onClick={() => scrollChatToBottom(true)} aria-label="النزول لآخر الشات" title="آخر الرسائل"><ArrowDown size={19}/></button>}
        </div>
        {actionToast && <div className="chat-action-toast"><CheckCircle2 size={16}/>{actionToast}<button type="button" onClick={() => setActionToast('')} aria-label="إغلاق">×</button></div>}
        {pendingMessageAction && <div className="message-confirm-backdrop" role="presentation"><section className="message-confirm glass" role="dialog" aria-modal="true"><strong>{pendingMessageAction.type === 'delete' ? 'تأكيد حذف الرسالة لدى الجميع؟' : 'تأكيد حذف الرسالة من عندك؟'}</strong><p>{pendingMessageAction.type === 'delete' ? 'الرسالة هتتمسح من الشات عند كل المستخدمين، ومش هتقدر ترجعها.' : 'الرسالة هتختفي من جهازك فقط، وباقي الناس هتفضل شايفاها.'}</p><div><button type="button" className="btn-secondary" onClick={() => setPendingMessageAction(null)}>إلغاء</button><button type="button" className="btn-primary" onClick={confirmMessageAction}><Check size={17}/> تأكيد</button></div></section></div>}
        {emojiOpen && <div className="emoji-panel" aria-label="لوحة الإيموجي">{CHAT_EMOJIS.map((emoji, index) => <button type="button" key={`${emoji}-${index}`} onClick={() => addEmoji(emoji)} aria-label={`إضافة ${emoji}`}>{emoji}</button>)}</div>}
        {replyTo && <div className="reply-composer-bar"><MessageSquareReply size={16}/><div><strong>الرد على {replyTo.name}</strong><span>{replyTo.preview}</span></div><button type="button" onClick={() => setReplyTo(null)} aria-label="إلغاء الرد"><X size={16}/></button></div>}
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
        <form className="owner-create-form" onSubmit={createTraderAccount}>
          <h3><UserPlus size={18} style={{verticalAlign:'middle',marginLeft:7}}/> إنشاء حساب تجاري</h3>
          <input value={newTraderName} onChange={e=>setNewTraderName(e.target.value)} placeholder="اسم التاجر أو المتجر" required maxLength={80}/>
          <input type="email" value={newTraderEmail} onChange={e=>setNewTraderEmail(e.target.value)} placeholder="البريد الإلكتروني للتاجر" required dir="ltr"/>
          <input type="password" value={newTraderPassword} onChange={e=>setNewTraderPassword(e.target.value)} placeholder="كلمة مرور مؤقتة (8 أحرف على الأقل)" required minLength={8} dir="ltr"/>
          <button className="btn-primary" type="submit" disabled={creatingTrader}>{creatingTrader ? <LoaderCircle className="spin" size={17}/> : <UserPlus size={17}/>} {creatingTrader ? 'جارٍ الإنشاء...' : 'إنشاء الحساب التجاري'}</button>
        </form>
        <h3>طلبات الحسابات ({profiles.filter(p => p.role === 'trader' && p.status === 'pending').length})</h3>
        <div className="owner-list">{profiles.filter(p => p.role === 'trader').map(p => <div className="owner-row" key={p.id}><div><strong>{p.display_name}</strong><small>{p.status} · {p.verified ? 'موثّق' : 'غير موثّق'}</small></div><div className="owner-actions">{p.status === 'pending' ? <button className="mini-approve" onClick={() => approveTrader(p.id)}>قبول</button> : p.status === 'active' ? <button className="mini-reject" onClick={() => suspendTrader(p.id)}>إيقاف</button> : null}</div></div>)}</div>
        <h3>طلبات التوثيق ({verificationRequests.length})</h3>
        <div className="owner-list">{verificationRequests.map(req => <div className="owner-row" key={req.id}><div><strong>{req.profiles?.display_name || 'تاجر'}</strong><small>طلب توثيق · {new Date(req.created_at).toLocaleDateString('ar-EG')}</small></div><div className="owner-actions"><button className="mini-approve" onClick={() => reviewVerification(req, true)}>توثيق</button><button className="mini-reject" onClick={() => reviewVerification(req, false)}>رفض</button></div></div>)}</div>
      </section>}

      {imageDraft && <div className="image-editor-backdrop" role="dialog" aria-modal="true" aria-label="تعديل الصورة قبل الإرسال">
        <section className="image-editor">
          <div className="image-editor-top"><strong>{imageTarget === 'banner' ? 'تعديل البانر قبل الحفظ' : 'تعديل الصورة قبل الإرسال'}</strong><button className="btn-secondary" type="button" onClick={closeImageEditor}><X size={17}/> إلغاء</button></div>
          <div className="image-editor-preview">
            <img src={imageDraft.url} alt="معاينة الصورة" onLoad={e=>{const c=imageCanvasRef.current;if(c){c.width=e.currentTarget.naturalWidth;c.height=e.currentTarget.naturalHeight;}}} style={{filter:imageBlur?'blur(4px)':'none'}}/>
            <canvas ref={imageCanvasRef} onPointerDown={beginImageDraw} onPointerMove={moveImageDraw} onPointerUp={()=>{imageDrawingRef.current=false;}} onPointerCancel={()=>{imageDrawingRef.current=false;}} />
            {imageText.trim() && <span style={{position:'absolute',left:8,right:8,bottom:12,textAlign:'center',fontWeight:800,fontSize:22,color:'#fff',textShadow:'-2px -2px #000,2px 2px #000,0 0 8px #000',pointerEvents:'none'}}>{imageText}</span>}
          </div>
          <div className="image-editor-tools">
            <select aria-label="مقاس الصورة" value={imageRatio} onChange={e=>setImageRatio(e.target.value)}><option value="original">المقاس الأصلي</option><option value="square">قص مربع 1:1</option><option value="landscape">قص عريض 16:9</option></select>
            <button type="button" className={imageBlur?'selected':''} onClick={()=>setImageBlur(v=>!v)}><Eraser size={15}/> تشويش الصورة</button>
            <button type="button" className={imageDrawMode==='pen'?'selected':''} onClick={()=>setImageDrawMode('pen')}><PenLine size={15}/> رسم / خط</button>
            <button type="button" className={imageDrawMode==='blur'?'selected':''} onClick={()=>setImageDrawMode('blur')}><Eraser size={15}/> تشويش بالقلم</button>
            <input value={imageText} onChange={e=>setImageText(e.target.value)} placeholder="اكتب نص يظهر على الصورة" maxLength={120}/>
          </div>
          <div className="image-editor-actions"><button type="button" className="btn-secondary" onClick={()=>{const c=imageCanvasRef.current;if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);setImageText('');setImageBlur(false);}}>مسح التعديلات</button><button type="button" className="btn-primary" onClick={sendEditedImage} disabled={mediaBusy}>{mediaBusy ? <LoaderCircle className="spin" size={17}/> : imageTarget === 'banner' ? <Check size={17}/> : <Send size={17}/>} {imageTarget === 'banner' ? 'حفظ البانر' : 'إرسال الصورة'}</button></div>
        </section>
      </div>}

      <nav className="bottom-dock glass" aria-label="التنقل الرئيسي">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><MessageCircle/><span>Chat</span></button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}><UserRound/><span>Profile</span></button>
        {isOwner && <button className={tab === 'owner' ? 'active' : ''} onClick={() => {setTab('owner');loadOwnerData();}}><Crown/><span>المالك</span></button>}
      </nav>
    </main>
  </div>;
}