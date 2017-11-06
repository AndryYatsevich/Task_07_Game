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
const CELL_SIZE = 32;

class DrawableObject {
    constructor(x = 0, y = 0, width = CELL_SIZE, heigth = CELL_SIZE) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = heigth;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
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

    get isEmpty() {
        return this.inside === null || this.inside === undefined;
    }

    swapInside(cell) {
        if (this.isMob) {
            this.inside.isDead = true;
        }

        this.inside = cell.inside;
        cell.inside = null;
    }

    extinction() {
        if (this.inside instanceof Character) {
            this.inside.isDead = true;
        }
        this.inside = null;
    }

    render(ctx) {
        ctx.strokeStyle = 'RGB(0, 0, 0)';
        ctx.strokeRect(CELL_SIZE * this._x, CELL_SIZE * this._y, CELL_SIZE, CELL_SIZE);
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

    render(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this._x * this._width, this._y * this._height, this._width, this._height);
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

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this._width * this._x + 16, this._height * this._y + 16, 8, 0, 360);
        ctx.fillStyle = 'pink';
        ctx.fill();
    }


}

const sideMovement = {
    RIGHT: 1,
    LEFT: 2,
    UP: 3,
    DOWN: 4
};

class Movable extends DrawableObject {

    constructor(x, y, speed) {
        super(x, y);
        this._speed = speed;
    }

    move(direction, matrix) {
        const currentPosition = matrix[this._y][this._x];
        let newX, newY, playerPosition;
        switch (direction) {
            case sideMovement.RIGHT:
                newX = this._x + 1;
                newY = this._y;
                break;
            case (sideMovement.LEFT):
                newX = this._x - 1;
                newY = this._y;
                break;
            case (sideMovement.UP):
                newY = this._y - 1;
                newX = this._x;
                break;
            case (sideMovement.DOWN):
                newY = this._y + 1;
                newX = this._x;
                break;
            default:
                break;
        }
        if (!Movable.canMove(newX, newY, matrix)) {
            return;
        }
        playerPosition = matrix[newY][newX];
        if (!playerPosition.isBarrier) {
            this._y = _.isNumber(newY) ? newY : this._y;
            this._x = _.isNumber(newX) ? newX : this._x;
            playerPosition.swapInside(currentPosition);
        }
        if (playerPosition.isBonus) {
            currentPosition.inside.pickUpBonus(playerPosition.inside.getBonus());
            playerPosition.swapInside(currentPosition);
        }
        console.log(`newX: ${newX}, newY: ${newY}`);
    }

    static canMove(x, y, matrix) {
        return !_.isEmpty(matrix[y]) && !_.isEmpty(matrix[y][x]);
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
    constructor(x, y, damage = 5, direction) {
        super(x, y);
        this._damage = damage;
        this._direction = direction;
    }

    getDamage() {
        return this._damage;
    }

    move(direction, matrix) {
        const currentPosition = matrix[this._y][this._x];
        let newX, newY, shootPosition;
        switch (this._direction) {
            case sideMovement.RIGHT:
                newX = this._x + 1;
                shootPosition = matrix[this._y][newX];

                break;
            case (sideMovement.LEFT):
                newX = this._x - 1;
                shootPosition = matrix[this._y][newX];

                break;
            case (sideMovement.UP):
                newY = this._y - 1;
                shootPosition = matrix[newY][this._x];

                break;
            case (sideMovement.DOWN):
                newY = this._y + 1;
                shootPosition = matrix[newY][this._x];
                break;
            default:
                break;
        }
        if (shootPosition.isEmpty || shootPosition.isBonus) {
            this._y = _.isNumber(newY) ? newY : this._y;
            this._x = _.isNumber(newX) ? newX : this._x;
            shootPosition.swapInside(currentPosition);
        } else if (shootPosition.isPlayer || shootPosition.isMob) {
            shootPosition.hit(this._damage);
            currentPosition.extinction();
        } else {
            currentPosition.extinction();
        }

    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this._width * this._x + 16, this._height * this._y + 16, 3, 0, 360);
        ctx.fillStyle = 'black';
        ctx.fill();
    }
}

class Character extends Movable {
    constructor(x, y, health = 30, speed = 2, damage = 5) {
        super(...arguments);
        this._health = health;
        this._speed = speed;
        this._damage = damage;
    }

    get health() {
        return this._health;
    }

    get speed() {
        return this._speed;
    }

    get damage() {
        return this._damage;
    }


    set health(newHealth) {
        if (!newHealth || newHealth < 0) {
            throw new Error('error');
        }
        this._health = newHealth;
    }

    hit(damage, position) {
        this._health -= damage;
        if (this._health <= 0) {
            position.extinction();
        }
    }
}

class Mob extends Character {
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    constructor(x, y, speed, damage) {
        super(...arguments);
        this._direction = sideMovement.LEFT;
        this.isDead = false;
        this._interval = 0;
        this._speed = Mob.getRandomArbitrary(0.3, 3.5);
        this._damage = damage;
    }

    move(matrix, observer) {
        this._interval += 100;
        if (this._interval < this._speed * 1000) {
            return;
        }

        this._interval = 0;
        const currentPosition = matrix[this._y][this._x];

        //console.log(`x: ${this._x}, y:  ${this._y}`);

        let newX, newY, mobPosition;
        switch (this._direction) {
            case sideMovement.RIGHT:
                newX = this._x + 1;
                newY = this._y;

                break;
            case (sideMovement.LEFT):
                newX = this._x - 1;
                newY = this._y;

                break;
            case (sideMovement.UP):
                newY = this._y - 1;
                newX = this._x;

                break;
            case (sideMovement.DOWN):
                newY = this._y + 1;
                newX = this._x;
                break;
            default:
                break;
        }

        //console.log(`canMove: ${Movable.canMove(newX, newY, matrix)}`);
        //console.log(`newX: ${newX}, newY: ${newY}`);

        if (!Movable.canMove(newX, newY, matrix)) {
            this._direction = Math.round(Mob.getRandomArbitrary(1, 4));
            //console.log(`direction: ${this._direction}`);
            return;
        }

        mobPosition = matrix[newY][newX];
        if (mobPosition.isPlayer) {
            if (mobPosition.inside._health > 0) {
                mobPosition.inside.hit(this._damage, mobPosition);
                this._direction = Math.round(Mob.getRandomArbitrary(1, 4));
                observer.broadcast(mobPosition.inside._health);
                console.log(mobPosition.inside._health);
            } else {
                this._y = _.isNumber(newY) ? newY : this._y;
                this._x = _.isNumber(newX) ? newX : this._x;
                mobPosition.swapInside(currentPosition);
            }

        } else if (!mobPosition.isBarrier && !mobPosition.isMob && !mobPosition.isBonus) {
            this._y = _.isNumber(newY) ? newY : this._y;
            this._x = _.isNumber(newX) ? newX : this._x;
            mobPosition.swapInside(currentPosition);
        } else {
            this._direction = Math.round(Mob.getRandomArbitrary(1, 4));
            console.log(this._direction);
        }
    }

    render(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this._x * this._width + CELL_SIZE / 3, this._y * this._height + CELL_SIZE / 3, CELL_SIZE / 3, CELL_SIZE / 3);

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

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this._width * this._x + 16, this._height * this._y + 16, 5, 0, 360);
        ctx.fillStyle = 'purple';
        ctx.fill();
    }
}

const KEY_CODES = {
    UP: 87,
    DOWN: 83,
    LEFT: 65,
    RIGHT: 68,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39
};


const LEGEND = {
    o: Bonus,
    b: Barrier,
    c: Cell,
    p: Player,
    m: Mob,
    s: Shoot
};


const MATRIX_PATTERN =
    `o * * b b b * * * * m b b o
    * * * m b b * * * o * * b *
    * * * * b b * * * * * * b *
    b b * * * * * * * * * * b *
    b b * p * * b * * b b * * *
    b b b * m o b b * * * * o m`.replace(/ /g, '');

class Main {
    constructor() {
        this.matrix = _.map(_.split(MATRIX_PATTERN, '\n'), (arr, y) => (_.map(_.split(arr, ''), (v, x) => (new Cell(LEGEND[v] && new LEGEND[v](x, y), x, y)))));

        this.action();
        this.on();

        this.statsRegister(); // нитрогай
    }

    statsRegister() {
        this._stats = new window.Stats();
        this._stats.showPanel(0);

        this._stats.dom.style.left = 'auto';
        this._stats.dom.style.right = 0;

        document.body.appendChild(this._stats.dom);
    }

    on() {
        window.addEventListener('keydown', (e) => this.movePlayer(e));
        window.addEventListener('keydown', (e) => this.moveShoot(e));
    }

    moveShoot(event) {
        let shoot = new Shoot(this.player._x, this.player._y);
        console.log(shoot);
        switch (event.keyCode) {
            case KEY_CODES.ARROW_UP:
                shoot.move(sideMovement.UP, this.matrix);
                break;
            case KEY_CODES.ARROW_DOWN:
                shoot.move(sideMovement.DOWN, this.matrix);
                break;
            case KEY_CODES.ARROW_LEFT:
                shoot.move(sideMovement.LEFT, this.matrix);
                break;
            case KEY_CODES.ARROW_RIGHT:
                shoot.move(sideMovement.RIGHT, this.matrix);
                break;
            default:
                break;
        }
    }

    movePlayer(event) {
        if (!this.player.isDead) {
            switch (event.keyCode) {
                case KEY_CODES.UP:
                    this.player.move(sideMovement.UP, this.matrix);
                    break;
                case KEY_CODES.DOWN:
                    this.player.move(sideMovement.DOWN, this.matrix);
                    break;
                case KEY_CODES.LEFT:
                    this.player.move(sideMovement.LEFT, this.matrix);
                    break;
                case KEY_CODES.RIGHT:
                    this.player.move(sideMovement.RIGHT, this.matrix);
                    break;
                default:
                    break;
            }
        }
        // this.render();
    }

    action() {
        const canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this._width = canvas.width = CELL_SIZE * _.maxBy(this.matrix, (v) => v.length).length;
        this._height = canvas.height = CELL_SIZE * this.matrix.length;
        let healthBar = document.getElementById('health');
        let speedBar = document.getElementById('speed');
        let damageBar = document.getElementById('damage');
        const observer = new EventObserver();

        observer.subscribe((v) => {
            healthBar.style.width = `${v}%`;
            console.log('takoe');
        });

        this._mobs = [];

        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                const cell = this.matrix[i][j];

                if (cell.isPlayer) {
                    this.player = cell.inside;

                }

                if (cell.isMob) {
                    this._mobs.push(cell.inside);
                }
            }
        }

        healthBar.style.width = `${this.player.health}%`;
        speedBar.style.width = `${this.player.speed}%`;
        damageBar.style.width = `${this.player.damage}%`;
        setInterval(() => this.goMob(), 100);
        this.render();

        console.log(this.player);

        /* const andreyLox = _
            .chain(this.matrix)
            .map((subArr) => (_
                    .chain(subArr)
                    .filter((v) => (v.isPlayer))
                    .first()
                    .value()
            ))
            .compact()
            .first()
            .value()
            .inside; */
    }

    goMob() {
        _.each(this._mobs, (v) => {
            !v.isDead && v.move(this.matrix)
        });
    };

    render() {
        const step = () => {
            this._stats.begin();
            this.ctx.clearRect(0, 0, this._width, this._height);
            _.forEach(this.matrix, (arr) => {
                _.forEach(arr, (cell) => {
                        cell.render(this.ctx);

                        if (!cell.isEmpty) {
                            cell.inside.render(this.ctx);
                        }
                    }
                )
            });

            this._stats.end();
            window.requestAnimationFrame(() => step());
        };

        window.requestAnimationFrame(() => step());

    }


}

class EventObserver {
    constructor() {
        this.observers = []
    }

    subscribe(fn) {
        this.observers.push(fn)
    }

    unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn)
    }

    broadcast(data) {
        this.observers.forEach(subscriber => subscriber(data))
    }
}

window.onload = () => (new Main());
