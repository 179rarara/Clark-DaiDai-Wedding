import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowDownRight, ArrowUpRight, CalendarDays, Camera, ChevronUp, Clock3,
  Heart, LockKeyhole, Loader2, LogIn, MapPin, Menu, MessageCircle, Plane,
  Quote, Send, Sparkles, UserRound, X,
} from "lucide-react";

type Language = "en" | "zh";
type PlaceKey = "hong-kong" | "tianjin" | "california";
type MessagePlace = "general" | PlaceKey;

const browserLanguage = (): Language => {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("wedding-language");
    if (saved === "en" || saved === "zh") return saved;
  }
  return typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
};
const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const places: Array<{ key: PlaceKey; number: string; name: string; chinese: string; date: string; status: string; tagline: { en: string; zh: string }; copy: { en: string; zh: string }; image?: string }> = [
  { key: "hong-kong", number: "01", name: "Hong Kong", chinese: "香港登记", date: "2025.12.09", status: "completed", tagline: { en: "the beginning", zh: "故事的开始" }, copy: { en: "We first became family in the eyes of the law. A small ceremony, giving our forever a name.", zh: "我们先成为法律上的家人。小小的仪式，让“以后”有了正式的名字。" }, image: "/photos/wedding-details.webp" },
  { key: "tianjin", number: "02", name: "Tianjin", chinese: "天津主婚礼", date: "2026.05.22", status: "completed", tagline: { en: "the celebration", zh: "盛大的庆祝" }, copy: { en: "Our people gathered around us, and we shared this happiness with everyone we love.", zh: "亲友围成一圈，烛光亮起来，我们把这份幸福分享给所有爱我们的人。" }, image: "/photos/wedding-table.webp" },
  { key: "california", number: "03", name: "California", chinese: "加利福尼亚", date: "coming soon", status: "coming soon", tagline: { en: "still unfolding", zh: "未完待续" }, copy: { en: "A date we have not chosen yet, already waiting inside our future. This chapter is still ours to write.", zh: "还未决定的日期，已经先被我们放进未来。这一章，等我们一起写下。" } },
];

const photos = [
  { src: "/photos/wedding-embrace.webp", alt: "A couple embracing at sunset", label: "Hong Kong / golden hour", place: "hong-kong" as PlaceKey },
  { src: "/photos/wedding-details.webp", alt: "Wedding rings and flowers beside vows", label: "Hong Kong / the little things", place: "hong-kong" as PlaceKey },
  { src: "/photos/wedding-table.webp", alt: "An intimate candlelit wedding table", label: "Tianjin / afterglow", place: "tianjin" as PlaceKey },
];

const chapters = [
  { number: "01", title: { en: "Before the yes", zh: "在那句我愿意以前" }, copy: { en: "From late-night coffee to calling the future ours.", zh: "从喝到天亮的咖啡，到我们开始把“以后”说成“我们”。" }, date: "2019 — 2023" },
  { number: "02", title: { en: "The day we said yes", zh: "我们说我愿意" }, copy: { en: "A circle of beloved people, and our hands finding each other.", zh: "亲爱的人们围成一圈，而我们把手交给彼此。" }, date: "three places · one story" },
  { number: "03", title: { en: "And then, every day", zh: "然后，日子继续" }, copy: { en: "Our wedding was not an ending, but a way to keep collecting ordinary days.", zh: "婚礼不是故事的句点，而是我们收藏平凡日子的开始。" }, date: "forever onward" },
];

const copy = {
  en: {
    navJourney: "Three weddings", navStory: "Our story", navGuestbook: "Guestbook", login: "Private entrance", logout: "Sign out", explore: "Explore",
    kicker: "PRIVATE WEDDING ARCHIVE · THREE PLACES, ONE STORY", heroIntro: "For the people who witnessed us, love us, and want to remember this journey with us.",
    unlockEyebrow: "A PRIVATE PLACE FOR OUR PEOPLE", unlockTitle: "This little archive,", unlockEmphasis: "just for our people.", unlockCopy: "Sign in to see the complete story, photographs, and notes from every chapter. Private by design, made for the people we love.", signIn: "Enter privately", gentleCorner: "A gentle corner for our people",
    journeyLabel: "OUR JOURNEY", journeyTitle: "Three places,", journeyEmphasis: "one story.", journeyLead: "Our wedding was never only one day. It travelled through cities and time, slowly becoming what it is now.", completed: "COMPLETED", comingSoon: "COMING SOON", route: "Hong Kong → Tianjin → California", stillUnfolding: "still unfolding",
    storyLabel: "OUR STORY", storyEyebrow: "A NOTE FROM US", storyTitle: "Some days are", storyEmphasis: "worth returning to.", storyOne: "Thank you for arriving here. After the celebrations, we wanted to keep the light, laughter, and every moment of being held by love.", storyTwo: "This little place does not need to be complete. It only needs to hold the pieces we never want to forget, and the people who made them ours.", withLove: "with all our love,",
    chaptersLabel: "THE CHAPTERS", archiveLabel: "THE ARCHIVE", archiveTitle: "A place for", archiveEmphasis: "our photographs.", allJourney: "All chapters", frames: "frames", wander: "click a frame to wander", emptyTitle: "California is waiting for its date.", emptyCopy: "When the time comes, we will place the next chapter here.",
    guestLabel: "FROM OUR PEOPLE", guestTitle: "Leave a line", guestEmphasis: "for our future selves.", guestIntro: "Everyone who has shared this journey with us can leave a little note here.", writeTitle: "write us a little note", whichChapter: "Which chapter does this belong to?", wholeJourney: "The whole journey", oneLine: "A line for us", more: "Want to say a little more?", optional: "optional", placeholderNote: "For example: Hong Kong was small, but your happiness filled the room.", placeholderMore: "A memory, a blessing, or anything you want us to carry…", leave: "Leave this note", saving: "Saving…", privateWall: "Only signed-in guests can see this wall", notesFrom: "notes from our people", firstNote: "It is quiet here for now. You can be the first to leave a line.", written: "written",
    noteLine: "In every version of “I do”,", noteEmphasis: "we choose each other every day.", footer: "made with love, for the memories", journeyDate: "three places · always together", forever: "2025 — forever",
  },
  zh: {
    navJourney: "三场婚礼", navStory: "我们的故事", navGuestbook: "亲友寄语", login: "私人入口", logout: "退出登录", explore: "向下探索",
    kicker: "私人婚礼档案 · 三个地方，一段故事", heroIntro: "给那些见证我们、爱着我们，也想一起记住这段旅程的人。",
    unlockEyebrow: "只留给我们亲友的地方", unlockTitle: "这本相簿，", unlockEmphasis: "只留给我们的人。", unlockCopy: "登录后可以看见每一章的完整故事、照片与亲友寄语。只对亲友开放，把最柔软的记忆留给你。", signIn: "进入私人入口", gentleCorner: "给亲友的温柔角落",
    journeyLabel: "三地旅程", journeyTitle: "三个地方，", journeyEmphasis: "一段故事。", journeyLead: "我们的婚礼不只发生在一天。它沿着城市与时间，慢慢长成现在的样子。", completed: "已完成", comingSoon: "即将到来", route: "香港 → 天津 → 加利福尼亚", stillUnfolding: "故事仍在继续",
    storyLabel: "我们的故事", storyEyebrow: "写给亲友", storyTitle: "有些日子，", storyEmphasis: "值得一再回去。", storyOne: "谢谢你来到这里。婚礼结束之后，我们一直想把那天的光、笑声，还有每一个被好好爱着的瞬间保存下来。", storyTwo: "所以有了这个小小的地方。它不追求完整，只想留下一些我们不想忘记的片段，和让这三个日子成为“我们”的你。", withLove: "爱我们的，",
    chaptersLabel: "故事章节", archiveLabel: "照片收藏", archiveTitle: "为我们的", archiveEmphasis: "照片留一个位置。", allJourney: "全部旅程", frames: "张照片", wander: "点击照片漫游", emptyTitle: "加利福尼亚正在等待一个日期。", emptyCopy: "等时间到了，我们会把下一章放进这里。",
    guestLabel: "来自亲友", guestTitle: "留下一句话，", guestEmphasis: "给未来的我们。", guestIntro: "每一位分享过这段旅程的人，都可以在这里留下一点话。", writeTitle: "写一句话给我们", whichChapter: "这句话属于哪一章？", wholeJourney: "整段旅程", oneLine: "给我们的一句话", more: "想再多说一点吗？", optional: "可选", placeholderNote: "例如：香港那天虽然很小，但你们的幸福填满了整个房间。", placeholderMore: "一段回忆、一句祝福，或任何你想让我们带走的话……", leave: "留下这句话", saving: "正在保存…", privateWall: "只有登录的亲友能看见这面留言墙", notesFrom: "来自亲友的留言", firstNote: "这里暂时还是安静的。你可以成为第一位留下话的人。", written: "写于",
    noteLine: "在所有“我愿意”里，", noteEmphasis: "我们最喜欢的是每天再说一次。", footer: "为回忆而写，带着爱", journeyDate: "三个地方 · 始终相伴", forever: "2025 — 永远",
  },
};

const placeLabel = (place: MessagePlace, language: Language) => ({ general: language === "en" ? "The whole journey" : "整段旅程", "hong-kong": language === "en" ? "Hong Kong" : "香港登记", tianjin: language === "en" ? "Tianjin" : "天津主婚礼", california: language === "en" ? "California" : "加利福尼亚" })[place];

export default function Home() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [language, setLanguage] = useState<Language>(browserLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [weddingsOpen, setWeddingsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[number] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceKey | "all">("all");
  const [guestPlace, setGuestPlace] = useState<MessagePlace>("general");
  const [guestNote, setGuestNote] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const t = copy[language];
  const closeMenu = () => { setMenuOpen(false); setWeddingsOpen(false); };
  const visiblePhotos = selectedPlace === "all" ? photos : photos.filter((photo) => photo.place === selectedPlace);
  const utils = trpc.useUtils();
  const guestbookQuery = trpc.guestbook.list.useQuery(undefined, { enabled: isAuthenticated });
  const createMessage = trpc.guestbook.create.useMutation({ onSuccess: async () => { setGuestNote(""); setGuestMessage(""); setGuestPlace("general"); await utils.guestbook.list.invalidate(); } });
  const submitMessage = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!guestNote.trim() || createMessage.isPending) return; createMessage.mutate({ place: guestPlace, guestNote: guestNote.trim(), message: guestMessage.trim() || undefined }); };
  useEffect(() => { localStorage.setItem("wedding-language", language); document.documentElement.lang = language === "en" ? "en" : "zh-CN"; }, [language]);

  return <main className="site-shell">
    <header className="site-nav">
      <button className="wordmark" onClick={() => scrollToId("top")} aria-label="Home"><span className="wordmark-mark">黛珂</span><span className="wordmark-sub">Clark &amp; Dai Dai&apos;s Wedding Site</span></button>
      <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`} aria-label="Primary navigation">
        <div className="weddings-nav" onMouseEnter={() => setWeddingsOpen(true)} onMouseLeave={() => setWeddingsOpen(false)}><button onClick={() => scrollToId("journey")}>{t.navJourney}</button>{weddingsOpen && <div className="weddings-dropdown">{places.map((place) => <button key={place.key} onClick={() => { setSelectedPlace(place.key); scrollToId("archive"); closeMenu(); }}><span>{language === "en" ? place.name : place.chinese}</span><small>{place.date === "coming soon" ? t.comingSoon : place.date}</small></button>)}</div>}</div>
        <button onClick={() => { scrollToId("story"); closeMenu(); }}>{t.navStory}</button><button onClick={() => { scrollToId("guestbook"); closeMenu(); }}>{t.navGuestbook}</button><button className="language-toggle" onClick={() => setLanguage((current) => current === "en" ? "zh" : "en")} aria-label="Switch language"><span className={language === "en" ? "language-active" : ""}>E</span><span>/</span><span className={language === "zh" ? "language-active" : ""}>中</span></button><span className="nav-divider" />
        {isAuthenticated ? <button className="nav-login" onClick={() => void logout()}><span>{user?.name ?? t.logout}</span><ArrowUpRight size={15} /></button> : <button className="nav-login" onClick={() => startLogin()}><LockKeyhole size={14} /><span>{t.login}</span></button>}
      </nav>
      <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Open navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </header>

    <section id="top" className="hero-section"><div className="hero-media" aria-hidden="true"><img src="/clark-daidai-hero.webp" alt="" /><div className="hero-shade" /></div><div className="hero-content page-container"><div className="hero-kicker reveal-up">{t.kicker}</div><h1 className="hero-title reveal-up delay-1">{language === "en" ? <>Our<br /><em>forever</em><br />starts here.</> : <>我们的<br /><em>永远</em><br />从这里开始。</>}</h1><p className="hero-intro reveal-up delay-2">{t.heroIntro}</p><button className="hero-scroll reveal-up delay-3" onClick={() => scrollToId(isAuthenticated ? "journey" : "unlock")}><span>{t.explore}</span><span className="scroll-line" /><ArrowDownRight size={17} /></button></div><div className="hero-stamp" aria-hidden="true"><span>黛</span><span className="stamp-heart">♡</span><span>珂</span></div></section>

    {!isAuthenticated && !authLoading ? <section id="unlock" className="unlock-section page-container"><div className="unlock-card"><div className="unlock-icon"><LockKeyhole size={20} strokeWidth={1.5} /></div><div className="unlock-copy"><p className="eyebrow">{t.unlockEyebrow}</p><h2>{t.unlockTitle}<br /><em>{t.unlockEmphasis}</em></h2><p>{t.unlockCopy}</p></div><button className="primary-button" onClick={() => startLogin()}><LogIn size={16} /><span>{t.signIn}</span><ArrowUpRight size={16} /></button></div><div className="unlock-note"><Sparkles size={15} /> {t.gentleCorner}</div></section> : <>
      <section id="journey" className="journey-section page-container"><div className="section-heading-row journey-heading"><div><div className="section-label">01 <span>/</span> {t.journeyLabel}</div><h2>{t.journeyTitle}<br /><em>{t.journeyEmphasis}</em></h2></div><p className="journey-lede">{t.journeyLead}</p></div><div className="place-grid">{places.map((place) => <button key={place.key} className={`place-card ${place.status === "coming soon" ? "place-card-future" : ""} ${selectedPlace === place.key ? "place-card-active" : ""}`} onClick={() => { setSelectedPlace(place.key); scrollToId("archive"); }}><div className="place-image">{place.image ? <img src={place.image} alt={place.chinese} /> : <div className="future-art"><Plane size={30} strokeWidth={1} /><span>the next chapter</span></div>}<div className="place-image-shade" /><span className="place-number">{place.number}</span><span className="place-status">{place.status === "coming soon" ? t.comingSoon : t.completed}</span></div><div className="place-info"><div className="place-title-row"><div><p>{place.tagline[language]}</p><h3>{place.name}</h3><span>{place.chinese}</span></div><ArrowUpRight size={19} /></div><div className="place-date"><CalendarDays size={14} /> {place.date}</div><p className="place-copy">{place.copy[language]}</p></div></button>)}</div><div className="journey-foot"><span><MapPin size={14} /> {t.route}</span><span>{t.stillUnfolding} <Clock3 size={14} /></span></div></section>
      <section id="story" className="story-section page-container"><div className="section-label">02 <span>/</span> {t.storyLabel}</div><div className="story-grid"><div className="story-heading"><p className="eyebrow">{t.storyEyebrow}</p><h2>{t.storyTitle}<br /><em>{t.storyEmphasis}</em></h2></div><div className="story-copy"><p className="drop-cap">{language === "en" ? "T" : "谢"}</p><p>{t.storyOne}</p><p>{t.storyTwo}</p><div className="story-signature">{t.withLove}<br /><span>黛珂 / Clark &amp; Dai Dai</span></div></div></div><div className="story-rule"><span /> <Heart size={14} fill="currentColor" /> <span /></div></section>
      <section className="chapters-section page-container"><div className="section-label">03 <span>/</span> {t.chaptersLabel}</div><div className="chapters-list">{chapters.map((chapter) => <article className="chapter-row" key={chapter.number}><span className="chapter-number">{chapter.number}</span><div className="chapter-main"><p className="chapter-english">{chapter.title.en}</p><h3>{chapter.title[language]}</h3></div><p className="chapter-copy">{chapter.copy[language]}</p><span className="chapter-date">{chapter.date}</span></article>)}</div></section>
      <section id="archive" className="archive-section page-container"><div className="section-heading-row"><div><div className="section-label">04 <span>/</span> {t.archiveLabel}</div><h2>{t.archiveTitle}<br /><em>{t.archiveEmphasis}</em></h2></div><div className="archive-meta"><Camera size={17} /><span>{visiblePhotos.length.toString().padStart(2, "0")} {t.frames}<br />from our journey</span></div></div><div className="place-filter" role="tablist"><button className={selectedPlace === "all" ? "filter-active" : ""} onClick={() => setSelectedPlace("all")}>{t.allJourney}</button>{places.map((place) => <button key={place.key} className={selectedPlace === place.key ? "filter-active" : ""} onClick={() => setSelectedPlace(place.key)}>{place.name}<span>{place.date}</span></button>)}</div>{visiblePhotos.length > 0 ? <div className="gallery-grid">{visiblePhotos.map((photo) => <button className={`gallery-card ${visiblePhotos.length === 1 ? "gallery-single" : ""}`} key={photo.src} onClick={() => setSelectedPhoto(photo)}><img src={photo.src} alt={photo.alt} /><span className="gallery-overlay"><span>{photo.label}</span><ArrowUpRight size={18} /></span></button>)}</div> : <div className="empty-place"><Plane size={25} /><p>{t.emptyTitle}</p><span>{t.emptyCopy}</span></div>}<div className="gallery-footnote"><span>photos we keep close</span><span>{t.wander} <ArrowDownRight size={14} /></span></div></section>
      <section id="guestbook" className="guestbook-section page-container"><div className="section-heading-row guestbook-heading"><div><div className="section-label">05 <span>/</span> {t.guestLabel}</div><h2>{t.guestTitle}<br /><em>{t.guestEmphasis}</em></h2></div><div className="guestbook-intro"><MessageCircle size={19} /><p>{t.guestIntro}</p></div></div><div className="guestbook-layout"><form className="guestbook-form" onSubmit={submitMessage}><div className="form-title"><Sparkles size={16} /><span>{t.writeTitle}</span></div><label>{t.whichChapter}<select value={guestPlace} onChange={(event) => setGuestPlace(event.target.value as MessagePlace)}><option value="general">{t.wholeJourney}</option><option value="hong-kong">Hong Kong · 2025.12.09</option><option value="tianjin">Tianjin · 2026.05.22</option><option value="california">California · {t.comingSoon}</option></select></label><label>{t.oneLine} <span className="field-hint">{guestNote.length}/280</span><textarea required value={guestNote} onChange={(event) => setGuestNote(event.target.value)} maxLength={280} rows={3} placeholder={t.placeholderNote} /></label><label>{t.more} <span className="optional">{t.optional}</span><textarea value={guestMessage} onChange={(event) => setGuestMessage(event.target.value)} maxLength={2000} rows={4} placeholder={t.placeholderMore} /></label>{createMessage.error && <p className="form-error">{createMessage.error.message}</p>}<button className="primary-button form-submit" type="submit" disabled={createMessage.isPending}><span>{createMessage.isPending ? t.saving : t.leave}</span>{createMessage.isPending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}</button><p className="form-privacy"><LockKeyhole size={12} /> {t.privateWall}</p></form><div className="messages-wall"><div className="messages-wall-head"><span>{guestbookQuery.data?.length ?? 0} {t.notesFrom}</span><Heart size={15} fill="currentColor" /></div>{guestbookQuery.isLoading ? <div className="messages-empty"><Loader2 size={22} className="spin" /><span>{language === "en" ? "Bringing everyone’s words back…" : "正在把大家的话带回来……"}</span></div> : guestbookQuery.data?.length ? <div className="messages-list">{guestbookQuery.data.map((message) => <article className="message-card" key={message.id}><div className="message-meta"><span className="message-avatar"><UserRound size={15} /></span><span>{message.authorName}</span><span className="message-place">{placeLabel(message.place as MessagePlace, language)}</span></div><p className="message-note">“{message.guestNote}”</p>{message.message && <p className="message-body">{message.message}</p>}<time>{t.written} {new Date(message.createdAt).toLocaleDateString(language === "en" ? "en-US" : "zh-CN", { year: "numeric", month: "long", day: "numeric" })}</time></article>)}</div> : <div className="messages-empty"><MessageCircle size={25} /><span>{t.firstNote}</span></div>}</div></div></section>
      <section id="note" className="note-section page-container"><div className="note-card"><div className="note-flower">✳</div><Quote size={34} strokeWidth={1} className="quote-mark" /><p>{t.noteLine}<br /><em>{t.noteEmphasis}</em></p><span className="note-caption">— written somewhere between then &amp; now</span></div><div className="location-line"><MapPin size={15} /><span>{t.journeyDate}</span><CalendarDays size={15} /><span>{t.forever}</span></div></section>
    </>}
    <footer className="site-footer page-container"><div className="footer-mark">黛珂</div><div className="footer-copy">{t.footer}<br /><span>© Clark &amp; Dai Dai</span></div><button className="back-top" onClick={() => scrollToId("top")} aria-label="Back to top"><ChevronUp size={18} /></button></footer>
    {selectedPhoto && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo preview" onClick={() => setSelectedPhoto(null)}><button className="lightbox-close" onClick={() => setSelectedPhoto(null)} aria-label="Close photo"><X size={22} /></button><img src={selectedPhoto.src} alt={selectedPhoto.alt} onClick={(event) => event.stopPropagation()} /><span className="lightbox-label">{selectedPhoto.label}</span></div>}
  </main>;
}
