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
    constructor(x = 0, y = 0, heigth = 32, width = 32) {
        this._x = x;
        this._y = y;
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
    constructor(inside, x, y) {
        super(x, y);
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

    swapInside(cell) {
        this.inside = cell.inside;
        cell.inside = null;
    }
}

class Barrier extends DrawableObject {
    static getTypes() {
        return ['wall', 'water', 'board'];
    }

    constructor(x, y, type) {
        super(x, y);
        const TYPES = Barrier.getTypes();
        this.type = _.indexOf(TYPES, type) >= 0 ? type : TYPES[0];
    }

}

class Bonus extends DrawableObject {
    static getTypes() {
        return ['apple', 'melon', 'pear'];
    }

    constructor(x, y, type) {
        super(x, y);
        const TYPES = Bonus.getTypes();
        switch (type) {
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

    getBonus() {
        return {h: this._bonusHealth, s: this._bonusSpeed};
    }

}

const sideMovement = {
    RIGHT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down'
};

class Movable extends DrawableObject {

    constructor(x, y, speed) {
        super(x, y);
        this._speed = speed;
    }

    move(direction, matrix) {
        if (sideMovement.RIGHT === direction) {
            let newX = this._x + 1;
            let currentPosition = matrix[this._y][this._x];
            let playerPosition = matrix[this._y][newX];

            if (!playerPosition.isBarrier) {
                this._x = newX;
                playerPosition.swapInside(currentPosition);
            }
        }

        if (sideMovement.LEFT === direction) {
            let newX = this._x - 1;
            let currentPosition = matrix[this._y][this._x];
            let playerPosition = matrix[this._y][newX];

            if (!playerPosition.isBarrier) {
                this._x = newX;
                playerPosition.swapInside(currentPosition);
            }
        }

        if (sideMovement.UP === direction) {
            let newY = this._y - 1;
            let currentPosition = matrix[this._y][this._x];
            let playerPosition = matrix[newY][this._x];

            if (!playerPosition.isBarrier) {
                this._y = newY;
                playerPosition.swapInside(currentPosition);
            }
        }

        if (sideMovement.DOWN === direction) {
            let newY = this._y + 1;
            let currentPosition = matrix[this._y][this._x];
            let playerPosition = matrix[newY][this._x];

            if (!playerPosition.isBarrier) {
                this._y = newY;
                playerPosition.swapInside(currentPosition);
            }
        }
    }

    get speed() {
        return this._speed;
    }

    set speed(newSpeed) {
        if (!newSpeed || newSpeed < 0) {
            throw new Error('error');
        }
        this._speed = newSpeed;
    }
}

class Shoot extends Movable {
    constructor(damage) {
        super();
        this._damage = damage;
    }

    getDamage() {
        return this._damage;
    }
}

class Character extends Movable {
    constructor(x, y, health) {
        super(...arguments);
        this._health = health;
    }

    get health() {
        return this._health;
    }


    set health(newHealth) {
        if (!newHealth || newHealth < 0) {
            throw new Error('error');
        }
        this._health = newHealth;

    }

}

class Mob extends Character {
    constructor(x, y) {
        super(...arguments);
    }
}

class Player extends Character {
    constructor(x, y) {
        super(...arguments);
    }

    pickUpBonus(bonus) {

        const bonus2 = bonus.getBonus();
        if (bonus2.h) {
            this.health += bonus2.h;
        }

        if (bonus2.s) {
            this.speed += bonus2.s;
        }
    }
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
        this.matrix = _.map(_.split(MATRIX_PATTERN, '\n'), (arr, y) => (_.map(_.split(arr, ''), (v, x) => (new Cell(LEGEND[v] && new LEGEND[v](x, y), x, y)))));
        console.log(this.matrix);
    }
}


window.onload = () => (new Main());
