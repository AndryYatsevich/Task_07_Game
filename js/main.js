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
 *      Гетторы и сетторы
 *       class DrawableObject {
 *          constructor(x) {
 *              this._x = x;
 *          }
 *
 *          get x() {
 *              return this._x;
 *          }
 *
 *          set x(newX) {
 *              if (_.isNumber(newX) && !_.isNaN(newX)) {
 *                  this._x = newX;
 *              } else {
 *                  throw Error('expected number');
 *              }
 *          }
 *      }

 *
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

class DrawableObject {
    constructor(heigth, width) {

        this._height = heigth;
        this._width = width;
    }

    get height() {
        return this._height;
    }

    get width() {
        return this._width;
    }
}

class Cell extends DrawableObject {
    constructor(inside) {
        super();
        this.inside = inside;
    }

    get isBarrier() {
        return this.inside instanceof Barrier;
    }

    get isBonus() {
        return this.inside instanceof Bonus;
    }

    get isPlayer() {
        return this.inside instanceof Player;
    }

    get isMob() {
        return this.inside instanceof Mob;
    }

    get isShoot() {
        return this.inside instanceof Shoot;
    }
}

class Barrier extends DrawableObject {
    static getTypes(){
        return ['wall', 'water', 'board'];
    }

    constructor (type){
        super();
        const TYPES = Barrier.getTypes();
        this.type = _.indexOf(TYPES, type) >= 0 ? type : TYPES[0];
    }

}

class Bonus extends DrawableObject {
    static getTypes(){
        return ['apple', 'melon', 'pear'];
    }

    constructor (type) {
        super();
        const TYPES = Bonus.getTypes();
        switch(type){
            case TYPES[0]:
                this._bonusHealth = 5;
                break;
            case TYPES[1]:
                this._bonusSpeed = 3;
                break;
            case TYPES[2]:
                this._bonusHealth = 7;
                this._bonusSpeed = 6;
                break;
            default:
                break;
        }
    }

    get bonus(){
        return {h: this._bonusHealth, s: this._bonusSpeed};
    }
    
}

class Movable extends DrawableObject {

    constructor(speed){
        super();
    }
}

class Shoot extends Movable {

}

class Character extends Movable {

}

class Mob extends Character {

}

class Player extends Character {

}

const LEGEND = {
    o: Bonus,
    b: Barrier,
    c: Cell,
    p: Player,
    m: Mob,
    s: Shoot
};

const MATRIX_PATTERN =
    `o * * b b b
    * * * m b b
    * * * * b b
    b b * * * *
    b b p * * *
    b b b * * o`.replace(/ /g, '');

class Main {
    constructor() {
        this.matrix = _.map(_.split(MATRIX_PATTERN, '\n'), (arr) => (_.map(_.split(arr, ''), (v) => (new Cell(LEGEND[v] && new LEGEND[v]())))));
    }
}


window.onload = () => (new Main());
