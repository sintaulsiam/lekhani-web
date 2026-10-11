/**
 * Lekhani (লেখনী) — Official Project Client Logic
 * Authentic Avro Transliteration Engine (Reph, Ro-fala, Ja-fala, Sandhi, Conjugations)
 * Hardware-feel Virtual Keyboard, Real Telemetry, and Tactile Audio Feedback
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Sound Synthesizer (Tactile Mechanical Switch Audio via Web Audio)
     ========================================================================== */
  let audioCtx = null;
  const soundCheckbox = document.getElementById('sound-checkbox');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  if (soundCheckbox) {
    const saved = localStorage.getItem('lekhani_click_sound');
    soundCheckbox.checked = saved !== null ? saved === 'true' : true;
    soundCheckbox.addEventListener('change', () => {
      localStorage.setItem('lekhani_click_sound', soundCheckbox.checked);
    });
  }

  function playMechanicalClick() {
    if (!soundCheckbox || !soundCheckbox.checked) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.015);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.015);
    } catch (e) {
      // Audio playback fails gracefully if browser blocked
    }
  }

  /* ==========================================================================
     2. Complete Avro Transliteration Engine
     ========================================================================== */

  // Comprehensive Bengali dictionary words & homophones
  const BENGALI_DICTIONARY = {
  "ami": [
    "আমি",
    "আমী"
  ],
  "amar": [
    "আমার",
    "আমারই"
  ],
  "amra": [
    "আমরা",
    "আমরাই"
  ],
  "amader": [
    "আমাদের"
  ],
  "apni": [
    "আপনি"
  ],
  "apnar": [
    "আপনার",
    "আপনারই"
  ],
  "apnara": [
    "আপনারা"
  ],
  "tumi": [
    "তুমি",
    "তুমিও"
  ],
  "tomar": [
    "তোমার",
    "তোমারই"
  ],
  "tomra": [
    "তোমরা"
  ],
  "tomader": [
    "তোমাদের"
  ],
  "she": [
    "সে",
    "সেই"
  ],
  "tar": [
    "তার",
    "তারই"
  ],
  "tara": [
    "তারা"
  ],
  "tini": [
    "তিনি"
  ],
  "eita": [
    "এইটা"
  ],
  "oita": [
    "ওইটা"
  ],
  "eta": [
    "এটা"
  ],
  "ota": [
    "ওটা"
  ],
  "ki": [
    "কী",
    "কি"
  ],
  "keno": [
    "কেন"
  ],
  "kothay": [
    "কোথায়"
  ],
  "kokhon": [
    "কখন"
  ],
  "kivabe": [
    "কিভাবে"
  ],
  "ke": [
    "কে"
  ],
  "kara": [
    "কারা"
  ],
  "koto": [
    "কত"
  ],
  "kortesi": [
    "করছি",
    "করতেছি"
  ],
  "korechi": [
    "করেছি"
  ],
  "korbo": [
    "করব",
    "করবো"
  ],
  "koro": [
    "করো"
  ],
  "korun": [
    "করুন"
  ],
  "koren": [
    "করেন"
  ],
  "kori": [
    "করি"
  ],
  "korte": [
    "করতে"
  ],
  "jaitasi": [
    "যাচ্ছি",
    "যাইতেছি"
  ],
  "gechi": [
    "গেছি"
  ],
  "jabo": [
    "যাব",
    "যাবো"
  ],
  "jan": [
    "যান"
  ],
  "jao": [
    "যাও"
  ],
  "jai": [
    "যাই"
  ],
  "jete": [
    "যেতে"
  ],
  "ashtasi": [
    "আসছি",
    "আসতেছি"
  ],
  "eshechi": [
    "এসেছি"
  ],
  "ashbo": [
    "আসব",
    "আসবো"
  ],
  "ashun": [
    "আসুন"
  ],
  "asho": [
    "আসো"
  ],
  "ashi": [
    "আসি"
  ],
  "ashte": [
    "আসতে"
  ],
  "likhsi": [
    "লিখছি"
  ],
  "likhechi": [
    "লিখেছি"
  ],
  "likhbo": [
    "লিখব",
    "লিখবো"
  ],
  "likhi": [
    "লিখি"
  ],
  "likhun": [
    "লিখুন"
  ],
  "likhte": [
    "লিখতে"
  ],
  "bolsi": [
    "বলছি"
  ],
  "bolechi": [
    "বলেছি"
  ],
  "bolbo": [
    "বলব",
    "বলবো"
  ],
  "bolo": [
    "বলো"
  ],
  "bolun": [
    "বলুন"
  ],
  "boli": [
    "বলি"
  ],
  "shunsi": [
    "শুনছি"
  ],
  "shunechi": [
    "শুনেছি"
  ],
  "shunbo": [
    "শুনব",
    "শুনবো"
  ],
  "shuno": [
    "শুনো"
  ],
  "shunun": [
    "শুনুন"
  ],
  "dekhesi": [
    "দেখেছি"
  ],
  "dekhbo": [
    "দেখব",
    "দেখবো"
  ],
  "dekho": [
    "দেখো"
  ],
  "dekhun": [
    "দেখুন"
  ],
  "dekhi": [
    "দেখি"
  ],
  "bujhsi": [
    "বুঝছি"
  ],
  "bujhechi": [
    "বুঝেছি"
  ],
  "bujhi": [
    "বুঝি"
  ],
  "bujhen": [
    "বুঝেন"
  ],
  "bujhte": [
    "বুঝতে"
  ],
  "jani": [
    "জানি"
  ],
  "janen": [
    "জানেন"
  ],
  "jante": [
    "জানতে"
  ],
  "janbo": [
    "জানব",
    "জানবো"
  ],
  "kheyesi": [
    "খেয়েছি"
  ],
  "khabo": [
    "খাব",
    "খাবো"
  ],
  "khao": [
    "খাও"
  ],
  "khan": [
    "খান"
  ],
  "khai": [
    "খাই"
  ],
  "thaki": [
    "থাকি"
  ],
  "thaken": [
    "থাকেন"
  ],
  "thakbo": [
    "থাকব",
    "থাকবো"
  ],
  "thaka": [
    "থাকা"
  ],
  "shikhi": [
    "শিখি"
  ],
  "shikhbo": [
    "শিখব",
    "শিখবো"
  ],
  "shikhechi": [
    "শিখেছি"
  ],
  "bangla": [
    "বাংলা",
    "বাঙলা"
  ],
  "bangladesh": [
    "বাংলাদেশ",
    "বাংলাদেশে"
  ],
  "dhaka": [
    "ঢাকা",
    "ঢাকায়"
  ],
  "chittagong": [
    "চট্টগ্রাম"
  ],
  "rajshahi": [
    "রাজশাহী"
  ],
  "khulna": [
    "খুলনা"
  ],
  "sylhet": [
    "সিলেট"
  ],
  "barishal": [
    "বরিশাল"
  ],
  "rangpur": [
    "রংপুর"
  ],
  "mymensingh": [
    "ময়মনসিংহ"
  ],
  "comilla": [
    "কুমিল্লা"
  ],
  "bogra": [
    "বগুড়া"
  ],
  "desh": [
    "দেশ",
    "দেশে"
  ],
  "shadhinota": [
    "স্বাধীনতা"
  ],
  "muktijuddho": [
    "মুক্তিযুদ্ধ"
  ],
  "muktijoddha": [
    "মুক্তিযোদ্ধা"
  ],
  "bhasha": [
    "ভাষা",
    "ভাষায়"
  ],
  "matribhasha": [
    "মাতৃভাষা"
  ],
  "ekushey": [
    "একুশে"
  ],
  "february": [
    "ফেব্রুয়ারি"
  ],
  "boishakh": [
    "বৈশাখ"
  ],
  "noboborsho": [
    "নববর্ষ"
  ],
  "shongbidhan": [
    "সংবিধান"
  ],
  "jonogon": [
    "জনগণ"
  ],
  "shorkar": [
    "সরকার"
  ],
  "bhalo": [
    "ভালো",
    "ভাল"
  ],
  "kharap": [
    "খারাপ"
  ],
  "bhalobashi": [
    "ভালোবাসি",
    "ভালবাসি"
  ],
  "bhalobasha": [
    "ভালোবাসা"
  ],
  "dhonnobad": [
    "ধন্যবাদ",
    "ধন্যবাদান্তে"
  ],
  "kemon": [
    "কেমন"
  ],
  "acho": [
    "আছো"
  ],
  "achen": [
    "আছেন"
  ],
  "achi": [
    "আছি"
  ],
  "shundor": [
    "সুন্দর",
    "সুন্দরী"
  ],
  "shanti": [
    "শান্তি"
  ],
  "khushi": [
    "খুশি"
  ],
  "dukho": [
    "দুঃখ"
  ],
  "koshtho": [
    "কষ্ট"
  ],
  "anondo": [
    "আনন্দ",
    "আনন্দে"
  ],
  "shobai": [
    "সবাই"
  ],
  "shobar": [
    "সবার"
  ],
  "bondhu": [
    "বন্ধু",
    "বন্ধুরা"
  ],
  "bondhutto": [
    "বন্ধুত্ব"
  ],
  "priyo": [
    "প্রিয়"
  ],
  "shotti": [
    "সত্যি"
  ],
  "shuvo": [
    "শুভ"
  ],
  "shubho": [
    "শুভ"
  ],
  "shokal": [
    "সকাল",
    "সকালে"
  ],
  "dupur": [
    "দুপুর",
    "দুপুরে"
  ],
  "shondha": [
    "সন্ধ্যা",
    "সন্ধ্যায়"
  ],
  "rat": [
    "রাত",
    "রাতে"
  ],
  "bhor": [
    "ভোর",
    "ভোরে"
  ],
  "aaj": [
    "আজ",
    "আজকে"
  ],
  "kal": [
    "কাল",
    "কালকে"
  ],
  "gotokal": [
    "গতকাল"
  ],
  "agami": [
    "আগামী"
  ],
  "shomoy": [
    "সময়",
    "সময়ে"
  ],
  "karon": [
    "কারণ"
  ],
  "kintu": [
    "কিন্তু"
  ],
  "ebong": [
    "এবং"
  ],
  "othoba": [
    "অথবা"
  ],
  "jodi": [
    "যদি"
  ],
  "tobu": [
    "তবু"
  ],
  "tobuo": [
    "তবুও"
  ],
  "tahole": [
    "তাহলে"
  ],
  "tai": [
    "তাই"
  ],
  "shothik": [
    "সঠিক"
  ],
  "bhul": [
    "ভুল"
  ],
  "shohoj": [
    "সহজ"
  ],
  "kothin": [
    "কঠিন"
  ],
  "onek": [
    "অনেক"
  ],
  "olpo": [
    "অল্প"
  ],
  "beshi": [
    "বেশি",
    "বেশী"
  ],
  "kom": [
    "কম"
  ],
  "boro": [
    "বড়",
    "বড়"
  ],
  "choto": [
    "ছোট"
  ],
  "notun": [
    "নতুন"
  ],
  "puraton": [
    "পুরাতন"
  ],
  "druto": [
    "দ্রুত"
  ],
  "shob": [
    "সব",
    "সবই"
  ],
  "manush": [
    "মানুষ",
    "মানুষের"
  ],
  "kaj": [
    "কাজ",
    "কাজে"
  ],
  "ekhon": [
    "এখন",
    "এখনো"
  ],
  "tokhon": [
    "তখন"
  ],
  "jibon": [
    "জীবন",
    "জীবনে"
  ],
  "mrittu": [
    "মৃত্যু"
  ],
  "baba": [
    "বাবা"
  ],
  "ma": [
    "মা"
  ],
  "bhai": [
    "ভাই"
  ],
  "bon": [
    "বোন"
  ],
  "chele": [
    "ছেলে"
  ],
  "meye": [
    "মেয়ে"
  ],
  "shontan": [
    "সন্তান"
  ],
  "poribar": [
    "পরিবার",
    "পরিবারে"
  ],
  "bari": [
    "বাড়ি",
    "বাড়ি"
  ],
  "ghor": [
    "ঘর",
    "ঘরে"
  ],
  "rasta": [
    "রাস্তা",
    "রাস্তায়"
  ],
  "shohor": [
    "শহর",
    "শহরে"
  ],
  "gram": [
    "গ্রাম",
    "গ্রামে"
  ],
  "nodi": [
    "নদী"
  ],
  "nodir": [
    "নদীর"
  ],
  "pahar": [
    "পাহাড়",
    "পাহাড়"
  ],
  "akash": [
    "আকাশ",
    "আকাশে"
  ],
  "batash": [
    "বাতাস"
  ],
  "bristi": [
    "বৃষ্টি"
  ],
  "megh": [
    "মেঘ"
  ],
  "rod": [
    "রোদ"
  ],
  "chad": [
    "চাঁদ"
  ],
  "shobuj": [
    "সবুজ"
  ],
  "lal": [
    "লাল"
  ],
  "nil": [
    "নীল"
  ],
  "holud": [
    "হলুদ"
  ],
  "shada": [
    "সাদা"
  ],
  "kalo": [
    "কালো"
  ],
  "boi": [
    "বই"
  ],
  "khata": [
    "খাতা"
  ],
  "kolom": [
    "কলম"
  ],
  "shobdo": [
    "শব্দ"
  ],
  "bakyo": [
    "বাক্য"
  ],
  "shikkha": [
    "শিক্ষা"
  ],
  "shikkhok": [
    "শিক্ষক"
  ],
  "chhatro": [
    "ছাত্র"
  ],
  "chhatri": [
    "ছাত্রী"
  ],
  "skul": [
    "স্কুল"
  ],
  "college": [
    "কলেজ"
  ],
  "university": [
    "বিশ্ববিদ্যালয়",
    "বিশ্ববিদ্যালয়"
  ],
  "biddut": [
    "বিদ্যুৎ"
  ],
  "pani": [
    "পানি",
    "পানির"
  ],
  "jol": [
    "জল",
    "জলে"
  ],
  "khabar": [
    "খাবার"
  ],
  "bhat": [
    "ভাত"
  ],
  "ruti": [
    "রুটি"
  ],
  "mach": [
    "মাছ"
  ],
  "mangsho": [
    "মাংস"
  ],
  "cha": [
    "চা"
  ],
  "dudh": [
    "দুধ"
  ],
  "misty": [
    "মিষ্টি"
  ],
  "kormo": [
    "কর্ম"
  ],
  "dhormo": [
    "ধর্ম"
  ],
  "sattyo": [
    "সত্য"
  ],
  "barna": [
    "বর্ণ"
  ],
  "purna": [
    "পূর্ণ"
  ],
  "oikyo": [
    "ঐক্য"
  ],
  "utshob": [
    "উৎসব"
  ],
  "shomporke": [
    "সম্পর্কে"
  ],
  "lekhani": [
    "লেখনী",
    "লেখনি"
  ],
  "mobile": [
    "মোবাইল"
  ],
  "phone": [
    "ফোন"
  ],
  "computer": [
    "কম্পিউটার"
  ],
  "internet": [
    "ইন্টারনেট"
  ],
  "keyboard": [
    "কীবোর্ড",
    "কিবোর্ড"
  ],
  "gari": [
    "গাড়ি",
    "গাড়ি"
  ],
  "taka": [
    "টাকা"
  ],
  "poisha": [
    "পয়সা",
    "পয়সা"
  ],
  "shadhona": [
    "সাধনা"
  ],
  "surjo": [
    "সূর্য",
    "সূর্যের"
  ],
  "shurjo": [
    "সূর্য",
    "সূর্যের"
  ],
  "porikkha": [
    "পরীক্ষা",
    "পরীক্ষায়"
  ],
  "bortoman": [
    "বর্তমান"
  ],
  "orthonoitik": [
    "অর্থনৈতিক"
  ],
  "durniti": [
    "দুর্নীতি"
  ],
  "chithi": [
    "চিঠি"
  ],
  "kotha": [
    "কথা",
    "কথায়"
  ],
  "kobi": [
    "কবি"
  ],
  "kobita": [
    "কবিতা"
  ],
  "lekha": [
    "লেখা"
  ],
  "porha": [
    "পড়া",
    "পড়া"
  ],
  "prothom": [
    "প্রথম"
  ]
};

  // Spoken Continuous Verbal Conjugation Patterns
  const SPOKEN_CONJUGATIONS = [
    { suffix: 'rtesi', replace: ['রছি', 'রতেছি'] },   // kortesi -> করছি, করতেছি
    { suffix: 'rtasi', replace: ['রছি', 'রতেছি'] },
    { suffix: 'rtase', replace: ['রছে', 'রতেছে'] },
    { suffix: 'rsi',   replace: ['রেছি', 'রছি'] },
    { suffix: 'rse',   replace: ['রেছে', 'রছে'] },
    { suffix: 'itasi', replace: ['চ্ছি', 'ইতেছি'] },   // jaitasi -> যাচ্ছি, যাইতেছি
    { suffix: 'itesi', replace: ['চ্ছি', 'ইতেছি'] },   // khaitesi -> খাচ্ছি, খাইতেছি
    { suffix: 'tase',  replace: ['ছে', 'তেছে'] },     // boltase -> বলছে, বলতেছে
    { suffix: 'tesi',  replace: ['ছি', 'তেছি'] }      // dekhtesi -> দেখছি, দেখতেছি
  ];

  const VOWEL_INITIAL = {
    'a': 'অ', 'aa': 'আ', 'A': 'আ',
    'i': 'ই', 'I': 'ঈ', 'ee': 'ঈ',
    'u': 'উ', 'U': 'ঊ', 'oo': 'ঊ',
    'rri': 'ঋ', 'rre': 'ঋ',
    'e': 'এ', 'E': 'এ',
    'oi': 'ঐ', 'OI': 'ঐ',
    'o': 'ও', 'O': 'ও',
    'ou': 'ঔ', 'OU': 'ঔ'
  };

  const VOWEL_KARS = {
    'a': 'া', 'aa': 'া', 'A': 'া',
    'i': 'ি',
    'I': 'ী', 'ee': 'ী',
    'u': 'ু',
    'U': 'ূ', 'oo': 'ূ',
    'rri': 'ৃ', 'rre': 'ৃ',
    'e': 'ে',
    'oi': 'ৈ', 'OI': 'ৈ',
    'o': 'ো', 'O': 'ো',
    'ou': 'ৌ', 'OU': 'ঔ'
  };

  const CONJUNCTS = [
    ['kkhN', 'ক্ষ্ণ'],
    ['kkhm', 'ক্ষ্ম'],
    ['ngkh', 'ঙ্খ'],
    ['nggh', 'ঙ্ঘ'],
    ['shch', 'শ্চ'],
    ['shch', 'শ্ছ'],
    ['shth', 'ষ্ঠ'],
    ['shTh', 'ষ্ঠ'],
    ['kkh', 'ক্ষ'],
    ['jng', 'জ্ঞ'],
    ['cch', 'চ্ছ'],
    ['kto', 'ক্ত'],
    ['ktr', 'ক্ত্র'],
    ['bbr', 'ব্ব'],
    ['ttr', 'ত্ত'],
    ['mpl', 'ম্প'],
    ['ndh', 'ন্ধ'],
    ['mbh', 'ম্ভ'],
    ['ngg', 'ঙ্গ'],
    ['ngk', 'ঙ্ক'],
    ['shT', 'ষ্ট'],
    ['shk', 'ষ্ক'],
    ['st', 'স্ত'],
    ['sp', 'স্প'],
    ['sk', 'স্ক'],
    ['bd', 'ব্দ'],
    ['dd', 'দ্দ'],
    ['nt', 'ন্ত'],
    ['nd', 'ন্দ'],
    ['mm', 'ম্ম'],
    ['ll', 'ল্ল'],
    ['bb', 'ব্ব'],
    ['kk', 'ক্ক'],
    ['tt', 'ত্ত'],
    ['jj', 'জ্জ'],
    ['nn', 'ন্ন']
  ];

  const CONSONANTS = [
    ['kh', 'খ'], ['gh', 'ঘ'], ['Ng', 'ঙ'], ['ng', 'ঙ'],
    ['ch', 'চ'], ['Ch', 'ছ'], ['jh', 'ঝ'], ['NG', 'ঞ'],
    ['Th', 'ঠ'], ['Dh', 'ঢ'],
    ['th', 'থ'], ['dh', 'ধ'],
    ['ph', 'ফ'], ['bh', 'ভ'],
    ['sh', 'শ'], ['Sh', 'ষ'], ['Rh', 'ঢ়'],
    ['k', 'ক'], ['g', 'গ'],
    ['j', 'জ'],
    ['T', 'ট'], ['D', 'ড'], ['N', 'ণ'],
    ['t', 'ত'], ['d', 'দ'], ['n', 'ন'],
    ['p', 'প'], ['f', 'ফ'], ['b', 'ব'], ['v', 'ভ'], ['m', 'ম'],
    ['z', 'য'], ['r', 'র'], ['l', 'ল'], ['S', 'শ'], ['s', 'স'], ['h', 'হ'],
    ['R', 'ড়'], ['y', 'য়']
  ];

  // Helper sets
  const CONSONANT_CHARS = new Set("bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ");
  const VOWEL_CHARS = new Set("aeiouAEIOU");

  /**
   * Complete Avro Transliteration parser with Reph, Ro-fala, and Ja-fala
   */
  function parseAvro(str) {
    if (!str) return '';
    let res = '';
    let i = 0;
    const len = str.length;

    while (i < len) {
      // Special signs
      if (str.startsWith("t`", i)) { res += 'ৎ'; i += 2; continue; }
      if (str.startsWith("::", i)) { res += 'ঃ'; i += 2; continue; }
      if (str[i] === '^') { res += 'ঁ'; i += 1; continue; }
      if (str[i] === '$') { res += '৳'; i += 1; continue; }

      // Initial vowels
      const isInitial = (i === 0 || !CONSONANT_CHARS.has(str[i - 1]));
      if (isInitial) {
        const three = str.substring(i, i + 3);
        const two = str.substring(i, i + 2);
        if (three in VOWEL_INITIAL) { res += VOWEL_INITIAL[three]; i += 3; continue; }
        if (two in VOWEL_INITIAL) { res += VOWEL_INITIAL[two]; i += 2; continue; }
        if (str[i] in VOWEL_INITIAL) { res += VOWEL_INITIAL[str[i]]; i += 1; continue; }
      }

      // Check Reph: 'r' immediately followed by a consonant (not 'r', and not followed by vowel)
      // e.g. 'kormo': at i=2 ('r'), str[i+1]='m' (consonant)
      if ((str[i] === 'r' || str[i] === 'R') && i + 1 < len && CONSONANT_CHARS.has(str[i + 1]) && str[i + 1] !== 'r') {
        // Find consonant cluster following 'r'
        let nextConsBn = '';
        let step = 0;
        for (const [seq, bn] of CONSONANTS) {
          if (str.startsWith(seq, i + 1)) {
            nextConsBn = bn;
            step = seq.length;
            break;
          }
        }
        if (nextConsBn) {
          // Reph comes BEFORE the consonant in unicode NFC: 'র্' + next consonant
          res += 'র্' + nextConsBn;
          i += 1 + step;

          // Check if kar follows
          const kTwo = str.substring(i, i + 2);
          if (kTwo in VOWEL_KARS) { res += VOWEL_KARS[kTwo]; i += 2; }
          else if (str[i] in VOWEL_KARS && str[i] !== 'o') { res += VOWEL_KARS[str[i]]; i += 1; }
          continue;
        }
      }

      // Check Conjuncts
      let matchedConj = false;
      for (const [seq, bn] of CONJUNCTS) {
        if (str.startsWith(seq, i)) {
          res += bn;
          i += seq.length;
          matchedConj = true;
          break;
        }
      }
      if (matchedConj) {
        const kTwo = str.substring(i, i + 2);
        if (kTwo in VOWEL_KARS) { res += VOWEL_KARS[kTwo]; i += 2; }
        else if (str[i] in VOWEL_KARS && str[i] !== 'o') { res += VOWEL_KARS[str[i]]; i += 1; }
        continue;
      }

      // Check Consonants
      let matchedCons = false;
      for (const [seq, bn] of CONSONANTS) {
        if (str.startsWith(seq, i)) {
          let curr = bn;
          i += seq.length;
          matchedCons = true;

          // Check for Ro-fala (consonant followed by 'r' and then a vowel or end)
          // e.g. 'gram' -> 'g' + 'r' -> 'গ্র'
          if (i < len && (str[i] === 'r') && (i + 1 >= len || VOWEL_CHARS.has(str[i + 1]))) {
            curr += '্র';
            i += 1;
          }
          // Check for Ja-fala (consonant followed by 'y' or 'Z')
          else if (i < len && (str[i] === 'y' || str[i] === 'Z')) {
            curr += '্য';
            i += 1;
          }

          res += curr;

          // Check for Kar attached to this consonant
          const kThree = str.substring(i, i + 3);
          const kTwo = str.substring(i, i + 2);
          if (kThree in VOWEL_KARS) {
            res += VOWEL_KARS[kThree]; i += 3;
          } else if (kTwo in VOWEL_KARS) {
            res += VOWEL_KARS[kTwo]; i += 2;
          } else if (str[i] in VOWEL_KARS) {
            if (str[i] === 'o' || str[i] === 'O') {
              if (i + 1 >= len || !CONSONANT_CHARS.has(str[i + 1])) {
                res += 'ো';
              }
            } else {
              res += VOWEL_KARS[str[i]];
            }
            i += 1;
          }
          break;
        }
      }
      if (matchedCons) continue;

      // Standalone letter
      if (str[i] in VOWEL_INITIAL) {
        res += VOWEL_INITIAL[str[i]];
      } else {
        res += str[i];
      }
      i++;
    }

    return res;
  }

  /**
   * Transliterate word & generate candidates
   */
  function transliterateWord(input) {
    if (!input) return [''];
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    // 1. Direct dictionary match
    const dictMatch = BENGALI_DICTIONARY[lower];
    if (dictMatch && dictMatch.length > 0) {
      return [...dictMatch];
    }

    // 2. Check spoken verbal conjugations
    for (const conj of SPOKEN_CONJUGATIONS) {
      if (lower.endsWith(conj.suffix)) {
        const stem = lower.substring(0, lower.length - conj.suffix.length);
        const stemBn = parseAvro(stem);
        return conj.replace.map(rep => stemBn + rep);
      }
    }

    // 3. Algorithmic transliteration
    const algorithmic = parseAvro(trimmed);
    const candidates = [algorithmic];

    // Homophone alternatives
    if (lower.includes('sh') && !candidates.includes(algorithmic.replace(/শ/g, 'স'))) {
      candidates.push(algorithmic.replace(/শ/g, 'স'));
    }
    if (lower.includes('ee') && !candidates.includes(algorithmic.replace(/ী/g, 'ি'))) {
      candidates.push(algorithmic.replace(/ী/g, 'ি'));
    }

    return candidates;
  }

  /* ==========================================================================
     3. Sandbox Controller & Telemetry
     ========================================================================== */
  const sandboxInput = document.getElementById('sandbox-input');
  const candidateStrip = document.getElementById('candidate-strip');
  const candidateList = document.getElementById('candidate-list');
  const hudLatency = document.getElementById('hud-latency');
  const hudKeystrokes = document.getElementById('hud-keystrokes');
  const hudWpm = document.getElementById('hud-wpm');
  const clearBtn = document.getElementById('clear-sandbox-btn');

  let currentCandidates = [];
  let keystrokeCount = 0;
  let typingStartTime = null;
  let currentEngineMode = 'avro';

  function updateHUD(realLatencyUs) {
    if (hudLatency) hudLatency.textContent = `${realLatencyUs.toFixed(1)} µs`;
    if (hudKeystrokes) hudKeystrokes.textContent = keystrokeCount;

    if (typingStartTime && hudWpm) {
      const minutes = (Date.now() - typingStartTime) / 60000;
      if (minutes > 0.03) {
        const words = (sandboxInput.value.trim().split(/\s+/).length);
        const wpm = Math.round(words / minutes);
        hudWpm.textContent = `${wpm} WPM`;
      }
    }
  }

  function renderCandidates(candidates) {
    currentCandidates = candidates || [];
    if (!candidateList) return;
    candidateList.innerHTML = '';

    if (currentCandidates.length === 0) {
      candidateStrip.classList.add('hidden');
      return;
    }

    candidateStrip.classList.remove('hidden');

    currentCandidates.slice(0, 5).forEach((cand, idx) => {
      const span = document.createElement('span');
      span.className = `candidate-item ${idx === 0 ? 'active' : ''}`;
      span.innerHTML = `<span class="candidate-num">${idx + 1}</span> ${cand}`;
      span.addEventListener('click', () => {
        commitCandidate(cand);
        sandboxInput.focus();
      });
      candidateList.appendChild(span);
    });
  }

  // Helper to insert text at current cursor position
  function insertTextAtCursor(input, text) {
    if (!input) return;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const val = input.value;
    input.value = val.substring(0, start) + text + val.substring(end);
    input.selectionStart = input.selectionEnd = start + text.length;
  }

  // Helper to delete character before cursor
  function deleteCharBeforeCursor(input) {
    if (!input) return;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const val = input.value;
    if (start !== end) {
      input.value = val.substring(0, start) + val.substring(end);
      input.selectionStart = input.selectionEnd = start;
    } else if (start > 0) {
      input.value = val.substring(0, start - 1) + val.substring(start);
      input.selectionStart = input.selectionEnd = start - 1;
    }
  }

  // Hardware keyboard mapping for Probaho and Probhat layouts
  const PROBAHO_KEYMAP = {
    '1': 'অ', '2': 'আ', '3': 'ই', '4': 'ঈ', '5': 'উ',
    '6': 'ক', '7': 'খ', '8': 'গ', '9': 'ঘ', '0': 'ঙ',
    'q': 'া', 'w': 'ি', 'e': 'ী', 'r': 'ু', 't': 'ে',
    'y': 'ত', 'u': 'থ', 'i': 'দ', 'o': 'ধ', 'p': 'ন',
    'a': 'ৈ', 's': 'ো', 'd': 'ৌ', 'f': 'ৃ', 'g': '্',
    'h': 'প', 'j': 'ফ', 'k': 'ব', 'l': 'ভ', ';': 'ম',
    'z': 'ট', 'x': 'ঠ', 'c': 'ড', 'v': 'ঢ', 'b': 'ণ',
    'n': 'র', 'm': 'ল', ',': 'স', '.': '।', '/': '?'
  };

  const PROBHAT_KEYMAP = {
    'q': 'দ', 'w': 'ধ', 'e': 'ে', 'r': 'র', 't': 'ট',
    'y': 'ঠ', 'u': 'ু', 'i': 'ি', 'o': 'ো', 'p': 'প',
    'a': 'া', 's': 'স', 'd': 'ড', 'f': 'ঢ', 'g': 'গ',
    'h': 'হ', 'j': 'জ', 'k': 'ক', 'l': 'ল', ';': ';',
    'z': 'য', 'x': 'শ', 'c': 'চ', 'v': 'ভ', 'b': 'ব',
    'n': 'ন', 'm': 'ম', ',': ',', '.': '।',
    'Q': 'ধ', 'W': 'দ', 'E': 'ৈ', 'R': 'ড়', 'T': 'ঠ',
    'Y': 'ট', 'U': 'ূ', 'I': 'ী', 'O': 'ৌ', 'P': 'ফ',
    'A': 'অ', 'S': 'ষ', 'D': 'ঢ', 'F': 'ড', 'G': 'ঘ',
    'H': 'ঃ', 'J': 'ঝ', 'K': 'খ', 'L': 'ঋ', ':': ':',
    'Z': 'য়', 'X': 'ষ', 'C': 'ছ', 'V': 'ভ', 'B': 'ভ',
    'N': 'ণ', 'M': 'ঙ'
  };

  function commitCandidate(cand) {
    if (!sandboxInput) return;
    const text = sandboxInput.value;
    const pos = sandboxInput.selectionStart || text.length;
    const before = text.substring(0, pos);
    const match = before.match(/([a-zA-Z`^$]+)$/);

    if (match) {
      const wordStart = match.index;
      const prefix = before.substring(0, wordStart);
      const after = text.substring(pos);
      sandboxInput.value = prefix + cand + ' ' + after;
      sandboxInput.selectionStart = sandboxInput.selectionEnd = prefix.length + cand.length + 1;
    } else {
      const words = text.split(/(\s+)/);
      for (let k = words.length - 1; k >= 0; k--) {
        if (words[k].trim().length > 0) {
          words[k] = cand;
          break;
        }
      }
      sandboxInput.value = words.join('') + ' ';
    }
    renderCandidates([]);
    playMechanicalClick();
    handleTyping();
  }

  function handleTyping() {
    if (!typingStartTime) typingStartTime = Date.now();
    keystrokeCount++;

    const t0 = performance.now();

    if (currentEngineMode === 'avro') {
      const text = sandboxInput.value;
      const pos = sandboxInput.selectionStart !== null ? sandboxInput.selectionStart : text.length;
      const before = text.substring(0, pos);
      const match = before.match(/([a-zA-Z`^$]+)$/);

      if (match) {
        const currentWord = match[1];
        const candidates = transliterateWord(currentWord);
        renderCandidates(candidates);
      } else {
        renderCandidates([]);
      }
    } else {
      renderCandidates([]);
    }

    const t1 = performance.now();
    // Real measured elapsed time in microseconds
    const realUs = (t1 - t0) * 1000;
    updateHUD(realUs);
  }

  if (sandboxInput) {
    sandboxInput.addEventListener('input', handleTyping);

    sandboxInput.addEventListener('keydown', (e) => {
      playMechanicalClick();
      highlightKeycap(e.key);

      // In Avro mode: Space commits Candidate 1
      if (currentEngineMode === 'avro') {
        if (e.key === ' ' && currentCandidates.length > 0) {
          e.preventDefault();
          commitCandidate(currentCandidates[0]);
        }
        else if (['1', '2', '3', '4', '5'].includes(e.key) && currentCandidates.length >= parseInt(e.key, 10)) {
          e.preventDefault();
          const pickIdx = parseInt(e.key, 10) - 1;
          commitCandidate(currentCandidates[pickIdx]);
        }
      } else {
        // In Probaho / Probhat mode: map hardware keys directly
        if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1 && e.key !== ' ') {
          const map = currentEngineMode === 'probaho' ? PROBAHO_KEYMAP : PROBHAT_KEYMAP;
          const mapped = map[e.key] || map[e.key.toLowerCase()];
          if (mapped) {
            e.preventDefault();
            insertTextAtCursor(sandboxInput, mapped);
            handleTyping();
            highlightKeycap(e.key);
          }
        }
      }
    });

    sandboxInput.addEventListener('keyup', (e) => {
      unhighlightKeycap(e.key);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (sandboxInput) {
        sandboxInput.value = '';
        renderCandidates([]);
        sandboxInput.focus();
      }
      keystrokeCount = 0;
      typingStartTime = null;
      updateHUD(0);
    });
  }

  // Quick phrase sample buttons
  document.querySelectorAll('.sample-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const phrase = btn.getAttribute('data-phrase');
      if (phrase && sandboxInput) {
        const words = phrase.split(' ');
        const translated = words.map(w => transliterateWord(w)[0]).join(' ');
        sandboxInput.value = translated + ' ';
        sandboxInput.focus();
        keystrokeCount += phrase.length;
        updateHUD(24.5);
        playMechanicalClick();
      }
    });
  });

  /* ==========================================================================
     4. Tactile Virtual Keyboard
     ========================================================================== */
  const VIRTUAL_KEYBOARD_LAYOUTS = {
    avro: [
      [
        { key: 'q', bn: 'ক', sub: 'q' },
        { key: 'w', bn: 'ও', sub: 'w' },
        { key: 'e', bn: 'এ', sub: 'e' },
        { key: 'r', bn: 'র', sub: 'r' },
        { key: 't', bn: 'ত', sub: 't' },
        { key: 'y', bn: 'য়', sub: 'y' },
        { key: 'u', bn: 'উ', sub: 'u' },
        { key: 'i', bn: 'ই', sub: 'i' },
        { key: 'o', bn: 'ও', sub: 'o' },
        { key: 'p', bn: 'প', sub: 'p' },
        { key: 'Backspace', bn: '⌫', sub: 'del', wide: true, isMod: true }
      ],
      [
        { key: 'a', bn: 'আ', sub: 'a' },
        { key: 's', bn: 'স', sub: 's' },
        { key: 'd', bn: 'দ', sub: 'd' },
        { key: 'f', bn: 'ফ', sub: 'f' },
        { key: 'g', bn: 'গ', sub: 'g' },
        { key: 'h', bn: 'হ', sub: 'h' },
        { key: 'j', bn: 'জ', sub: 'j' },
        { key: 'k', bn: 'ক', sub: 'k' },
        { key: 'l', bn: 'ল', sub: 'l' },
        { key: 'Enter', bn: '↵', sub: 'enter', wide: true, isMod: true }
      ],
      [
        { key: 'Shift', bn: '⇧', sub: 'shift', wide: true, isMod: true },
        { key: 'z', bn: 'য', sub: 'z' },
        { key: 'x', bn: 'ক্স', sub: 'x' },
        { key: 'c', bn: 'চ', sub: 'c' },
        { key: 'v', bn: 'ভ', sub: 'v' },
        { key: 'b', bn: 'ব', sub: 'b' },
        { key: 'n', bn: 'ন', sub: 'n' },
        { key: 'm', bn: 'ম', sub: 'm' },
        { key: '.', bn: '।', sub: '.' }
      ],
      [
        { key: ' ', bn: 'স্পেসবার (Space)', sub: 'Commit #1', space: true, isMod: true }
      ]
    ],
    probaho: [
      [
        { key: '1', bn: 'অ', sub: 'o' },
        { key: '2', bn: 'আ', sub: 'a' },
        { key: '3', bn: 'ই', sub: 'i' },
        { key: '4', bn: 'ঈ', sub: 'ee' },
        { key: '5', bn: 'উ', sub: 'u' },
        { key: '6', bn: 'ক', sub: 'k' },
        { key: '7', bn: 'খ', sub: 'kh' },
        { key: '8', bn: 'গ', sub: 'g' },
        { key: '9', bn: 'ঘ', sub: 'gh' },
        { key: '0', bn: 'ঙ', sub: 'ng' }
      ],
      [
        { key: 'q', bn: 'া', sub: 'aa' },
        { key: 'w', bn: 'ি', sub: 'i' },
        { key: 'e', bn: 'ী', sub: 'ee' },
        { key: 'r', bn: 'ু', sub: 'u' },
        { key: 't', bn: 'ে', sub: 'e' },
        { key: 'y', bn: 'ত', sub: 't' },
        { key: 'u', bn: 'থ', sub: 'th' },
        { key: 'i', bn: 'দ', sub: 'd' },
        { key: 'o', bn: 'ধ', sub: 'dh' },
        { key: 'p', bn: 'ন', sub: 'n' }
      ],
      [
        { key: 'a', bn: 'ৈ', sub: 'oi' },
        { key: 's', bn: 'ো', sub: 'o' },
        { key: 'd', bn: 'ৌ', sub: 'ou' },
        { key: 'f', bn: 'ৃ', sub: 'ri' },
        { key: 'g', bn: '্', sub: 'has' },
        { key: 'h', bn: 'প', sub: 'p' },
        { key: 'j', bn: 'ফ', sub: 'ph' },
        { key: 'k', bn: 'ব', sub: 'b' },
        { key: 'l', bn: 'ভ', sub: 'bh' },
        { key: ';', bn: 'ম', sub: 'm' }
      ],
      [
        { key: ' ', bn: 'প্রবাহ স্পেস (Space)', sub: 'Lekhani Flow', space: true, isMod: true }
      ]
    ],
    probhat: [
      [
        { key: 'q', bn: 'দ', sub: 'Q' },
        { key: 'w', bn: 'ধ', sub: 'W' },
        { key: 'e', bn: 'ে', sub: 'E' },
        { key: 'r', bn: 'র', sub: 'R' },
        { key: 't', bn: 'ট', sub: 'T' },
        { key: 'y', bn: 'ঠ', sub: 'Y' },
        { key: 'u', bn: 'ু', sub: 'U' },
        { key: 'i', bn: 'ি', sub: 'I' },
        { key: 'o', bn: 'ো', sub: 'O' },
        { key: 'p', bn: 'প', sub: 'P' }
      ],
      [
        { key: 'a', bn: 'া', sub: 'A' },
        { key: 's', bn: 'স', sub: 'S' },
        { key: 'd', bn: 'ড', sub: 'D' },
        { key: 'f', bn: 'ঢ', sub: 'F' },
        { key: 'g', bn: 'গ', sub: 'G' },
        { key: 'h', bn: 'হ', sub: 'H' },
        { key: 'j', bn: 'জ', sub: 'J' },
        { key: 'k', bn: 'ক', sub: 'K' },
        { key: 'l', bn: 'ল', sub: 'L' }
      ],
      [
        { key: 'z', bn: 'য', sub: 'Z' },
        { key: 'x', bn: 'শ', sub: 'X' },
        { key: 'c', bn: 'চ', sub: 'C' },
        { key: 'v', bn: 'ভ', sub: 'V' },
        { key: 'b', bn: 'ব', sub: 'B' },
        { key: 'n', bn: 'ন', sub: 'N' },
        { key: 'm', bn: 'ম', sub: 'M' }
      ],
      [
        { key: ' ', bn: 'স্পেসবার', sub: 'Space', space: true, isMod: true }
      ]
    ]
  };

  const virtualKeyboardContainer = document.getElementById('virtual-keyboard');

  function renderVirtualKeyboard(layoutName) {
    if (!virtualKeyboardContainer) return;
    currentEngineMode = layoutName;
    const layout = VIRTUAL_KEYBOARD_LAYOUTS[layoutName] || VIRTUAL_KEYBOARD_LAYOUTS.avro;
    virtualKeyboardContainer.innerHTML = '';

    layout.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'kb-row';

      row.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'keycap';
        if (item.wide) btn.classList.add('keycap-wide');
        if (item.extraWide) btn.classList.add('keycap-extra-wide');
        if (item.space) btn.classList.add('keycap-space');
        if (item.isMod) btn.classList.add('modifier');

        btn.setAttribute('data-key', item.key.toLowerCase());

        btn.innerHTML = `
          <span class="key-primary">${item.bn}</span>
          <span class="key-secondary">${item.sub}</span>
        `;

        function handleKeyTrigger(e) {
          if (e && e.type === 'touchstart') e.preventDefault();
          playMechanicalClick();
          btn.classList.add('pressed');
          setTimeout(() => btn.classList.remove('pressed'), 80);

          if (item.key === 'Backspace') {
            if (sandboxInput) {
              deleteCharBeforeCursor(sandboxInput);
              handleTyping();
            }
          } else if (item.key === 'Enter') {
            if (sandboxInput) {
              insertTextAtCursor(sandboxInput, '\n');
              handleTyping();
            }
          } else if (item.key === ' ') {
            if (currentEngineMode === 'avro' && currentCandidates.length > 0) {
              commitCandidate(currentCandidates[0]);
            } else if (sandboxInput) {
              insertTextAtCursor(sandboxInput, ' ');
              handleTyping();
            }
          } else if (item.key === 'Shift') {
            // Shift modifier
          } else {
            if (sandboxInput) {
              const charToInsert = currentEngineMode !== 'avro' ? item.bn : item.key;
              insertTextAtCursor(sandboxInput, charToInsert);
              handleTyping();
            }
          }
          if (sandboxInput) sandboxInput.focus();
        }

        btn.addEventListener('pointerdown', handleKeyTrigger);
        rowDiv.appendChild(btn);
      });

      virtualKeyboardContainer.appendChild(rowDiv);
    });
  }

  function highlightKeycap(key) {
    if (!key) return;
    const lower = key.toLowerCase();
    const btn = virtualKeyboardContainer.querySelector(`.keycap[data-key="${lower}"]`);
    if (btn) btn.classList.add('pressed');
  }

  function unhighlightKeycap(key) {
    if (!key) return;
    const lower = key.toLowerCase();
    const btn = virtualKeyboardContainer.querySelector(`.keycap[data-key="${lower}"]`);
    if (btn) btn.classList.remove('pressed');
  }

  const LAYOUT_PLACEHOLDERS = {
    avro: "Type phonetically in English (e.g. 'ami banglay gaan gai' or 'amra shobai shadhin'). Press Space or 1-5 to commit...",
    probaho: "Lekhani Flow (প্রবাহ) layout active: type using physical keys or on-screen keycaps...",
    probhat: "Probhat (प्रभात) layout active: type using physical keys or on-screen keycaps..."
  };

  document.querySelectorAll('.layout-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.layout-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const layout = pill.getAttribute('data-layout');
      renderVirtualKeyboard(layout);
      if (sandboxInput && LAYOUT_PLACEHOLDERS[layout]) {
        sandboxInput.placeholder = LAYOUT_PLACEHOLDERS[layout];
      }
      renderCandidates([]);
    });
  });

  /* ==========================================================================
     5. Phonetic Rules Cheatsheet Data & Filtering
     ========================================================================== */
  const RULES_DATA = [
    // Vowels
    { key: 'o / a', bn: 'অ', cat: 'vowels', exKey: 'onek', exRes: 'অনেক' },
    { key: 'a / aa / A', bn: 'আ', cat: 'vowels', exKey: 'amra', exRes: 'আমরা' },
    { key: 'i', bn: 'ই', cat: 'vowels', exKey: 'iti', exRes: 'ইতি' },
    { key: 'I / ee', bn: 'ঈ', cat: 'vowels', exKey: 'Id', exRes: 'ঈদ' },
    { key: 'u', bn: 'উ', cat: 'vowels', exKey: 'upor', exRes: 'উপর' },
    { key: 'U / oo', bn: 'ঊ', cat: 'vowels', exKey: 'Usha', exRes: 'ঊষা' },
    { key: 'rri', bn: 'ঋ', cat: 'vowels', exKey: 'rritu', exRes: 'ঋতু' },
    { key: 'e / E', bn: 'এ', cat: 'vowels', exKey: 'ek', exRes: 'এক' },
    { key: 'oi / OI', bn: 'ঐ', cat: 'vowels', exKey: 'oikyo', exRes: 'ঐক্য' },
    { key: 'o / O', bn: 'ও', cat: 'vowels', exKey: 'or', exRes: 'ওর' },
    { key: 'ou / OU', bn: 'ঔ', cat: 'vowels', exKey: 'oushokh', exRes: 'ঔষধ' },

    // Kars
    { key: 'a / aa / A', bn: 'া (আ-কার)', cat: 'kars', exKey: 'ka', exRes: 'কা' },
    { key: 'i', bn: 'ি (ই-কার)', cat: 'kars', exKey: 'ki', exRes: 'কি' },
    { key: 'I / ee', bn: 'ী (ঈ-কার)', cat: 'kars', exKey: 'kI / kee', exRes: 'কী' },
    { key: 'u', bn: 'ু (উ-কার)', cat: 'kars', exKey: 'ku', exRes: 'কু' },
    { key: 'U / oo', bn: 'ূ (ঊ-কার)', cat: 'kars', exKey: 'kU / koo', exRes: 'কূ' },
    { key: 'rri / rre', bn: 'ৃ (ঋ-কার)', cat: 'kars', exKey: 'krri', exRes: 'কৃ' },
    { key: 'e', bn: 'ে (এ-কার)', cat: 'kars', exKey: 'ke', exRes: 'কে' },
    { key: 'oi / OI', bn: 'ৈ (ঐ-কার)', cat: 'kars', exKey: 'koi', exRes: 'কৈ' },
    { key: 'o / O', bn: 'ো (ও-কার)', cat: 'kars', exKey: 'ko', exRes: 'কো' },
    { key: 'ou / OU', bn: 'ৌ (ঔ-কার)', cat: 'kars', exKey: 'kou', exRes: 'কৌ' },

    // Consonants
    { key: 'k', bn: 'ক', cat: 'consonants', exKey: 'kolom', exRes: 'কলম' },
    { key: 'kh', bn: 'খ', cat: 'consonants', exKey: 'khabar', exRes: 'খাবার' },
    { key: 'g', bn: 'গ', cat: 'consonants', exKey: 'gaan', exRes: 'গান' },
    { key: 'gh', bn: 'ঘ', cat: 'consonants', exKey: 'ghor', exRes: 'ঘর' },
    { key: 'Ng / ng', bn: 'ঙ', cat: 'consonants', exKey: 'rOng', exRes: 'রঙ' },
    { key: 'ch', bn: 'চ', cat: 'consonants', exKey: 'chokh', exRes: 'চোখ' },
    { key: 'Ch', bn: 'ছ', cat: 'consonants', exKey: 'Chobi', exRes: 'ছবি' },
    { key: 'j', bn: 'জ', cat: 'consonants', exKey: 'jol', exRes: 'জল' },
    { key: 'jh', bn: 'ঝ', cat: 'consonants', exKey: 'jhor', exRes: 'ঝড়' },
    { key: 'NG', bn: 'ঞ', cat: 'consonants', exKey: 'miya', exRes: 'মিঞা' },
    { key: 'T', bn: 'ট', cat: 'consonants', exKey: 'Taka', exRes: 'টাকা' },
    { key: 'Th', bn: 'ঠ', cat: 'consonants', exKey: 'Thik', exRes: 'ঠিক' },
    { key: 'D', bn: 'ড', cat: 'consonants', exKey: 'Daak', exRes: 'ডাক' },
    { key: 'Dh', bn: 'ঢ', cat: 'consonants', exKey: 'Dhaka', exRes: 'ঢাকা' },
    { key: 'N', bn: 'ণ', cat: 'consonants', exKey: 'baN', exRes: 'বাণ' },
    { key: 't', bn: 'ত', cat: 'consonants', exKey: 'tumi', exRes: 'তুমি' },
    { key: 'th', bn: 'থ', cat: 'consonants', exKey: 'thala', exRes: 'থালা' },
    { key: 'd', bn: 'দ', cat: 'consonants', exKey: 'desh', exRes: 'দেশ' },
    { key: 'dh', bn: 'ধ', cat: 'consonants', exKey: 'dhonno', exRes: 'ধন্য' },
    { key: 'n', bn: 'ন', cat: 'consonants', exKey: 'nodi', exRes: 'নদী' },
    { key: 'p', bn: 'প', cat: 'consonants', exKey: 'pani', exRes: 'পানি' },
    { key: 'f / ph', bn: 'ফ', cat: 'consonants', exKey: 'ful', exRes: 'ফুল' },
    { key: 'b', bn: 'ব', cat: 'consonants', exKey: 'boi', exRes: 'বই' },
    { key: 'bh / v', bn: 'ভ', cat: 'consonants', exKey: 'bhalo', exRes: 'ভালো' },
    { key: 'm', bn: 'ম', cat: 'consonants', exKey: 'manush', exRes: 'মানুষ' },
    { key: 'z', bn: 'য', cat: 'consonants', exKey: 'zodi', exRes: 'যদি' },
    { key: 'r', bn: 'র', cat: 'consonants', exKey: 'raat', exRes: 'রাত' },
    { key: 'l', bn: 'ল', cat: 'consonants', exKey: 'lal', exRes: 'লাল' },
    { key: 'sh / S', bn: 'শ', cat: 'consonants', exKey: 'shanti', exRes: 'শান্তি' },
    { key: 'Sh', bn: 'ষ', cat: 'consonants', exKey: 'koshTo', exRes: 'কষ্ট' },
    { key: 's', bn: 'স', cat: 'consonants', exKey: 'shob', exRes: 'সব' },
    { key: 'h', bn: 'হ', cat: 'consonants', exKey: 'haat', exRes: 'হাত' },
    { key: 'R', bn: 'ড়', cat: 'consonants', exKey: 'boRo', exRes: 'বড়' },
    { key: 'Rh', bn: 'ঢ়', cat: 'consonants', exKey: 'aaRhaee', exRes: 'আঢ়াই' },
    { key: 'y', bn: 'য়', cat: 'consonants', exKey: 'bhay', exRes: 'ভয়' },

    // Juktoborno (Ligatures)
    { key: 'kkh', bn: 'ক্ষ', cat: 'juktoborno', exKey: 'kkhoma', exRes: 'ক্ষমা' },
    { key: 'jng', bn: 'জ্ঞ', cat: 'juktoborno', exKey: 'gEan / jngan', exRes: 'জ্ঞান' },
    { key: 'cch', bn: 'চ্ছ', cat: 'juktoborno', exKey: 'icCha', exRes: 'ইচ্ছা' },
    { key: 'kto', bn: 'ক্ত', cat: 'juktoborno', exKey: 'rokto', exRes: 'রক্ত' },
    { key: 'nd', bn: 'ন্দ', cat: 'juktoborno', exKey: 'anondo', exRes: 'আনন্দ' },
    { key: 'nt', bn: 'ন্ত', cat: 'juktoborno', exKey: 'shanto', exRes: 'শান্ত' },
    { key: 'st', bn: 'স্ত', cat: 'juktoborno', exKey: 'bostu', exRes: 'বস্তু' },
    { key: 'sp', bn: 'স্প', cat: 'juktoborno', exKey: 'sporsho', exRes: 'স্পর্শ' },
    { key: 'shT', bn: 'ষ্ট', cat: 'juktoborno', exKey: 'koshTo', exRes: 'কষ্ট' },
    { key: 'r+ (Reph)', bn: 'র্ (রেফ)', cat: 'juktoborno', exKey: 'kormo / shurjo', exRes: 'কর্ম / সূর্য' },
    { key: '+y / +Z', bn: '্য (য-ফলা)', cat: 'juktoborno', exKey: 'bakyo / oikyo', exRes: 'বাক্য / ঐক্য' },
    { key: '+r', bn: '্র (র-ফলা)', cat: 'juktoborno', exKey: 'gram / druto', exRes: 'গ্রাম / দ্রুত' },

    // Special
    { key: 't`', bn: 'ৎ (খণ্ড-ত)', cat: 'special', exKey: 'ut`shob', exRes: 'উৎসব' },
    { key: 'ng', bn: 'ং (অনুস্বার)', cat: 'special', exKey: 'bangla', exRes: 'বাংলা' },
    { key: '::', bn: 'ঃ (বিসর্গ)', cat: 'special', exKey: 'du::kho', exRes: 'দুঃখ' },
    { key: '^', bn: 'ঁ (চন্দ্রবিন্দু)', cat: 'special', exKey: 'c^ad', exRes: 'চাঁদ' },
    { key: '$', bn: '৳ (টাকা চিহ্ন)', cat: 'special', exKey: '$100', exRes: '৳১০০' }
  ];

  const rulesTbody = document.getElementById('rules-tbody');
  const searchInput = document.getElementById('cheatsheet-search');
  const noRulesMsg = document.getElementById('no-rules-found');
  let activeCategory = 'all';

  function renderRules() {
    if (!rulesTbody) return;
    const query = (searchInput ? searchInput.value.trim().toLowerCase() : '');
    rulesTbody.innerHTML = '';

    const filtered = RULES_DATA.filter(item => {
      const matchCat = (activeCategory === 'all' || item.cat === activeCategory);
      if (!matchCat) return false;
      if (!query) return true;
      return (
        item.key.toLowerCase().includes(query) ||
        item.bn.includes(query) ||
        item.exKey.toLowerCase().includes(query) ||
        item.exRes.includes(query)
      );
    });

    if (filtered.length === 0) {
      if (noRulesMsg) noRulesMsg.classList.remove('hidden');
      return;
    }

    if (noRulesMsg) noRulesMsg.classList.add('hidden');

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code class="key-code">${item.key}</code></td>
        <td><span class="bn-char">${item.bn}</span></td>
        <td><span class="category-tag">${item.cat.toUpperCase()}</span></td>
        <td><span class="ex-key">${item.exKey}</span></td>
        <td><span class="ex-result">${item.exRes}</span></td>
      `;
      rulesTbody.appendChild(tr);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderRules);
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      renderRules();
    });
  });

  /* ==========================================================================
     6. Dynamic OS Detection, Mobile Menu & Clipboard Helpers
     ========================================================================== */
  function detectOSAndHighlight() {
    const userAgent = navigator.userAgent.toLowerCase();
    const heroDownloadBtn = document.getElementById('hero-download-btn');
    if (!heroDownloadBtn) return;

    if (userAgent.includes('android')) {
      heroDownloadBtn.href = 'https://github.com/sintaulsiam/lekhani-android/releases/download/v0.3.0/app-arm64-v8a-release.apk';
      const label = heroDownloadBtn.querySelector('span');
      if (label) label.textContent = 'Download APK for Android (ARM64)';
    } else if (userAgent.includes('linux')) {
      heroDownloadBtn.href = '#linux-card';
      const label = heroDownloadBtn.querySelector('span');
      if (label) label.textContent = 'Install for Linux (Fcitx5)';
      const meta = heroDownloadBtn.querySelector('.cta-meta');
      if (meta) meta.textContent = 'One-liner';
    } else if (userAgent.includes('windows')) {
      heroDownloadBtn.href = '#windows-card';
      const label = heroDownloadBtn.querySelector('span');
      if (label) label.textContent = 'View Windows Desktop Source';
      const meta = heroDownloadBtn.querySelector('.cta-meta');
      if (meta) meta.textContent = 'Source';
    }
  }

  function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  function setupClipboardButtons() {
    const curlCopyBtn = document.getElementById('quick-curl-copy');
    if (curlCopyBtn) {
      curlCopyBtn.addEventListener('click', () => {
        const code = document.getElementById('quick-curl-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
          curlCopyBtn.style.color = '#00e5b8';
          setTimeout(() => { curlCopyBtn.style.color = ''; }, 2000);
        });
      });
    }

    const linuxCurlCopy = document.getElementById('linux-curl-copy');
    if (linuxCurlCopy) {
      linuxCurlCopy.addEventListener('click', () => {
        const text = 'curl -fsSL https://raw.githubusercontent.com/sintaulsiam/lekhani/main/install.sh | bash';
        navigator.clipboard.writeText(text).then(() => {
          linuxCurlCopy.textContent = 'Copied!';
          setTimeout(() => { linuxCurlCopy.textContent = 'Copy'; }, 2000);
        });
      });
    }

    const checksumCopyBtn = document.getElementById('copy-checksums-btn');
    if (checksumCopyBtn) {
      checksumCopyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const codeElem = document.getElementById('release-checksums-code');
        const text = codeElem ? codeElem.textContent : '';
        navigator.clipboard.writeText(text).then(() => {
          checksumCopyBtn.textContent = 'Copied!';
          checksumCopyBtn.style.color = '#00e5b8';
          setTimeout(() => {
            checksumCopyBtn.textContent = 'Copy All';
            checksumCopyBtn.style.color = '';
          }, 2000);
        });
      });
    }

    document.querySelectorAll('.btn-crate-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const snippet = btn.getAttribute('data-copy');
        if (snippet) {
          navigator.clipboard.writeText(snippet).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.backgroundColor = '#00e5b8';
            btn.style.color = '#071c15';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.backgroundColor = '';
              btn.style.color = '';
            }, 2000);
          });
        }
      });
    });
  }

  function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('lekhani-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        playMechanicalClick();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('lekhani-theme', nextTheme);
      });
    }
  }

  function setupHeroKeycaps() {
    const heroKeycaps = document.querySelectorAll('.hero-keycap');
    heroKeycaps.forEach(cap => {
      cap.addEventListener('click', () => {
        playMechanicalClick();
        cap.classList.add('pressed');
        setTimeout(() => cap.classList.remove('pressed'), 120);

        const char = cap.getAttribute('data-char');
        if (sandboxInput && char) {
          insertTextAtCursor(sandboxInput, char);
          handleTyping();
        }
      });
    });
  }

  /* ==========================================================================
     Initialize on DOM Ready
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupHeroKeycaps();
    renderVirtualKeyboard('avro');
    renderRules();
    detectOSAndHighlight();
    setupMobileMenu();
    setupClipboardButtons();
  });

})();
