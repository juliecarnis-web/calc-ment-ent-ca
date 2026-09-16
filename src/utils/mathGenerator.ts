export function getRandomInt(min: number, max: number): number {
  const cMin = Math.ceil(min);
  const cMax = Math.floor(max);
  if (cMin > cMax) {
    return Math.floor(Math.random() * (cMin - cMax + 1)) + cMax;
  }
  return Math.floor(Math.random() * (cMax - cMin + 1)) + cMin;
}

export function fmtNum(n: number | string): string {
  if (n === null || n === undefined) return '';
  const num = typeof n === 'number' ? Math.round(n * 10000) / 10000 : parseFloat(n);
  if (isNaN(num)) return n.toString();

  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join(',');
}

export function getOpSym(op: string): string {
  if (op === '*') return 'x';
  if (op === '/') return '÷';
  return op;
}

/**
 * CM2 Rounding Rules for Estimation:
 * - Decimal part <= 0.4 -> Round down to integer
 * - Decimal part > 0.4 and <= 0.7 -> Round to half-integer (X,5)
 * - Decimal part > 0.7 -> Round up to next integer (X+1)
 */
export function roundCM2Estimation(val: number): number {
  const intPart = Math.floor(val);
  const decPart = Math.round((val - intPart) * 10) / 10;

  if (decPart <= 0.4) {
    return intPart;
  } else if (decPart <= 0.7) {
    return Math.round((intPart + 0.5) * 10) / 10;
  } else {
    return intPart + 1;
  }
}

export interface GeneratedProblem {
  n1: number;
  n2: number;
  op: '+' | '-' | 'x' | '÷';
  ans: number;
  expected: number;
  displayHtml: string;
  subtype: 'double' | 'moitie' | null;
  roundedN1?: number;
  roundedN2?: number;
}

// Rolling history to avoid duplicate consecutive problems
const recentHistory: string[] = [];
const MAX_HISTORY_SIZE = 40;

function isRecentlyGenerated(key: string): boolean {
  return recentHistory.includes(key);
}

function pushToHistory(key: string) {
  recentHistory.push(key);
  if (recentHistory.length > MAX_HISTORY_SIZE) {
    recentHistory.shift();
  }
}

export function generateProblem(
  skill: string,
  limit: number,
  format: 'classique' | 'boulier' | 'blocs'
): GeneratedProblem {
  let result: GeneratedProblem | null = null;
  let attempts = 0;

  // Try generating a non-repetitive problem up to 25 times
  while (attempts < 25) {
    attempts++;
    const candidate = generateSingleProblemAttempt(skill, limit, format);
    const key = `${skill}:${limit}:${candidate.n1}:${candidate.op}:${candidate.n2}`;

    if (!isRecentlyGenerated(key) || attempts >= 25) {
      pushToHistory(key);
      result = candidate;
      break;
    }
  }

  return result || generateSingleProblemAttempt(skill, limit, format);
}

function generateSingleProblemAttempt(
  skill: string,
  limit: number,
  format: 'classique' | 'boulier' | 'blocs'
): GeneratedProblem {
  const max = Math.max(10, limit);
  const minBase = max >= 100 ? Math.floor(max / 10) : 1;

  let op: '+' | '-' | 'x' | '÷' = '+';
  let n1 = 0;
  let n2 = 0;
  let ans = 0;
  let expected = 0;
  let subtype: 'double' | 'moitie' | null = null;
  let roundedN1: number | undefined = undefined;
  let roundedN2: number | undefined = undefined;

  switch (skill) {
    case 'cp_add_sub_5':
      op = Math.random() > 0.5 ? '+' : '-';
      n2 = 5;
      if (op === '+') {
        n1 = getRandomInt(0, Math.max(0, max - n2));
      } else {
        n1 = getRandomInt(n2, Math.max(n2, max));
      }
      ans = op === '+' ? n1 + n2 : n1 - n2;
      expected = ans;
      break;

    case 'cp_add_8_9':
      op = '+';
      n2 = getRandomInt(8, 9);
      n1 = getRandomInt(0, Math.max(0, max - n2));
      ans = n1 + n2;
      expected = ans;
      break;

    case 'cp_somme_simple':
      op = '+';
      n1 = getRandomInt(1, Math.min(9, max));
      n2 = getRandomInt(1, Math.max(1, Math.min(max - n1, max)));
      if (Math.random() > 0.5) [n1, n2] = [n2, n1];
      ans = n1 + n2;
      expected = ans;
      break;

    case 'cp_tables_add_sub':
    case 'ce1_tables_add_sub':
    case 'ce2_tables_add_sub':
    case 'cm1_tables_add_sub':
    case 'cm2_tables_add_sub': {
      if (skill === 'cp_tables_add_sub') op = '+';
      else op = Math.random() > 0.5 ? '+' : '-';

      const maxNum = Math.min(Math.floor(max / 2), 10);
      n1 = getRandomInt(1, Math.max(1, maxNum));
      n2 = getRandomInt(1, Math.max(1, maxNum));

      if (op === '+') {
        ans = n1 + n2;
      } else {
        ans = n1;
        n1 = ans + n2;
      }
      expected = ans;
      break;
    }

    case 'ce1_add_sub_10_100':
    case 'ce2_add_sub_10_100_1000':
    case 'cm1_add_sub_10k_100k':
    case 'cm2_add_sub_10k_100k_1m': {
      op = Math.random() > 0.5 ? '+' : '-';
      const steps = [10, 100, 1000, 10000, 100000, 1000000];
      let allowed = steps.filter((s) => s <= max);
      if (allowed.length === 0) allowed = [10];

      n2 = allowed[Math.floor(Math.random() * allowed.length)];
      if (op === '+') {
        n1 = getRandomInt(minBase, Math.max(minBase, max - n2));
      } else {
        n1 = getRandomInt(n2, Math.max(n2, max));
      }
      ans = op === '+' ? n1 + n2 : n1 - n2;
      expected = ans;
      break;
    }

    case 'ce1_add_sub_8_9_fin':
    case 'ce2_add_sub_8_9_fin':
    case 'cm1_add_sub_8_9_fin':
    case 'cm2_add_sub_8_9_fin': {
      op = Math.random() > 0.5 ? '+' : '-';
      let maxBase = Math.floor(max / 10) - 1;
      if (maxBase < 0) maxBase = 0;
      const base = getRandomInt(0, Math.min(maxBase, 10000));
      n2 = base * 10 + (Math.random() > 0.5 ? 8 : 9);
      if (n2 > max) n2 = 8;

      if (op === '+') {
        n1 = getRandomInt(minBase, Math.max(minBase, max - n2));
      } else {
        n1 = getRandomInt(n2, Math.max(n2, max));
      }
      ans = op === '+' ? n1 + n2 : n1 - n2;
      expected = ans;
      break;
    }

    case 'cp_comp_limit':
    case 'ce1_comp_limit':
    case 'ce2_comp_limit':
    case 'cm1_comp_limit':
    case 'cm2_comp_limit': {
      op = '+';
      ans = max;
      let step = 1;
      if (ans >= 100 && Math.random() > 0.3) step = 10;
      if (ans >= 1000 && Math.random() > 0.5) step = 100;
      if (ans >= 10000 && Math.random() > 0.5) step = 1000;

      const stepUnits = Math.max(1, Math.floor((ans - 1) / step));
      n1 = getRandomInt(1, stepUnits) * step;
      n2 = ans - n1;
      expected = n2;
      break;
    }

    case 'cp_doubles_moities':
    case 'ce1_doubles_moities':
    case 'ce2_doubles_moities':
    case 'cm1_doubles_moities':
    case 'cm2_doubles_moities': {
      const isDouble = Math.random() > 0.5;
      subtype = isDouble ? 'double' : 'moitie';
      op = isDouble ? 'x' : '÷';
      if (isDouble) {
        n1 = getRandomInt(1, Math.max(1, Math.floor(max / 2)));
        ans = n1 * 2;
      } else {
        n1 = getRandomInt(1, Math.max(1, Math.floor(max / 2))) * 2;
        ans = n1 / 2;
      }
      expected = ans;
      break;
    }

    case 'cp_mult_tables': {
      op = 'x';
      const cpOpts = [1, 2, 4, 10];
      n2 = cpOpts[Math.floor(Math.random() * cpOpts.length)];
      let maxN1 = Math.floor(max / n2);
      if (maxN1 < 1) maxN1 = 1;
      n1 = getRandomInt(1, Math.min(10, maxN1));
      if (Math.random() > 0.5) [n1, n2] = [n2, n1];
      ans = n1 * n2;
      expected = ans;
      break;
    }

    case 'ce1_mult_1_5':
    case 'ce2_mult_1_5':
    case 'ce2_mult_6_10':
    case 'cm1_mult_1_10':
    case 'cm1_mult_11_12':
    case 'cm2_mult_1_12': {
      op = 'x';
      if (skill.endsWith('mult_1_5')) n2 = getRandomInt(1, 5);
      else if (skill.endsWith('mult_6_10')) n2 = getRandomInt(6, 10);
      else if (skill.endsWith('mult_1_10')) n2 = getRandomInt(1, 10);
      else if (skill.endsWith('mult_11_12')) n2 = getRandomInt(11, 12);
      else if (skill.endsWith('mult_1_12')) n2 = getRandomInt(1, 12);

      let maxN1 = Math.floor(max / n2);
      if (maxN1 < 1) maxN1 = 1;
      n1 = getRandomInt(1, Math.min(maxN1, 100));
      if (Math.random() > 0.5) [n1, n2] = [n2, n1];
      ans = n1 * n2;
      expected = ans;
      break;
    }

    case 'cp_mult_10':
    case 'ce1_mult_10_100':
    case 'ce2_mult_10_100_1000':
    case 'cm1_mult_1k_10k':
    case 'cm2_mult_10k_100k_1m': {
      op = 'x';
      let mOpts = [10];
      if (skill.endsWith('mult_10_100')) mOpts = [10, 100];
      if (skill.endsWith('mult_10_100_1000')) mOpts = [10, 100, 1000];
      if (skill.endsWith('mult_1k_10k')) mOpts = [1000, 10000];
      if (skill.endsWith('mult_10k_100k_1m')) mOpts = [10000, 100000, 1000000];

      let vOpts = mOpts.filter((m) => m <= max);
      if (vOpts.length === 0) vOpts = [10];
      n2 = vOpts[Math.floor(Math.random() * vOpts.length)];
      let possibleN1 = Math.floor(max / n2);
      if (possibleN1 < 1) possibleN1 = 1;
      n1 = getRandomInt(2, possibleN1);
      if (Math.random() > 0.5) [n1, n2] = [n2, n1];
      ans = n1 * n2;
      expected = ans;
      break;
    }

    case 'ce1_mult_end_0':
    case 'ce2_mult_end_0':
    case 'cm1_mult_end_0':
    case 'cm2_mult_end_0': {
      op = 'x';
      let mag = Math.floor(Math.log10(max)) - 1;
      if (mag < 1) mag = 1;
      let z = getRandomInt(1, Math.max(1, mag - 1));
      n2 = getRandomInt(1, 9) * Math.pow(10, z);
      if (n2 > max) n2 = 10;
      n1 = getRandomInt(2, Math.max(2, Math.floor(max / n2)));
      if (Math.random() > 0.5) [n1, n2] = [n2, n1];
      ans = n1 * n2;
      expected = ans;
      break;
    }

    case 'ce1_mult_decomp':
    case 'ce2_mult_decomp':
    case 'cm1_mult_decomp':
    case 'cm2_mult_decomp': {
      op = 'x';
      n2 = getRandomInt(2, Math.min(12, Math.floor(Math.sqrt(max))));
      n1 = getRandomInt(11, Math.max(11, Math.floor(max / n2)));
      ans = n1 * n2;
      expected = ans;
      break;
    }

    // =========================================================================
    // COMPÉTENCES CM2 (TOUTES BORNÉES PAR LE CHAMP NUMÉRIQUE L'UTILISATEUR)
    // =========================================================================

    // 1. Ajouter / soustraire 0,1 ou 0,01 à un décimal
    case 'cm2_dec_add_sub_01': {
      op = Math.random() > 0.5 ? '+' : '-';
      n2 = Math.random() > 0.5 ? 0.1 : 0.01;
      const upperInt = Math.max(1, Math.min(max - 1, 999999));
      const baseInt = getRandomInt(1, upperInt);
      // In blocks mode, base 10 blocks can only represent whole numbers, so n1 MUST be an integer.
      const decPart = format === 'blocs' ? 0 : (n2 === 0.1 ? getRandomInt(1, 9) / 10 : getRandomInt(1, 99) / 100);
      n1 = Math.round((baseInt + decPart) * 100) / 100;

      if (op === '-') {
        if (n1 <= n2) n1 = Math.round((n1 + 5) * 100) / 100;
        ans = Math.round((n1 - n2) * 100) / 100;
      } else {
        ans = Math.round((n1 + n2) * 100) / 100;
      }
      expected = ans;
      break;
    }

    // 2. Fractions décimales : passer à l'écriture décimale
    case 'cm2_fractions_dec': {
      let possibleDenoms = [10];
      if (limit >= 100) possibleDenoms.push(100);
      if (limit >= 1000) possibleDenoms.push(1000);
      if (limit >= 10000) possibleDenoms.push(10000);

      const chosenDenom = possibleDenoms[possibleDenoms.length - 1];
      n2 = chosenDenom;

      if (n2 === 10) {
        n1 = Math.random() > 0.3 ? getRandomInt(1, 9) : getRandomInt(11, 29);
      } else if (n2 === 100) {
        n1 = Math.random() > 0.3 ? getRandomInt(1, 99) : getRandomInt(101, 299);
      } else if (n2 === 1000) {
        n1 = Math.random() > 0.3 ? getRandomInt(1, 999) : getRandomInt(1001, 2999);
      } else {
        n1 = getRandomInt(1, n2 - 1);
      }

      op = '÷';
      ans = Math.round((n1 / n2) * 10000) / 10000;
      expected = ans;
      break;
    }

    // 3. Ajouter, soustraire 0,9 ou 1,9 à un décimal
    case 'cm2_dec_add_sub_09_19': {
      op = Math.random() > 0.5 ? '+' : '-';
      n2 = Math.random() > 0.5 ? 0.9 : 1.9;
      const upperInt = Math.max(2, Math.min(max - 2, 999999));
      const baseInt = getRandomInt(2, upperInt);
      const decPart = format === 'blocs' ? 0 : getRandomInt(1, 9) / 10;
      n1 = Math.round((baseInt + decPart) * 10) / 10;

      if (op === '-') {
        if (n1 <= n2) n1 = Math.round((n1 + 10) * 10) / 10;
        ans = Math.round((n1 - n2) * 10) / 10;
      } else {
        ans = Math.round((n1 + n2) * 10) / 10;
      }
      expected = ans;
      break;
    }

    // 4. Estimation : Ordre de grandeur d'une somme de décimaux (Règles CM2 d'arrondi)
    case 'cm2_estimation_somme': {
      op = '+';
      const halfLimit = Math.max(5, Math.floor(max / 2));
      const int1 = getRandomInt(2, halfLimit);
      const int2 = getRandomInt(2, halfLimit);
      const dec1 = format === 'blocs' ? 0 : getRandomInt(1, 9) / 10;
      const dec2 = getRandomInt(1, 9) / 10;

      n1 = Math.round((int1 + dec1) * 10) / 10;
      n2 = Math.round((int2 + dec2) * 10) / 10;

      // Apply strict CM2 rounding rules:
      // <= 0.4 -> int, 0.5..0.7 -> X,5, >= 0.8 -> int+1
      roundedN1 = roundCM2Estimation(n1);
      roundedN2 = roundCM2Estimation(n2);

      ans = Math.round((roundedN1 + roundedN2) * 10) / 10;
      expected = ans;
      break;
    }

    // 5. Reconnaître les multiples de 2, 3, 5 et 9
    case 'cm2_multiples_2_3_5_9': {
      const divisors = [2, 3, 5, 9];
      n2 = divisors[Math.floor(Math.random() * divisors.length)];
      const isMultiple = Math.random() > 0.5;

      const maxFactor = Math.max(2, Math.floor(max / n2));
      const factor = getRandomInt(1, maxFactor);
      if (isMultiple) {
        n1 = factor * n2;
        ans = 1; // 1 = Oui
      } else {
        n1 = Math.min(max, factor * n2 + getRandomInt(1, n2 - 1));
        ans = (n1 % n2 === 0) ? 1 : 0;
      }
      expected = ans;
      break;
    }

    // 6. Doubles et moitiés de décimaux simples
    case 'cm2_doubles_moities_dec': {
      const isDouble = Math.random() > 0.5;
      subtype = isDouble ? 'double' : 'moitie';
      op = isDouble ? 'x' : '÷';

      if (isDouble) {
        const upperInt = Math.max(1, Math.floor(max / 2));
        const intP = getRandomInt(1, upperInt);
        const decP = format === 'blocs' ? 0 : getRandomInt(1, 9) / 10;
        n1 = Math.round((intP + decP) * 10) / 10;
        ans = Math.round(n1 * 2 * 10) / 10;
      } else {
        const upperInt = Math.max(1, Math.floor(max / 2));
        const intP = getRandomInt(1, upperInt) * 2;
        const decP = format === 'blocs' ? 0 : (Math.random() > 0.5 ? 0.4 : 0.8);
        n1 = Math.round((intP + decP) * 10) / 10;
        ans = Math.round((n1 / 2) * 10) / 10;
      }
      expected = ans;
      break;
    }

    // 7. Diviser par 10, 100, 1000 (décimaux)
    case 'cm2_div_10_100_1000_dec': {
      op = '÷';
      const divs = [10, 100, 1000].filter((d) => d <= max || d === 10);
      n2 = divs[Math.floor(Math.random() * divs.length)];
      const baseInt = getRandomInt(1, Math.min(max, 999999));
      const decP = format === 'blocs' ? 0 : getRandomInt(1, 9) / 10;
      n1 = Math.round((baseInt + decP) * 10) / 10;
      ans = Math.round((n1 / n2) * 10000) / 10000;
      expected = ans;
      break;
    }

    // 8. Multiplier un décimal par 5 ou 50
    case 'cm2_mult_5_50_dec': {
      op = 'x';
      n2 = (limit >= 100 && Math.random() > 0.5) ? 50 : 5;
      const upperInt = Math.max(1, Math.floor(max / n2));
      const baseInt = getRandomInt(1, upperInt);
      const decP = format === 'blocs' ? 0 : ((getRandomInt(1, 9) * 2) / 10);
      n1 = Math.round((baseInt + decP) * 10) / 10;
      ans = Math.round(n1 * n2 * 100) / 100;
      expected = ans;
      break;
    }

    // 9. Produit d'un décimal simple
    case 'cm2_produit_dec_simple': {
      op = 'x';
      n2 = getRandomInt(2, 9);
      const decP = format === 'blocs' ? 0 : (Math.random() > 0.5 ? getRandomInt(1, 9) / 10 : getRandomInt(1, 9) / 100);
      const upperInt = Math.max(0, Math.floor(max / n2) - 1);
      const intP = format === 'blocs' && upperInt === 0 ? getRandomInt(1, 9) : getRandomInt(0, upperInt);
      n1 = Math.round((intP + decP) * 100) / 100;
      ans = Math.round(n1 * n2 * 100) / 100;
      expected = ans;
      break;
    }

    default: {
      op = '+';
      ans = getRandomInt(10, max);
      n1 = getRandomInt(1, ans - 1);
      n2 = ans - n1;
      expected = ans;
    }
  }

  // Generate display HTML string
  let displayHtml = '';
  const htmlSym = `<span class="text-amber-400 mx-1 md:mx-2 font-black">${getOpSym(op)}</span>`;
  const htmlEq = `<span class="text-slate-400 font-black mx-1 md:mx-2">=</span>`;

  if (skill === 'cm2_fractions_dec') {
    displayHtml = `<div class="inline-flex items-center justify-center gap-3 md:gap-4 my-1">
      <div class="inline-flex flex-col items-center justify-center font-black leading-none text-emerald-400 bg-slate-800 px-3.5 py-1.5 rounded-xl border-2 border-emerald-500/50 shadow-md">
        <span class="text-xl md:text-2xl">${n1}</span>
        <div class="w-full h-0.5 bg-emerald-400 my-1 rounded-full"></div>
        <span class="text-xl md:text-2xl">${n2}</span>
      </div>
      <span class="text-slate-300 font-black text-2xl md:text-3xl mx-2">=</span>
    </div>`;
  } else if (skill === 'cm2_estimation_somme') {
    displayHtml = `<div class="flex flex-col items-center">
      <span class="text-[10px] uppercase font-bold text-amber-300 tracking-wider mb-0.5">Ordre de grandeur :</span>
      <div className="flex items-center justify-center">
        ${fmtNum(n1)} ${htmlSym} ${fmtNum(n2)} <span class="text-amber-400 font-black mx-2">≈</span>
      </div>
    </div>`;
  } else if (skill === 'cm2_multiples_2_3_5_9') {
    displayHtml = `<div class="flex flex-col items-center text-center">
      <div className="flex items-center justify-center flex-wrap gap-1 text-base md:text-xl">
        <span class="text-white font-extrabold">${fmtNum(n1)}</span>
        <span class="text-slate-300 font-bold mx-1">multiple de</span>
        <span class="text-emerald-400 font-black">${n2}</span> ?
      </div>
      <span class="text-[11px] font-bold text-amber-300 mt-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 font-mono">
        Tapez 1 = OUI , 0 = NON
      </span>
    </div>`;
  } else if (skill.includes('doubles_moities')) {
    const typeText = subtype === 'double' ? 'Double de' : 'Moitié de';
    if (format === 'classique') {
      displayHtml = `<span class="text-slate-400 mr-2 md:mr-3">${typeText}</span><span class="text-white font-black">${fmtNum(n1)}</span>`;
    } else {
      displayHtml = `<span class="text-slate-400 mr-2 md:mr-3">${typeText}</span><span class="text-slate-400 border-b-4 border-slate-500 pb-1 px-2 font-mono">...</span>`;
    }
  } else if (format === 'classique') {
    if (skill.includes('comp_')) {
      displayHtml = `${fmtNum(n1)} ${htmlSym} <span class="text-emerald-400 font-black">...</span> ${htmlEq} <span class="text-slate-100 font-black ml-1">${fmtNum(ans)}</span>`;
    } else {
      displayHtml = `${fmtNum(n1)} ${htmlSym} ${fmtNum(n2)} ${htmlEq}`;
    }
  } else {
    // Format Boulier / Blocs
    if (skill.includes('comp_')) {
      displayHtml = `<span class="text-slate-400 border-b-4 border-slate-500 pb-1 px-2 font-mono">...</span> ${htmlSym} <span class="text-emerald-400 font-black">...</span> ${htmlEq} <span class="text-slate-100 font-black ml-1">${fmtNum(ans)}</span>`;
    } else {
      displayHtml = `<span class="text-slate-400 border-b-4 border-slate-500 pb-1 px-2 font-mono">...</span> ${htmlSym} ${fmtNum(n2)} ${htmlEq}`;
    }
  }

  return {
    n1,
    n2,
    op,
    ans,
    expected,
    displayHtml,
    subtype,
    roundedN1,
    roundedN2,
  };
}
