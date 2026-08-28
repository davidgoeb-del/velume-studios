import React, { useState, useEffect, useRef } from 'react';
import { CATEGORY_COLORS } from './data';
import { Capacitor } from '@capacitor/core';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Volume2, Bookmark, BookOpen, Music, Play, Pause, VolumeX, Sparkles, Disc, Waves, ArrowUp, Share2, ChevronLeft, ChevronRight, ChevronUp, CheckCircle2, Sun, Activity, Users, Briefcase, Heart, Leaf, GraduationCap, Home, TrendingUp, Trophy, Lock, X, Headphones } from 'lucide-react';
import { PhraseItem, LocaleCatalog } from './types';
import { STORIES_DATA, StoryItem } from './storiesData';
import storiesEnData from './stories_en.json';
import { PurchasesService } from './purchases';

const storiesEn = storiesEnData as Record<string, { american_moment_en: string; reflection_en: string }>;


// Import localized catalogs
import jaLocale from './locales/ja.json';
import zhTWLocale from './locales/zh-TW.json';
import koLocale from './locales/ko.json';
import thLocale from './locales/th.json';
import viLocale from './locales/vi.json';
import storiesZhData from './locales/stories_zh.json';
import storiesKoData from './locales/stories_ko.json';
import storiesThData from './locales/stories_th.json';
import storiesViData from './locales/stories_vi.json';
import storiesJaData from './locales/stories_ja.json';

const storiesJa = storiesJaData as Record<string, {
  title_ja: string;
  teaser_ja: string;
  vocab: Array<{
    word: string;
    def_ja: string;
    example_ja?: string;
  }>;
  expressions: Array<{
    phrase: string;
    usage_ja: string;
    examples_ja: string[];
  }>;
  american_moment_ja: string;
  reflection_ja: string;
}>;

const storiesZh = storiesZhData as Record<string, {
  title_zh: string;
  teaser_zh: string;
  vocab: Array<{
    word: string;
    def_zh: string;
    example_zh?: string;
  }>;
  expressions: Array<{
    phrase: string;
    usage_zh: string;
    examples_zh: string[];
  }>;
  american_moment_zh: string;
  reflection_zh: string;
}>;

const storiesKo = storiesKoData as Record<string, {
  title_ko: string;
  teaser_ko: string;
  vocab: Array<{
    word: string;
    def_ko: string;
    example_ko?: string;
  }>;
  expressions: Array<{
    phrase: string;
    usage_ko: string;
    examples_ko: string[];
  }>;
  american_moment_ko: string;
  reflection_ko: string;
}>;

const storiesTh = storiesThData as Record<string, {
  title_th: string;
  teaser_th: string;
  vocab: Array<{
    word: string;
    def_th: string;
    example_th?: string;
  }>;
  expressions: Array<{
    phrase: string;
    usage_th: string;
    examples_th: string[];
  }>;
  american_moment_th: string;
  reflection_th: string;
}>;

const storiesVi = storiesViData as Record<string, {
  title_vi: string;
  teaser_vi: string;
  vocab: Array<{
    word: string;
    def_vi: string;
    example_vi?: string;
  }>;
  expressions: Array<{
    phrase: string;
    usage_vi: string;
    examples_vi: string[];
  }>;
  american_moment_vi: string;
  reflection_vi: string;
}>;
const CATEGORY_STYLES = CATEGORY_COLORS;

const HOME_STYLE = {
  name: 'Home',
  subtitle: 'American Life Moments',
  bgColor: '#FAF6F0',     // cozy warm milk foam / cream
  borderColor: '#DEC9C1', // gentle light cocoa
  textColor: '#7C5E39',   // warm roasted espresso bronze
  pillBg: '#F5EDD6',      // cozy chamomile gold
  pillText: '#7C5E39'
};

const NOTEBOOK_STYLE = {
  name: 'Notebook',
  subtitle: 'My Saved Notebook',
  bgColor: '#FDFaf5',     
  borderColor: '#E4DFD5', 
  textColor: '#5A4636',   
  pillBg: '#EFEBE3',
  pillText: '#5A4636'
};

const TRACKS = [
  { id: 'marigold', name: 'Marigold', file: 'marigold_lofi.mp3', abbr: 'mgd' },
  { id: 'not_my_sun', name: 'Not My Sun (Smokey Jazz)', file: 'Not My Sun (LowFi Smokey Jazz Mix).mp3', abbr: 'nms' },
  { id: 'pavement', name: 'Wet Pavement', file: 'Wet Pavement Zen.mp3', abbr: 'wp' },
  { id: 'stonewater', name: 'Stonewater Hymn', file: 'Stonewater Hymn.mp3', abbr: 'sh' },
  { id: 'velvet', name: 'Velvet Pressure', file: 'Velvet Pressure.mp3', abbr: 'vp' },
  { id: 'harmonic', name: 'Harmonic Safety', file: 'Harmonic Safety.mp3', abbr: 'hs' }
];

interface LevelItem {
  id: number;
  title: string;
  title_ja: string;
  title_zh: string;
  title_ko: string;
  title_th: string;
  title_vi: string;
  description: string;
  description_ja: string;
  description_zh: string;
  description_ko: string;
  description_th: string;
  description_vi: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  pillBg: string;
  pillText: string;
}

const LEVELS_DATA: LevelItem[] = [
  {
    "id": 1,
    "title": "Daily Foundations",
    "title_ja": "日常会話の基礎",
    "title_zh": "日常會話基礎",
    "title_ko": "일상 회화의 기초",
    "title_th": "พื้นฐานในชีวิตประจำวัน",
    "title_vi": "Nền tảng Hàng ngày",
    "description": "Master essential morning routines, neighborhood chat, and visiting a doctor.",
    "description_ja": "朝の会話、近所の紹介、風邪をひいた時のやり取りなど、暮らしの基本フレーズを学びます。",
    "description_zh": "學習早晨對話、社區介紹、看醫生等生活基本片語。",
    "description_ko": "아침 루틴, 우리 동네 소개, 병원 진료 등 일상생활의 기초가 되는 표현들을 배웁니다.",
    "description_th": "ฝึกฝนกิจวัตรยามเช้าที่สำคัญ การพูดคุยกับเพื่อนบ้าน และการไปหาหมอ",
    "description_vi": "Làm chủ các thói quen buổi sáng thiết yếu, trò chuyện hàng xóm và đi khám bác sĩ.",
    "emoji": "🌅",
    "bgColor": "#ebf7f5",
    "borderColor": "#b8dad4",
    "textColor": "#3d6e65",
    "pillBg": "#ebf7f5",
    "pillText": "#3d6e65"
  },
  {
    "id": 2,
    "title": "Everyday Rhythms",
    "title_ja": "日々の暮らしの習慣",
    "title_zh": "日常生活習慣",
    "title_ko": "일상의 습관과 리듬",
    "title_th": "จังหวะชีวิตประจำวัน",
    "title_vi": "Nhịp sống Thường nhật",
    "description": "Discuss habits, simple living, digital detox, and cultural comfort food.",
    "description_ja": "貯金やシンプルライフ、スマホ依存 of 対策、懐かしの味など、日常の習慣にまつわる会話です。",
    "description_zh": "關於儲蓄、極簡生活、數位排毒、懷舊美食等日常習慣的對話。",
    "description_ko": "저축, 미니멀 라이프, 스마트폰 디톡스, 추억의 소울푸드 등 생활 습ดับ에 대한 대화입니다.",
    "description_th": "พูดคุยเกี่ยวกับนิสัยส่วนตัว การใช้ชีวิตแบบเรียบง่าย การดีท็อกซ์หน้าจอ และอาหารที่เยียวยาจิตใจ",
    "description_vi": "Thảo luận về các thói quen, lối sống giản dị, cai nghiện thiết bị số và các món ăn truyền thống đem lại sự thoải mái.",
    "emoji": "🌿",
    "bgColor": "#fefaec",
    "borderColor": "#ecd29b",
    "textColor": "#8c6820",
    "pillBg": "#fefaec",
    "pillText": "#8c6820"
  },
  {
    "id": 3,
    "title": "Social Connections",
    "title_ja": "人とのつながり",
    "title_zh": "人際關係與社交",
    "title_ko": "사람과의 연결과 소통",
    "title_th": "ความสัมพันธ์และการพบปะผู้คน",
    "title_vi": "Kết nối Xã hội",
    "description": "Practice school interactions, team sports, daily commuting, and nature outings.",
    "description_ja": "新学期の緊張、週末のスポーツ、毎日の通勤、自然散策など、社会的なシーンを体験します。",
    "description_zh": "體驗開學的緊張感、周末運動、每日通勤、親近自然等社交場景。",
    "description_ko": "첫 등교의 긴장감, 주말 스포츠 활동, 매일의 출퇴근, 자연으로의 소풍 등 다양한 사회적 상황을 연습합니다.",
    "description_th": "ฝึกการพูดคุยในสถานศึกษา กีฬาประเภททีม การเดินทางไปทำงานประจำวัน และการท่องเที่ยวตามธรรมชาติ",
    "description_vi": "Thực hành giao tiếp ở trường học, thể thao đồng đội, đi làm hàng ngày và dã ngoại ngoài thiên nhiên.",
    "emoji": "📚",
    "bgColor": "#f6effa",
    "borderColor": "#d9c9e0",
    "textColor": "#7b5083",
    "pillBg": "#f6effa",
    "pillText": "#7b5083"
  },
  {
    "id": 4,
    "title": "Career & Creativity",
    "title_ja": "キャリアとクリエイティビティ",
    "title_zh": "職涯與創意表達",
    "title_ko": "커리어와 창의성",
    "title_th": "หน้าที่การงานและความคิดสร้างสรรค์",
    "title_vi": "Sự nghiệp & Sáng tạo",
    "description": "Explore shopping habits, movie dates, job interviews, and creative hobbies.",
    "description_ja": "買い物、영화 데이트, job interviews, 料理の失敗など、キャリアや趣味に関する会話を深めます。",
    "description_zh": "深入探討購物、電影約會、求職面試、烹飪失敗等職涯與興趣相關의 對話。",
    "description_ko": "쇼핑 습관, 영화 데이트, 구직 면접, 요리 실수 등 커리어와 취미 활동에 대한 흥미로운 대화입니다.",
    "description_th": "สำรวจนิสัยการช้อปปิ้ง การเดทดูหนัง การสัมภาษณ์งาน และงานอดิเรกที่สร้างสรรค์",
    "description_vi": "Khám phá thói quen mua sắm, hẹn hò xem phim, phỏng vấn xin việc và các sở thích sáng tạo.",
    "emoji": "💼",
    "bgColor": "#faf0eb",
    "borderColor": "#e5bfb3",
    "textColor": "#a35740",
    "pillBg": "#faf0ed",
    "pillText": "#a35740"
  },
  {
    "id": 5,
    "title": "Leisure & Wellness",
    "title_ja": "余暇とウェルネス",
    "title_zh": "休閒與身心健康",
    "title_ko": "여가와 웰빙",
    "title_th": "การพักผ่อนและสุขภาพที่ดี",
    "title_vi": "Thư giãn & Chăm sóc Bản thân",
    "description": "Discuss cooking disasters, rainy day moods, aging gracefully, and active lifestyles.",
    "description_ja": "美味しいレシピ、雨の日の過ごし方、年齢に対する考え方、健康的な生活などをテーマにします。",
    "description_zh": "以美味食譜、雨天日常、健康變老、積極生活方式等為主題。",
    "description_ko": "맛있는 레시피, 비 오는 날의 일상, 멋지게 나이 들기, 활기찬 라이프스타일 등을 다룹니다.",
    "description_th": "พูดคุยเกี่ยวกับเรื่องวุ่นๆ ในครัว อารมณ์ในวันฝนตก การเติบโตอย่างมีคุณภาพ และการใช้ชีวิตที่กระฉับกระเฉง",
    "description_vi": "Trò chuyện về những sự cố nấu nướng, tâm trạng ngày mưa, già đi một cách thanh nhã và lối sống năng động.",
    "emoji": "🎸",
    "bgColor": "#fef1f3",
    "borderColor": "#f2c7cd",
    "textColor": "#9e4051",
    "pillBg": "#fef1f3",
    "pillText": "#9e4051"
  },
  {
    "id": 6,
    "title": "Nature & Culture",
    "title_ja": "自然とカルチャー",
    "title_zh": "自然與文化體驗",
    "title_ko": "자연과 문화 체험",
    "title_th": "ธรรมชาติและวัฒนธรรม",
    "title_vi": "Tự nhiên & Văn hóa",
    "description": "Connect with environmental awareness, wildlife experiences, and cultural festivals.",
    "description_ja": "エコロジー活動、動物との触れ合い、街のフェスティバルなど、豊かな自然と文化に触れます。",
    "description_zh": "接觸環保活動、與動物互動、城市節慶等豐富的自然與文化主題。",
    "description_ko": "환경 보호 활동, 야생 동물과의 만남, 동네 축제 등 풍요로운 자연과 문화를 만끽해 봅니다.",
    "description_th": "เรียนรู้เกี่ยวกับการตระหนักถึงสิ่งแวดล้อม ประสบการณ์เกี่ยวกับสัตว์ป่า และเทศกาลทางวัฒนธรรม",
    "description_vi": "Kết nối với nhận thức về môi trường, trải nghiệm thế giới hoang dã và các lễ hội văn hóa.",
    "emoji": "🌲",
    "bgColor": "#e9f3ec",
    "borderColor": "#a3baa8",
    "textColor": "#365243",
    "pillBg": "#e9f3ec",
    "pillText": "#365243"
  },
  {
    "id": 7,
    "title": "Community & Learning",
    "title_ja": "学びとコミュニティ",
    "title_zh": "學習與社區參與",
    "title_ko": "배움과 지역사회",
    "title_th": "ชุมชนและการเรียนรู้",
    "title_vi": "Cộng đồng & Học tập",
    "description": "Share advice on local clubs, volunteer experiences, and educational goals.",
    "description_ja": "地域のサークル、ボランティア活動、将来の学習目標など、コミュニティとの関わりを学びます。",
    "description_zh": "學習地區社團、志工活動、未來學習目標等社區參與對話。",
    "description_ko": "동호회 가입, 자원봉사 경험, 학업적 목표 등 지역사회와 연계된 소통을 배웁니다.",
    "description_th": "แบ่งปันคำแนะนำเกี่ยวกับชมรมในท้องถิ่น ประสบการณ์อาสาสมัคร และเป้าหมายทางการศึกษา",
    "description_vi": "Chia sẻ lời khuyên về các câu lạc bộ địa phương, trải nghiệm tình nguyện và mục tiêu giáo dục.",
    "emoji": "🤝",
    "bgColor": "#ebf4fa",
    "borderColor": "#aac9df",
    "textColor": "#406a8e",
    "pillBg": "#ebf4fa",
    "pillText": "#406a8e"
  },
  {
    "id": 8,
    "title": "Life Adjustments",
    "title_ja": "生活の転機と適応",
    "title_zh": "生活轉折與適應",
    "title_ko": "삶의 변화와 적응",
    "title_th": "การปรับตัวและการเปลี่ยนแปลงในชีวิต",
    "title_vi": "Thích nghi Cuộc sống",
    "description": "Navigate flat sharing, moving to new cities, and adapting to career changes.",
    "description_ja": "ルームシェア、引越し、新しい職場での人間関係など、変化に対する適応力を磨きます。",
    "description_zh": "培養合租、搬家、新工作人際關係等應對變化的適應力。",
    "description_ko": "룸메이트와의 생활, 새로운 도시로의 이사, 이직 등 여러 변화 속에서 적응해 나가는 법을 배웁니다.",
    "description_th": "รับมือกับการแชร์ห้องพัก การย้ายไปยังเมืองใหม่ และการปรับตัวให้เข้ากับการเปลี่ยนสายงาน",
    "description_vi": "Vượt qua thử thách khi ở chung căn hộ, chuyển đến thành phố mới và thích ứng với những thay đổi trong sự nghiệp.",
    "emoji": "🏠",
    "bgColor": "#f1f2f4",
    "borderColor": "#cbd5e1",
    "textColor": "#475569",
    "pillBg": "#f1f2f4",
    "pillText": "#475569"
  },
  {
    "id": 9,
    "title": "Personal Growth",
    "title_ja": "自己成長と発見",
    "title_zh": "自我成長與發現",
    "title_ko": "자아 성장과 발견",
    "title_th": "การเติบโตและการค้นพบตัวเอง",
    "title_vi": "Phát triển Bản thân",
    "description": "Discuss building confidence, learning from failures, and setting healthy boundaries.",
    "description_ja": "自信の持ち方、失敗から学ぶこと、人との心地よい距離感など、内面적인 성장들을 다룹니다.",
    "description_zh": "以如何建立自信、從失敗中學習、人際舒適距離等內在成長為主題。",
    "description_ko": "자신감 키우기, 실패로부터 배우기, 건강한 관계의 선 긋기 등 내면의 성장을 다룹니다.",
    "description_th": "พูดคุยเกี่ยวกับการสร้างความมั่นใจ การเรียนรู้จากความล้มเหลว และการกำหนดขอบเขตที่ดีสำหรับตัวเอง",
    "description_vi": "Thảo luận về việc xây dựng sự tự tin, học hỏi từ thất bại và thiết lập các ranh giới lành mạnh.",
    "emoji": "🧠",
    "bgColor": "#fcf0f7",
    "borderColor": "#ebc0d1",
    "textColor": "#9e4063",
    "pillBg": "#fcf0f4",
    "pillText": "#9e4063"
  },
  {
    "id": 10,
    "title": "Final Integration",
    "title_ja": "学びの統合",
    "title_zh": "學習整合與展望",
    "title_ko": "통합과 새로운 시작",
    "title_th": "การรวบรวมและต่อยอดการเรียนรู้",
    "title_vi": "Tích hợp Toàn diện",
    "description": "Consolidate your journey, review expressions, and take natural steps forward.",
    "description_ja": "これまで学んだすべての表現をおさらいし、自信を持って一歩踏み出すための最終段階です。",
    "description_zh": "複習所有學過的表達，為自信地邁出下一步做最後準備。",
    "description_ko": "그동안 배운 핵심 표현들을 총정리하며, 더 자연스러운 소통을 향해 나아가는 마지막 단계입니다.",
    "description_th": "ทบทวนการเดินทางทั้งหมดของคุณ สรุปความรู้วลีที่สำคัญ และก้าวไปข้างหน้าอย่างมั่นใจและเป็นธรรมชาติ",
    "description_vi": "Củng cố hành trình của bạn, ôn tập các cụm từ và tự tin vững bước tiến về phía trước.",
    "emoji": "✨",
    "bgColor": "#fefaec",
    "borderColor": "#ecd29b",
    "textColor": "#8c6820",
    "pillBg": "#fefaec",
    "pillText": "#8c6820"
  }
];

const LEVEL_ICONS: Record<number, React.ComponentType<any>> = {
  1: Sun,
  2: Activity,
  3: Users,
  4: Briefcase,
  5: Heart
};

export default function App() {
  const [localeKey, setLocaleKey] = useState<'ja' | 'zh-TW' | 'zh-CN' | 'ko' | 'th' | 'vi'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumora_locale_key');
      return (saved === 'zh-TW' || saved === 'zh-CN' || saved === 'ja' || saved === 'ko' || saved === 'th' || saved === 'vi') ? (saved as any) : 'ja';
    }
    return 'ja';
  });

  const currentLocale = (localeKey === 'zh-TW' || localeKey === 'zh-CN') ? (zhTWLocale as LocaleCatalog) : localeKey === 'ko' ? (koLocale as LocaleCatalog) : localeKey === 'th' ? (thLocale as LocaleCatalog) : localeKey === 'vi' ? (viLocale as LocaleCatalog) : (jaLocale as LocaleCatalog);
  const phrasesData = currentLocale.phrases;

  const getStoryTitle = (story: StoryItem) => {
    if (localeKey === 'ja') {
      return storiesJa[story.id.toString()]?.title_ja || story.title_ja || story.title;
    }
    if (localeKey === 'zh-TW') {
      return storiesZh[story.id.toString()]?.title_zh || story.title;
    }
    if (localeKey === 'ko') {
      return storiesKo[story.id.toString()]?.title_ko || story.title;
    }
    if (localeKey === 'th') {
      return storiesTh[story.id.toString()]?.title_th || story.title;
    }
    if (localeKey === 'vi') {
      return storiesVi[story.id.toString()]?.title_vi || story.title;
    }
    return story.title_ja || story.title;
  };

  const getStoryTeaser = (story: StoryItem) => {
    if (localeKey === 'ja') {
      return storiesJa[story.id.toString()]?.teaser_ja || story.teaser_ja || story.teaser;
    }
    if (localeKey === 'zh-TW') {
      return storiesZh[story.id.toString()]?.teaser_zh || story.teaser;
    }
    if (localeKey === 'ko') {
      return storiesKo[story.id.toString()]?.teaser_ko || story.teaser;
    }
    if (localeKey === 'th') {
      return storiesTh[story.id.toString()]?.teaser_th || story.teaser;
    }
    if (localeKey === 'vi') {
      return storiesVi[story.id.toString()]?.teaser_vi || story.teaser;
    }
    return story.teaser_ja || story.teaser;
  };

  const getVocabDef = (storyId: number, word: string, fallbackDefJa: string) => {
    if (localeKey === 'ja') {
      const jaStory = storiesJa[storyId.toString()];
      const jaVocab = jaStory?.vocab?.find(v => v.word === word);
      return jaVocab?.def_ja || fallbackDefJa;
    }
    if (localeKey === 'zh-TW') {
      const zhStory = storiesZh[storyId.toString()];
      const zhVocab = zhStory?.vocab?.find(v => v.word === word);
      return zhVocab?.def_zh || fallbackDefJa;
    }
    if (localeKey === 'ko') {
      const koStory = storiesKo[storyId.toString()];
      const koVocab = koStory?.vocab?.find(v => v.word === word);
      return koVocab?.def_ko || fallbackDefJa;
    }
    if (localeKey === 'th') {
      const thStory = storiesTh[storyId.toString()];
      const thVocab = thStory?.vocab?.find(v => v.word === word);
      return thVocab?.def_th || fallbackDefJa;
    }
    if (localeKey === 'vi') {
      const viStory = storiesVi[storyId.toString()];
      const viVocab = viStory?.vocab?.find(v => v.word === word);
      return viVocab?.def_vi || fallbackDefJa;
    }
    return fallbackDefJa;
  };

  const getVocabExample = (storyId: number, word: string, fallbackExample: string) => {
    if (localeKey === 'ja') {
      const jaStory = storiesJa[storyId.toString()];
      const jaVocab = jaStory?.vocab?.find(v => v.word === word);
      return jaVocab?.example_ja || fallbackExample;
    }
    if (localeKey === 'zh-TW') {
      const zhStory = storiesZh[storyId.toString()];
      const zhVocab = zhStory?.vocab?.find(v => v.word === word);
      return zhVocab?.example_zh || fallbackExample;
    }
    if (localeKey === 'ko') {
      const koStory = storiesKo[storyId.toString()];
      const koVocab = koStory?.vocab?.find(v => v.word === word);
      return koVocab?.example_ko || fallbackExample;
    }
    if (localeKey === 'th') {
      const thStory = storiesTh[storyId.toString()];
      const thVocab = thStory?.vocab?.find(v => v.word === word);
      return thVocab?.example_th || fallbackExample;
    }
    if (localeKey === 'vi') {
      const viStory = storiesVi[storyId.toString()];
      const viVocab = viStory?.vocab?.find(v => v.word === word);
      return viVocab?.example_vi || fallbackExample;
    }
    return fallbackExample;
  };

  const getExpressionUsage = (storyId: number, phrase: string, fallbackUsageJa: string) => {
    if (localeKey === 'ja') {
      const jaStory = storiesJa[storyId.toString()];
      const jaExp = jaStory?.expressions?.find(e => e.phrase === phrase);
      return jaExp?.usage_ja || fallbackUsageJa;
    }
    if (localeKey === 'zh-TW') {
      const zhStory = storiesZh[storyId.toString()];
      const zhExp = zhStory?.expressions?.find(e => e.phrase === phrase);
      return zhExp?.usage_zh || fallbackUsageJa;
    }
    if (localeKey === 'ko') {
      const koStory = storiesKo[storyId.toString()];
      const koExp = koStory?.expressions?.find(e => e.phrase === phrase);
      return koExp?.usage_ko || fallbackUsageJa;
    }
    if (localeKey === 'th') {
      const thStory = storiesTh[storyId.toString()];
      const thExp = thStory?.expressions?.find(e => e.phrase === phrase);
      return thExp?.usage_th || fallbackUsageJa;
    }
    if (localeKey === 'vi') {
      const viStory = storiesVi[storyId.toString()];
      const viExp = viStory?.expressions?.find(e => e.phrase === phrase);
      return viExp?.usage_vi || fallbackUsageJa;
    }
    return fallbackUsageJa;
  };

  const getExpressionExamples = (storyId: number, phrase: string, fallbackExamples: string[]) => {
    let rawExamples = fallbackExamples;
    if (localeKey === 'ja') {
      const jaStory = storiesJa[storyId.toString()];
      const jaExp = jaStory?.expressions?.find(e => e.phrase === phrase);
      rawExamples = (jaExp?.examples_ja && jaExp.examples_ja.length > 0) ? jaExp.examples_ja : fallbackExamples;
    } else if (localeKey === 'zh-TW') {
      const zhStory = storiesZh[storyId.toString()];
      const zhExp = zhStory?.expressions?.find(e => e.phrase === phrase);
      rawExamples = (zhExp?.examples_zh && zhExp.examples_zh.length > 0) ? zhExp.examples_zh : fallbackExamples;
    } else if (localeKey === 'ko') {
      const koStory = storiesKo[storyId.toString()];
      const koExp = koStory?.expressions?.find(e => e.phrase === phrase);
      rawExamples = (koExp?.examples_ko && koExp.examples_ko.length > 0) ? koExp.examples_ko : fallbackExamples;
    } else if (localeKey === 'th') {
      const thStory = storiesTh[storyId.toString()];
      const thExp = thStory?.expressions?.find(e => e.phrase === phrase);
      rawExamples = (thExp?.examples_th && thExp.examples_th.length > 0) ? thExp.examples_th : fallbackExamples;
    } else if (localeKey === 'vi') {
      const viStory = storiesVi[storyId.toString()];
      const viExp = viStory?.expressions?.find(e => e.phrase === phrase);
      rawExamples = (viExp?.examples_vi && viExp.examples_vi.length > 0) ? viExp.examples_vi : fallbackExamples;
    }

    const processed: string[] = [];
    rawExamples.forEach(ex => {
      if (ex.includes('A:') && ex.includes('B:')) {
        const parts = ex.split(/(?=[A-Z]:)/).map(s => s.trim()).filter(Boolean);
        processed.push(...parts);
      } else {
        processed.push(ex);
      }
    });
    return processed;
  };

  // Strip placeholder text that should never appear in bubbles or TTS
  const sanitizeBubbleText = (text: string): string =>
    text.replace(/example\s+cont(?:ext|ent)\.?/gi, '').trim();

  const getPairedExamples = (storyId: number, phrase: string, fallbackExamples: string[]) => {
    const englishExamples: string[] = [];
    (fallbackExamples || []).forEach(ex => {
      if (ex.includes('A:') && ex.includes('B:')) {
        const parts = ex.split(/(?=[A-Z]:)/).map(s => s.trim()).filter(Boolean);
        englishExamples.push(...parts);
      } else {
        englishExamples.push(ex);
      }
    });

    const translatedExamples = getExpressionExamples(storyId, phrase, fallbackExamples);
    
    return englishExamples.map((engLine, idx) => {
      const transLine = translatedExamples[idx] || '';
      
      // Parse English
      const engColon = engLine.indexOf(':');
      let speaker = '';
      let englishSpeech = sanitizeBubbleText(engLine);
      if (engColon > 0 && engColon < 15) {
        speaker = engLine.substring(0, engColon).trim();
        englishSpeech = sanitizeBubbleText(engLine.substring(engColon + 1).trim());
      }

      // Parse Translated
      let translatedSpeech = sanitizeBubbleText(transLine);
      if (transLine) {
        const transColon = transLine.indexOf(':');
        if (transColon > 0 && transColon < 15) {
          if (!speaker) {
            speaker = transLine.substring(0, transColon).trim();
          }
          translatedSpeech = sanitizeBubbleText(transLine.substring(transColon + 1).trim());
        }
      }

      return {
        speaker,
        englishSpeech,
        translatedSpeech: (translatedSpeech !== englishSpeech) ? translatedSpeech : ''
      };
    }).filter(pair => pair.englishSpeech.length > 0);
  };

  const getAmericanMoment = (story: StoryItem) => {
    if (localeKey === 'ja') {
      return storiesJa[story.id.toString()]?.american_moment_ja || story.american_moment_ja || storiesEn[story.id.toString()]?.american_moment_en || '';
    }
    if (localeKey === 'zh-TW') {
      return storiesZh[story.id.toString()]?.american_moment_zh || storiesEn[story.id.toString()]?.american_moment_en || '';
    }
    if (localeKey === 'ko') {
      return storiesKo[story.id.toString()]?.american_moment_ko || storiesEn[story.id.toString()]?.american_moment_en || '';
    }
    if (localeKey === 'th') {
      return storiesTh[story.id.toString()]?.american_moment_th || storiesEn[story.id.toString()]?.american_moment_en || '';
    }
    if (localeKey === 'vi') {
      return storiesVi[story.id.toString()]?.american_moment_vi || storiesEn[story.id.toString()]?.american_moment_en || '';
    }
    return story.american_moment_ja || storiesEn[story.id.toString()]?.american_moment_en || '';
  };

  const getLearnCulturePrompt = () => {
    if (localeKey === 'ja') return '読む前に文化背景を理解しましょう';
    if (localeKey === 'zh-TW') return '閱讀前先了解文化背景';
    if (localeKey === 'ko') return '읽기 전에 문화적 배경을 알아봅시다';
    if (localeKey === 'th') return 'เรียนรู้วัฒนธรรมก่อนอ่าน';
    if (localeKey === 'vi') return 'Tìm hiểu văn hóa trước khi đọc';
    return 'Learn the culture before reading';
  };

  const getReflection = (story: StoryItem) => {
    if (localeKey === 'ja') {
      return storiesJa[story.id.toString()]?.reflection_ja || story.reflection_ja || storiesEn[story.id.toString()]?.reflection_en || '';
    }
    if (localeKey === 'zh-TW') {
      return storiesZh[story.id.toString()]?.reflection_zh || storiesEn[story.id.toString()]?.reflection_en || '';
    }
    if (localeKey === 'ko') {
      return storiesKo[story.id.toString()]?.reflection_ko || storiesEn[story.id.toString()]?.reflection_en || '';
    }
    if (localeKey === 'th') {
      return storiesTh[story.id.toString()]?.reflection_th || storiesEn[story.id.toString()]?.reflection_en || '';
    }
    if (localeKey === 'vi') {
      return storiesVi[story.id.toString()]?.reflection_vi || storiesEn[story.id.toString()]?.reflection_en || '';
    }
    return story.reflection_ja || storiesEn[story.id.toString()]?.reflection_en || '';
  };


  const [activeTab, setActiveTab] = useState<string>('All');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');
  const [completedStories, setCompletedStories] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('david_goeb_completed_stories');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [storyVibes, setStoryVibes] = useState<Record<number, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumora_story_vibes');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [vibeCheckingStoryId, setVibeCheckingStoryId] = useState<number | null>(null);
  const [vibeMessage, setVibeMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('lumora_story_vibes', JSON.stringify(storyVibes));
  }, [storyVibes]);

  const [selectedLevel, setSelectedLevel] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('david_goeb_selected_level');
      return saved ? parseInt(saved, 10) : null;
    }
    return null;
  });

  useEffect(() => {
    if (selectedLevel !== null) {
      localStorage.setItem('david_goeb_selected_level', selectedLevel.toString());
    } else {
      localStorage.removeItem('david_goeb_selected_level');
    }
  }, [selectedLevel]);

  // Initialize RevenueCat and check premium status on app launch
  useEffect(() => {
    const initPurchases = async () => {
      await PurchasesService.initialize();
      const premium = await PurchasesService.checkPremiumStatus();
      setIsPremium(premium);
      const offerings = await PurchasesService.getOfferings();
      if (offerings && offerings.current && offerings.current.availablePackages) {
        setPackages(offerings.current.availablePackages);
      }
    };
    initPurchases();
  }, []);

  const toggleStoryCompleted = (storyId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const isCompleted = completedStories.includes(storyId);
    if (isCompleted) {
      // Toggle off immediately
      setCompletedStories(prev => {
        const updated = prev.filter(id => id !== storyId);
        localStorage.setItem('david_goeb_completed_stories', JSON.stringify(updated));
        return updated;
      });
    } else {
      // Mark completed immediately
      setCompletedStories(prev => {
        const updated = [...prev, storyId];
        localStorage.setItem('david_goeb_completed_stories', JSON.stringify(updated));
        return updated;
      });
      // Collapse card cleanly after a short delay so the user feels the completion
      setTimeout(() => {
        setExpandedStories(prev => ({ ...prev, [storyId]: false }));
      }, 600);
    }
  };

  const [savedPhrases, setSavedPhrases] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('david_goeb_notebook');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [savedVocab, setSavedVocab] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('david_goeb_saved_vocab');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [savedExpressions, setSavedExpressions] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('david_goeb_saved_expressions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [notebookSubTab, setNotebookSubTab] = useState<'vocab' | 'expressions'>('vocab');

  const toggleSaveVocab = (storyId: number, word: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const key = `${storyId}-${word}`;
    setSavedVocab((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      localStorage.setItem('david_goeb_saved_vocab', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleSaveExpression = (storyId: number, phrase: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const key = `${storyId}-${phrase}`;
    setSavedExpressions((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      localStorage.setItem('david_goeb_saved_expressions', JSON.stringify(updated));
      return updated;
    });
  };

  const navigateToStory = (storyId: number) => {
    setActiveTab('All');
    const targetLevel = Math.floor((storyId - 1) / 10) + 1;
    setSelectedLevel(targetLevel);
    setExpandedStories(prev => ({ ...prev, [storyId]: true }));
    setTimeout(() => {
      const element = document.getElementById(`story-${storyId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 250);
  };

  const getSavedVocabDetails = () => {
    const details: { story: StoryItem; item: any; key: string }[] = [];
    savedVocab.forEach(key => {
      const idx = key.indexOf('-');
      if (idx === -1) return;
      const storyId = parseInt(key.substring(0, idx));
      const word = key.substring(idx + 1);
      const story = STORIES_DATA.find(s => s.id === storyId);
      if (!story) return;
      const item = story.vocab.find(v => v.word === word);
      if (!item) return;
      details.push({ story, item, key });
    });
    return details;
  };

  const getSavedExpressionDetails = () => {
    const details: { story: StoryItem; item: any; key: string }[] = [];
    savedExpressions.forEach(key => {
      const idx = key.indexOf('-');
      if (idx === -1) return;
      const storyId = parseInt(key.substring(0, idx));
      const phrase = key.substring(idx + 1);
      const story = STORIES_DATA.find(s => s.id === storyId);
      if (!story) return;
      const item = story.expressions.find(e => e.phrase === phrase);
      if (!item) return;
      details.push({ story, item, key });
    });
    return details;
  };

  const renderHighlightedText = (text: string, vocab: any[], expressions: any[], storyId: number, style: any) => {
    const terms: { term: string; type: 'vocab' | 'expression'; id: string }[] = [];
    vocab.forEach(v => {
      terms.push({ term: v.word, type: 'vocab', id: v.word });
    });
    expressions.forEach(e => {
      terms.push({ term: e.phrase, type: 'expression', id: e.phrase });
    });
    
    terms.sort((a, b) => b.term.length - a.term.length);
    
    if (terms.length === 0) return text;
    
    const escapedTerms = terms.map(t => t.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    return parts.map((part, index) => {
      const match = terms.find(t => t.term.toLowerCase() === part.toLowerCase());
      if (match) {
        return (
          <span 
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              if (match.type === 'vocab') {
                const element = document.getElementById(`vocab-${storyId}-${match.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('highlight-flash');
                  setTimeout(() => element.classList.remove('highlight-flash'), 1200);
                }
                toggleExpandVocab(`${storyId}-${match.id}`);
              } else {
                const element = document.getElementById(`expression-${storyId}-${match.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('highlight-flash');
                  setTimeout(() => element.classList.remove('highlight-flash'), 1200);
                }
              }
            }}
            className="cursor-pointer border-b-2 border-dashed font-semibold transition-all duration-200 px-0.5 rounded hover:bg-stone-200/50"
            style={{ borderColor: style.textColor, color: style.textColor }}
            title={`Click to view ${match.type}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicRepeatMode, setMusicRepeatMode] = useState<'playlist' | 'single'>('playlist');
  const musicVolume = 0.30; // Cozy default background volume (30%)
  const SPEECH_VOLUME = 1.0; // Clear, consistent maximum volume for speech
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Native Audio Preloading
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      TRACKS.forEach(track => {
        NativeAudio.preload({
          assetId: track.id,
          assetPath: track.file,
          audioChannelNum: 1,
          isUrl: false
        }).catch(e => console.warn('NativeAudio preload failed:', e));
      });
      return () => {
        TRACKS.forEach(track => {
          NativeAudio.unload({ assetId: track.id }).catch(() => {});
        });
      };
    }
  }, []);

  const [speakingPhrase, setSpeakingPhrase] = useState<string | null>(null);
  const [expandedPhrases, setExpandedPhrases] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedStories, setExpandedStories] = useState<Record<number, boolean>>({});
  const [welcomeExpanded, setWelcomeExpanded] = useState<boolean>(false);

  const toggleExpandPhrase = (english: string) => {
    setExpandedPhrases(prev => ({
      ...prev,
      [english]: !prev[english]
    }));
  };
  const [expandedVocab, setExpandedVocab] = useState<Record<string, boolean>>({});
  const [playingStoryId, setPlayingStoryId] = useState<number | string | null>(null);
  const [playingVocabKey, setPlayingVocabKey] = useState<string | null>(null);
  const [playingMomentId, setPlayingMomentId] = useState<number | string | null>(null);
  const [playingExpressionKey, setPlayingExpressionKey] = useState<string | null>(null);

  // Relax & Listen to All Stories state
  const [isListenToAllActive, setIsListenToAllActive] = useState(false);
  const isListenToAllActiveRef = useRef(false);
  const [listenToAllIndex, setListenToAllIndex] = useState(0);
  const [isLoopingAll, setIsLoopingAll] = useState(false);
  const [isListenToAllPaused, setIsListenToAllPaused] = useState(false);
  const listenTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopActiveSpeechAudio = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.onplay = null;
      activeAudioRef.current.onended = null;
      activeAudioRef.current.onerror = null;
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current.src = '';
      } catch (e) {}
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const stopListenToAll = () => {
    isListenToAllActiveRef.current = false;
    setIsListenToAllActive(false);
    setIsListenToAllPaused(false);
    setListenToAllIndex(0);
    setPlayingStoryId(null);
    if (listenTimerRef.current) {
      clearTimeout(listenTimerRef.current);
      listenTimerRef.current = null;
    }
    stopActiveSpeechAudio();
  };

  const playListenToAllItem = (stories: StoryItem[], index: number, loopMode: boolean) => {
    if (!isListenToAllActiveRef.current) return;
    if (index >= stories.length) {
      if (loopMode) {
        setListenToAllIndex(0);
        playListenToAllItem(stories, 0, loopMode);
      } else {
        stopListenToAll();
      }
      return;
    }

    setListenToAllIndex(index);
    const story = stories[index];

    // Enforce paywall for Listen to All
    const globalStoryIndex = STORIES_DATA.findIndex(s => s.id === story.id);
    if (!isPremium && globalStoryIndex > 0) {
      setShowPaywall(true);
      stopListenToAll();
      return;
    }

    setPlayingStoryId(story.id);
    stopActiveSpeechAudio();

    const onStoryFinishWith5sPause = () => {
      if (!isListenToAllActiveRef.current) return;
      setPlayingStoryId(null);
      activeAudioRef.current = null;
      listenTimerRef.current = setTimeout(() => {
        if (isListenToAllActiveRef.current) {
          playListenToAllItem(stories, index + 1, loopMode);
        }
      }, 5000);
    };

    let handledFallback = false;

    const tryPlayItemPath = (path: string, fallbackPath: string | null) => {
      if (!isListenToAllActiveRef.current) return;
      const audio = new Audio(path);
      audio.volume = 1.0;
      audio.playbackRate = 0.88;
      activeAudioRef.current = audio;

      let hasStarted = false;
      let failed = false;

      audio.onplay = () => {
        hasStarted = true;
        setPlayingStoryId(story.id);
      };

      audio.onended = onStoryFinishWith5sPause;

      const handleFail = () => {
        if (failed || hasStarted || handledFallback || !isListenToAllActiveRef.current) {
          if (!failed && !hasStarted && isListenToAllActiveRef.current) onStoryFinishWith5sPause();
          return;
        }
        failed = true;

        if (fallbackPath) {
          tryPlayItemPath(fallbackPath, null);
        } else {
          handledFallback = true;
          if (typeof window === 'undefined' || !window.speechSynthesis) {
            return onStoryFinishWith5sPause();
          }
          const textToRead = story.story.replace(/[A-Za-z]+:/g, '').replace(/"/g, '');
          const utterance = new SpeechSynthesisUtterance(textToRead);
          utterance.lang = 'en-US';
          utterance.rate = 0.80;
          utterance.onend = onStoryFinishWith5sPause;
          utterance.onerror = onStoryFinishWith5sPause;
          window.speechSynthesis.speak(utterance);
        }
      };

      audio.onerror = handleFail;
      audio.play().catch(handleFail);
    };

    tryPlayItemPath(`./audio/stories/story_${story.id}.mp3`, `./audio/stories/story_${story.id}.m4a`);
  };

  const startListenToAll = async (stories: StoryItem[]) => {
    if (stories.length === 0) return;
    if (isListenToAllActiveRef.current) {
      stopListenToAll();
    } else {
      isListenToAllActiveRef.current = true;
      setIsListenToAllActive(true);
      setIsListenToAllPaused(false);
      setListenToAllIndex(0);
      playListenToAllItem(stories, 0, isLoopingAll);
    }
  };

  const toggleExpandVocab = (wordKey: string) => {
    setExpandedVocab(prev => ({
      ...prev,
      [wordKey]: !prev[wordKey]
    }));
  };

  const playStorySpeech = (story: StoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    if (playingStoryId === story.id) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingStoryId(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const audioPath = `./audio/stories/story_${story.id}.m4a`;
    const audio = new Audio(audioPath);
    audio.volume = SPEECH_VOLUME;
    audio.playbackRate = 0.90; // Play pre-rendered slower (90% speed) audio track naturally
    activeAudioRef.current = audio;

    audio.onplay = () => {
      setPlayingStoryId(story.id);
    };

    audio.onended = () => {
      setPlayingStoryId(null);
      activeAudioRef.current = null;
    };

    audio.onerror = () => {
      activeAudioRef.current = null;
      runWebSpeechSynthesisStoryFallback(story);
    };

    audio.play().catch(() => {
      activeAudioRef.current = null;
      runWebSpeechSynthesisStoryFallback(story);
    });
  };

  const runWebSpeechSynthesisStoryFallback = (story: StoryItem) => {
    if (!window.speechSynthesis) {
      setPlayingStoryId(null);
      return;
    }

    const textToRead = story.story
      .replace(/[A-Za-z]+:/g, '')
      .replace(/"/g, '');

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en-US') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Aria'))
    ) || voices.find(v => v.lang.startsWith('en-US')) 
      || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.80;

    utterance.onstart = () => {
      setPlayingStoryId(story.id);
    };

    utterance.onend = () => {
      setPlayingStoryId(null);
    };

    utterance.onerror = () => {
      setPlayingStoryId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playVocabSpeech = (storyId: number, word: string, exampleText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    const vocabKey = `${storyId}-${word}`;

    if (playingVocabKey === vocabKey) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingVocabKey(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const slug = word.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // remove punctuation
      .trim()
      .replace(/\s+/g, '_');
    const audioPath = `./audio/vocab/story_${storyId}_vocab_${slug}.m4a`;

    const audio = new Audio(audioPath);
    audio.volume = SPEECH_VOLUME;
    audio.playbackRate = 0.90; // Play pre-rendered slower (90% speed) audio track naturally
    activeAudioRef.current = audio;

    audio.onplay = () => {
      setPlayingVocabKey(vocabKey);
    };

    audio.onended = () => {
      setPlayingVocabKey(null);
      activeAudioRef.current = null;
    };

    audio.onerror = () => {
      activeAudioRef.current = null;
      runWebSpeechSynthesisVocabFallback(vocabKey, exampleText);
    };

    audio.play().catch(() => {
      activeAudioRef.current = null;
      runWebSpeechSynthesisVocabFallback(vocabKey, exampleText);
    });
  };

  const runWebSpeechSynthesisVocabFallback = (vocabKey: string, text: string) => {
    if (!window.speechSynthesis) {
      setPlayingVocabKey(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en-US') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Aria'))
    ) || voices.find(v => v.lang.startsWith('en-US')) 
      || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.80;

    utterance.onstart = () => {
      setPlayingVocabKey(vocabKey);
    };

    utterance.onend = () => {
      setPlayingVocabKey(null);
    };

    utterance.onerror = () => {
      setPlayingVocabKey(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playWelcomeSpeech = (
    type: 'story' | 'vocab' | 'expression' | 'moment',
    key: string,
    textToSpeak: string,
    audioPath: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    let isPlaying = false;
    if (type === 'story') isPlaying = playingStoryId === key;
    else if (type === 'vocab') isPlaying = playingVocabKey === key;
    else if (type === 'expression') isPlaying = playingExpressionKey === key;
    else if (type === 'moment') isPlaying = playingMomentId === key;

    if (isPlaying) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      if (type === 'story') setPlayingStoryId(null);
      else if (type === 'vocab') setPlayingVocabKey(null);
      else if (type === 'expression') setPlayingExpressionKey(null);
      else if (type === 'moment') setPlayingMomentId(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const audio = new Audio(audioPath);
    audio.volume = SPEECH_VOLUME;
    audio.playbackRate = 0.90; // 90% natural study speed
    activeAudioRef.current = audio;

    audio.onplay = () => {
      if (type === 'story') setPlayingStoryId(key);
      else if (type === 'vocab') setPlayingVocabKey(key);
      else if (type === 'expression') setPlayingExpressionKey(key);
      else if (type === 'moment') setPlayingMomentId(key);
    };

    audio.onended = () => {
      activeAudioRef.current = null;
      if (type === 'story') setPlayingStoryId(null);
      else if (type === 'vocab') setPlayingVocabKey(null);
      else if (type === 'expression') setPlayingExpressionKey(null);
      else if (type === 'moment') setPlayingMomentId(null);
    };

    audio.onerror = () => {
      activeAudioRef.current = null;
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.80; // Slower cadence
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          v.name.includes('Google US English') || 
          v.name.includes('Samantha') || 
          v.name.includes('Zira')
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => {
          if (type === 'story') setPlayingStoryId(key);
          else if (type === 'vocab') setPlayingVocabKey(key);
          else if (type === 'expression') setPlayingExpressionKey(key);
          else if (type === 'moment') setPlayingMomentId(key);
        };

        utterance.onend = () => {
          if (type === 'story') setPlayingStoryId(null);
          else if (type === 'vocab') setPlayingVocabKey(null);
          else if (type === 'expression') setPlayingExpressionKey(null);
          else if (type === 'moment') setPlayingMomentId(null);
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    audio.play().catch(() => {
      // Direct fallback on block
      audio.onerror(new Event('error'));
    });
  };

  const playMomentSpeech = (storyId: number, momentText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    if (playingMomentId === storyId) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingMomentId(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const audioPath = `./audio/moments/story_${storyId}_moment.m4a`;
    const audio = new Audio(audioPath);
    audio.volume = SPEECH_VOLUME;
    audio.playbackRate = 0.90; // Play pre-rendered slower (90% speed) audio track naturally
    activeAudioRef.current = audio;

    audio.onplay = () => {
      setPlayingMomentId(storyId);
    };

    audio.onended = () => {
      setPlayingMomentId(null);
      activeAudioRef.current = null;
    };

    audio.onerror = () => {
      activeAudioRef.current = null;
      runWebSpeechSynthesisMomentFallback(storyId, momentText);
    };

    audio.play().catch(() => {
      activeAudioRef.current = null;
      runWebSpeechSynthesisMomentFallback(storyId, momentText);
    });
  };

  const runWebSpeechSynthesisMomentFallback = (storyId: number, text: string) => {
    if (!window.speechSynthesis) {
      setPlayingMomentId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en-US') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Aria'))
    ) || voices.find(v => v.lang.startsWith('en-US')) 
      || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.80;

    utterance.onstart = () => {
      setPlayingMomentId(storyId);
    };

    utterance.onend = () => {
      setPlayingMomentId(null);
    };

    utterance.onerror = () => {
      setPlayingMomentId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playExpressionSpeech = (storyId: number, phrase: string, examplesText: string[], e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    const expKey = `${storyId}-${phrase}`;

    if (playingExpressionKey === expKey) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingExpressionKey(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const slug = phrase.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // remove punctuation
      .trim()
      .replace(/\s+/g, '_');
    const audioPath = `./audio/expressions/story_${storyId}_expression_${slug}.m4a`;

    const audio = new Audio(audioPath);
    audio.volume = SPEECH_VOLUME;
    audio.playbackRate = 0.90; // Play pre-rendered slower (90% speed) audio track naturally
    activeAudioRef.current = audio;

    audio.onplay = () => {
      setPlayingExpressionKey(expKey);
    };

    audio.onended = () => {
      setPlayingExpressionKey(null);
      activeAudioRef.current = null;
    };

    let fallbackCalled = false;
    const triggerFallback = () => {
      if (fallbackCalled) return;
      fallbackCalled = true;
      activeAudioRef.current = null;
      runWebSpeechSynthesisExpressionFallback(expKey, [phrase]);
    };

    audio.onerror = triggerFallback;

    audio.play().catch(triggerFallback);
  };

  const runWebSpeechSynthesisExpressionFallback = (expKey: string, examples: string[]) => {
    if (!window.speechSynthesis) {
      setPlayingExpressionKey(null);
      return;
    }

    const textToRead = examples.join('\n')
      .replace(/^[AB]:\s*/mg, '')  // strip speaker prefixes line-by-line
      .replace(/example\s+cont(?:ext|ent)\.?/gi, '') // strip placeholder text
      .trim();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en-US') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Aria'))
    ) || voices.find(v => v.lang.startsWith('en-US')) 
      || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.80;

    utterance.onstart = () => {
      setPlayingExpressionKey(expKey);
    };

    utterance.onend = () => {
      setPlayingExpressionKey(null);
    };

    utterance.onerror = () => {
      setPlayingExpressionKey(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleExpandStory = (id: number) => {
    setExpandedStories(prev => {
      const isNowExpanded = !prev[id];
      if (!isNowExpanded && playingStoryId === id) {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setPlayingStoryId(null);
      }

      if (!isNowExpanded) {
        setTimeout(() => {
          const element = document.getElementById(`story-${id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }

      return {
        ...prev,
        [id]: isNowExpanded
      };
    });
  };

  const toggleExpandCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Proactively populating the speech voices list support
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        if (activeAudioRef.current) {
          activeAudioRef.current.pause();
        }
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const playSpeech = (text: string) => {
    if (typeof window === 'undefined') return;

    if (speakingPhrase === text) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingPhrase(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Attempt to load the pre-rendered audio asset from public/audio/phrases/
    const slug = text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // remove punctuation
      .trim()
      .replace(/\s+/g, '_');
    const audioPath = `audio/phrases/${slug}.m4a`;

    const audio = new Audio(audioPath);
    audio.volume = SPEECH_VOLUME;
    audio.playbackRate = 0.90; // Play pre-rendered slower (90% speed) audio track naturally
    activeAudioRef.current = audio;

    audio.onplay = () => {
      setSpeakingPhrase(text);
    };

    audio.onended = () => {
      setSpeakingPhrase(null);
      activeAudioRef.current = null;
    };

    audio.onerror = () => {
      activeAudioRef.current = null;
      runWebSpeechSynthesisFallback(text);
    };

    audio.play().catch(() => {
      activeAudioRef.current = null;
      runWebSpeechSynthesisFallback(text);
    });
  };

  const runWebSpeechSynthesisFallback = (text: string) => {
    if (!window.speechSynthesis) {
      setSpeakingPhrase(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en-US') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Aria'))
    ) || voices.find(v => v.lang.startsWith('en-US')) 
      || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.82; // Set corresponding fallback SpeechSynthesis speed
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setSpeakingPhrase(text);
    };

    utterance.onend = () => {
      setSpeakingPhrase(null);
    };

    utterance.onerror = () => {
      setSpeakingPhrase(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const musicRepeatModeRef = useRef(musicRepeatMode);
  useEffect(() => { musicRepeatModeRef.current = musicRepeatMode; }, [musicRepeatMode]);

  // Pure HTML5 Audio background music player (No AudioContext / No Web Audio API)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio(selectedTrack.file);
    audio.loop = musicRepeatModeRef.current === 'single';
    audio.volume = musicVolume;
    musicRef.current = audio;

    const handleCanPlay = () => {
      setAudioError(false);
      setIsAudioLoading(false);
    };

    const handleAudioError = () => {
      setAudioError(true);
      setIsPlayingMusic(false);
      setIsAudioLoading(false);
    };

    const handleLoadStart = () => {
      setIsAudioLoading(true);
    };

    const handleEnded = () => {
      if (musicRepeatModeRef.current === 'playlist') {
        setSelectedTrack(prev => {
          const currentIndex = TRACKS.findIndex(t => t.id === prev.id);
          const nextIndex = (currentIndex + 1) % TRACKS.length;
          return TRACKS[nextIndex];
        });
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleAudioError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('ended', handleEnded);

    if (isPlayingMusic) {
      setIsAudioLoading(true);
      audio.play().catch(e => {
        console.warn("Audio play failed on switch:", e);
        setAudioError(true);
        setIsPlayingMusic(false);
        setIsAudioLoading(false);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleAudioError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedTrack]);

  // Direct volume & repeat mode sync
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = musicVolume;
      musicRef.current.loop = musicRepeatMode === 'single';
    }
  }, [musicVolume, musicRepeatMode]);

  const toggleMusicPlay = async () => {
    if (musicRef.current) {
      if (isPlayingMusic) {
        musicRef.current.pause();
        setIsPlayingMusic(false);
      } else {
        setAudioError(false);
        setIsAudioLoading(true);
        try {
          await musicRef.current.play();
          setIsPlayingMusic(true);
          setIsAudioLoading(false);
        } catch (e) {
          console.warn("Audio play failed:", e);
          setAudioError(true);
          setIsPlayingMusic(false);
          setIsAudioLoading(false);
        }
      }
    }
  };

  const handleTrackSelect = (track: typeof TRACKS[0]) => {
    if (!isPremium && track.id !== 'marigold') {
      setShowPaywall(true);
      return;
    }
    if (selectedTrack.id === track.id) {
      if (!isPlayingMusic) {
        setMusicRepeatMode('playlist');
        toggleMusicPlay();
      } else if (musicRepeatMode === 'playlist') {
        setMusicRepeatMode('single');
      } else {
        setMusicRepeatMode('playlist');
        toggleMusicPlay();
      }
    } else {
      setSelectedTrack(track);
      setMusicRepeatMode('playlist');
      if (!isPlayingMusic) {
        setIsPlayingMusic(true);
      }
    }
  };

  const activeStyle = activeTab === 'Notebook' ? NOTEBOOK_STYLE : HOME_STYLE;

  const toggleSavePhrase = (english: string) => {
    setSavedPhrases((prev) => {
      const updated = prev.includes(english)
        ? prev.filter((id) => id !== english)
        : [...prev, english];
      localStorage.setItem('david_goeb_notebook', JSON.stringify(updated));
      return updated;
    });
  };

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setExpandedPhrases({});
    window.scrollTo({ top: 0 });
  };

  // Filter phrases based on selection and search query
  const filteredPhrases = phrasesData.filter((phrase) => {
    if (activeTab === 'Notebook') {
      return savedPhrases.includes(phrase.english);
    }
    return phrase.category.toLowerCase() === activeTab.toLowerCase();
  });

  const filteredStories = STORIES_DATA.filter((story) => {
    if (selectedLevel !== null) {
      const startId = (selectedLevel - 1) * 10 + 1;
      const endId = selectedLevel * 10;
      if (story.id < startId || story.id > endId) {
        return false;
      }
    }
    if (filterMode === 'unread') {
      return !completedStories.includes(story.id);
    }
    return true;
  });


  const downloadVibeCard = (phrase: typeof phrasesData[0]) => {
    const style = CATEGORY_STYLES[phrase.category] || CATEGORY_STYLES['Essentials'];
    
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Solid background base
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Soft atmospheric radial ambient glow matching the active category palette
    const gradient = ctx.createRadialGradient(250, 200, 100, 540, 540, 750);
    gradient.addColorStop(0, style.bgColor);
    gradient.addColorStop(0.5, '#fcfbf8');
    gradient.addColorStop(1, '#f6f4ee');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // 3. Draw outer double frame
    ctx.strokeStyle = style.borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1000, 1000);

    ctx.strokeStyle = style.borderColor + '40'; // 25% opacity
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, 976, 976);

    // 4. Draw Studio Masthead Watermark
    ctx.fillStyle = '#7c5e39';
    ctx.textAlign = 'center';
    ctx.font = "italic 500 24px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("Velume Studios", 540, 105);

    // 5. Draw Category Pill
    const catConfig = currentLocale.categories[phrase.category] || { name: phrase.category, subtitle: '' };
    const categoryName = catConfig.name.toUpperCase().split('').join(' ');
    ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
    const textWidth = ctx.measureText(categoryName).width;
    
    ctx.fillStyle = style.pillBg;
    const pillW = textWidth + 30;
    const pillH = 30;
    const pillX = 540 - pillW / 2;
    const pillY = 145;
    
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(pillX, pillY, pillW, pillH, 15);
    } else {
      ctx.rect(pillX, pillY, pillW, pillH);
    }
    ctx.fill();
    
    ctx.fillStyle = style.textColor;
    ctx.fillText(categoryName, 540, 164);

    // Wrap text function for drawing wrapped lines on canvas
    const wrapText = (
      text: string,
      x: number,
      startY: number,
      maxWidth: number,
      lineHeight: number,
      font: string,
      color: string,
      align: 'center' | 'left' = 'center'
    ): number => {
      // Append fallback fonts for dynamic CJK and Thai display on canvas
      const localeFontStack = ", 'Pretendard', 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Prompt', sans-serif";
      ctx.font = font + localeFontStack;
      ctx.fillStyle = color;
      ctx.textAlign = align;

      // Split character-by-character if contains CJK/Thai, else by word spaces (English, Vietnamese)
      const splitByChar = /[\u3040-\u30ff\u4e00-\u9faf\uac00-\ud7af\u0e00-\u0e7f]/.test(text);
      let lines: string[] = [];

      if (splitByChar) {
        let currentLine = '';
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const testLine = currentLine + char;
          if (ctx.measureText(testLine).width > maxWidth && i > 0) {
            lines.push(currentLine);
            currentLine = char;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
      } else {
        const words = text.split(' ');
        let currentLine = '';
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          if (ctx.measureText(testLine).width > maxWidth && i > 0) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
      }

      let currentY = startY;
      lines.forEach((line) => {
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
      });
      return currentY;
    };

    // 6. Draw English Phrase (Large Serif)
    const englishY = 320;
    const englishEnd = wrapText(
      phrase.english,
      540,
      englishY,
      880,
      60,
      "600 48px 'Cormorant Garamond', Georgia, serif",
      '#1c1917'
    );

    // 7. Draw Localized Translation (Italic Serif)
    const translationY = englishEnd + 25;
    const translationEnd = wrapText(
      phrase.translation,
      540,
      translationY,
      880,
      44,
      "italic bold 28px 'Cormorant Garamond', Georgia, serif",
      style.textColor
    );

    // 8. Draw separator line
    const sepY = translationEnd + 35;
    ctx.strokeStyle = '#e7e5e4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(420, sepY);
    ctx.lineTo(660, sepY);
    ctx.stroke();

    let currentY = sepY + 45;

    // 9. Draw Situation if present
    if (phrase.situation) {
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = style.textColor;
      ctx.fillText(currentLocale.ui.situationLabel, 540, currentY);

      currentY = wrapText(
        phrase.situation,
        540,
        currentY + 35,
        840,
        34,
        "italic 21px system-ui, -apple-system, sans-serif",
        '#57534e'
      ) + 25;
    }

    // 10. Draw VIBE CHECK Header
    ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = style.textColor;
    ctx.fillText(currentLocale.ui.vibeCheckLabel, 540, currentY);

    // 11. Draw VIBE CHECK Description (Clean Sans-serif)
    wrapText(
      phrase.vibeCheck,
      540,
      currentY + 35,
      840,
      34,
      "normal 21px system-ui, -apple-system, sans-serif",
      '#44403c'
    );

    // 12. Draw Footer Signature Watermark
    ctx.fillStyle = '#a8a29e';
    ctx.font = "500 12px system-ui, -apple-system, sans-serif";
    ctx.fillText("LUMORA • A VELUME STUDIOS PRODUCTION • VELUMESTUDIOS.COM/LUMORA", 540, 1010);

    // 12. Share or Download (Web Share API for native OS Share Sheet support)
    const filename = `Lumora_${phrase.category}_${phrase.english.replace(/[^a-zA-Z0-9]/g, '_')}.png`;

    const triggerDownload = () => {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
    };

    if (navigator.share && navigator.canShare) {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          triggerDownload();
          return;
        }
        const file = new File([blob], filename, { type: 'image/png' });
        const shareData = {
          files: [file],
          title: `Lumora Vibe Check: ${phrase.english}`,
          text: `Check out the vibe behind "${phrase.english}" on Lumora!`
        };
        
        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (e) {
            console.log("Share sheet dismissed:", e);
          }
        } else {
          triggerDownload();
        }
      }, 'image/png');
    } else {
      triggerDownload();
    }
  };

  return (
    <div 
      className="relative min-h-screen pb-24 selection:bg-stone-200 overflow-x-hidden"
      style={{ backgroundColor: activeStyle.bgColor, transition: 'background-color 1.1s cubic-bezier(0.25, 1, 0.3, 1)' }}
    >
      {/* Symmetrical Fluid Blob Ambient Gradient Layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-15%] w-[85vw] h-[85vw] sm:w-[65vw] sm:h-[65vw] rounded-full filter blur-[45px] sm:blur-[110px] md:blur-[140px] bg-[#f0a2ad]/[0.55] sm:bg-[#f0a2ad]/[0.45] blob-drift-1" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[95vw] h-[95vw] sm:w-[75vw] sm:h-[75vw] rounded-full filter blur-[50px] sm:blur-[125px] md:blur-[150px] bg-[#81abee]/[0.65] sm:bg-[#81abee]/[0.55] blob-drift-2" />
        <div className="absolute top-[35%] right-[-15%] w-[75vw] h-[75vw] sm:w-[55vw] sm:h-[55vw] rounded-full filter blur-[45px] sm:blur-[100px] md:blur-[120px] bg-[#fcdca8]/[0.85] sm:bg-[#fcdca8]/[0.7] blob-drift-3" />
      </div>

      {/* Home Button (Top Left) */}
      <a 
        href="../index.html" 
        className="fixed top-4 left-4 sm:left-6 z-[9999] flex items-center justify-center w-[40px] h-[40px] bg-white/80 backdrop-blur-md hover:bg-white border border-stone-200/80 rounded-full text-stone-600 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(40,36,32,0.12)]"
        title="Back to Lumora Main Hub"
        aria-label="Back to Lumora Home"
      >
        <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </a>

      {/* Main Container Layout */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-6 sm:pt-16 px-4 sm:px-6">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <select
            value={localeKey}
            onChange={(e) => {
              const val = e.target.value as 'ja' | 'zh-TW' | 'zh-CN' | 'ko' | 'th' | 'vi';
              setLocaleKey(val);
              localStorage.setItem('lumora_locale_key', val);
            }}
            className="bg-white/70 backdrop-blur-md hover:bg-white border border-stone-200/50 rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-stone-600 focus:outline-none transition-all duration-300 cursor-pointer shadow-sm font-sans tracking-wide"
          >
            <option value="ja">日本語</option>
            <option value="zh-TW">繁體中文</option>
            <option value="zh-CN">简体中文</option>
            <option value="ko">한국어</option>
            <option value="th">ภาษาไทย</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>
        {activeTab === 'Notebook' ? (
          /* ================= NOTEBOOK VIEW ================= */
          <div className="w-full animate-fade-in">
            {/* Top minimal header */}
            <header 
              className="pt-4 sm:pt-10 text-center select-none cursor-pointer group animate-slide-up-fade" 
              onClick={() => handleTabChange('All')}
              title="Go to Home"
            >
              <p className="font-serif italic text-[13.5px] tracking-wider text-stone-400 transition-colors group-hover:text-stone-600">
                {localeKey === 'ja' ? (
                  <>A <a href="https://velumestudios.com" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-sans font-semibold not-italic text-[12px] uppercase tracking-widest text-[#7c5e39] hover:underline transition-all duration-200"><span className="shimmer-text">Velume Studios</span></a> Production</>
                ) : localeKey === 'ko' ? (
                  <><a href="https://velumestudios.com" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-sans font-semibold not-italic text-[12px] uppercase tracking-widest text-[#7c5e39] hover:underline transition-all duration-200"><span className="shimmer-text">Velume Studios</span></a> 제작</>
                ) : localeKey.startsWith('zh') ? (
                  <><a href="https://velumestudios.com" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-sans font-semibold not-italic text-[12px] uppercase tracking-widest text-[#7c5e39] hover:underline transition-all duration-200"><span className="shimmer-text">Velume Studios</span></a> 出品</>
                ) : localeKey === 'vi' ? (
                  <>Sản phẩm của <a href="https://velumestudios.com" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-sans font-semibold not-italic text-[12px] uppercase tracking-widest text-[#7c5e39] hover:underline transition-all duration-200"><span className="shimmer-text">Velume Studios</span></a></>
                ) : (
                  <>โดย <a href="https://velumestudios.com" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-sans font-semibold not-italic text-[12px] uppercase tracking-widest text-[#7c5e39] hover:underline transition-all duration-200"><span className="shimmer-text">Velume Studios</span></a></>
                )}
              </p>
              <h1 className="font-serif text-[2.6rem] sm:text-[4.2rem] font-semibold text-stone-900 tracking-tight leading-tight mt-2 transition-colors group-hover:text-stone-700">
                Lumora
              </h1>
              <p className="font-serif italic text-[#7c5e39] font-bold text-[15px] sm:text-[18px] mt-1">
                {currentLocale.ui.mySavedNotebook}
              </p>
            </header>

            {/* Custom Tab Selector */}
            <div className="max-w-2xl mx-auto mt-8 px-4 sm:px-6 flex justify-center">
              <div className="inline-flex p-0.5 rounded-full bg-stone-200/50 border border-stone-200/30 shadow-inner">
                <button
                  onClick={() => setNotebookSubTab('vocab')}
                  className={`px-5 py-1.5 rounded-full font-serif italic text-[14px] sm:text-[15px] font-semibold transition-all duration-300 cursor-pointer active:scale-95 ${
                    notebookSubTab === 'vocab'
                      ? 'bg-white text-[#7c5e39] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-stone-200/10'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Saved Vocabulary ({savedVocab.length})
                </button>
                <button
                  onClick={() => setNotebookSubTab('expressions')}
                  className={`px-5 py-1.5 rounded-full font-serif italic text-[14px] sm:text-[15px] font-semibold transition-all duration-300 cursor-pointer active:scale-95 ${
                    notebookSubTab === 'expressions'
                      ? 'bg-white text-[#7c5e39] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-stone-200/10'
                      : 'text-stone-500 hover:text-[#7c5e39]'
                  }`}
                >
                  Saved Expressions ({savedExpressions.length})
                </button>
              </div>
            </div>

            {/* Scrollable vertical list of Notebook items */}
            <main key={notebookSubTab} className="max-w-2xl mx-auto mt-6 space-y-4 sm:space-y-5 px-4 sm:px-6 pb-28 sm:pb-20 animate-slide-up-fade">
              {notebookSubTab === 'vocab' ? (
                (() => {
                  const items = getSavedVocabDetails();
                  if (items.length === 0) {
                    return (
                      <div className="text-center py-20 px-6 rounded-3xl bg-stone-50/60 border border-dashed border-stone-200/80">
                        <p className="font-serif italic text-lg text-stone-500">
                          Your saved vocabulary list is empty.
                        </p>
                        <p className="font-sans text-stone-400 text-xs mt-2 max-w-sm mx-auto">
                          Read through stories and click the bookmark star next to any vocabulary terms you would like to remember and review.
                        </p>
                        <button
                          onClick={() => handleTabChange('All')}
                          className="mt-6 font-serif italic text-[0.95rem] text-[#7c5e39] hover:text-[#5e4324] underline cursor-pointer font-bold"
                        >
                          {currentLocale.ui.exploreDecks}
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {items.map(({ story, item, key }) => {
                        const style = CATEGORY_STYLES[story.category] || CATEGORY_STYLES['Essentials'];
                        return (
                          <article
                            key={key}
                            style={{ backgroundColor: style.bgColor, borderColor: style.borderColor }}
                            className="vocab-card p-5 border flex flex-col justify-between rounded-2xl hover:scale-[1.01] hover:shadow-md transition-all duration-200 text-left relative"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span 
                                  className="text-[10px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full shadow-sm"
                                  style={{ backgroundColor: style.pillBg, color: style.pillText }}
                                >
                                  {story.category.toUpperCase()}
                                </span>
                                <button
                                  onClick={() => navigateToStory(story.id)}
                                  className="text-stone-500 hover:text-stone-800 text-[12px] font-medium underline flex items-center gap-1 cursor-pointer transition-all"
                                  title="Go to this story"
                                >
                                  <span>{story.emoji} Story {story.id}: {story.title}</span>
                                </button>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveVocab(story.id, item.word);
                                }}
                                className="p-1.5 rounded-full hover:bg-white/60 text-amber-700 transition-colors duration-200 cursor-pointer"
                                title="Remove from Notebook"
                              >
                                <Bookmark className="w-4 h-4 fill-amber-700 text-amber-700" />
                              </button>
                            </div>
                            
                            <div className="mt-1">
                              <strong className="vocab-word font-bold text-stone-900 font-sans text-lg tracking-tight">{item.word}</strong>
                              <div className="vocab-def text-stone-700 font-serif italic text-[13.5px] mt-1">{getVocabDef(story.id, item.word, item.def_ja)}</div>
                            </div>

                            <div className="vocab-example text-stone-800 text-[13.5px] italic font-sans mt-3 border-t border-stone-200/30 pt-2.5">
                              💬 {getVocabExample(story.id, item.word, item.example)}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const items = getSavedExpressionDetails();
                  if (items.length === 0) {
                    return (
                      <div className="text-center py-20 px-6 rounded-3xl bg-stone-50/60 border border-dashed border-stone-200/80">
                        <p className="font-serif italic text-lg text-stone-500">
                          Your saved expressions list is empty.
                        </p>
                        <p className="font-sans text-stone-400 text-xs mt-2 max-w-sm mx-auto">
                          Read through stories and click the bookmark star next to any key expressions you would like to remember and review.
                        </p>
                        <button
                          onClick={() => handleTabChange('All')}
                          className="mt-6 font-serif italic text-[0.95rem] text-[#7c5e39] hover:text-[#5e4324] underline cursor-pointer font-bold"
                        >
                          {currentLocale.ui.exploreDecks}
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {items.map(({ story, item, key }) => {
                        const style = CATEGORY_STYLES[story.category] || CATEGORY_STYLES['Essentials'];
                        return (
                          <article
                            key={key}
                            style={{ backgroundColor: `${style.bgColor}70`, borderColor: style.borderColor }}
                            className="p-5 border rounded-2xl flex flex-col justify-between shadow-sm text-left relative"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <span 
                                  className="text-[10px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full shadow-sm"
                                  style={{ backgroundColor: style.pillBg, color: style.pillText }}
                                >
                                  {story.category.toUpperCase()}
                                </span>
                                <button
                                  onClick={() => navigateToStory(story.id)}
                                  className="text-stone-500 hover:text-stone-800 text-[12px] font-medium underline flex items-center gap-1 cursor-pointer transition-all"
                                  title="Go to this story"
                                >
                                  <span>{story.emoji} Story {story.id}: {story.title}</span>
                                </button>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveExpression(story.id, item.phrase);
                                }}
                                className="p-1.5 rounded-full hover:bg-white/60 text-amber-700 transition-colors duration-200 cursor-pointer"
                                title="Remove from Notebook"
                              >
                                <Bookmark className="w-4 h-4 fill-amber-700 text-amber-700" />
                              </button>
                            </div>                            <div>
                              <div className="flex flex-wrap items-baseline gap-2">
                                <strong className="font-bold text-stone-900 font-sans text-[18px] tracking-tight">{item.phrase}</strong>
                                <span className="text-stone-600 text-xs font-serif italic">({getExpressionUsage(story.id, item.phrase, item.usage_ja)})</span>
                              </div>
                              
                              <div className="mt-4 space-y-3">
                                {(() => {
                                  const pairs = getPairedExamples(story.id, item.phrase, item.examples);
                                  const isSingle = pairs.length === 1;
                                  return pairs.map((pair, exIdx) => {
                                    const isEven = exIdx % 2 === 0;
                                    return (
                                      <div 
                                        key={exIdx} 
                                        style={!isEven ? { backgroundColor: style.pillBg, borderColor: style.borderColor } : undefined}
                                        className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] font-sans leading-relaxed border shadow-sm ${
                                          isSingle
                                            ? 'w-full text-left bg-white border-stone-200 text-stone-900'
                                            : isEven 
                                              ? 'bg-white border-stone-200 mr-auto rounded-tl-none text-left text-stone-900 max-w-[90%]' 
                                              : 'ml-auto rounded-tr-none text-left text-stone-900 max-w-[90%]'
                                        }`}
                                      >
                                        <div className="text-stone-800 font-bold">{pair.englishSpeech}</div>
                                        {pair.translatedSpeech && (
                                          <div className="text-[11.5px] text-stone-550 italic mt-0.5 font-serif">
                                            {pair.translatedSpeech}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </main>
          </div>
        ) : (
          /* ================= DECK/CATEGORY VIEW ================= */
          <div className="w-full">
            {/* Top minimal header */}
            <header 
              className="pt-4 sm:pt-10 text-center select-none cursor-pointer group animate-slide-up-fade" 
              onClick={() => { setSelectedLevel(null); handleTabChange('All'); }}
              title="Go to Home"
            >
              <p className="font-serif italic text-[14px] tracking-wider text-stone-400 transition-colors group-hover:text-stone-600">
                A <a 
                  href="https://velumestudios.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => e.stopPropagation()}
                  className="font-sans font-semibold not-italic text-[12px] sm:text-[13px] uppercase tracking-widest text-[#7c5e39] hover:underline transition-all duration-200"
                >
                  <span className="shimmer-text">Velume Studios</span>
                </a> Production
              </p>
              <h1 className="font-serif text-[2.6rem] sm:text-[4.2rem] font-semibold text-stone-900 tracking-tight leading-tight mt-2 transition-colors group-hover:text-stone-700">
                Lumora
              </h1>
              <p className="font-serif italic text-[#7c5e39] font-bold text-[28px] sm:text-[34px] mt-2 transition-colors group-hover:text-[#5c4428] text-balance leading-normal">
                American Life Moments
              </p>
              <p className="font-sans text-[16px] sm:text-[18px] text-stone-500 mt-1 transition-colors group-hover:text-stone-600 text-balance leading-relaxed">
                Learn English vocabulary &amp; expressions in real everyday situations
              </p>
            </header>

            {selectedLevel === null ? (
              <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 pb-28 sm:pb-20 animate-slide-up-fade">
                {/* Gentle Progress Indicator */}
                <div className="max-w-md mx-auto text-center font-sans select-none mb-10">
                  <div className="flex justify-between items-center text-[13px] font-serif italic text-stone-500 mb-1.5 px-0.5">
                    <span>{completedStories.length} of {STORIES_DATA.length} moments explored</span>
                    <span className="font-sans not-italic text-xs font-semibold text-[#2e4f3c]">
                      {Math.round((completedStories.length / STORIES_DATA.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#2e4f3c] transition-all duration-700 ease-out rounded-full"
                      style={{ width: `${(completedStories.length / STORIES_DATA.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Grid of 10 Levels */}
                <div className="flex flex-col gap-8">

                  {/* ── Welcome to the Neighborhood Card ── */}
                  {(() => {
                    const getLang = (item: { en: string; ja: string; zh: string; ko: string; th: string; vi: string }) =>
                      localeKey === 'zh-TW' ? item.zh : localeKey === 'ko' ? item.ko : localeKey === 'th' ? item.th : localeKey === 'vi' ? item.vi : item.ja;

                    const welcomeTitles = {
                      en: 'Welcome to the Neighborhood',
                      ja: 'Lumoraへようこそ',
                      zh: '歡迎來到 Lumora',
                      ko: 'Lumora에 오신 것을 환영합니다',
                      th: 'ยินดีต้อนรับสู่ Lumora',
                      vi: 'Chào mừng bạn đến với Lumora',
                    };

                    return (
                      <article
                        key="welcome"
                        onClick={!welcomeExpanded ? () => setWelcomeExpanded(true) : undefined}
                        className={`relative bg-white rounded-[28px] p-5 sm:p-6 md:p-8 shadow-[0_8px_28px_rgba(0,0,0,0.04)] border transition-all duration-300 select-none group/card ${
                          !welcomeExpanded ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
                        }`}
                        style={{ borderColor: welcomeExpanded ? '#b8dad4' : '#EDE9FF' }}
                      >
                        {/* Clickable header — collapses when expanded */}
                        <div
                          onClick={welcomeExpanded ? () => setWelcomeExpanded(false) : undefined}
                          className={welcomeExpanded ? 'cursor-pointer hover:opacity-85 transition-opacity duration-200' : ''}
                        >
                          <div className="flex items-center justify-between mb-4">
                          </div>
                          <h2 className="font-serif-display text-[1.8rem] sm:text-[2.2rem] font-medium text-stone-900 tracking-tight leading-tight text-left group-hover/card:text-[#3d6e65] transition-colors duration-300">
                            Welcome to the Neighborhood
                            <span className="block text-stone-400 font-normal text-[0.95rem] sm:text-[1rem] mt-1.5 font-sans not-italic font-medium">
                              {getLang(welcomeTitles)}
                            </span>
                          </h2>
                        </div>

                        {/* Teaser (always visible) */}
                        <div className="mt-4 text-left border-l-2 pl-4 space-y-1" style={{ borderColor: '#b8dad4' }}>
                          <p className="font-sans text-stone-600 text-[15px] sm:text-[16px] leading-relaxed font-normal">
                            Every neighborhood has its own rhythm.
                          </p>
                          <p className="font-sans text-stone-400 text-[13px] leading-relaxed italic">
                            {getLang({ en: '', ja: 'どの街にも独特のリズムがある。', zh: '每個社區都有自己的節奏。', ko: '모든 동네에는 고유한 리듬이 있다.', th: 'ทุกย่านมีจังหวะของตัวเอง', vi: 'Mỗi khu phố đều có nhịp điệu riêng.' })}
                          </p>
                        </div>

                        {/* Expandable body */}
                        <div className={`grid transition-all duration-[1100ms] ease-[cubic-bezier(0.25,1,0.3,1)] ${
                          welcomeExpanded ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-dashed border-stone-200' : 'grid-rows-[0fr] opacity-0'
                        }`}>
                          <div className="overflow-hidden space-y-6">

                            {/* American Moment */}
                            <div
                              className="p-5 sm:p-6 rounded-[24px] border text-left"
                              style={{ backgroundColor: '#ebf7f580', borderColor: '#b8dad4' }}
                            >
                              <div className="flex items-center justify-between mb-3 w-full">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4" style={{ color: '#3d6e65' }} />
                                  <span className="text-[11px] font-sans font-bold tracking-widest uppercase" style={{ color: '#3d6e65' }}>
                                    American Moment
                                  </span>
                                </div>
                                {/* Moment play button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playWelcomeSpeech('moment', 'welcome-moment', "There is no finish line here. Take your time. Read each story more than once. Listen to the audio, notice the expressions, and enjoy the small moments that make everyday life feel real. Learning English isn't about racing from one lesson to the next. It's about gradually becoming familiar with the language, the culture, and the people who speak it. We hope you'll settle in, enjoy the journey, and feel at home here in Lumora.", './audio/moments/story_welcome_moment.m4a', e);
                                  }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center border bg-white/90 shadow-sm transition-all duration-300 tactile-btn cursor-pointer border-[#b8dad4] text-[#3d6e65] hover:bg-white"
                                >
                                  {playingMomentId === 'welcome-moment' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <div className="space-y-3">
                                <p className="font-sans text-stone-900 text-[15px] sm:text-[16px] leading-relaxed font-medium">
                                  There is no finish line here.
                                  {' '}Take your time. Read each story more than once. Listen to the audio, notice the expressions, and enjoy the small moments that make everyday life feel real.
                                  {' '}Learning English isn't about racing from one lesson to the next. It's about gradually becoming familiar with the language, the culture, and the people who speak it.
                                  {' '}We hope you'll settle in, enjoy the journey, and feel at home here in Lumora.
                                </p>
                                <p className="font-sans text-stone-500 text-[13.5px] sm:text-[14px] leading-relaxed border-t border-stone-200/40 pt-2.5 mt-2.5">
                                  {localeKey === 'zh-TW' ? '這裡沒有終點線。慢慢來。每篇故事可以多讀幾遍。聽聽音檔，留意那些表達方式，享受那些讓日常生活變得真實的小時刻。學英文不是急著從一課趕到下一課。而是逐漸熟悉這門語言、熟悉文化，以及熟悉說著這種語言的人們。我們希望你會在這裡安頓下來，享受這段旅程，並在 Lumora 裡感覺像在家一樣。'
                                  : localeKey === 'ko' ? '여기에는 결승선이 없습니다. 서두르지 마세요. 각 이야기를 여러 번 읽어보세요. 오디오를 듣고, 표현들을 살펴보고, 일상생활을 생생하게 만드는 작은 순간들을 즐기세요. 영어를 배우는 것은 한 수업에서 다음 수업으로 달려가는 것이 아닙니다. 그것은 언어와, 문화와, 그 언어를 사용하는 사람들에게 점차 익숙해지는 것입니다. 여러분이 Lumora에서 편안히 머물며, 이 여정을 즐기고, 집에 있는 것처럼 느끼길 바랍니다.'
                                  : localeKey === 'th' ? 'ที่นี่ไม่มีเส้นชัย ใช้เวลาของคุณ อ่านแต่ละเรื่องมากกว่าหนึ่งครั้ง ฟังเสียง เลือกดูสำนวน และเพลิดเพลินกับช่วงเวลาเล็กๆ น้อยๆ ที่ทำให้ชีวิตประจำวันรู้สึกมีชีวิตชีวา การเรียนรู้ภาษาอังกฤษไม่ใช่การเร่งจากบทเรียนหนึ่งไปยังอีกบทเรียนหนึ่ง มันคือการค่อยๆ ทำความคุ้นเคยกับภาษา วัฒนธรรม และผู้คนที่ใช้ภาษานั้น เราหวังว่าคุณจะเข้ามาพักผ่อน เพลิดเพลินกับการเดินทาง และรู้สึกเหมือนอยู่บ้านที่ Lumora'
                                  : localeKey === 'vi' ? 'Không có vạch đích ở đây. Hãy thoải mái. Đọc mỗi câu chuyện nhiều hơn một lần. Lắng nghe âm thanh, chú ý đến các cách diễn đạt, và tận hưởng những khoảnh khắc nhỏ bé khiến cuộc sống hàng ngày trở nên chân thực. Học tiếng Anh không phải là chạy từ bài học này sang bài học tiếp theo. Nó là về việc dần dần trở nên quen thuộc với ngôn ngữ, với văn hóa, và với những người nói ngôn ngữ đó. Chúng tôi hy vọng bạn sẽ ổn định, tận hưởng hành trình, và cảm thấy như ở nhà tại Lumora.'
                                  : 'ここにはゴールラインはない。急がないで。それぞれのストーリーを何度でも読んでほしい。音声を聴き、表現に目を留め、日常をリアルにする小さな瞬間を楽しんでほしい。英語を学ぶことは、次のレッスンへと急ぐことではない。それは、言語と、文化と、それを話す人々に徐々に親しんでいくことだ。Lumoraでくつろぎ、旅を楽しみ、家にいるように感じてもらえることを願っている。'}
                                </p>
                              </div>
                            </div>

                            {/* Reflection Question */}
                            <div className="bg-[#fdfaf5] border border-stone-200/40 p-6 rounded-[24px] text-center shadow-sm">
                              <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-stone-400 block mb-2">
                                Reflection Question
                              </span>
                              <div className="space-y-2">
                                <p className="font-serif text-stone-900 text-[16px] sm:text-[18px] leading-relaxed font-semibold max-w-lg mx-auto italic">
                                  “If you could spend one day in an American neighborhood, what would you like to do?”
                                </p>
                                <p className="font-sans text-stone-500 text-[13.5px] sm:text-[14.5px] leading-relaxed max-w-lg mx-auto">
                                  “{localeKey === 'zh-TW' ? '如果你能在美國的社區裡度過一天，你會想做什麼？'
                                  : localeKey === 'ko' ? '미국 동네에서 하루를 보낼 수 있다면, 무엇을 해보고 싶나요?'
                                  : localeKey === 'th' ? 'ถ้าคุณสามารถใช้เวลาหนึ่งวันในย่านอเมริกัน คุณอยากทำอะไร?'
                                  : localeKey === 'vi' ? 'Nếu bạn có thể dành một ngày ở một khu phố Mỹ, bạn muốn làm gì?'
                                  : 'もしアメリカの街で一日過ごせるとしたら、何をしてみたいですか？'}”
                                </p>
                              </div>
                            </div>

                            {/* Close button */}
                            <div className="border-t border-stone-200/40 pt-5 mt-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setWelcomeExpanded(false); }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-serif italic text-[14px] sm:text-[15px] tracking-wide border border-stone-200/60 bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-all duration-300 cursor-pointer active:scale-95 shadow-sm font-semibold"
                              >
                                <ChevronUp className="w-4 h-4" />
                                Close
                              </button>
                            </div>

                          </div>
                        </div>
                      </article>
                    );
                  })()}

                  {LEVELS_DATA.map((level) => {
                    const startId = (level.id - 1) * 10 + 1;
                    const endId = level.id * 10;
                    const completedInLevel = completedStories.filter(id => id >= startId && id <= endId).length;
                    const levelPercentage = completedInLevel * 10;

                    return (
                      <article
                        key={level.id}
                        onClick={() => {
                          setSelectedLevel(level.id);
                          window.scrollTo(0, 0);
                        }}
                        style={{ backgroundColor: level.bgColor, borderColor: level.borderColor }}
                        className="level-card p-8 sm:p-10 border rounded-[32px] cursor-pointer hover:scale-[1.01] hover:shadow-md active:scale-[0.99] transition-all duration-300 flex flex-col justify-between text-left group/level relative"
                      >
                        <span 
                          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] sm:text-[12px] font-sans font-bold tracking-widest px-5 py-1.5 rounded-full uppercase shadow-sm border-[1.5px] border-white z-10"
                          style={{ backgroundColor: level.textColor, color: '#ffffff' }}
                        >
                          LEVEL {level.id}
                        </span>
                        <div>
                          {/* Card Header (Title & Level Pill aligned horizontally) */}
                          <div className="flex items-start justify-between gap-4 mb-6">
                            <h2 className="font-serif text-3xl sm:text-[34px] font-semibold text-stone-900 leading-tight group-hover/level:text-stone-700 transition-colors">
                              {level.title}
                              <span className="block text-stone-500 font-normal text-[15px] sm:text-[16px] mt-1.5 font-sans">
                                {localeKey === 'zh-TW' ? level.title_zh : localeKey === 'ko' ? level.title_ko : localeKey === 'th' ? level.title_th : localeKey === 'vi' ? level.title_vi : level.title_ja}
                              </span>
                            </h2>
                          </div>

                          {/* Description */}
                          <p className="font-sans text-stone-600 text-[15px] sm:text-[16px] leading-relaxed mt-3.5 font-normal">
                            {level.description}
                          </p>
                          <p className="font-sans text-stone-400 text-[14px] sm:text-[15px] leading-relaxed mt-1.5 font-normal italic border-t border-stone-200/30 pt-3">
                            {localeKey === 'zh-TW' ? level.description_zh : localeKey === 'ko' ? level.description_ko : localeKey === 'th' ? level.description_th : localeKey === 'vi' ? level.description_vi : level.description_ja}
                          </p>
                        </div>

                        {/* Progress Tracker */}
                        <div className="mt-6 border-t border-stone-200/40 pt-5 font-sans select-none">
                          <div className="flex justify-between items-center text-[12px] sm:text-[13px] font-medium text-stone-500 mb-2">
                            <span>{completedInLevel} of 10 stories</span>
                            <span style={{ color: level.textColor }} className="font-bold">{levelPercentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200/40 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{ 
                                width: `${levelPercentage}%`,
                                backgroundColor: level.textColor
                              }}
                            />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto mt-6 px-4 sm:px-6">
                {/* Levels Navigation Tabs */}
                <div className="flex justify-center mb-6 animate-slide-up-fade">
                  <div className="flex items-center gap-2 bg-[#f6f3ed]/65 border border-stone-200/25 p-2 rounded-full backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-x-auto max-w-full">
                    {LEVELS_DATA.map(l => {
                      const isActive = l.id === selectedLevel;
                      return (
                        <button
                          key={l.id}
                          onClick={() => {
                            setSelectedLevel(l.id);
                            window.scrollTo(0, 0);
                          }}
                          style={{
                            backgroundColor: isActive ? l.bgColor : 'transparent',
                            color: isActive ? l.textColor : '#78716c',
                            borderColor: isActive ? l.borderColor : 'transparent'
                          }}
                          className={`flex items-center px-4.5 py-2 rounded-full font-serif italic text-[14.5px] sm:text-[15.5px] font-medium border transition-all duration-300 cursor-pointer shrink-0 ${
                            isActive 
                              ? 'shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold scale-[1.02]' 
                              : 'hover:text-stone-900 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <span>{l.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Level Title Card */}
                {(() => {
                  const currentLevelData = LEVELS_DATA.find(l => l.id === selectedLevel);
                  if (!currentLevelData) return null;
                  return (
                    <div 
                      style={{ backgroundColor: currentLevelData.bgColor, borderColor: currentLevelData.borderColor }}
                      className="p-6 sm:p-8 rounded-[28px] border text-left mb-6 shadow-sm animate-slide-up-fade relative mt-6"
                    >
                      <span 
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] sm:text-[12px] font-sans font-bold tracking-widest px-5 py-1.5 rounded-full uppercase shadow-sm border-[1.5px] border-white z-10"
                        style={{ backgroundColor: currentLevelData.textColor, color: '#ffffff' }}
                      >
                        LEVEL {selectedLevel}
                      </span>
                      <div className="flex items-start justify-between gap-4">
                        <h2 translate="no" className="font-serif text-3xl sm:text-[38px] font-semibold text-stone-900 tracking-tight leading-tight pt-1">
                          {currentLevelData.title}
                          <span className="block text-stone-500 font-normal text-sm sm:text-base mt-2 font-sans">
                            {localeKey === 'zh-TW' ? currentLevelData.title_zh : localeKey === 'ko' ? currentLevelData.title_ko : localeKey === 'th' ? currentLevelData.title_th : localeKey === 'vi' ? currentLevelData.title_vi : currentLevelData.title_ja}
                          </span>
                        </h2>
                      </div>
                      <p className="font-sans text-stone-600 text-sm sm:text-md mt-3 leading-relaxed">
                        {currentLevelData.description}
                      </p>
                      <p className="font-sans text-stone-400 text-xs sm:text-sm mt-1 leading-relaxed italic border-t border-stone-200/40 pt-2">
                        {localeKey === 'zh-TW' ? currentLevelData.description_zh : localeKey === 'ko' ? currentLevelData.description_ko : localeKey === 'th' ? currentLevelData.description_th : localeKey === 'vi' ? currentLevelData.description_vi : currentLevelData.description_ja}
                      </p>
                    </div>
                  );
                })()}

                {/* Relax & Listen to All Stories Banner */}
                <div className="mb-6">
                  <button
                    onClick={() => {
                      const levelStories = selectedLevel !== null
                        ? STORIES_DATA.filter(s => s.id >= (selectedLevel - 1) * 10 + 1 && s.id <= selectedLevel * 10)
                        : STORIES_DATA;
                      startListenToAll(levelStories);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-amber-50/95 hover:bg-amber-100/90 border border-amber-200/80 shadow-sm flex items-center justify-between text-amber-950 transition-all group cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-200/70 flex items-center justify-center text-amber-900 shadow-inner shrink-0">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <h4 className="font-serif font-semibold text-stone-900 text-sm sm:text-base leading-tight">
                        Relax & Listen to All Stories
                      </h4>
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-stone-900 text-amber-100 text-xs font-sans font-medium group-hover:bg-stone-800 transition-colors shadow-sm shrink-0 ml-2">
                      {isListenToAllActive ? "Playing..." : "Play All"}
                    </span>
                  </button>
                </div>

                {/* Simple Toggle Pills */}
                <div className="text-center font-sans select-none mb-6">
                  <div className="inline-flex p-0.5 rounded-full bg-stone-200/50 border border-stone-200/30">
                    <button
                      onClick={() => setFilterMode('all')}
                      className={`px-5 py-1.5 rounded-full font-serif italic text-[14px] sm:text-[15px] font-semibold transition-all duration-300 cursor-pointer active:scale-95 ${
                        filterMode === 'all'
                          ? 'bg-white text-[#2e4f3c] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-stone-200/10'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      All Moments
                    </button>
                    <button
                      onClick={() => setFilterMode('unread')}
                      className={`px-5 py-1.5 rounded-full font-serif italic text-[14px] sm:text-[15px] font-semibold transition-all duration-300 cursor-pointer active:scale-95 ${
                        filterMode === 'unread'
                          ? 'bg-white text-[#2e4f3c] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-stone-200/10'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Unread Only
                    </button>
                  </div>
                </div>

                {/* Scrollable vertical list of beautiful story card structures */}
                <main key={`${selectedLevel}-${filterMode}`} className="space-y-6 pb-28 sm:pb-20 animate-slide-up-fade">
              {filteredStories.map((story) => {
                const style = CATEGORY_STYLES[story.category] || {
                  bgColor: '#fdf0f4',
                  borderColor: '#dec9c1',
                  textColor: '#7c5e39',
                  pillBg: '#fdf0f4',
                  pillText: '#7c5e39'
                };
                const isExpanded = !!expandedStories[story.id];
                const isStoryPlaying = playingStoryId === story.id;
                return (
                  <article
                    key={story.id}
                    id={`story-${story.id}`}
                    onClick={!isExpanded ? () => {
                      if (!isPremium && story.id > 1) {
                        setShowPaywall(true);
                        return;
                      }
                      toggleExpandStory(story.id);
                    } : undefined}
                    className={`relative bg-white rounded-[28px] p-5 sm:p-6 md:p-8 shadow-[0_8px_28px_rgba(0,0,0,0.04)] border transition-all duration-300 select-none group/card ${
                      !isExpanded ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
                    } ${
                      !isExpanded && completedStories.includes(story.id) ? 'opacity-[0.82] hover:opacity-100' : ''
                    } ${
                      !isPremium && story.id > 1 ? 'opacity-90' : ''
                    }`}
                    style={{ 
                      borderColor: isExpanded ? style.borderColor : (completedStories.includes(story.id) ? '#eedfe3' : '#EDE9FF'), 
                      backgroundColor: !isExpanded && completedStories.includes(story.id) ? '#fbf5f7' : '#ffffff' 
                    }}
                  >
                    {/* Clickable Header Area (Toggles collapse only when expanded) */}
                    <div 
                      onClick={isExpanded ? () => toggleExpandStory(story.id) : undefined}
                      className={isExpanded ? 'cursor-pointer hover:opacity-85 active:opacity-75 transition-all duration-200' : ''}
                    >
                      {/* Top Header Row of Card (Title & Story Number aligned horizontally) */}
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="font-serif-display text-[1.8rem] sm:text-[2.2rem] font-medium text-stone-900 tracking-tight leading-tight text-left group-hover/card:text-[#7c5e39] transition-colors duration-300">
                          {story.title}
                          <span className="block text-stone-400 font-normal text-[0.95rem] sm:text-[1rem] mt-1.5 font-sans not-italic font-medium">
                            {getStoryTitle(story)}
                          </span>
                        </h2>
                        
                        <div className="flex items-center gap-2 shrink-0 mt-1">
                          {!isPremium && story.id > 1 && (
                            <span className="flex items-center gap-1 text-[11px] font-sans font-bold text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
                              <Lock className="w-3 h-3" />
                              Premium
                            </span>
                          )}
                          {isPremium && completedStories.includes(story.id) && (
                            <span className="flex items-center gap-1 text-[11px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                              {storyVibes[story.id] && (
                                <span className="text-[13px] mr-0.5 animate-scale-up" title="Story Vibe Stamp">
                                  {storyVibes[story.id]}
                                </span>
                              )}
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Read
                            </span>
                          )}
                          <span className="text-stone-700 text-[18px] sm:text-[19px] font-serif font-bold italic">Story #{story.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Teaser Sneak Preview */}
                    <div className="mt-4 text-left border-l-2 pl-4 space-y-1" style={{ borderColor: style.borderColor }}>
                      <p className="font-sans text-stone-600 text-[15px] sm:text-[16px] leading-relaxed font-normal">
                        {story.teaser}
                      </p>
                      <p className="font-sans text-stone-400 text-[13px] leading-relaxed italic">
                        {getStoryTeaser(story)}
                      </p>
                    </div>

                    {/* Expandable Accordion Body */}
                    <div className={`grid transition-all duration-[1100ms] ease-[cubic-bezier(0.25,1,0.3,1)] ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-dashed border-stone-200' : 'grid-rows-[0fr] opacity-0'
                    }`}>
                      <div className="overflow-hidden space-y-6">
                        
                        {/* American Moment Callout (Moved to top as cultural schema primer) */}
                        <div 
                          className="p-5 sm:p-6 rounded-[24px] border text-left" 
                          style={{ backgroundColor: `${style.bgColor}80`, borderColor: style.borderColor }}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex flex-col items-start text-left">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-[18px] h-[18px]" style={{ color: style.textColor }} />
                                <span 
                                  className="text-[13.5px] font-sans font-bold tracking-widest uppercase"
                                  style={{ color: style.textColor }}
                                >
                                  American Moment
                                </span>
                              </div>
                              <span className="text-[12.5px] font-serif italic text-stone-600 block mt-1">
                                {getLearnCulturePrompt()}
                              </span>
                            </div>
                            {(() => {
                              const enStory = storiesEn[story.id.toString()];
                              const momentEn = enStory?.american_moment_en || "";
                              if (momentEn) {
                                return (
                                  <button
                                    onClick={(e) => playMomentSpeech(story.id, momentEn, e)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 tactile-btn cursor-pointer ${
                                      playingMomentId === story.id
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-500'
                                    }`}
                                    title="Listen to American Moment explanation"
                                  >
                                    {playingMomentId === story.id ? (
                                      <VolumeX className="w-4 h-4" />
                                    ) : (
                                      <Volume2 className="w-4 h-4" />
                                    )}
                                  </button>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          {(() => {
                            const enStory = storiesEn[story.id.toString()];
                            const momentEn = enStory?.american_moment_en;
                            return (
                              <div className="space-y-3">
                                {momentEn && (
                                  <p className="font-sans text-stone-900 text-[15px] sm:text-[16px] leading-relaxed font-medium">
                                    {momentEn}
                                  </p>
                                )}
                                <p className={`font-sans text-stone-500 text-[13.5px] sm:text-[14px] leading-relaxed ${momentEn ? 'border-t border-stone-200/40 pt-2.5 mt-2.5' : ''}`}>
                                  {getAmericanMoment(story)}
                                </p>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Audio Player Block */}
                        <div 
                          className="audio-player flex items-center gap-4 bg-stone-50/50 p-4 rounded-2xl border border-stone-100/60"
                          onClick={(e) => e.stopPropagation()} // Prevent card collapse
                        >
                          <button 
                            onClick={(e) => playStorySpeech(story, e)}
                            className={`play-btn w-11 h-11 rounded-full flex items-center justify-center text-white text-base transition-colors duration-300 cursor-pointer ${
                              isStoryPlaying ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                            style={!isStoryPlaying ? { backgroundColor: style.textColor } : undefined}
                          >
                            {isStoryPlaying ? '⏸' : '▶'}
                          </button>
                          <div className="text-left">
                            <div className="audio-label text-sm font-sans font-bold text-stone-800">🎧 Listen to the story</div>
                            <div className="text-xs text-stone-400 font-sans mt-0.5">English · natural speed</div>
                          </div>
                        </div>

                        {/* Section 1: The Narrative Story Dialogue */}
                        <div className="text-left bg-stone-50/40 p-5 rounded-2xl border border-stone-100/40">
                          <h3 className="font-serif-display font-medium text-stone-800 text-lg mb-3" style={{ color: style.textColor }}>Story Dialogue</h3>
                          <div className="font-sans space-y-4 text-[17.5px] sm:text-[19.5px] leading-relaxed text-stone-950">
                            {story.story.split('\n\n').map((paragraph, pIdx) => {
                              const linesInParagraph = paragraph.split('\n');
                              return (
                                <p key={pIdx} className="text-stone-950 font-sans font-medium text-[17.5px] sm:text-[19.5px] leading-relaxed py-1 text-left">
                                  {linesInParagraph.map((line, lIdx) => {
                                    const colonIdx = line.indexOf(':');
                                    if (colonIdx > 0 && colonIdx < 30 && !line.includes('http://') && !line.includes('https://')) {
                                      const speaker = line.substring(0, colonIdx).trim().replace(/"/g, '');
                                      const speech = line.substring(colonIdx + 1).trim();
                                      return (
                                        <span key={lIdx} className="block mt-2 pl-4 border-l-2 py-0.5" style={{ borderColor: style.borderColor }}>
                                          <strong className="text-stone-950 font-bold">{speaker}:</strong> {renderHighlightedText(speech, story.vocab, story.expressions, story.id, style)}
                                        </span>
                                      );
                                    }
                                    return (
                                      <span key={lIdx} className="block mt-1">
                                        {renderHighlightedText(line, story.vocab, story.expressions, story.id, style)}
                                      </span>
                                    );
                                  })}
                                </p>
                              );
                            })}
                          </div>
                        </div>

                        <hr className="border-none border-t-2 border-stone-100" />

                        {/* Section 2: Key Expressions & Vocabulary Grid (Stacked Layout) */}
                        <div className="space-y-8 text-left">
                          
                          {/* Vocab Bank */}
                          <div className="space-y-4">
                            <h3 className="font-serif-display font-medium text-lg border-b border-stone-100 pb-1.5" style={{ color: style.textColor }}>Vocabulary Bank</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {story.vocab.map((item, vIdx) => {
                                const wordKey = `${story.id}-${item.word}`;
                                const isVocabExpanded = !!expandedVocab[wordKey];
                                return (
                                  <div 
                                    key={vIdx} 
                                    id={`vocab-${story.id}-${item.word}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpandVocab(wordKey);
                                    }}
                                    style={{ backgroundColor: style.bgColor, borderColor: style.borderColor }}
                                    className="vocab-card p-4 border cursor-pointer flex flex-col justify-between rounded-2xl hover:scale-[1.01] hover:shadow-md transition-all duration-200"
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <div className="flex flex-col text-left">
                                        <strong className="vocab-word font-bold text-stone-900 font-sans text-[18px] tracking-tight">{item.word}</strong>
                                        <span className="vocab-def text-stone-600 font-serif italic text-[14.5px] mt-0.5">{getVocabDef(story.id, item.word, item.def_ja)}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSaveVocab(story.id, item.word);
                                          }}
                                          className="p-1.5 rounded-full hover:bg-white/60 text-stone-500 hover:text-amber-700 transition-colors duration-200"
                                          title="Save to Notebook"
                                        >
                                          <Bookmark className={`w-3.5 h-3.5 ${savedVocab.includes(`${story.id}-${item.word}`) ? 'fill-amber-700 text-amber-700' : 'text-stone-400'}`} />
                                        </button>
                                        <span className="text-[10.5px] uppercase font-sans tracking-wider font-semibold text-stone-700 bg-white/70 border border-stone-200/40 px-2.5 py-0.5 rounded-full select-none shadow-sm">
                                          {isVocabExpanded ? 'Hide' : 'Example'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className={`vocab-example text-stone-800 text-[14.5px] font-sans mt-2 border-t border-stone-200/30 pt-2 flex items-center justify-between gap-2 ${isVocabExpanded ? 'show' : ''}`}>
                                      <span className="italic flex-1">
                                        💬 {getVocabExample(story.id, item.word, item.example)}
                                      </span>
                                      <button
                                        onClick={(e) => playVocabSpeech(story.id, item.word, item.example, e)}
                                        className={`p-1.5 rounded-full hover:bg-white/80 transition-colors duration-200 shadow-sm border border-stone-200/40 ${
                                          playingVocabKey === `${story.id}-${item.word}`
                                            ? 'text-emerald-600 bg-emerald-50/50'
                                            : 'text-stone-500 hover:text-stone-800 bg-stone-50/50'
                                        }`}
                                        title="Listen to Example"
                                      >
                                        {playingVocabKey === `${story.id}-${item.word}` ? (
                                          <VolumeX className="w-3.5 h-3.5" />
                                        ) : (
                                          <Volume2 className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Key Expressions */}
                          <div className="space-y-4">
                            <h3 className="font-serif-display font-medium text-lg border-b border-stone-100 pb-1.5" style={{ color: style.textColor }}>Key Expressions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {story.expressions.map((exp, eIdx) => (
                                <div 
                                  key={eIdx} 
                                  id={`expression-${story.id}-${exp.phrase}`}
                                  style={{ backgroundColor: `${style.bgColor}70`, borderColor: style.borderColor }}
                                  className="p-4 border rounded-2xl flex flex-col justify-between shadow-sm"
                                >
                                  <div>
                                    <div className="flex justify-between items-start w-full">
                                      <div className="flex items-center flex-wrap gap-2 text-left">
                                        <strong className="font-bold text-stone-900 font-sans text-[18px] tracking-tight">{exp.phrase}</strong>
                                        <button
                                          onClick={(e) => playExpressionSpeech(story.id, exp.phrase, exp.examples, e)}
                                          className={`p-1 rounded-full hover:bg-white/80 transition-colors duration-200 shadow-sm border border-stone-200/40 ${
                                            playingExpressionKey === `${story.id}-${exp.phrase}`
                                              ? 'text-emerald-600 bg-emerald-50/50'
                                              : 'text-stone-400 hover:text-stone-700 bg-stone-50/50'
                                          }`}
                                          title="Listen to Dialogue Examples"
                                        >
                                          {playingExpressionKey === `${story.id}-${exp.phrase}` ? (
                                            <VolumeX className="w-3.5 h-3.5" />
                                          ) : (
                                            <Volume2 className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                        <span className="text-stone-600 text-[14.5px] font-serif italic">({getExpressionUsage(story.id, exp.phrase, exp.usage_ja)})</span>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSaveExpression(story.id, exp.phrase);
                                        }}
                                        className="p-1.5 rounded-full hover:bg-white/60 text-stone-500 hover:text-amber-700 transition-colors duration-200"
                                        title="Save to Notebook"
                                      >
                                        <Bookmark className={`w-3.5 h-3.5 ${savedExpressions.includes(`${story.id}-${exp.phrase}`) ? 'fill-amber-700 text-amber-700' : 'text-stone-400'}`} />
                                      </button>
                                    </div>
                                    <div className="mt-3 space-y-2.5">
                                      {(() => {
                                        const pairs = getPairedExamples(story.id, exp.phrase, exp.examples);
                                        const isSingle = pairs.length === 1;
                                        return pairs.map((pair, exIdx) => {
                                          const isEven = exIdx % 2 === 0;
                                          return (
                                            <div 
                                              key={exIdx} 
                                              style={!isEven ? { backgroundColor: style.pillBg, borderColor: style.borderColor } : undefined}
                                              className={`rounded-2xl px-4 py-3 text-[14.5px] sm:text-[16px] font-sans leading-relaxed border shadow-sm ${
                                                isSingle
                                                  ? 'w-full text-left bg-white border-stone-200 text-stone-900'
                                                  : isEven 
                                                    ? 'bg-white border-stone-200 mr-auto rounded-tl-none text-left text-stone-900 max-w-[90%]' 
                                                    : 'ml-auto rounded-tr-none text-left text-stone-900 max-w-[90%]'
                                              }`}
                                            >
                                              <div className="text-stone-800 font-bold">{pair.englishSpeech}</div>
                                              {pair.translatedSpeech && (
                                                <div className="text-[13px] sm:text-[14.5px] text-stone-550 italic mt-0.5 font-serif">
                                                  {pair.translatedSpeech}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        });
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Section 3: Cultural Vibe Check ("American Moment" & Reflection) */}
                      <div className="space-y-6">

                        {/* Reflection Box */}
                        <div className="bg-[#fdfaf5] border border-stone-200/40 p-6 rounded-[24px] text-center shadow-sm">
                          <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-stone-400 block mb-2">
                            Reflection Question
                          </span>
                          {(() => {
                            const enStory = storiesEn[story.id.toString()];
                            const reflectionEn = enStory?.reflection_en ? enStory.reflection_en.replace(/\s*##\s*$/, '') : '';
                            return (
                              <div className="space-y-2">
                                {reflectionEn && (
                                  <p className="font-serif text-stone-900 text-[16px] sm:text-[18px] leading-relaxed font-semibold max-w-lg mx-auto italic">
                                    “ {reflectionEn} ”
                                  </p>
                                )}
                                <p className="font-sans text-stone-500 text-[13.5px] sm:text-[14.5px] leading-relaxed max-w-lg mx-auto">
                                  “ {getReflection(story)} ”
                                </p>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Bottom Action Row: Quiet, Centered Single-Button Completion Flow */}
                        <div className="pt-4 mt-2 flex justify-center items-center">
                          {completedStories.includes(story.id) ? (
                            <div className="flex items-center gap-3 animate-fade-in text-[13px] bg-stone-50 border border-stone-200/50 px-4 py-1.5 rounded-full">
                              <span className="flex items-center gap-1.5 text-stone-500 font-sans font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-scale-up" />
                                Story completed
                              </span>
                              <span className="text-stone-300">|</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStoryCompleted(story.id);
                                }}
                                className="text-stone-400 hover:text-amber-900 font-sans font-semibold transition-all duration-200 cursor-pointer active:scale-95"
                              >
                                Reset
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStoryCompleted(story.id);
                              }}
                              className="flex items-center gap-2 py-2 px-5 rounded-full border border-stone-200/80 bg-stone-50/50 hover:bg-stone-100 hover:border-stone-300 text-stone-500 hover:text-stone-800 font-sans font-semibold text-[13px] tracking-wide transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
                            >
                              <CheckCircle2 className="w-4 h-4 text-stone-400" />
                              Mark Completed & Close
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  </article>
                );
              })}
            </main>

            {/* Bottom Levels Navigation Tabs */}
            <div className="flex justify-center mt-8 mb-12 animate-slide-up-fade">
              <div className="flex items-center gap-2 bg-[#f6f3ed]/65 border border-stone-200/25 p-2 rounded-full backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-x-auto max-w-full">
                {LEVELS_DATA.map(l => {
                  const isActive = l.id === selectedLevel;
                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        setSelectedLevel(l.id);
                        window.scrollTo(0, 0);
                      }}
                      style={{
                        backgroundColor: isActive ? l.bgColor : 'transparent',
                        color: isActive ? l.textColor : '#78716c',
                        borderColor: isActive ? l.borderColor : 'transparent'
                      }}
                      className={`flex items-center px-4.5 py-2 rounded-full font-serif italic text-[14.5px] sm:text-[15.5px] font-medium border transition-all duration-300 cursor-pointer shrink-0 ${
                        isActive 
                          ? 'shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-bold scale-[1.02]' 
                          : 'hover:text-stone-900 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span>{l.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    )}
      </div>

      {/* Symmetrical Boutique Floating Background Music Control Widget (Bottom Left) -- Collapsible single node opening vertically */}
      <div 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="fixed bottom-6 left-3 md:left-6 z-50 flex flex-col-reverse items-center bg-[#fdfaf5]/90 hover:bg-[#fdfaf5]/95 border border-stone-200/60 shadow-[0_8px_30px_rgba(40,36,32,0.065)] p-1.5 rounded-full select-none backdrop-blur-md transition-all duration-300 gap-1.5"
      >
        {/* Toggle Button - A clean music note icon */}
        <button
          onClick={() => setIsMusicOpen(!isMusicOpen)}
          className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border transition-all duration-300 tactile-btn cursor-pointer ${
            isMusicOpen 
              ? 'bg-stone-200 border-stone-300 text-stone-800' 
              : isPlayingMusic
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-stone-50 border-stone-100 text-stone-500 hover:text-stone-800'
          }`}
          title={isMusicOpen ? "Close Music Menu" : "Choose Background Music"}
        >
          <Music className={`w-[18px] h-[18px] ${isPlayingMusic && !isMusicOpen ? 'animate-pulse' : ''}`} />
        </button>

        {/* Expanded Songs Selection Panel (Vertical stacking) */}
        {isMusicOpen && (
          <div className="flex flex-col items-center gap-1.5 pb-1 animate-fade-in">
            {TRACKS.map((track) => {
              const isActive = selectedTrack.id === track.id;
              const isCurrentPlaying = isActive && isPlayingMusic;
              const isCurrentLoading = isActive && isAudioLoading;
              const hasActiveError = isActive && audioError;
              
              return (
                <button
                  key={track.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackSelect(track);
                  }}
                  className={`group/btn relative flex items-center justify-center w-[38px] h-[38px] rounded-full border transition-all duration-300 tactile-btn cursor-pointer ${
                    isActive 
                      ? isCurrentPlaying
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-[0_2px_8px_rgba(16,185,129,0.08)]' 
                        : hasActiveError
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-stone-100 border-stone-300 text-stone-800'
                      : 'bg-transparent border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                  }`}
                  title={hasActiveError ? `File missing: ${track.file.substring(1)}` : `Play/Pause ${track.name}`}
                >
                  {isCurrentLoading ? (
                    <span className="w-[18px] h-[18px] border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className={`relative text-[10px] font-sans font-bold tracking-tighter uppercase transition-transform duration-300 ${
                      isActive 
                        ? isCurrentPlaying
                          ? 'text-emerald-700 font-extrabold animate-[spin_6s_linear_infinite]'
                          : 'text-stone-800'
                        : 'text-stone-400 group-hover/btn:text-stone-600 group-hover/btn:scale-110'
                    }`}>
                      {track.abbr}
                      {isActive && isCurrentPlaying && musicRepeatMode === 'single' && (
                        <span className="absolute -top-1 -right-2 text-[8px] bg-emerald-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold shadow-sm" style={{ animation: 'none', transform: 'rotate(0deg)' }}>1</span>
                      )}
                    </span>
                  )}
                  
                  {/* Micro glowing active indicator dot */}
                  {isCurrentPlaying && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                  
                  {hasActiveError && (
                    <span className="absolute -top-0.5 -right-0.5 text-[8px]">⚠️</span>
                  )}

                  {/* Tooltips - Left positioned for vertical layout */}
                  <span className="absolute left-11 scale-90 opacity-0 group-hover/btn:scale-100 group-hover/btn:opacity-100 transition-all duration-200 bg-stone-900/95 text-stone-50 text-[10px] font-sans font-medium px-2 py-1 rounded-md shadow-md whitespace-nowrap pointer-events-none md:block hidden">
                    {track.name}{isCurrentPlaying ? ' (Playing)' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>


      {/* Symmetrical Signature Footer */}
      <footer className="w-full text-center mt-20 mb-12 px-4 selection:bg-stone-200 animate-slide-up-fade">
        <p className="font-serif italic text-xs tracking-wider text-stone-400">
          A <a 
            href="https://velumestudios.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-sans font-semibold not-italic text-[10px] uppercase tracking-widest text-[#7c5e39] hover:underline transition-all duration-200"
          >
            <span className="shimmer-text">Velume Studios</span>
          </a> Production
        </p>
      </footer>

      {/* Sleek Adaptive Back-to-Top Floating Companion Button (appears on scroll) */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-22 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#fdfaf5]/90 hover:bg-[#fdfaf5] border border-stone-200/80 shadow-[0_8px_30px_rgba(40,36,32,0.05)] hover:shadow-[0_12px_40px_rgba(40,36,32,0.1)] hover:border-stone-300 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 group cursor-pointer animate-slide-up-fade"
          title={currentLocale.ui.backToTop}
        >
          <ArrowUp className="w-5 h-5 text-stone-500 group-hover:text-stone-800 transition-colors duration-200" />
        </button>
      )}

      {/* Absolute Pristine Floating Notebook Button (Bottom Right) */}
      <button
        onClick={() => {
          if (activeTab === 'Notebook') {
            setActiveTab('All');
          } else {
            setActiveTab('Notebook');
          }
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#fdfaf5] border border-stone-200/80 shadow-[0_8px_30px_rgba(120,90,60,0.08)] hover:shadow-[0_12px_40px_rgba(120,90,60,0.15)] hover:border-stone-300 hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 group cursor-pointer"
        title="My Study Notebook"
      >
        <div className="relative">
          <BookOpen className={`w-5 h-5 transition-colors duration-200 ${
            activeTab === 'Notebook' 
              ? 'text-amber-700' 
              : 'text-stone-500 group-hover:text-stone-800'
          }`} />
          {(savedVocab.length + savedExpressions.length) > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-amber-700 text-white text-[9px] font-sans font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm select-none border border-white">
              {savedVocab.length + savedExpressions.length}
            </span>
          )}
        </div>
      </button>

      {/* ── Freemium Glassmorphism Paywall Modal ── */}
      {showPaywall && (() => {
        const pw: Record<string, {
          title: string;
          subtitle: string;
          feature1: string;
          feature2: string;
          feature3: string;
          annualBtn: string;
          monthlyBtn: string;
          annualSuffix: string;
          monthlySuffix: string;
          cta: string;
          processing: string;
          footer: string;
          restore: string;
          disclaimer: string;
        }> = {
          'ja': {
            title: 'Lumoraを解放しよう',
            subtitle: '本当の英語の旅は、ここから始まります。',
            feature1: '150以上のネイティブ音声ストーリー',
            feature2: '500以上の日常英会話フレーズ',
            feature3: 'すべての音楽と文化解説',
            annualBtn: 'Lumora 年間プラン',
            monthlyBtn: 'Lumora 月額プラン',
            annualSuffix: ' / 年',
            monthlySuffix: ' / 月',
            cta: 'プレミアムをアンロック',
            processing: '処理中...',
            footer: 'いつでもキャンセル可能。追加料金なし。',
            restore: '購入を復元する',
            disclaimer: '購入の確認時にお使いのApple IDアカウントに請求されます。現在の期間が終了する24時間前までにキャンセルされない限り、サブスクリプションは自動的に更新されます。App Storeのアカウント設定からいつでも管理および解約できます。'
          },
          'zh-TW': {
            title: '解鎖 Lumora',
            subtitle: '真正的英語之旅從這裡開始。',
            feature1: '150多個母語語音故事',
            feature2: '500多個日常英語會話短語',
            feature3: '所有的音樂和文化解說',
            annualBtn: 'Lumora 年度方案',
            monthlyBtn: 'Lumora 月度方案',
            annualSuffix: ' / 年',
            monthlySuffix: ' / 月',
            cta: '解鎖高級版',
            processing: '處理中...',
            footer: '隨時取消。無隱藏費用。',
            restore: '恢復購買',
            disclaimer: '確認購買時將向您的 Apple ID 帳戶收取費用。除非在當前訂閱期結束前至少 24 小時取消，否則訂閱將自動續訂。您可以隨時在 App Store 帳戶設定中管理或取消訂閱。'
          },
          'zh-CN': {
            title: '解锁 Lumora',
            subtitle: '真正的英语之旅从这里开始。',
            feature1: '150多个母语语音故事',
            feature2: '500多个日常英语会话短语',
            feature3: '所有的音乐和文化解说',
            annualBtn: 'Lumora 年度方案',
            monthlyBtn: 'Lumora 月度方案',
            annualSuffix: ' / 年',
            monthlySuffix: ' / 月',
            cta: '解锁高级版',
            processing: '处理中...',
            footer: '随时取消。无隐藏费用。',
            restore: '恢复购买',
            disclaimer: '确认购买时将向您的 Apple ID 账户收取费用。除非在当前订阅期结束前至少 24 小时取消，否则订阅将自动续订。您可以随时在 App Store 账户设置中管理或取消订阅。'
          },
          'ko': {
            title: 'Lumora 잠금 해제',
            subtitle: '진정한 영어 여행이 여기서 시작됩니다.',
            feature1: '150개 이상의 원어민 음성 스토리',
            feature2: '500개 이상의 일상 영어 회화',
            feature3: '모든 음악과 문화 설명',
            annualBtn: 'Lumora 연간 플랜',
            monthlyBtn: 'Lumora 월간 플랜',
            annualSuffix: ' / 년',
            monthlySuffix: ' / 월',
            cta: '프리미엄 잠금 해제',
            processing: '처리 중...',
            footer: '언제든 취소 가능. 추가 비용 없음.',
            restore: '구매 복원',
            disclaimer: '구매 확인 시 Apple ID 계정으로 결제됩니다. 현재 구독 기간이 끝나기 최소 24시간 전에 취소하지 않으면 구독이 자동으로 갱신됩니다. App Store 계정 설정에서 언제든지 구독을 관리하거나 취소할 수 있습니다.'
          },
          'th': {
            title: 'ปลดล็อก Lumora',
            subtitle: 'การเดินทางภาษาอังกฤษที่แท้จริงเริ่มขึ้นที่นี่',
            feature1: 'เรื่องราวเสียงเจ้าของภาษามากกว่า 150 เรื่อง',
            feature2: 'วลีภาษาอังกฤษในชีวิตประจำวันกว่า 500 วลี',
            feature3: 'เพลงและคำอธิบายวัฒนธรรมทั้งหมด',
            annualBtn: 'Lumora รายปี',
            monthlyBtn: 'Lumora รายเดือน',
            annualSuffix: ' / ปี',
            monthlySuffix: ' / เดือน',
            cta: 'ปลดล็อกพรีเมียม',
            processing: 'กำลังประมวลผล...',
            footer: 'ยกเลิกได้ตลอดเวลา ไม่มีค่าใช้จ่ายแอบแฝง',
            restore: 'กู้คืนการซื้อ',
            disclaimer: 'การชำระเงินจะถูกเรียกเก็บจากบัญชี Apple ID ของคุณเมื่อยืนยันการสั่งซื้อ การสมัครสมาชิกจะต่ออายุโดยอัตโนมัติเว้นแต่จะยกเลิกอย่างน้อย 24 ชั่วโมงก่อนสิ้นสุดระยะเวลาปัจจุบัน คุณสามารถจัดการหรือยกเลิกการสมัครสมาชิกได้ตลอดเวลาในการตั้งค่าบัญชี App Store'
          },
          'vi': {
            title: 'Mở khóa Lumora',
            subtitle: 'Hành trình tiếng Anh thực sự bắt đầu từ đây.',
            feature1: 'Hơn 150 câu chuyện âm thanh bản ngữ',
            feature2: 'Hơn 500 cụm từ tiếng Anh giao tiếp hàng ngày',
            feature3: 'Tất cả âm nhạc và giải thích văn hóa',
            annualBtn: 'Lumora Gói Năm',
            monthlyBtn: 'Lumora Gói Tháng',
            annualSuffix: ' / năm',
            monthlySuffix: ' / tháng',
            cta: 'Mở khóa Premium',
            processing: 'Đang xử lý...',
            footer: 'Hủy bất cứ lúc nào. Không có phí ẩn.',
            restore: 'Khôi phục mua hàng',
            disclaimer: 'Thanh toán sẽ được tính vào tài khoản Apple ID của bạn khi xác nhận mua hàng. Đăng ký tự động gia hạn trừ khi bị hủy ít nhất 24 giờ trước khi kết thúc giai đoạn hiện tại. Bạn có thể quản lý hoặc hủy đăng ký bất kỳ lúc nào trong Cài đặt tài khoản App Store.'
          },
          'en': {
            title: 'Unlock Lumora',
            subtitle: 'The authentic English journey starts here.',
            feature1: '150+ Native Audio Stories',
            feature2: '500+ Daily English Phrases',
            feature3: 'All Ambient Music & Cultural Insights',
            annualBtn: 'Lumora Annual',
            monthlyBtn: 'Lumora Monthly',
            annualSuffix: ' / year',
            monthlySuffix: ' / month',
            cta: 'Unlock Premium',
            processing: 'Processing...',
            footer: 'Cancel anytime. No hidden fees.',
            restore: 'Restore Purchases',
            disclaimer: 'Payment will be charged to your Apple ID account at confirmation of purchase. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. You can manage or cancel your subscription in your App Store Account Settings.'
          }
        };
        const t = pw[localeKey] || pw['en'] || pw['ja'];
        
        return (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-6 pb-0 sm:pb-6">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setShowPaywall(false)}
            />
            <div className="relative w-full max-w-[440px] bg-gradient-to-b from-[#fdfaf5] to-[#f4eee6] rounded-t-[32px] sm:rounded-[32px] shadow-[0_20px_60px_-10px_rgba(40,36,32,0.25)] overflow-hidden animate-slide-up-fade border border-white/60 pt-8 pb-8 px-6 sm:px-8 text-center mt-auto sm:mt-0">
              <button
                onClick={() => setShowPaywall(false)}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-stone-200/50 text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-[#fdfaf5] border border-[#e2d5bd] flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Sparkles className="w-7 h-7 text-amber-700" />
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold tracking-tight mb-3">
                {t.title}
              </h2>
              <p className="font-sans text-[14.5px] sm:text-[15.5px] text-stone-600 mb-8 leading-relaxed max-w-[90%] mx-auto">
                {t.subtitle}
              </p>

              <div className="flex flex-col gap-3.5 mb-8 text-left bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#e1efe7] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#376d54]" />
                  </div>
                  <span className="font-sans text-[14.5px] text-stone-800 font-medium">{t.feature1}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#e1efe7] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#376d54]" />
                  </div>
                  <span className="font-sans text-[14.5px] text-stone-800 font-medium">{t.feature2}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#e1efe7] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#376d54]" />
                  </div>
                  <span className="font-sans text-[14.5px] text-stone-800 font-medium">{t.feature3}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 relative z-10 w-full sm:w-[90%] mx-auto pb-2">
                {packages.length > 0 ? packages.map((pkg, idx) => {
                  const isAnnual = pkg.identifier === '$rc_annual' || pkg.packageType === 'ANNUAL';
                  const title = isAnnual ? t.annualBtn : t.monthlyBtn;
                  const suffix = isAnnual ? t.annualSuffix : t.monthlySuffix;
                  return (
                    <button
                      key={pkg.identifier}
                      disabled={isUnlocking}
                      onClick={async () => {
                        setIsUnlocking(true);
                        const success = await PurchasesService.purchasePackage(pkg);
                        if (success) {
                          setIsPremium(true);
                          setShowPaywall(false);
                        }
                        setIsUnlocking(false);
                      }}
                      className={isAnnual 
                        ? "w-full h-[58px] rounded-full bg-stone-900 text-white font-sans font-bold text-[15px] sm:text-[16px] tracking-wide hover:scale-[1.02] active:scale-[0.98] hover:bg-stone-800 transition-all shadow-[0_8px_20px_-4px_rgba(40,36,32,0.3)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                        : "w-full h-[54px] rounded-full bg-white text-stone-800 border-[1.5px] border-stone-200 font-sans font-bold text-[14px] sm:text-[15px] tracking-wide hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      }
                    >
                      {isUnlocking ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t.processing}
                        </span>
                      ) : (
                        <span>
                          {title} — {pkg.product.priceString}{suffix}
                        </span>
                      )}
                    </button>
                  );
                }) : (
                  <button
                    disabled={isUnlocking}
                    onClick={async () => {
                      setIsUnlocking(true);
                      const success = await PurchasesService.purchasePackage(null); // Fallback
                      if (success) {
                        setIsPremium(true);
                        setShowPaywall(false);
                      }
                      setIsUnlocking(false);
                    }}
                    className="w-full h-[58px] rounded-full bg-stone-900 text-white font-sans font-bold text-[16px] tracking-wide hover:scale-[1.02] active:scale-[0.98] hover:bg-stone-800 transition-all shadow-[0_8px_20px_-4px_rgba(40,36,32,0.3)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {isUnlocking ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {t.processing}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {t.cta}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </span>
                    )}
                  </button>
                )}
                
                <button 
                  disabled={isUnlocking}
                  onClick={async () => {
                    setIsUnlocking(true);
                    const restored = await PurchasesService.restorePurchases();
                    if (restored) {
                      setIsPremium(true);
                      setShowPaywall(false);
                    }
                    setIsUnlocking(false);
                  }}
                  className="font-sans text-[13px] text-stone-400 mt-1 underline cursor-pointer hover:text-stone-600 transition-colors"
                >
                  {t.restore}
                </button>

                <p className="font-sans text-[11px] text-stone-400 leading-relaxed mt-2 px-1 text-center">
                  {t.disclaimer}
                </p>

                <div className="flex items-center justify-center gap-3 mt-1.5 text-[12px] text-stone-400">
                  <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-600 underline">Terms of Use</a>
                  <span>•</span>
                  <a href="https://velumestudios.com/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-stone-600 underline">Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Floating Relax & Listen to All Controller Bar (Bottom) */}
      {isListenToAllActive && (() => {
        const storiesToPlay = selectedLevel !== null
          ? STORIES_DATA.filter(s => s.id >= (selectedLevel - 1) * 10 + 1 && s.id <= selectedLevel * 10)
          : STORIES_DATA;
        const currentStory = storiesToPlay[listenToAllIndex] || storiesToPlay[0];

        return (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-stone-900/95 text-stone-100 backdrop-blur-xl p-3.5 px-5 rounded-full shadow-2xl border border-stone-700/60 flex items-center justify-between gap-4 animate-slide-up-fade font-sans">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4 animate-pulse" />
              </div>
              <div className="truncate text-left">
                <p className="text-[13px] font-semibold truncate text-white leading-tight font-serif">
                  {currentStory?.title || "Story"}
                </p>
                <p className="text-[10.5px] text-stone-400 tracking-wider">
                  Story {listenToAllIndex + 1} of {storiesToPlay.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (listenToAllIndex > 0) {
                    playListenToAllItem(storiesToPlay, listenToAllIndex - 1, isLoopingAll);
                  }
                }}
                disabled={listenToAllIndex === 0}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Previous Story"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (isListenToAllPaused) {
                    setIsListenToAllPaused(false);
                    playListenToAllItem(storiesToPlay, listenToAllIndex, isLoopingAll);
                  } else {
                    setIsListenToAllPaused(true);
                    stopActiveSpeechAudio();
                    if (listenTimerRef.current) {
                      clearTimeout(listenTimerRef.current);
                      listenTimerRef.current = null;
                    }
                  }
                }}
                className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                title={isListenToAllPaused ? "Resume" : "Pause"}
              >
                {isListenToAllPaused ? <Play className="w-4 h-4 fill-current ml-0.5" /> : <Pause className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={() => {
                  if (listenToAllIndex < storiesToPlay.length - 1) {
                    playListenToAllItem(storiesToPlay, listenToAllIndex + 1, isLoopingAll);
                  } else if (isLoopingAll) {
                    playListenToAllItem(storiesToPlay, 0, isLoopingAll);
                  }
                }}
                disabled={!isLoopingAll && listenToAllIndex >= storiesToPlay.length - 1}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Next Story"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={stopListenToAll}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors ml-1 cursor-pointer"
                title="Stop Listening"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
