import { X_AXIS_DAY_NAMES } from '@config'

export const MOCK_YEAR_DATA = [
  {
    name: 'jan',
    date: '22-01',
    revenu: 650000,
  },
  {
    name: 'fev',
    date: '22-02',
    revenu: 550000,
  },
  {
    name: 'mar',
    date: '22-03',
    revenu: 880000,
  },
  {
    name: 'avr',
    date: '22-04',
    revenu: 490000,
  },
  {
    name: 'mai',
    date: '22-05',
    revenu: 950000,
  },
  {
    name: 'jun',
    date: '22-06',
    revenu: 1430000,
  },
  {
    name: 'jul',
    date: '22-07',
    revenu: 1030000,
  },
  {
    name: 'aou',
    date: '22-08',
    revenu: 430000,
  },
  {
    name: 'sep',
    date: '22-09',
    revenu: 830000,
  },
  {
    name: 'oct',
    date: '22-10',
    revenu: 1130000,
  },
  {
    name: 'nov',
    date: '22-11',
    revenu: 330000,
  },
  {
    name: 'dec',
    date: '22-12',
    revenu: 530000,
  },
  {
    name: 'jan',
    date: '23-01',
    revenu: 650000,
  },
  {
    name: 'feb',
    date: '23-02',
    revenu: 450000,
  },
  {
    name: 'mar',
    date: '22-03',
    revenu: 895000,
  },
]

export const MOCK_MONTH_DATA = [
  { name: '01', label: X_AXIS_DAY_NAMES[1], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '02', label: X_AXIS_DAY_NAMES[2], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '03', label: X_AXIS_DAY_NAMES[3], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '04', label: X_AXIS_DAY_NAMES[4], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '05', label: X_AXIS_DAY_NAMES[5], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '06', label: X_AXIS_DAY_NAMES[6], revenu: 0 },
  { name: '07', label: X_AXIS_DAY_NAMES[7], revenu: 0 },
  { name: '08', label: X_AXIS_DAY_NAMES[8], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '09', label: X_AXIS_DAY_NAMES[9], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '10', label: X_AXIS_DAY_NAMES[10], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '11', label: X_AXIS_DAY_NAMES[11], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '12', label: X_AXIS_DAY_NAMES[12], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '13', label: X_AXIS_DAY_NAMES[13], revenu: 0 },
  { name: '14', label: X_AXIS_DAY_NAMES[14], revenu: 0 },
  { name: '15', label: X_AXIS_DAY_NAMES[15], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '16', label: X_AXIS_DAY_NAMES[16], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '17', label: X_AXIS_DAY_NAMES[17], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '18', label: X_AXIS_DAY_NAMES[18], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '19', label: X_AXIS_DAY_NAMES[19], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '20', label: X_AXIS_DAY_NAMES[20], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '21', label: X_AXIS_DAY_NAMES[21], revenu: 0 },
  { name: '22', label: X_AXIS_DAY_NAMES[22], revenu: 0 },
  { name: '23', label: X_AXIS_DAY_NAMES[23], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '24', label: X_AXIS_DAY_NAMES[24], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '25', label: X_AXIS_DAY_NAMES[25], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '26', label: X_AXIS_DAY_NAMES[26], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '27', label: X_AXIS_DAY_NAMES[27], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '28', label: X_AXIS_DAY_NAMES[28], revenu: 0 },
  { name: '29', label: X_AXIS_DAY_NAMES[29], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
  { name: '30', label: X_AXIS_DAY_NAMES[30], revenu: Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000 },
]

export const PAYMENT_CATEGORY_DATA = [
  { name: 'Douleur', value: 493500 },
  { name: 'Fonctionnel', value: 1683500 },
  { name: 'Esthetique', value: 933500 },
  { name: 'Autre', value: 983500 },
]

export const MOCK_PATIENTS_AGE_RATIO_DATA = [
  { name: '4-18', count: 292 },
  { name: '19-30', count: 359 },
  { name: '31-45', count: 412 },
  { name: '46+', count: 189 },
]

export const MOCK_PATIENTS_COUNT_DATA = [
  { name: '1', enAttente: 98, fini: 93 },
  { name: '2', enAttente: 77, fini: 66 },
  { name: '3', enAttente: 56, fini: 45 },
  { name: '4', enAttente: 64, fini: 60 },
  { name: '5', enAttente: 89, fini: 85 },
  { name: '6', enAttente: 47, fini: 29 },
  { name: '7', enAttente: 45, fini: 33 },
  { name: '8', enAttente: 83, fini: 52 },
  { name: '9', enAttente: 23, fini: 21 },
  { name: '10', enAttente: 23, fini: 21 },
  { name: '12', enAttente: 45, fini: 43 },
  { name: '13', enAttente: 90, fini: 74 },
  { name: '14', enAttente: 45, fini: 41 },
  { name: '15', enAttente: 32, fini: 27 },
  { name: '16', enAttente: 54, fini: 46 },
  { name: '17', enAttente: 26, fini: 19 },
  { name: '18', enAttente: 53, fini: 25 },
  { name: '19', enAttente: 66, fini: 62 },
  { name: '20', enAttente: 86, fini: 72 },
  { name: '21', enAttente: 52, fini: 42 },
  { name: '22', enAttente: 42, fini: 34 },
  { name: '23', enAttente: 25, fini: 21 },
  { name: '24', enAttente: 67, fini: 51 },
  { name: '25', enAttente: 90, fini: 88 },
  { name: '26', enAttente: 94, fini: 77 },
  { name: '27', enAttente: 71, fini: 75 },
  { name: '28', enAttente: 76, fini: 62 },
  { name: '29', enAttente: 95, fini: 93 },
  { name: '30', enAttente: 22, fini: 20 },
]

export const WORK_LOAD_DATA = [
  { week: '1', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '2', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '3', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '4', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '5', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '6', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '7', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '8', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '9', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '10', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '11', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '12', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '13', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '14', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '15', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '16', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '17', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '18', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '19', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '20', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '21', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '22', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '23', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '24', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '25', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '26', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '27', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '28', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '29', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '30', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '31', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '32', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '33', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '34', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '35', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '36', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '37', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '38', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '39', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '40', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '41', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '42', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '43', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '44', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '45', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '46', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '47', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '48', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '49', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '50', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '51', index: 1, value: Math.floor(Math.random() * 100) },
  { week: '52', index: 1, value: Math.floor(Math.random() * 100) },
]

export const SUGGESTIONS = [
  'Dents',
  'Carie',
  'Plombage',
  'Extraction',
  'Anesthésie',
  'Gencive',
  'Rendez-vous',
  "Préparez le dossier du patient, s'il vous plaît.",
  "Assurez-vous que l'équipement est prêt et fonctionne correctement.",
  'Veuillez stériliser les instruments pour le prochain patient.',
  "Avez-vous vérifié les rendez-vous suivants dans l'agenda ?",
  "N'oubliez pas de noter les détails importants de la visite précédente.",
  "Assurez-vous que la salle d'attente est propre et accueillante.",
  'Veuillez informer le dentiste que le prochain patient est prêt à être vu.',
  'Avez-vous préparé les rayons X ou les autres examens requis ?',
  "Vérifiez les informations d'assurance du patient avant leur arrivée.",
  "N'oubliez pas de mettre à jour le statut du patient dans le système informatique.",
  "Assurez-vous de désinfecter la salle d'examen.",
  'Prenez les prochains rendez-vous nécessaires.',
  "Pensez à facturer les traitements effectués aujourd'hui.",
  'Rappelez-moi de préparer les documents pour le patient suivant.',
  'Vérifiez si des fournitures médicales doivent être réapprovisionnées.',
  "N'oubliez pas de mettre à jour le dossier du patient.",
  'Si le patient a besoin de médicaments, assurez-vous de les prescrire.',
]
