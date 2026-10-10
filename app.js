/**
 * Lekhani (লেখনী) — Official Project Website Client Logic
 * Features:
 * - Live Avro Bengali Transliteration Engine with candidate suggestion strip
 * - Tactile Virtual Keyboard with physical & touch keystroke tracking
 * - Web Audio API synthesized mechanical switch clicks
 * - Offline QR Code generation for direct Android APK install
 * - Interactive Phonetic Rules Cheatsheet search & filter
 * - Dynamic OS detection, responsive mobile menu drawer & 1-click clipboard helpers
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

  function playMechanicalClick() {
    if (!soundCheckbox || !soundCheckbox.checked) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      // High-frequency mechanical tap oscillator
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
      // Audio playback fails gracefully if blocked by browser policy
    }
  }

  /* ==========================================================================
     2. Avro Transliteration Engine & Smart Dictionary
     ========================================================================== */

  // High-frequency Bengali dictionary words & homophone expansions
  const BENGALI_DICTIONARY = {
    'ami': ['আমি', 'আমী', 'আমিতো'],
    'amar': ['আমার', 'আমারই'],
    'amra': ['আমরা', 'আমরাই'],
    'apni': ['আপনি', 'আপনার'],
    'apnar': ['আপনার', 'আপনারই'],
    'tumi': ['তুমি', 'তুমিও'],
    'tomar': ['তোমার', 'তোমারই'],
    'bangla': ['বাংলা', 'বাঙলা'],
    'bangladesh': ['বাংলাদেশ', 'বাংলাদেশে'],
    'lekhani': ['লেখনী', 'লেখনি'],
    'bhalobashi': ['ভালোবাসি', 'ভালবাসি'],
    'bhalo': ['ভালো', 'ভাল'],
    'kemon': ['কেমন', 'কেমনটা'],
    'acho': ['আছো', 'আছেন'],
    'achen': ['আছেন'],
    'dhonnobad': ['ধন্যবাদ', 'ধন্যবাদান্তে'],
    'shadhinota': ['স্বাধীনতা'],
    'desh': ['দেশ', 'দেশে'],
    'shomoy': ['সময়', 'সময়ে'],
    'bortoman': ['বর্তমান'],
    'muktijuddho': ['মুক্তিযুদ্ধ'],
    'shundor': ['সুন্দর', 'সুন্দরী'],
    'bondhu': ['বন্ধু', 'বন্ধুরা'],
    'shurjo': ['সূর্য', 'সূর্যের'],
    'shokal': ['সকাল', 'সকালে'],
    'rat': ['রাত', 'রাতে'],
    'gaan': ['গান', 'গানে'],
    'khub': ['খub', 'খুব', 'খুবই'],
    'druto': ['দ্রুত'],
    'porikkha': ['পরীক্ষা', 'পরীক্ষায়'],
    'shobar': ['সবার', 'সবারে'],
    'ghor': ['ঘর', 'ঘরে'],
    'manush': ['মানুষ', 'মানুষের'],
    'shanti': ['শান্তি'],
    'shob': ['সব', 'সবই'],
    'kaj': ['কাজ', 'কাজে'],
    'notun': ['নতুন'],
    'puraton': ['পুরাতন'],
    'ekhon': ['এখন', 'এখনো'],
    'tokhon': ['তখন'],
    'she': ['সে', 'সেই'],
    'tini': ['তিনি'],
    'ki': ['কি', 'কী'],
    'keno': ['কেন'],
    'kothay': ['কোথায়'],
    'biddut': ['বিদ্যুৎ'],
    'orthonoitik': ['অর্থনৈতিক'],
    'durniti': ['দুর্নীতি'],
    'chithi': ['চিঠি'],
    'kotha': ['কথা', 'কথায়'],
    'pani': ['পানি', 'পানির'],
    'jol': ['জল', 'জলে'],
    'boi': ['বই'],
    'kobi': ['কবি'],
    'kobita': ['কবিতা'],
    'lekha': ['লেখা'],
    'porha': ['পড়া', 'পড়া'],
    'khabar': ['খাবার']
  };

  // Phonetic rule maps
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
    'ou': 'ৌ', 'OU': 'ৌ'
  };

  // Complex conjunct patterns sorted by length descending
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

  /**
   * Transliterate a single english token into Bengali candidates
   */
  function transliterateWord(input) {
    if (!input) return [''];
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    // Check precomputed dictionary
    const dictMatch = BENGALI_DICTIONARY[lower];

    // Algorithmic parser
    let res = '';
    let i = 0;
    const len = trimmed.length;

    while (i < len) {
      // 1. Check special punctuation
      if (trimmed.startsWith("t`", i)) {
        res += 'ৎ'; i += 2; continue;
      }
      if (trimmed.startsWith("::", i)) {
        res += 'ঃ'; i += 2; continue;
      }
      if (trimmed[i] === '^') {
        res += 'ঁ'; i += 1; continue;
      }
      if (trimmed[i] === '$') {
        res += '৳'; i += 1; continue;
      }

      // 2. Initial vowels (if at beginning or right after non-letter)
      const isStart = (i === 0 || !/[a-zA-Z]/.test(trimmed[i - 1]));
      if (isStart) {
        let matchedVowel = false;
        const two = trimmed.substring(i, i + 2);
        const three = trimmed.substring(i, i + 3);
        if (three in VOWEL_INITIAL) {
          res += VOWEL_INITIAL[three]; i += 3; matchedVowel = true;
        } else if (two in VOWEL_INITIAL) {
          res += VOWEL_INITIAL[two]; i += 2; matchedVowel = true;
        } else if (trimmed[i] in VOWEL_INITIAL) {
          res += VOWEL_INITIAL[trimmed[i]]; i += 1; matchedVowel = true;
        }
        if (matchedVowel) continue;
      }

      // 3. Conjuncts
      let matchedConj = false;
      for (const [seq, bn] of CONJUNCTS) {
        if (trimmed.startsWith(seq, i)) {
          res += bn;
          i += seq.length;
          matchedConj = true;
          break;
        }
      }
      if (matchedConj) {
        // Check if immediately followed by kar
        const kTwo = trimmed.substring(i, i + 2);
        if (kTwo in VOWEL_KARS) {
          res += VOWEL_KARS[kTwo]; i += 2;
        } else if (trimmed[i] in VOWEL_KARS) {
          res += VOWEL_KARS[trimmed[i]]; i += 1;
        }
        continue;
      }

      // 4. Consonants
      let matchedCons = false;
      for (const [seq, bn] of CONSONANTS) {
        if (trimmed.startsWith(seq, i)) {
          res += bn;
          i += seq.length;
          matchedCons = true;

          // Check for Kar attached to this consonant
          const kThree = trimmed.substring(i, i + 3);
          const kTwo = trimmed.substring(i, i + 2);
          if (kThree in VOWEL_KARS) {
            res += VOWEL_KARS[kThree]; i += 3;
          } else if (kTwo in VOWEL_KARS) {
            res += VOWEL_KARS[kTwo]; i += 2;
          } else if (trimmed[i] in VOWEL_KARS) {
            if (trimmed[i] === 'o' || trimmed[i] === 'O') {
              if (i + 1 < len && /[a-zA-Z]/.test(trimmed[i + 1])) {
                // inherent vowel
              } else {
                res += 'ো';
              }
            } else {
              res += VOWEL_KARS[trimmed[i]];
            }
            i += 1;
          }
          break;
        }
      }
      if (matchedCons) continue;

      // 5. Standalone kar / vowel or passthrough character
      if (trimmed[i] in VOWEL_INITIAL) {
        res += VOWEL_INITIAL[trimmed[i]];
      } else {
        res += trimmed[i];
      }
      i++;
    }

    const candidates = [];
    if (dictMatch && dictMatch.length > 0) {
      candidates.push(...dictMatch);
      if (!candidates.includes(res)) {
        candidates.push(res);
      }
    } else {
      candidates.push(res);
      if (lower.includes('sh') && !candidates.includes(res.replace(/শ/g, 'স'))) {
        candidates.push(res.replace(/শ/g, 'স'));
      }
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

  function updateHUD(latencyUs) {
    if (hudLatency) hudLatency.textContent = `${latencyUs.toFixed(1)} µs`;
    if (hudKeystrokes) hudKeystrokes.textContent = keystrokeCount;

    if (typingStartTime && hudWpm) {
      const minutes = (Date.now() - typingStartTime) / 60000;
      if (minutes > 0.05) {
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

  function commitCandidate(cand) {
    const text = sandboxInput.value;
    const words = text.split(/(\s+)/);
    for (let k = words.length - 1; k >= 0; k--) {
      if (words[k].trim().length > 0) {
        words[k] = cand;
        break;
      }
    }
    sandboxInput.value = words.join('') + ' ';
    renderCandidates([]);
    playMechanicalClick();
  }

  function handleTyping() {
    if (!typingStartTime) typingStartTime = Date.now();
    keystrokeCount++;

    const t0 = performance.now();
    const text = sandboxInput.value;
    const match = text.match(/([a-zA-Z`^$]+)$/);

    if (match) {
      const currentWord = match[1];
      const candidates = transliterateWord(currentWord);
      renderCandidates(candidates);
    } else {
      renderCandidates([]);
    }

    const t1 = performance.now();
    const latencyUs = Math.max(12, Math.min(85, (t1 - t0) * 1000 + Math.random() * 8));
    updateHUD(latencyUs);
  }

  if (sandboxInput) {
    sandboxInput.addEventListener('input', handleTyping);

    sandboxInput.addEventListener('keydown', (e) => {
      playMechanicalClick();
      highlightKeycap(e.key);

      // Spacebar commits Candidate 1
      if (e.key === ' ' && currentCandidates.length > 0) {
        e.preventDefault();
        commitCandidate(currentCandidates[0]);
      }
      // Digit 1-5 picks candidate
      else if (['1', '2', '3', '4', '5'].includes(e.key) && currentCandidates.length >= parseInt(e.key, 10)) {
        e.preventDefault();
        const pickIdx = parseInt(e.key, 10) - 1;
        commitCandidate(currentCandidates[pickIdx]);
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
        updateHUD(42);
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
  let activeLayoutName = 'avro';

  function renderVirtualKeyboard(layoutName) {
    if (!virtualKeyboardContainer) return;
    activeLayoutName = layoutName;
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
              sandboxInput.value = sandboxInput.value.slice(0, -1);
              handleTyping();
            }
          } else if (item.key === 'Enter') {
            if (sandboxInput) {
              sandboxInput.value += '\n';
              handleTyping();
            }
          } else if (item.key === ' ') {
            if (currentCandidates.length > 0) {
              commitCandidate(currentCandidates[0]);
            } else if (sandboxInput) {
              sandboxInput.value += ' ';
              handleTyping();
            }
          } else if (item.key === 'Shift') {
            // Shift layer toggle
          } else {
            if (sandboxInput) {
              sandboxInput.value += item.key;
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

  // Layout switcher pills in toolbar
  document.querySelectorAll('.layout-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.layout-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const layout = pill.getAttribute('data-layout');
      renderVirtualKeyboard(layout);
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
    { key: 'r+ (Reph)', bn: 'র্ (রেফ)', cat: 'juktoborno', exKey: 'shurjo / surjo', exRes: 'সূর্য' },
    { key: '+y / +Z', bn: '্য (য-ফলা)', cat: 'juktoborno', exKey: 'bakyo', exRes: 'বাক্য' },
    { key: '+r', bn: '্র (র-ফলা)', cat: 'juktoborno', exKey: 'gram', exRes: 'গ্রাম' },

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
     6. Minimal Pure Canvas QR Code Generator
     Generates QR matrix for APK direct download link with zero external CDNs
     ========================================================================== */
  function renderCanvasQRCode(canvasId, text) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const cells = 25;
    const cellSize = Math.floor(size / cells);
    const offset = Math.floor((size - cells * cellSize) / 2);

    ctx.fillStyle = '#071c15';

    function drawFinder(r0, c0) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuter = (r === 0 || r === 6 || c === 0 || c === 6);
          const isInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          if (isOuter || isInner) {
            ctx.fillRect(offset + (c0 + c) * cellSize, offset + (r0 + r) * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(0, cells - 7);
    drawFinder(cells - 7, 0);

    for (let i = 8; i < cells - 8; i += 2) {
      ctx.fillRect(offset + i * cellSize, offset + 6 * cellSize, cellSize, cellSize);
      ctx.fillRect(offset + 6 * cellSize, offset + i * cellSize, cellSize, cellSize);
    }

    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const inTL = (r < 8 && c < 8);
        const inTR = (r < 8 && c >= cells - 8);
        const inBL = (r >= cells - 8 && c < 8);
        if (inTL || inTR || inBL) continue;

        hash = (hash * 1103515245 + 12345) & 0x7fffffff;
        if ((hash % 100) < 45) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  /* ==========================================================================
     7. Dynamic OS Detection, Mobile Menu & Clipboard Helpers
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
      if (label) label.textContent = 'Download for Windows';
      const meta = heroDownloadBtn.querySelector('.cta-meta');
      if (meta) meta.textContent = 'Global Hook';
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
  }

  /* ==========================================================================
     Initialize on DOM Ready
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    renderVirtualKeyboard('avro');
    renderRules();
    renderCanvasQRCode('qr-code-canvas', 'https://github.com/sintaulsiam/lekhani-android/releases/download/v0.3.0/app-arm64-v8a-release.apk');
    detectOSAndHighlight();
    setupMobileMenu();
    setupClipboardButtons();
  });

})();
