import cafeRecreationPrompt from "./prompts/cafe-recreation-prompt.txt?raw";
import digitalPotteryRecreationPrompt from "./prompts/digital-pottery-recreation-prompt.txt?raw";
import foldlabRecreationPrompt from "./prompts/foldlab-recreation-prompt.txt?raw";
import infiniteCinemaRecreationPrompt from "./prompts/infinite-cinema-recreation-prompt.txt?raw";
import insideTheHeatRecreationPrompt from "./prompts/inside-the-heat-recreation-prompt.txt?raw";
import inventoryManagementRecreationPrompt from "./prompts/inventory-management-recreation-prompt.txt?raw";
import nookRecreationPrompt from "./prompts/nook-recreation-prompt.txt?raw";
import onboardingOrbitRecreationPrompt from "./prompts/onboarding-orbit-recreation-prompt.txt?raw";
import pocketPortfolioRecreationPrompt from "./prompts/pocket-portfolio-recreation-prompt.txt?raw";
import postureGuardianRecreationPrompt from "./prompts/posture-guardian-recreation-prompt.txt?raw";
import spatialDesignerRecreationPrompt from "./prompts/spatial-designer-recreation-prompt.txt?raw";
import spatialDiningRecreationPrompt from "./prompts/spatial-dining-recreation-prompt.txt?raw";
import warmIsleRecreationPrompt from "./prompts/warm-isle-recreation-prompt.txt?raw";
import wrensRoomBuildPrompt from "./prompts/wrens-room-build-prompt.txt?raw";

import { fallbackLng, normalizeLanguage } from "@/i18n/config";

/**
 * Display string in every supported language. Case copy lives here rather than in
 * public/locales because a case is data, not UI chrome: adding a campaign entry
 * should never require touching locale files.
 */
export type Localized = {
  en: string;
  "zh-CN": string;
  [locale: string]: string;
};

export type CaseCategoryId = "interactive3d" | "business" | "creative";
export type PromptKind = "original" | "recreation";

export type CaseEntry = {
  /** Enter project id. Also the React key. */
  id: string;
  /** Public display title, written from what the published preview actually renders. */
  title: Localized;
  /** Short, truthful description. No speed, quality, partnership or efficacy claims. */
  description: Localized;
  category: CaseCategoryId;
  /**
   * Published preview URL, exactly as supplied by the source. Never rewrite,
   * normalize or strip the trailing slash of these values.
   */
  previewUrl: string;
  /**
   * Official remix/template URL. `null` means no official template link exists yet;
   * the UI then renders a disabled "coming soon" control. Dropping a real URL in
   * here is all that is needed to enable the Remix button for that case.
   */
  remixUrl: string | null;
  /** Verbatim prompt text, or `null` when no prompt is available. */
  prompt: string | null;
  /** Whether the prompt is the creator's original or a catalog-based recreation. */
  promptKind: PromptKind | null;
  /**
   * Internal provenance note for maintainers: the original source-table title.
   * Never rendered and never part of the search index.
   */
  sourceTitle: string;
  /** Optional runtime gallery media for catalog entries loaded from the backend. */
  gallery?: {
    imageUrl: string;
    caption: Localized;
    format: "landscape" | "square";
  };
};

export const CASE_CATEGORY_IDS: CaseCategoryId[] = [
  "interactive3d",
  "business",
  "creative",
];

/**
 * Showcase's real project catalog. Collection membership is defined separately
 * in showcase-collections; adding a project here does not change old collections.
 */
const baseCases: CaseEntry[] = [
  {
    id: "d6b40daaf4ea4ba88b2a5aa5d3f4c6d8",
    title: {
      en: "Wren's Room · Interactive 3D Studio",
      "zh-CN": "Wren's Room · 可探索 3D 工作室",
    },
    description: {
      en: "A creative studio you can explore in the browser. Objects in the room respond to clicks and open small built-in tools.",
      "zh-CN": "一间可以在浏览器里自由探索的创意工作室，点击房间中的物件会打开对应的小功能。",
    },
    category: "interactive3d",
    previewUrl: "https://d6b40daaf4ea4ba88b2a5aa5d3f4c6d8.prod.enterapp.pro",
    remixUrl: null,
    prompt: wrensRoomBuildPrompt,
    promptKind: "original",
    sourceTitle: "可交互 3D 房间作品集（每个物件都能点）",
  },
  {
    id: "8913089c9e184d1aad4b0310a5b7fb96",
    title: {
      en: "Warm Isle · Interactive 3D Room",
      "zh-CN": "Warm Isle · 慢生活 3D 小屋",
    },
    description: {
      en: "A small, warm home scene rendered in 3D on the web, themed around a slower everyday pace.",
      "zh-CN": "一个温暖的小家场景，以网页 3D 呈现，主题是慢一点的日常生活。",
    },
    category: "interactive3d",
    previewUrl: "https://8913089c9e184d1aad4b0310a5b7fb96.prod.enterapp.pro/",
    remixUrl: null,
    prompt: warmIsleRecreationPrompt,
    promptKind: "recreation",
    sourceTitle:
      "Astra 一句话 Prompt 生成 three.js 3D 互动网页场景（nocoo 演示）",
  },
  {
    id: "ac436982c25144eb83faf94a06cb904a",
    title: {
      en: "Nook · Modular Sofa",
      "zh-CN": "Nook 模块沙发互动展示",
    },
    description: {
      en: "An interactive product page for a modular sofa: ten pieces move through five different arrangements in 3D.",
      "zh-CN": "模块化沙发的互动产品页：十个组件可以在 3D 中切换成五种不同的组合方式。",
    },
    category: "interactive3d",
    previewUrl: "https://ac436982c25144eb83faf94a06cb904a.prod.enterapp.pro/",
    remixUrl: null,
    prompt: nookRecreationPrompt,
    promptKind: "recreation",
    sourceTitle: "Astra 电商商品互动展示：台灯双形态切换上线 Shopify",
  },
  {
    id: "a2a3b1836aac46d1bb5d3d09715848db",
    title: {
      en: "Dieline to Foldable Carton",
      "zh-CN": "刀版图转可折叠纸盒 3D",
    },
    description: {
      en: "Turns a flat packaging dieline into an editable 3D carton model with a folding animation.",
      "zh-CN": "把平面包装刀版图转换成可编辑的 3D 折叠纸盒模型，并带有折叠动画。",
    },
    category: "interactive3d",
    previewUrl: "https://a2a3b1836aac46d1bb5d3d09715848db.prod.enterapp.pro",
    remixUrl: null,
    prompt: foldlabRecreationPrompt,
    promptKind: "recreation",
    sourceTitle:
      "GPT-6 Astra: 包装刀版图(dieline)→Blender 可编辑折叠纸盒 3D 模型+折叠动画",
  },
  {
    id: "674a7f6546ea4ff5a2c6fd7394aa5a2b",
    title: {
      en: "Inside the Heat · 3D Phone Lab",
      "zh-CN": "手机散热 3D 互动实验室",
    },
    description: {
      en: "An interactive 3D teardown for exploring smartphone components and illustrative heat conditions, with small challenges along the way.",
      "zh-CN": "可交互的 3D 手机拆解：探索内部元件与示意性的发热情况，并附有小挑战关卡。",
    },
    category: "interactive3d",
    previewUrl: "https://674a7f6546ea4ff5a2c6fd7394aa5a2b.prod.enterapp.pro",
    remixUrl: null,
    prompt: insideTheHeatRecreationPrompt,
    promptKind: "recreation",
    sourceTitle:
      "GPT-6 Astra: 单次对话生成个人踝痛交互式 3D 解剖图谱(骨骼/韧带/肌腱+运动轴+实时读数)",
  },
  {
    id: "b84a5c72086842a7ab8c77b6fa935f01",
    title: {
      en: "Spatial Dining",
      "zh-CN": "餐厅沉浸式互动体验",
    },
    description: {
      en: "An immersive restaurant experience page built around spatial, scroll-driven interaction.",
      "zh-CN": "以空间感和滚动交互为核心的餐厅沉浸式体验页面。",
    },
    category: "interactive3d",
    previewUrl: "https://b84a5c72086842a7ab8c77b6fa935f01.prod.enterapp.pro/",
    remixUrl: null,
    prompt: spatialDiningRecreationPrompt,
    promptKind: "recreation",
    sourceTitle: "Spatial Dining 餐厅沉浸式互动体验页",
  },
  {
    id: "741bada9961f4d2186c85316f16a05c8",
    title: {
      en: "Inventory Management 3D Dashboard",
      "zh-CN": "3D 库存管理仪表盘",
    },
    description: {
      en: "A warehouse inventory dashboard that pairs stock data panels with a 3D view of the storage layout.",
      "zh-CN": "仓储库存管理仪表盘，将库存数据面板与仓库布局的 3D 视图结合在一起。",
    },
    category: "business",
    previewUrl: "https://741bada9961f4d2186c85316f16a05c8.prod.enterapp.pro",
    remixUrl: null,
    prompt: inventoryManagementRecreationPrompt,
    promptKind: "recreation",
    sourceTitle: "Inventory Management 3D Dashboard",
  },
  {
    id: "3b395dba2e1f49138c9b8d5ac5b6710e",
    title: {
      en: "Café Mobile Ordering",
      "zh-CN": "咖啡馆移动点单系统",
    },
    description: {
      en: "A mobile ordering flow for a café: browse the menu, customise a drink and review the order.",
      "zh-CN": "咖啡馆的移动点单流程：浏览菜单、自定义饮品选项并确认订单。",
    },
    category: "business",
    previewUrl: "https://3b395dba2e1f49138c9b8d5ac5b6710e.prod.enterapp.pro",
    remixUrl: null,
    prompt: cafeRecreationPrompt,
    promptKind: "recreation",
    sourceTitle: "Astra 一条提示词5分钟直出咖啡馆移动点单系统",
  },
  {
    id: "92ef2d78e1b6478ab1f5bda3ca160641",
    title: {
      en: "Onboarding Orbit · Employee SOP",
      "zh-CN": "Onboarding Orbit · 新员工入职 SOP",
    },
    description: {
      en: "An interactive standard operating procedure that walks a new hire through onboarding steps.",
      "zh-CN": "互动式入职标准流程，带新同事一步步走完入职所需的各个环节。",
    },
    category: "business",
    previewUrl: "https://92ef2d78e1b6478ab1f5bda3ca160641.prod.enterapp.pro",
    remixUrl: null,
    prompt: onboardingOrbitRecreationPrompt,
    promptKind: "recreation",
    sourceTitle: "ONBOARDING ORBIT Interactive Employee SOP 新员工入职sop",
  },
  {
    id: "d5025a8116e04650b4f1aa05ceda76e4",
    title: {
      en: "Spatial Designer · Interior Concepts",
      "zh-CN": "Spatial Designer · 室内设计概念工具",
    },
    description: {
      en: "Upload a room photo, pick a style such as Nordic, Japandi, mid-century or bohemian, and view a generated concept image with the furniture in it.",
      "zh-CN": "上传房间照片并选择北欧、Japandi、中古、波西米亚等风格，查看生成的概念效果图以及画面中的家具。",
    },
    category: "creative",
    previewUrl: "https://d5025a8116e04650b4f1aa05ceda76e4.prod.enterapp.pro",
    remixUrl: null,
    prompt: spatialDesignerRecreationPrompt,
    promptKind: "recreation",
    sourceTitle:
      "Spatial Designer（Astra）AI 室内设计工具，上传房间照片并选择风格（北欧、Japandi、中古、波西米亚等），AI 即可生成改造后的概念图，还能查看图中家具「买下这个造型」。",
  },
  {
    id: "ef0378ba7d45412ca7550377eec9f180",
    title: {
      en: "Infinite Cinema",
      "zh-CN": "无限影院",
    },
    description: {
      en: "A quiet viewing room of first-person nature clips — forest paths, Atlantic coastline, autumn leaves and snow — for unwinding.",
      "zh-CN": "一个安静的观影空间，收录森林小径、大西洋海岸、秋日落叶与雪地等第一人称自然风光短片，用于放空。",
    },
    category: "creative",
    previewUrl: "https://ef0378ba7d45412ca7550377eec9f180.prod.enterapp.pro",
    remixUrl: null,
    prompt: infiniteCinemaRecreationPrompt,
    promptKind: "recreation",
    sourceTitle:
      "Infinite Cinema 「无限影院」，提供一系列第一人称实拍的自然风光短视频（森林小径、大西洋海岸、秋日落叶、雪地等），用于放空与沉浸式放松。",
  },
  {
    id: "fea402c71dab4f66b91fadb41946b70f",
    title: {
      en: "Digital Pottery",
      "zh-CN": "数字陶艺",
    },
    description: {
      en: "Shape a vase, bowl or cup online by adjusting height, body width and opening ratio — a small, calm making tool.",
      "zh-CN": "在线调节高度、瓶身宽度与开口比例，捏出花瓶、碗或杯子，是一个安静的小小创作工具。",
    },
    category: "creative",
    previewUrl: "https://fea402c71dab4f66b91fadb41946b70f.prod.enterapp.pro",
    remixUrl: null,
    prompt: digitalPotteryRecreationPrompt,
    promptKind: "recreation",
    sourceTitle:
      "Digital Pottery在线数字陶艺小工具，通过调节高度、瓶身宽度、开口比例来捏制花瓶 / 碗 / 杯，主打「小小宁静」的减压体验。",
  },
  {
    id: "cc26e5a341804bfbb139d28f5e49c237",
    title: {
      en: "Posture Guardian",
      "zh-CN": "姿势守护者",
    },
    description: {
      en: "A sitting-habit reminder that reads head, shoulder and hip position on-device through the camera, softly blurs the screen when you slouch, and includes a 25-minute focus timer. The camera only starts inside the preview, after you allow it.",
      "zh-CN": "久坐习惯提醒工具：在本机通过摄像头读取头、肩、髋位置，驼背时让画面轻微模糊，并配有 25 分钟专注计时器。摄像头只会在你进入预览并授权后才启动。",
    },
    category: "creative",
    previewUrl: "https://cc26e5a341804bfbb139d28f5e49c237.prod.enterapp.pro",
    remixUrl: null,
    prompt: postureGuardianRecreationPrompt,
    promptKind: "recreation",
    sourceTitle:
      "Posture Guardian「姿势守护者」健康应用，通过摄像头在本机实时监测坐姿（头、肩、髋），驼背时屏幕会轻微模糊提醒，并配有 25 分钟专注计时器，帮你改善久坐习惯。",
  },
  {
    id: "9a3b574243ac45b39c004db93ea520b3",
    title: {
      en: "Pocket Portfolio · Retro Handheld",
      "zh-CN": "掌机风格作品集",
    },
    description: {
      en: "A personal portfolio presented as a retro handheld console, navigated with on-screen controls.",
      "zh-CN": "以复古掌上游戏机形式呈现的个人作品集，通过屏幕上的按键进行浏览。",
    },
    category: "creative",
    previewUrl: "https://9a3b574243ac45b39c004db93ea520b3.prod.enterapp.pro/",
    remixUrl: null,
    prompt: pocketPortfolioRecreationPrompt,
    promptKind: "recreation",
    sourceTitle: "Pocket Portfolio 复古掌机个人作品集",
  },
];

type CaseLocaleCopy = { title: string; description: string };
type CaseLocaleMap = Record<string, CaseLocaleCopy>;

/** Additional public display copy. The source titles remain internal-only. */
const caseLocalizations: Record<string, CaseLocaleMap> = {
  d6b40daaf4ea4ba88b2a5aa5d3f4c6d8: {
    es: { title: "Wren's Room · Estudio 3D interactivo", description: "Un estudio creativo que puedes explorar en el navegador. Los objetos responden a los clics y abren pequeñas herramientas." },
    "pt-BR": { title: "Wren's Room · Estúdio 3D interativo", description: "Um estúdio criativo para explorar no navegador. Os objetos respondem aos cliques e abrem pequenas ferramentas." },
    "pt-PT": { title: "Wren's Room · Estúdio 3D interativo", description: "Um estúdio criativo para explorar no navegador. Os objetos respondem aos cliques e abrem pequenas ferramentas." },
    fr: { title: "Wren's Room · Studio 3D interactif", description: "Un studio créatif à explorer dans le navigateur. Les objets réagissent aux clics et ouvrent de petits outils." },
    de: { title: "Wren's Room · Interaktives 3D-Studio", description: "Ein kreatives Studio zum Erkunden im Browser. Objekte reagieren auf Klicks und öffnen kleine Werkzeuge." },
    it: { title: "Wren's Room · Studio 3D interattivo", description: "Uno studio creativo da esplorare nel browser. Gli oggetti reagiscono ai clic e aprono piccoli strumenti." },
    ja: { title: "Wren's Room · 探索できる3Dスタジオ", description: "ブラウザで探索できるクリエイティブスタジオ。部屋のオブジェクトをクリックすると小さな機能が開きます。" },
    ko: { title: "Wren's Room · 인터랙티브 3D 스튜디오", description: "브라우저에서 탐색할 수 있는 창작 스튜디오입니다. 방 안의 물건을 클릭하면 작은 도구가 열립니다." },
    "zh-TW": { title: "Wren's Room · 可探索 3D 工作室", description: "一間可以在瀏覽器裡自由探索的創意工作室，點擊房間中的物件會開啟對應的小功能。" }
  },
  "8913089c9e184d1aad4b0310a5b7fb96": {
    es: { title: "Warm Isle · Habitación 3D interactiva", description: "Una pequeña casa cálida en 3D para la web, inspirada en un ritmo de vida más pausado." },
    "pt-BR": { title: "Warm Isle · Casa 3D interativa", description: "Uma pequena casa acolhedora em 3D para a web, inspirada em um ritmo de vida mais tranquilo." },
    "pt-PT": { title: "Warm Isle · Casa 3D interativa", description: "Uma pequena casa acolhedora em 3D para a web, inspirada num ritmo de vida mais tranquilo." },
    fr: { title: "Warm Isle · Maison 3D interactive", description: "Une petite maison chaleureuse en 3D sur le web, inspirée par un quotidien plus lent." },
    de: { title: "Warm Isle · Interaktives 3D-Zimmer", description: "Eine kleine, warme 3D-Wohnszene im Web, gestaltet für einen langsameren Alltag." },
    it: { title: "Warm Isle · Casa 3D interattiva", description: "Una piccola casa accogliente in 3D sul web, ispirata a un ritmo quotidiano più lento." },
    ja: { title: "Warm Isle · インタラクティブ3Dルーム", description: "ゆったりした日常をテーマにした、ウェブ上の温かな小さな3Dの家です。" },
    ko: { title: "Warm Isle · 인터랙티브 3D 룸", description: "느린 일상을 주제로 웹에 구현한 따뜻하고 작은 3D 집입니다." },
    "zh-TW": { title: "Warm Isle · 慢生活 3D 小屋", description: "一個溫暖的小家場景，以網頁 3D 呈現，主題是慢一點的日常生活。" }
  },
  ac436982c25144eb83faf94a06cb904a: {
    es: { title: "Nook · Sofá modular", description: "Una página de producto 3D donde diez piezas forman cinco configuraciones distintas de sofá." },
    "pt-BR": { title: "Nook · Sofá modular", description: "Uma página de produto 3D em que dez peças formam cinco configurações diferentes de sofá." },
    "pt-PT": { title: "Nook · Sofá modular", description: "Uma página de produto 3D onde dez peças formam cinco configurações diferentes de sofá." },
    fr: { title: "Nook · Canapé modulaire", description: "Une page produit 3D où dix éléments composent cinq configurations de canapé." },
    de: { title: "Nook · Modulares Sofa", description: "Eine interaktive 3D-Produktseite, auf der zehn Teile fünf Sofakonfigurationen bilden." },
    it: { title: "Nook · Divano modulare", description: "Una pagina prodotto 3D in cui dieci elementi formano cinque configurazioni del divano." },
    ja: { title: "Nook · モジュラーソファ", description: "10個のパーツを5つのレイアウトに組み替えられるインタラクティブな3D商品ページです。" },
    ko: { title: "Nook · 모듈형 소파", description: "10개의 조각을 5가지 배치로 바꿔 볼 수 있는 인터랙티브 3D 제품 페이지입니다." },
    "zh-TW": { title: "Nook 模組沙發互動展示", description: "模組化沙發的互動產品頁：十個組件可以在 3D 中切換成五種不同的組合方式。" }
  },
  a2a3b1836aac46d1bb5d3d09715848db: {
    es: { title: "Del troquel a una caja plegable", description: "Convierte un troquel plano en un modelo 3D editable de caja con animación de plegado." },
    "pt-BR": { title: "Da faca à caixa dobrável", description: "Transforma uma faca de embalagem plana em um modelo 3D editável com animação de dobra." },
    "pt-PT": { title: "Da faca à caixa dobrável", description: "Transforma uma faca de embalagem plana num modelo 3D editável com animação de dobragem." },
    fr: { title: "Du tracé à la boîte pliable", description: "Transforme un tracé d’emballage à plat en boîte 3D modifiable avec animation de pliage." },
    de: { title: "Stanzkontur zur Faltschachtel", description: "Verwandelt eine flache Stanzkontur in ein editierbares 3D-Kartonmodell mit Faltanimation." },
    it: { title: "Dal tracciato alla scatola pieghevole", description: "Trasforma un tracciato piano in un modello 3D modificabile con animazione di piegatura." },
    ja: { title: "ダイラインから折りたたみ箱へ", description: "平面のパッケージ展開図を、折りたたみアニメーション付きの編集可能な3D箱に変換します。" },
    ko: { title: "칼선에서 접이식 상자로", description: "평면 패키지 칼선을 접기 애니메이션이 있는 편집 가능한 3D 상자로 변환합니다." },
    "zh-TW": { title: "刀版圖轉可折疊紙盒 3D", description: "把平面包裝刀版圖轉換成可編輯的 3D 折疊紙盒模型，並帶有折疊動畫。" }
  },
  "674a7f6546ea4ff5a2c6fd7394aa5a2b": {
    es: { title: "Inside the Heat · Laboratorio 3D del teléfono", description: "Explora componentes de un smartphone y condiciones térmicas ilustrativas mediante un desmontaje 3D interactivo." },
    "pt-BR": { title: "Inside the Heat · Laboratório 3D do celular", description: "Explore componentes de um smartphone e condições térmicas ilustrativas em uma desmontagem 3D interativa." },
    "pt-PT": { title: "Inside the Heat · Laboratório 3D do telemóvel", description: "Explore componentes de um smartphone e condições térmicas ilustrativas numa desmontagem 3D interativa." },
    fr: { title: "Inside the Heat · Laboratoire 3D du téléphone", description: "Explorez les composants d’un smartphone et des conditions thermiques illustratives dans un démontage 3D interactif." },
    de: { title: "Inside the Heat · 3D-Smartphone-Labor", description: "Erkunde Smartphone-Komponenten und illustrative Wärmezustände in einer interaktiven 3D-Zerlegung." },
    it: { title: "Inside the Heat · Laboratorio 3D dello smartphone", description: "Esplora i componenti di uno smartphone e condizioni termiche illustrative in uno smontaggio 3D interattivo." },
    ja: { title: "Inside the Heat · 3Dスマートフォンラボ", description: "インタラクティブな3D分解でスマートフォンの部品と熱の状態を視覚的に探索します。" },
    ko: { title: "Inside the Heat · 3D 스마트폰 실험실", description: "인터랙티브 3D 분해를 통해 스마트폰 부품과 예시 열 상태를 탐색합니다." },
    "zh-TW": { title: "手機散熱 3D 互動實驗室", description: "可互動的 3D 手機拆解：探索內部元件與示意性的發熱情況，並附有小挑戰關卡。" }
  },
  b84a5c72086842a7ab8c77b6fa935f01: {
    es: { title: "Spatial Dining", description: "Una experiencia inmersiva de restaurante basada en interacción espacial y desplazamiento." },
    "pt-BR": { title: "Spatial Dining", description: "Uma experiência imersiva de restaurante baseada em interação espacial e rolagem." },
    "pt-PT": { title: "Spatial Dining", description: "Uma experiência imersiva de restaurante baseada em interação espacial e deslocamento." },
    fr: { title: "Spatial Dining", description: "Une expérience immersive de restaurant fondée sur l’espace et le défilement." },
    de: { title: "Spatial Dining", description: "Eine immersive Restaurantseite mit räumlicher und scrollgesteuerter Interaktion." },
    it: { title: "Spatial Dining", description: "Un’esperienza immersiva per un ristorante basata su spazio e scorrimento." },
    ja: { title: "Spatial Dining", description: "空間表現とスクロール操作を中心にした、没入型レストラン体験ページです。" },
    ko: { title: "Spatial Dining", description: "공간감과 스크롤 상호작용을 중심으로 한 몰입형 레스토랑 경험 페이지입니다." },
    "zh-TW": { title: "餐廳沉浸式互動體驗", description: "以空間感和捲動互動為核心的餐廳沉浸式體驗頁面。" }
  },
  "741bada9961f4d2186c85316f16a05c8": {
    es: { title: "Panel 3D de gestión de inventario", description: "Un panel de almacén que combina datos de existencias con una vista 3D de la distribución." },
    "pt-BR": { title: "Dashboard 3D de estoque", description: "Um painel de armazém que combina dados de estoque com uma visão 3D do espaço." },
    "pt-PT": { title: "Painel 3D de inventário", description: "Um painel de armazém que combina dados de inventário com uma vista 3D do espaço." },
    fr: { title: "Tableau de bord 3D des stocks", description: "Un tableau de bord d’entrepôt combinant les données de stock et une vue 3D de l’espace." },
    de: { title: "3D-Dashboard für Bestandsverwaltung", description: "Ein Lager-Dashboard, das Bestandsdaten mit einer 3D-Ansicht des Layouts verbindet." },
    it: { title: "Dashboard 3D per l’inventario", description: "Un pannello di magazzino che unisce i dati delle scorte a una vista 3D dello spazio." },
    ja: { title: "3D在庫管理ダッシュボード", description: "在庫データと倉庫レイアウトの3D表示を組み合わせたダッシュボードです。" },
    ko: { title: "3D 재고 관리 대시보드", description: "재고 데이터와 창고 배치의 3D 보기를 결합한 대시보드입니다." },
    "zh-TW": { title: "3D 庫存管理儀表板", description: "倉儲庫存管理儀表板，將庫存資料面板與倉庫配置的 3D 視圖結合在一起。" }
  },
  "3b395dba2e1f49138c9b8d5ac5b6710e": {
    es: { title: "Pedidos móviles para cafetería", description: "Un flujo móvil para explorar el menú, personalizar una bebida y revisar el pedido." },
    "pt-BR": { title: "Pedidos móveis para cafeteria", description: "Um fluxo móvel para explorar o cardápio, personalizar uma bebida e revisar o pedido." },
    "pt-PT": { title: "Pedidos móveis para café", description: "Um fluxo móvel para explorar o menu, personalizar uma bebida e rever o pedido." },
    fr: { title: "Commande mobile pour café", description: "Un parcours mobile pour consulter le menu, personnaliser une boisson et vérifier la commande." },
    de: { title: "Mobile Café-Bestellung", description: "Ein mobiler Ablauf zum Durchsuchen der Karte, Anpassen eines Getränks und Prüfen der Bestellung." },
    it: { title: "Ordini mobile per caffetteria", description: "Un flusso mobile per sfogliare il menu, personalizzare una bevanda e rivedere l’ordine." },
    ja: { title: "カフェのモバイル注文", description: "メニュー閲覧、ドリンクのカスタマイズ、注文確認までを行えるモバイル注文フローです。" },
    ko: { title: "카페 모바일 주문", description: "메뉴 탐색, 음료 맞춤 설정, 주문 확인을 위한 모바일 주문 흐름입니다." },
    "zh-TW": { title: "咖啡館行動點餐系統", description: "咖啡館的行動點餐流程：瀏覽選單、自訂飲品選項並確認訂單。" }
  },
  "92ef2d78e1b6478ab1f5bda3ca160641": {
    es: { title: "Onboarding Orbit · SOP de incorporación", description: "Un procedimiento interactivo que guía paso a paso a las nuevas incorporaciones." },
    "pt-BR": { title: "Onboarding Orbit · SOP de integração", description: "Um procedimento interativo que guia novos colaboradores por cada etapa da integração." },
    "pt-PT": { title: "Onboarding Orbit · SOP de integração", description: "Um procedimento interativo que orienta novos colaboradores em cada etapa da integração." },
    fr: { title: "Onboarding Orbit · Procédure d’intégration", description: "Une procédure interactive qui guide les nouveaux collaborateurs à chaque étape." },
    de: { title: "Onboarding Orbit · Mitarbeiter-SOP", description: "Ein interaktiver Standardablauf, der neue Mitarbeitende durch alle Onboarding-Schritte führt." },
    it: { title: "Onboarding Orbit · SOP di inserimento", description: "Una procedura interattiva che guida i nuovi dipendenti in ogni fase dell’inserimento." },
    ja: { title: "Onboarding Orbit · 新入社員SOP", description: "新入社員をオンボーディングの各ステップへ案内するインタラクティブな標準手順です。" },
    ko: { title: "Onboarding Orbit · 신규 입사자 SOP", description: "신규 입사자를 온보딩 각 단계로 안내하는 인터랙티브 표준 절차입니다." },
    "zh-TW": { title: "Onboarding Orbit · 新員工入職 SOP", description: "互動式入職標準流程，帶新同事一步步完成入職所需的各個環節。" }
  },
  d5025a8116e04650b4f1aa05ceda76e4: {
    es: { title: "Spatial Designer · Conceptos de interior", description: "Sube una foto, elige un estilo y descubre una propuesta visual del espacio con sus muebles." },
    "pt-BR": { title: "Spatial Designer · Conceitos de interiores", description: "Envie uma foto, escolha um estilo e veja uma proposta visual do ambiente com seus móveis." },
    "pt-PT": { title: "Spatial Designer · Conceitos de interiores", description: "Carregue uma foto, escolha um estilo e veja uma proposta visual do espaço com o mobiliário." },
    fr: { title: "Spatial Designer · Concepts d’intérieur", description: "Importez une photo, choisissez un style et découvrez une proposition visuelle avec son mobilier." },
    de: { title: "Spatial Designer · Raumkonzepte", description: "Lade ein Zimmerfoto hoch, wähle einen Stil und sieh ein Gestaltungskonzept mit Möbeln." },
    it: { title: "Spatial Designer · Concept di interni", description: "Carica una foto, scegli uno stile e guarda una proposta visiva dello spazio con gli arredi." },
    ja: { title: "Spatial Designer · インテリア提案", description: "部屋の写真とスタイルを選び、家具を含む空間のコンセプト画像を確認できます。" },
    ko: { title: "Spatial Designer · 인테리어 콘셉트", description: "방 사진과 스타일을 선택해 가구가 포함된 공간 콘셉트 이미지를 확인할 수 있습니다." },
    "zh-TW": { title: "Spatial Designer · 室內設計概念工具", description: "上傳房間照片並選擇風格，查看生成的概念效果圖以及畫面中的家具。" }
  },
  ef0378ba7d45412ca7550377eec9f180: {
    es: { title: "Infinite Cinema", description: "Una sala tranquila con vídeos de naturaleza en primera persona para desconectar." },
    "pt-BR": { title: "Infinite Cinema", description: "Uma sala tranquila com vídeos de natureza em primeira pessoa para relaxar." },
    "pt-PT": { title: "Infinite Cinema", description: "Uma sala tranquila com vídeos de natureza em primeira pessoa para descontrair." },
    fr: { title: "Infinite Cinema", description: "Une salle calme de vidéos nature en vue subjective pour faire une pause." },
    de: { title: "Infinite Cinema", description: "Ein ruhiger Vorführraum mit Naturvideos aus der Ich-Perspektive zum Abschalten." },
    it: { title: "Infinite Cinema", description: "Una sala tranquilla con video naturalistici in prima persona per rilassarsi." },
    ja: { title: "Infinite Cinema", description: "森や海岸、紅葉、雪景色を一人称視点で眺める、静かな映像空間です。" },
    ko: { title: "Infinite Cinema", description: "숲길, 해안, 낙엽과 설경을 1인칭 영상으로 감상하는 조용한 공간입니다." },
    "zh-TW": { title: "無限影院", description: "收錄森林小徑、海岸、秋日落葉與雪地等第一人稱自然風光短片的安靜觀影空間。" }
  },
  fea402c71dab4f66b91fadb41946b70f: {
    es: { title: "Cerámica digital", description: "Modela un jarrón, cuenco o taza ajustando la altura, la anchura y la abertura." },
    "pt-BR": { title: "Cerâmica digital", description: "Modele um vaso, tigela ou copo ajustando altura, largura e abertura." },
    "pt-PT": { title: "Cerâmica digital", description: "Modele uma jarra, taça ou copo ajustando a altura, largura e abertura." },
    fr: { title: "Poterie numérique", description: "Façonnez un vase, un bol ou une tasse en réglant la hauteur, la largeur et l’ouverture." },
    de: { title: "Digitale Töpferei", description: "Forme eine Vase, Schale oder Tasse durch Anpassen von Höhe, Breite und Öffnung." },
    it: { title: "Ceramica digitale", description: "Modella un vaso, una ciotola o una tazza regolando altezza, larghezza e apertura." },
    ja: { title: "デジタル陶芸", description: "高さ、胴の幅、口の広さを調整して花瓶や器、カップを作る静かな制作ツールです。" },
    ko: { title: "디지털 도예", description: "높이, 몸통 너비, 입구 비율을 조절해 화병, 그릇이나 컵을 만드는 차분한 도구입니다." },
    "zh-TW": { title: "數位陶藝", description: "線上調整高度、瓶身寬度與開口比例，捏出花瓶、碗或杯子。" }
  },
  cc26e5a341804bfbb139d28f5e49c237: {
    es: { title: "Posture Guardian", description: "Un recordatorio de hábitos al sentarse que analiza la postura en el dispositivo e incluye un temporizador de enfoque." },
    "pt-BR": { title: "Posture Guardian", description: "Um lembrete de hábitos ao sentar que analisa a postura no dispositivo e inclui um timer de foco." },
    "pt-PT": { title: "Posture Guardian", description: "Um lembrete de hábitos ao sentar que analisa a postura no dispositivo e inclui um temporizador de foco." },
    fr: { title: "Posture Guardian", description: "Un rappel d’habitudes assises qui analyse la posture sur l’appareil et inclut un minuteur de concentration." },
    de: { title: "Posture Guardian", description: "Eine Sitzgewohnheits-Erinnerung mit lokaler Haltungserkennung und 25-Minuten-Fokustimer." },
    it: { title: "Posture Guardian", description: "Un promemoria per le abitudini da seduti che analizza la postura sul dispositivo e include un timer." },
    ja: { title: "Posture Guardian", description: "端末上で姿勢を確認し、25分の集中タイマーも備えた座り方の習慣リマインダーです。" },
    ko: { title: "Posture Guardian", description: "기기에서 자세를 확인하고 25분 집중 타이머를 제공하는 앉기 습관 알림 도구입니다." },
    "zh-TW": { title: "姿勢守護者", description: "在本機讀取坐姿並提供提醒與 25 分鐘專注計時器的久坐習慣工具。" }
  },
  "9a3b574243ac45b39c004db93ea520b3": {
    es: { title: "Pocket Portfolio · Consola retro", description: "Un portafolio personal presentado como una consola portátil retro con controles en pantalla." },
    "pt-BR": { title: "Pocket Portfolio · Console retrô", description: "Um portfólio pessoal apresentado como um console portátil retrô com controles na tela." },
    "pt-PT": { title: "Pocket Portfolio · Consola retro", description: "Um portefólio pessoal apresentado como uma consola portátil retro com controlos no ecrã." },
    fr: { title: "Pocket Portfolio · Console rétro", description: "Un portfolio personnel présenté comme une console portable rétro avec commandes à l’écran." },
    de: { title: "Pocket Portfolio · Retro-Handheld", description: "Ein persönliches Portfolio als Retro-Handheld-Konsole mit Bildschirmsteuerung." },
    it: { title: "Pocket Portfolio · Console retrò", description: "Un portfolio personale presentato come una console portatile retrò con controlli a schermo." },
    ja: { title: "Pocket Portfolio · レトロ携帯ゲーム機", description: "画面上のボタンで操作する、レトロ携帯ゲーム機風の個人ポートフォリオです。" },
    ko: { title: "Pocket Portfolio · 레트로 휴대용 게임기", description: "화면 버튼으로 탐색하는 레트로 휴대용 게임기 형태의 개인 포트폴리오입니다." },
    "zh-TW": { title: "掌機風格作品集", description: "以復古掌上遊戲機形式呈現的個人作品集，透過螢幕上的按鍵瀏覽。" }
  }
};

export const cases: CaseEntry[] = baseCases.map((entry) => {
  const translations = caseLocalizations[entry.id] ?? {};
  const title = { ...entry.title };
  const description = { ...entry.description };

  for (const [locale, copy] of Object.entries(translations)) {
    title[locale] = copy.title;
    description[locale] = copy.description;
  }

  return { ...entry, title, description };
});

/** Resolve a Localized value for the active i18n language. */
export const pickLocalized = (value: Localized, language: string): string => {
  const code = normalizeLanguage(language) ?? fallbackLng;
  return value[code] ?? value[fallbackLng] ?? value.en;
};

export const casesWithPrompt = cases.filter(
  (entry): entry is CaseEntry & { prompt: string } => entry.prompt !== null,
);

export const casesWithoutPrompt = cases.filter((entry) => entry.prompt === null);
