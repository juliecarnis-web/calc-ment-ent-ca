import { Level, SkillDefinition } from './types';

export const SKILLS: Record<Level, SkillDefinition[]> = {
  CP: [
    { id: 'cp_add_sub_5', name: 'Ajouter ou soustraire 5' },
    { id: 'cp_tables_add_sub', name: 'Tables d\'additions' },
    { id: 'cp_add_8_9', name: 'Ajouter 8 ou 9' },
    { id: 'cp_comp_limit', name: 'Compléments à 10' },
    { id: 'cp_doubles_moities', name: 'Doubles et moitiés' },
    { id: 'cp_somme_simple', name: 'Somme simple < 10 et < 50' },
    { id: 'cp_mult_tables', name: 'Tables de multiplication (1, 2, 4, 10)' },
    { id: 'cp_mult_10', name: 'Multiplier par 10' }
  ],
  CE1: [
    { id: 'ce1_add_sub_10_100', name: 'Ajouter ou soustraire 10, 100' },
    { id: 'ce1_tables_add_sub', name: 'Tables additions et soustractions' },
    { id: 'ce1_add_sub_8_9_fin', name: '+ ou - de nombres terminant par 8 ou 9' },
    { id: 'ce1_comp_limit', name: 'Compléments à 10, 100' },
    { id: 'ce1_mult_1_5', name: 'Tables de multiplication x1 à x5' },
    { id: 'ce1_doubles_moities', name: 'Doubles et moitiés' },
    { id: 'ce1_mult_10_100', name: 'Multiplier par 10, 100' },
    { id: 'ce1_mult_end_0', name: 'Multiplier par un nombre se terminant par 0' },
    { id: 'ce1_mult_decomp', name: 'Calculer un produit en le décomposant' }
  ],
  CE2: [
    { id: 'ce2_add_sub_10_100_1000', name: 'Ajouter ou soustraire 10, 100, 1000' },
    { id: 'ce2_tables_add_sub', name: 'Consolider tables additions et soustractions' },
    { id: 'ce2_add_sub_8_9_fin', name: '+ ou - de nombres terminant par 8 ou 9' },
    { id: 'ce2_comp_limit', name: 'Compléments à 100, 1000' },
    { id: 'ce2_mult_1_5', name: 'Consolider tables de multiplication x1 à x5' },
    { id: 'ce2_mult_6_10', name: 'Construire tables de multiplication x6 à x10' },
    { id: 'ce2_doubles_moities', name: 'Doubles et moitiés' },
    { id: 'ce2_mult_10_100_1000', name: 'Multiplier par 10, 100, 1000' },
    { id: 'ce2_mult_end_0', name: 'Multiplier par un nombre se terminant par 0' },
    { id: 'ce2_mult_decomp', name: 'Calculer un produit en le décomposant' }
  ],
  CM1: [
    { id: 'cm1_add_sub_10k_100k', name: '+ ou - 10 000, 100 000' },
    { id: 'cm1_tables_add_sub', name: 'Réviser tables additions et soustractions' },
    { id: 'cm1_add_sub_8_9_fin', name: '+ ou - de nombres terminant par 8 ou 9' },
    { id: 'cm1_comp_limit', name: 'Compléments à 10 000, 100 000' },
    { id: 'cm1_mult_1_10', name: 'Consolider tables de multiplication x1 à x10' },
    { id: 'cm1_mult_11_12', name: 'Construire tables de multiplication x11 à x12' },
    { id: 'cm1_doubles_moities', name: 'Doubles et moitiés complexes' },
    { id: 'cm1_mult_1k_10k', name: 'Multiplier par 1 000, 10 000' },
    { id: 'cm1_mult_end_0', name: 'Multiplier par un nombre se terminant par 0' },
    { id: 'cm1_mult_decomp', name: 'Calculer un produit en le décomposant' }
  ],
  CM2: [
    { id: 'cm2_add_sub_10k_100k_1m', name: '+ ou - 10k, 100k, 1 000 000' },
    { id: 'cm2_tables_add_sub', name: 'Réviser tables additions et soustractions' },
    { id: 'cm2_add_sub_8_9_fin', name: '+ ou - de nombres terminant par 8 ou 9' },
    { id: 'cm2_comp_limit', name: 'Compléments à 10k, 100k, 1 000 000' },
    { id: 'cm2_mult_1_12', name: 'Consolider tables de multiplication x1 à x12' },
    { id: 'cm2_doubles_moities', name: 'Doubles et moitiés (Grands nombres)' },
    { id: 'cm2_mult_10k_100k_1m', name: 'Multiplier par 10k, 100k, 1 000 000' },
    { id: 'cm2_mult_end_0', name: 'Multiplier par un nombre se terminant par 0' },
    { id: 'cm2_mult_decomp', name: 'Calculer un produit en le décomposant' },
    { id: 'cm2_dec_add_sub_01', name: 'Ajouter / soustraire 0,1 ou 0,01 à un décimal' },
    { id: 'cm2_fractions_dec', name: 'Fractions usuelles : passer à l’écriture décimale' },
    { id: 'cm2_dec_add_sub_09_19', name: 'Ajouter / soustraire 0,9 ou 1,9 à un décimal' },
    { id: 'cm2_estimation_somme', name: 'Estimation : Ordre de grandeur d’une somme décimale' },
    { id: 'cm2_multiples_2_3_5_9', name: 'Reconnaître les multiples de 2, 3, 5 et 9' },
    { id: 'cm2_doubles_moities_dec', name: 'Doubles et moitiés de décimaux simples' },
    { id: 'cm2_div_10_100_1000_dec', name: 'Diviser par 10, 100, 1000 (décimaux)' },
    { id: 'cm2_mult_5_50_dec', name: 'Multiplier un décimal par 5 ou 50' },
    { id: 'cm2_produit_dec_simple', name: 'Produit d’un décimal simple' }
  ]
};

export const LIMITS_PER_LEVEL: Record<Level, number> = {
  CP: 100,
  CE1: 1000,
  CE2: 10000,
  CM1: 100000,
  CM2: 1000000
};

// All skills allow user differentiation via the numeric limit selector
export const FIXED_LIMIT_SKILLS: string[] = [];
