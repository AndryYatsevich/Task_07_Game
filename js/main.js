/**
 * Сделать игру
 * Надо:
 *      todo: Игровое поле
 *      todo: Монстры (они должны ходить, стрелять, умирать)
 *      todo: Бонусы (+hp, +speed)
 *      todo: Возможность стрелять
 */
/**
 * ES6:
 * - Стрелочные функции:
 *      Простая
 *      canvas.addEventListener('click', () => {
 *          console.log('a');
 *      });
 *
 *      Возвращающая значение
 *      _.map([1, 2, 3], (v) => (v * 2)); // [2,4,6]
 *
 *      Декоратор раз
 *      _.filter([1, 'string', 3], (v) => _.isNumber(v));
 *
 *      Декоратор два
 *      canvas.addEventListener('click', (b) => (c) => (d) => {
 *          console.log(b, c, d)
 *      });
 * - const, let
 *      Область видимости - {}. const - неизменна
 *      Не всплывают
 *
 * - spread operator + destructor
 *      Обьектное состояние
 *       function getCoords(point) {
 *          const defaults = {
 *              x: 0,
 *              y: 0,
 *              z: 0
 *          };
 *
 *          return {...defaults, ...point};
 *      }
 *
 *     Переменное состояние
 *     const a = {x: 0, y: 1, z: 3};
 *     let {x = 2, y, z} = a;
 *     const [a, b, c] = [1, 2, 3];
 *
 *     Функциональное состояние
 *       (() => {
 *          function a() {
 *          }
 *
 *          function b() {
 *          }
 *
 *          const canvas = '';
 *
 *          return {
 *              a,
 *              b,
 *              canvas
 *          };
 *      })();
 *
 *      Аргументное состояние
 *      new Shape(...['title', 1, 2, 5, 5]);
 *       b({x: 1, y: 2, z: 3, t: 4});
 *
 *       function b({x, y, z}) {
 *          console.log(x, y, z);
 *      }
 *
 *      Свойственное состояние
 *       // a = 'latitude'
 *       // b = 51.440232
 *       function n(a, b) {
 *          return {
 *              longitude: 41.4314,
 *              [a]: b
 *          };
 *      }
 *
 * - Классы
 *      Наследование
 *       class Shape {
 *          constructor(title, x, y, width, height) {
 *              this.x = x;
 *              this.y = y;
 *              this.title = title;
 *              this.width = width;
 *              this.height = height;
 *          }
 *
 *          getTitle() {
 *              return this.title;
 *          }
 *
 *          render() {
 *              throw Error('unimplemented method');
 *          }
 *
 *          static sayHi() {
 *              console.log('Hi!');
 *          }
 *      }
 *
 *
 *       const s = new Shape();
 *       Shape.sayHi();
 *
 *       class Circle extends Shape {
 *          constructor(title, x, y, radius) {
 *              super(title, x, y, 0, 0);
 *              this.radius = radius;
 *          }
 *
 *          render(ctx) {
 *              ctx.drawCircle(this.x, this.y, this.radius);
 *          }
 *
 *          getRadius() {
 *              return this.radius;
 *          }
 *      }
 * - Шаблоны
 *      console.log(`Сегодня ${day} день месяца`);
 *
 *       function b(arg) {
 *          // return (arg + '').replace(/%s/g, '');
 *          // return (new String(arg)).replace(/%s/g, '');
 *          return `${arg}`.replace(/%s/g, '');
 *      }
 *
 * - Дефольтные значения функций
 *       // b: 'string'
 *       // c: 45
 *       // d: [1,2,3]
 *       function a(b = '', c = 0, d = []) {
 *          return {
 *              b: b.replace(/%s/g, ''),
 *              c: c + 2,
 *              d: _.filter(d, (v) => _.isNumber(v))
 *          };
 *      }
 */

class Main {
    constructor() {

        // создание игры и тп
    }
}

class DrawableObject {

}

class Cell extends DrawableObject {

}

class Static extends DrawableObject {

}

class Barrier extends Static {

}

class Bonus extends Static {

}

class Movable extends DrawableObject {

}

class Shoot extends Movable {

}

class Character extends Movable {

}

class Mob extends Character {

}

class Player extends Character {

}
window.onload = () => (new Main());
