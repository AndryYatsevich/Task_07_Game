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
const CELL_SIZE = 64;

class DrawableObject {
    constructor(x = 0, y = 0, width = CELL_SIZE, heigth = CELL_SIZE, image) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = heigth;
        this._image = image;
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
        this._image = new Image();
        let i = Math.round(Mob.getRandomArbitrary(0, 2));
        let imageSrc = ['img/terrain/earth.png', 'img/terrain/road.bmp', 'img/terrain/road2.png'];
        this._image.src = imageSrc[i];


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

    set x(newX) {
        this._oldX = this._x;
        this._x = newX;
    }

    set y(newY) {
        this._oldY = this._y;
        this._y = newY;
    }

    swapInside(cell) {
        if (this.isShoot) {
            cell.inside.hit(this.inside.damage, cell);
            this.inside.isWasted = true;
        }

        this.inside = cell.inside;
        cell.inside = null;
    }

    extinction() {
        if (this.inside instanceof Character) {
            this.inside.isDead = true;
        }
        if (this.inside instanceof Shoot) {
            this.inside.isWasted = true;
        }
        this.inside = null;
    }

    render(ctx) {
        ctx.drawImage(this._image, CELL_SIZE * this._x, CELL_SIZE * this._y, CELL_SIZE, CELL_SIZE);
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
        this._image = new Image();              // "Создаём" изображение
        let i = Math.round(Mob.getRandomArbitrary(1, 4));
        let imageSrc = ['img/terrain/pit.png', 'img/terrain/bushes0.png', 'img/terrain/bushes1.png', 'img/terrain/stone0.png', 'img/terrain/stone1.png'];
        this._image.src = imageSrc[i];

    }


    render(ctx) {
        ctx.drawImage(this._image, 0, 0, 40, 40, CELL_SIZE * this._x + this._width / 4, CELL_SIZE * this._y + this._height / 5, CELL_SIZE / 2, CELL_SIZE / 2);
    }

}

class Bonus extends DrawableObject {
    static getTypes() {
        return ['apple', 'melon', 'pear', 'cherry'];
    }

    constructor(x, y, type) {
        super(x, y);
        const TYPES = Bonus.getTypes();
        this._image = new Image();

        switch (type) {
            case TYPES[0]:
                this._bonusHealth = 5;
                this._image.src = 'img/bonuses/apple.png';
                break;
            case TYPES[1]:
                this._bonusSpeed = 3;
                this._image.src = 'img/bonuses/melon.png';
                break;
            case TYPES[2]:
                this._bonusHealth = 7;
                this._bonusSpeed = 6;
                this._image.src = 'img/bonuses/pear.png';
                break;
            case TYPES[3]:
                this._bonusDamage = 7;
                this._bonusSpeed = 3;
                this._image.src = 'img/bonuses/cherry.png';
                break;
            default:
                break;
        }
    }

    getBonus() {
        return {h: this._bonusHealth, s: this._bonusSpeed, d: this._bonusDamage};
    }

    render(ctx) {
        ctx.drawImage(this._image, 0, 0, 30, 30, CELL_SIZE * this._x + this._width / 4, CELL_SIZE * this._y + this._height / 4, CELL_SIZE / 2, CELL_SIZE / 2);
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
                this.imagePosition = 97;
                break;
            case (sideMovement.LEFT):
                newX = this._x - 1;
                newY = this._y;
                this.imagePosition = 56;
                break;
            case (sideMovement.UP):
                newY = this._y - 1;
                newX = this._x;
                this.imagePosition = 170;
                break;
            case (sideMovement.DOWN):
                newY = this._y + 1;
                newX = this._x;
                this.imagePosition = 0;
                break;
            default:
                break;
        }
        if (!Movable.canMove(newX, newY, matrix)) {
            return;
        }
        playerPosition = matrix[newY][newX];

        if (playerPosition.isMob) {
            if (playerPosition.inside._health > 0) {
                playerPosition.inside.hit(this._damage, playerPosition);
            }
        } else if (!playerPosition.isBarrier) {
            if (playerPosition.isBonus) {
                currentPosition.inside.pickUpBonus(playerPosition.inside.getBonus());
            }
            this._oldX = _.isNumber(newX) ? this._x : this._oldX;
            this._oldY = _.isNumber(newY) ? this._y : this._oldY;
            this._y = _.isNumber(newY) ? newY : this._y;
            this._x = _.isNumber(newX) ? newX : this._x;
            playerPosition.swapInside(currentPosition);
        }
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

    tick(speed) {
        if (_.isNumber(this._oldX)) {
            const diff = this._oldX < this._x ? this._bufferX - this._x * this._width : this._x * this._width - this._bufferX;

            if (diff + speed < speed) {

                this._bufferX += (this._oldX < this._x) ? speed : -speed;

            } else {
                this._bufferX = this._x * this._width;
                this._oldX = null;
            }

        } else {
            this._bufferX = this._x * this._width;
            this._oldX = null;
        }

        if (_.isNumber(this._oldY)) {
            const diff = this._oldY < this._y ? this._bufferY - this._y * this._height : this._y * this._height - this._bufferY;

            if (diff + speed < speed) {

                this._bufferY += (this._oldY < this._y) ? speed : -speed;

            } else {
                this._bufferY = this._y * this._height;
                this._oldY = null;
            }

        } else {
            this._bufferY = this._y * this._height;
            this._oldY = null;
        }
    }

    hit(damage, position) {
        this._health -= damage;
        if (this._health <= 0) {
            position.extinction();
        }
        this._eventObserver.broadcast({h: this._health});
    }

}

class Shoot extends Movable {
    constructor(x, y, damage = 5, direction, speed = 3.6) {
        super(x, y);
        this._damage = damage;
        this._direction = direction;
        this.isWasted = false;
        this.speed = speed;
        this._image = new Image();
    }

    get damage() {
        return this._damage;
    }

    setDirection(direction) {
        return this._direction = direction;
    }


    move(matrix, isFirstMove = false) {
        const currentPosition = matrix[this._y][this._x];

        let newX, newY, shootPosition;
        switch (this._direction) {
            case sideMovement.RIGHT:
                newX = this._x + 1;
                newY = this._y;
                this._image.src = 'img/swords/right.png';
                break;
            case (sideMovement.LEFT):
                newX = this._x - 1;
                newY = this._y;
                this._image.src = 'img/swords/left.png';
                break;
            case (sideMovement.UP):
                newY = this._y - 1;
                newX = this._x;
                this._image.src = 'img/swords/up.png';
                break;
            case (sideMovement.DOWN):
                newY = this._y + 1;
                newX = this._x;
                this._image.src = 'img/swords/down.png';
                break;
            default:
                break;
        }

        if (!Movable.canMove(newX, newY, matrix)) {
            if (!isFirstMove) {
                currentPosition.extinction();
            }
            this.isWasted = true;

            return;
        }
        shootPosition = matrix[newY][newX];
        if (shootPosition.isEmpty) {
            this._oldX = _.isNumber(newX) ? this._x : this._oldX;
            this._oldY = _.isNumber(newY) ? this._y : this._oldY;
            this._y = _.isNumber(newY) ? newY : this._y;
            this._x = _.isNumber(newX) ? newX : this._x;
            if (isFirstMove) {
                shootPosition.inside = this;

            } else {
                shootPosition.swapInside(currentPosition);
            }
        } else if (shootPosition.isPlayer || shootPosition.isMob) {
            if (!isFirstMove) {
                currentPosition.extinction();

            }
            shootPosition.inside.hit(this._damage, shootPosition);
            this.isWasted = true;
        } else {
            if (!isFirstMove) {
                currentPosition.extinction();
            }
            this.isWasted = true;
        }
    }

    render(ctx) {
        this.tick(this.speed);
        ctx.drawImage(this._image, 0, 0, 50, 50, this._bufferX + this._width / 4, this._bufferY + this._height / 4, 50, 50);
    }
}

class Character extends Movable {
    constructor(x, y, health = 100, speed = 2, damage = 5) {
        super(...arguments);
        this._health = health;
        this._speed = speed;
        this._damage = damage;
        this._eventObserver = new EventObserver();
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

    get eventObserver() {
        return this._eventObserver;
    }

    set health(newHealth) {
        if (!newHealth || newHealth < 0) {
            throw new Error('error');
        }
        this._health = newHealth;
        this._eventObserver.broadcast({h: newHealth});
    }
}

class Mob extends Character {
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;

    }

    constructor(x, y, speed, damage = 10) {
        super(...arguments);
        this._direction = sideMovement.LEFT;
        this.isDead = false;
        this._interval = 0;
        this._speed = Mob.getRandomArbitrary(0.3, 3.5);
        this._damage = Math.round(Mob.getRandomArbitrary(1, 15));
        this._image = new Image();
        this._image.src = 'img/actors/cars.png';
        this.imagePosition = 0;
    }

    move(matrix) {
        this._interval += 100;
        if (this._interval < this._speed * 1000) {
            return;
        }

        this._interval = 0;
        const currentPosition = matrix[this._y][this._x];

        let newX, newY, mobPosition;
        switch (this._direction) {
            case sideMovement.RIGHT:
                newX = this._x + 1;
                newY = this._y;
                this.imagePosition = 97;
                break;
            case (sideMovement.LEFT):
                newX = this._x - 1;
                newY = this._y;
                this.imagePosition = 58;
                break;
            case (sideMovement.UP):
                newY = this._y - 1;
                newX = this._x;
                this.imagePosition = 170;
                break;
            case (sideMovement.DOWN):
                newY = this._y + 1;
                newX = this._x;
                this.imagePosition = 0;
                break;
            default:
                break;
        }

        if (!Movable.canMove(newX, newY, matrix)) {
            this._direction = Math.round(Mob.getRandomArbitrary(1, 4));
            return;
        }

        mobPosition = matrix[newY][newX];
        if (mobPosition.isPlayer || mobPosition.isMob) {
            if (mobPosition.inside._health > 0) {
                mobPosition.inside.hit(this._damage, mobPosition);
                this._direction = Math.round(Mob.getRandomArbitrary(1, 4));
            } else {
                this._oldX = _.isNumber(newX) ? this._x : this._oldX;
                this._oldY = _.isNumber(newY) ? this._y : this._oldY;
                this._y = _.isNumber(newY) ? newY : this._y;
                this._x = _.isNumber(newX) ? newX : this._x;
                mobPosition.swapInside(currentPosition);
            }

        } else if (!mobPosition.isBarrier && !mobPosition.isMob && !mobPosition.isBonus) {
            this._oldX = _.isNumber(newX) ? this._x : this._oldX;
            this._oldY = _.isNumber(newY) ? this._y : this._oldY;
            this._y = _.isNumber(newY) ? newY : this._y;
            this._x = _.isNumber(newX) ? newX : this._x;
            mobPosition.swapInside(currentPosition);
        } else {
            this._direction = Math.round(Mob.getRandomArbitrary(1, 4));
        }
    }

    render(ctx) {

        this.tick(5 - this._speed);
        ctx.drawImage(this._image, 55, this.imagePosition, 60, 70, this._bufferX + this._width / 8, this._bufferY + this._height / 3, 50, 50);
        const x = this._bufferX + this._width / 3;

        ctx.fillStyle = 'orange';
        const progressSize = 2;
        const progressOffset = this._bufferY + this._height / 4;

        ctx.fillRect(x, progressOffset - progressSize * 4, (this._width / 3) * this.health * 0.01, progressSize);

        ctx.fillStyle = 'red';
        const damageMob = (this._width / 3) * this.damage * 0.1;
        ctx.fillRect(x, progressOffset - progressSize * 2, damageMob < this._width / 3 ? damageMob : this._width / 3, progressSize);

        ctx.fillStyle = 'blue';
        const speedMob = (this._width / 3) / this.speed;
        ctx.fillRect(x, progressOffset, speedMob < this._width / 3 ? speedMob : this._width / 3, progressSize);
    }
}

class Player extends Character {
    constructor(x, y) {
        super(...arguments);
        this._image = new Image();
        this._image.src = 'img/actors/cars.png';
        this.imagePosition = 0;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    moveThrottle = _.throttle(super.move, 800);

    pickUpBonus(bonus) {
        if (bonus.h) {
            this._health += bonus.h;
        }

        if (bonus.s) {
            this._speed += bonus.s;
            this.moveThrottle = _.throttle(super.move, (1000 - this.speed * 100) < 0 ? 0 : 1000 - this.speed * 100);
        }

        if (bonus.d) {
            this._damage += bonus.d;
        }
        this._eventObserver.broadcast({s: this.speed, h: this.health, d: this.damage});
    }

    render(ctx) {
        this.tick(this._speed);
        ctx.drawImage(this._image, 0, this.imagePosition, 50, 70, this._bufferX + this._width / 6, this._bufferY + this._height / 6, 40, 60);
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
    b: Barrier,
    c: Cell,
    p: Player,
    m: Mob,
    s: Shoot,
    w: (x, y) => (new Bonus(x, y, 'melon')),
    q: (x, y) => (new Bonus(x, y, 'pear')),
    o: (x, y) => (new Bonus(x, y, 'apple')),
    k: (x, y) => (new Bonus(x, y, 'cherry'))


};

const MATRIX_PATTERN =
    `q * * b b b * * * * m b b o
    * w * m b b * * * w * * b *
    * * * * b b * * * * * * b *
    b b * * * * * k * * * * b *
    b b * m * * b * * b b * * *
    m * * * * * k * * b * * m *
    * * * p * o * * * m * * * *
    * * * * * * * * * * * * * *
    * * * * * * * * * * * * * *
    b b b * m o b b * * * * q m`.replace(/ /g, '');

class Main {
    constructor() {
        this.matrix = _.map(_.split(MATRIX_PATTERN, '\n'), (arr, y) => (_.map(_.split(arr, ''), (v, x) => (new Cell(LEGEND[v] && new LEGEND[v](x, y), x, y)))));
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
        let start = document.getElementById('start');
        let modalWindow = document.getElementById('modalWindow');
        window.addEventListener('keydown', (e) => this.movePlayer(e));
        start.addEventListener('click', () => {
            modalWindow.style.display = `none`;
            this.action()
        });
    }

    movePlayer(event) {

        if (!this.player.isDead) {
            let shoot;
            switch (event.keyCode) {
                case KEY_CODES.UP:
                    this.player.moveThrottle(sideMovement.UP, this.matrix);
                    break;
                case KEY_CODES.DOWN:
                    this.player.moveThrottle(sideMovement.DOWN, this.matrix);
                    break;
                case KEY_CODES.LEFT:
                    this.player.moveThrottle(sideMovement.LEFT, this.matrix);
                    break;
                case KEY_CODES.RIGHT:
                    this.player.moveThrottle(sideMovement.RIGHT, this.matrix);
                    break;
                case KEY_CODES.ARROW_UP:
                    shoot = new Shoot(this.player.x, this.player.y, this.player.damage, sideMovement.UP);
                    break;
                case KEY_CODES.ARROW_DOWN:
                    shoot = new Shoot(this.player.x, this.player.y, this.player.damage, sideMovement.DOWN);
                    break;
                case KEY_CODES.ARROW_LEFT:
                    shoot = new Shoot(this.player.x, this.player.y, this.player.damage, sideMovement.LEFT);
                    break;
                case KEY_CODES.ARROW_RIGHT:
                    shoot = new Shoot(this.player.x, this.player.y, this.player.damage, sideMovement.RIGHT);
                    break;
                default:
                    break;
            }
            if (shoot) {
                shoot.move(this.matrix, true);
                this._shoots.push(shoot);
            }
        }
    }

    action() {
        const canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this._width = canvas.width = CELL_SIZE * _.maxBy(this.matrix, (v) => v.length).length;
        this._height = canvas.height = CELL_SIZE * this.matrix.length;
        let healthBar = document.getElementById('health');
        let speedBar = document.getElementById('speed');
        let damageBar = document.getElementById('damage');
        this._mobs = [];
        this._shoots = [];

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
        healthBar.innerHTML = `${this.player.health}`;
        speedBar.style.width = `${this.player.speed}%`;
        speedBar.innerHTML = `${this.player.speed}`;
        damageBar.style.width = `${this.player.damage}%`;
        damageBar.innerHTML = `${this.player.damage}`;
        setInterval(() => this.goMob(), 100);
        setInterval(() => this.goShoots(), 300);
        this.render();

        this.player.eventObserver.subscribe(({h, s, d}) => {

            if (_.isNumber(h) && h <= 0) {
                let playerDead = document.getElementById('playerDead');
                playerDead.style.display = `block`;
                healthBar.style.width = `0%`;

            } else {
                healthBar.style.width = `${h}%`;
                healthBar.innerHTML = `${h}`;
            }
            if (_.isNumber(s)) {
                speedBar.style.width = `${s}%`;
                speedBar.innerHTML = `${s}`;
            }
            if (_.isNumber(d)) {
                damageBar.style.width = `${d}%`;
                damageBar.innerHTML = `${d}`;
            }
        });
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

    goShoots() {
        _.each(this._shoots, (v) => {
            !v.isWasted && v.move(this.matrix)
        });
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
                        if (cell.isBarrier || cell.isBonus) {
                            cell.inside.render(this.ctx);
                        }
                    }
                )
            });
            this._mobs = _.filter(this._mobs, (v) => (!v.isDead));
            this._shoots = _.filter(this._shoots, (v) => (!v.isWasted));
            this._mobsLive = _.filter(this._mobs, (v) => (!v.isDead));
            if (!this._mobsLive.length) {
                let endGame = document.getElementById('endGame');
                endGame.style.display = `block`;
            }

            _.each([...this._mobs, ...this._shoots, this.player], (v) => v.render(this.ctx));

            this._stats.end();
            window.requestAnimationFrame(() => step());
        };
        window.requestAnimationFrame(() => step());
    }
}

class EventObserver {
    constructor() {
        this.observers = [];
    }

    subscribe(fn) {
        this.observers.push(fn);
    }

    unsubscribe(fn) {
        this.observers = this.observers.filter((subscriber) => subscriber !== fn);
    }

    broadcast(data) {
        this.observers.forEach((subscriber) => subscriber(data));
    }
}

window.onload = () => (new Main());
