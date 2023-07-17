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

export const MOCK_PATIENTS_AGE_RATIO_DATA = [
  { name: '5/18', count: 292 },
  { name: '19/30', count: 359 },
  { name: '31/45', count: 412 },
  { name: '46+', count: 189 },
]
