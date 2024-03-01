import { textsAreComparable } from './textsAreComparable';

describe('textsAreComparable', () => {
  it('should return true for mostly similar texts', () => {
    const text1 =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nulla nibh, interdum eu enim sed, suscipit lobortis metus. Nulla facilisi. Phasellus at lorem fermentum, auctor tellus viverra, vulputate odio. Suspendisse et iaculis massa. Cras at lorem vitae sem ornare laoreet a vitae lectus. Phasellus dictum nunc ut purus aliquam molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam cursus sagittis accumsan. Nunc sem nisi, tempus sed elit iaculis, feugiat volutpat ipsum. Aliquam ut ipsum ligula. Mauris eu orci eget enim commodo varius.';
    const text2 =
      'Lorem ipsum dolor sit amet. Nulla nulla nibh, interdum eu enim sed, suscipit lobortis metus. Nulla facilisi. Phasellus at lorem fermentum, auctor tellus viverra, vulputate odio. Suspendisse et iaculis massa. Nam sagittis nisi nisi, eget viverra magna imperdiet sit amet. Cras at lorem vitae sem ornare laoreet a vitae lectus. Phasellus dictum nunc ut purus aliquam molestie. Etiam cursus sagittis accumsan. Nunc sem nisi, tempus sed elit iaculis, feugiat volutpat ipsum. Aliquam ut ipsum ligula. Mauris eu orci eget enim commodo varius.';
    expect(textsAreComparable(text1, text2)).toBe(true);
  });

  it('should return false for mostly different texts', () => {
    const text1 =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nulla nibh, interdum eu enim sed, suscipit lobortis metus. Nulla facilisi. Phasellus at lorem fermentum, auctor tellus viverra, vulputate odio. Suspendisse et iaculis massa. Cras at lorem vitae sem ornare laoreet a vitae lectus. Phasellus dictum nunc ut purus aliquam molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam cursus sagittis accumsan. Nunc sem nisi, tempus sed elit iaculis, feugiat volutpat ipsum. Aliquam ut ipsum ligula. Mauris eu orci eget enim commodo varius.';
    const text2 =
      'Praesent pretium ante justo. Etiam eu purus lorem. Aliquam sem purus, maximus varius metus sed, blandit laoreet enim. Pellentesque pulvinar ornare metus, vel facilisis leo auctor id. Nulla facilisi. Ut elementum posuere consequat. Sed nec iaculis tortor, ac volutpat nisl. Aliquam ac neque nec mauris vulputate imperdiet. Nullam vitae quam vulputate, maximus velit at, finibus lectus. Nam iaculis justo sit amet tempus lacinia. Curabitur urna dolor, euismod in efficitur a, faucibus non neque.';
    expect(textsAreComparable(text1, text2)).toBe(false);
  });

  it('should return true if the first text is empty', () => {
    expect(textsAreComparable('     ', 'Hello world')).toBe(true);
  });

  it('should return true if the second text is empty', () => {
    expect(textsAreComparable('Hello world', '   ')).toBe(true);
  });
});
