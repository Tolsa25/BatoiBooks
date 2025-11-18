const funciones = require('../scripts/functions');

describe('Funciones sobre la frase "Una frase para probar"', () => {
    const frase = 'Una frase para probar';
    const frase2 = 'La ruta nos aporto otro paso natural';

    test('letters devuelve 21', () => {
      expect(funciones.letters(frase)).toBe(21);
    });
    test('words devuelve 4', () => {
      expect(funciones.words(frase)).toBe(4);
    });
    test('upperString devuelve UNA FRASE PARA PROBAR', () => {
      expect(funciones.upperString(frase)).toBe('UNA FRASE PARA PROBAR');
    });
    test('titleString devuelve Una Frase Para Probar ', () => {
      expect(funciones.titleString(frase)).toBe('Una Frase Para Probar');
    });
    test('backwardsLetters devuelve raborp arap esarf anU', () => {
      expect(funciones.backwardsLetters(frase)).toBe('raborp arap esarf anU');
    });
    test('backwardsWords devuelve probar para frase Una', () => {
      expect(funciones.backwardsWords(frase)).toBe('probar para frase Una');
    });
    test('palindrome sobre "Una frase para probar"  devuelve FALSE', () => {
      expect(funciones.palindrome(frase)).toBe(false);
    });
    test('palindrome sobre "La ruta nos aporto otro paso natural"  devuelve TRUE', () => {
      expect(funciones.palindrome(frase2)).toBe(true);
    });
});
