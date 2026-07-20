import type { AlphabetItem } from '../types/models';

export const alphabetData: AlphabetItem[] = [
  { letter: 'A', word: 'Avião', icon: '✈️' },
  { letter: 'B', word: 'Bola', icon: '⚽' },
  { letter: 'C', word: 'Casa', icon: '🏠' },
  { letter: 'D', word: 'Dado', icon: '🎲' },
  { letter: 'E', word: 'Estrela', icon: '⭐' },
  { letter: 'F', word: 'Flor', icon: '🌸' },
  { letter: 'G', word: 'Gato', icon: '🐱' },
  { letter: 'H', word: 'Helicóptero', icon: '🚁' },
  { letter: 'I', word: 'Igreja', icon: '⛪' },
  { letter: 'J', word: 'Janela', icon: '🪟' },
  { letter: 'K', word: 'Kiwi', icon: '🥝' },
  { letter: 'L', word: 'Leão', icon: '🦁' },
  { letter: 'M', word: 'Maçã', icon: '🍎' },
  { letter: 'N', word: 'Navio', icon: '🚢' },
  { letter: 'O', word: 'Ovo', icon: '🥚' },
  { letter: 'P', word: 'Pato', icon: '🦆' },
  { letter: 'Q', word: 'Queijo', icon: '🧀' },
  { letter: 'R', word: 'Rato', icon: '🐭' },
  { letter: 'S', word: 'Sol', icon: '☀️' },
  { letter: 'T', word: 'Trem', icon: '🚂' },
  { letter: 'U', word: 'Uva', icon: '🍇' },
  { letter: 'V', word: 'Vaca', icon: '🐮' },
  { letter: 'W', word: 'Waffle', icon: '🧇' },
  { letter: 'X', word: 'Xícara', icon: '☕' },
  { letter: 'Y', word: 'Yoga', icon: '🧘' },
  { letter: 'Z', word: 'Zebra', icon: '🦓' },
];

export function getAlphabetItems(): AlphabetItem[] {
  return alphabetData;
}

export function getAlphabetByLetter(letter: string): AlphabetItem | undefined {
  return alphabetData.find(item => item.letter === letter.toUpperCase());
}
