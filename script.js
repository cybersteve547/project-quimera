class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	multi(multiplier) {
		return new Vector(this.x * multiplier, this.y * multiplier);
	}
}

class SheetImage {
	constructor(image, posx, posy, sizex, sizey, offsetx, offsety) {
		this.image = image;
		this.pos = new Vector(posx, posy);
		this.size = new Vector(sizex, sizey);
		this.offset = new Vector(offsetx, offsety);
	}
	draw(context, pos, scale) {
		context.drawImage(
			this.image,
			this.pos.x * this.offset.x, this.pos.y * this.offset.y,
			this.size.x, this.size.y,
			Math.round(pos.x), Math.round(pos.y),
			this.size.x * scale.x, this.size.y * scale.y
		);
	}
}

class Player {
	constructor() {
		this.pos = new Vector(0, 0);
		this.vel = new Vector(0, 0);
		this.dir = 0;
		this.anim = 0;
		this.image = new SheetImage(playerimage, 0, 0, 16, 16, 16, 16);
	}
	tick(kbd) {
		let walk = 0;
		if (kbd.a) {this.vel.x -= 1; this.dir = 2; walk = 1;}
		if (kbd.d) {this.vel.x += 1; this.dir = 3; walk = 1;}
		if (kbd.w) {this.vel.y -= 1; this.dir = 1; walk = 1;}
		if (kbd.s) {this.vel.y += 1; this.dir = 0; walk = 1;}
		this.vel = this.vel.multi(0.6);
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		this.anim += 1;
		if (this.anim > 31) {
			this.anim = 0
		}
		this.image.pos.x = Math.floor(this.anim / 8) + (walk * 4);
		this.image.pos.y = this.dir;
	}
}

class Keyboard {
	constructor() {
		this.w = 0;
		this.s = 0;
		this.a = 0;
		this.d = 0;
		this.q = 0;
		this.e = 0;
		window.addEventListener('keydown', (e) => {
			var code = e.key.toLowerCase();
			switch (code) {
				case 'w': this.w = 1; break;
				case 's': this.s = 1; break;
				case 'a': this.a = 1; break;
				case 'd': this.d = 1; break;
				case 'q': this.q = 1; break;
				case 'e': this.e = 1; break;
				default: console.log(code);
			}
		});
		window.addEventListener('keyup', (e) => {
			var code = e.key.toLowerCase();
			switch (code) {
				case 'w': this.w = 0; break;
				case 's': this.s = 0; break;
				case 'a': this.a = 0; break;
				case 'd': this.d = 0; break;
				case 'q': this.q = 0; break;
				case 'e': this.e = 0; break;
				default: console.log(code);
			}
		});
	}
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const sheet = document.getElementById("sheet");
const playerimage = document.getElementById("player");

const width = 16;
const height = 16;

let mouse = new Vector(0, 0)
mouse.image = document.getElementById("mouse")

let map = [];
for (let y = 0; y < height; y++) {
	map[y] = [];
	for (let x = 0; x < width; x++) {
		map[y][x] = new SheetImage(sheet, Math.round(Math.random()), 0, 16, 16, 16, 16);
	}
}

let player = new Player();
let keyboard = new Keyboard();

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

function drawGrid(context, gridsize, grid, pos, scale) {
	for (let y = 0; y < gridsize.y; y++) {
		for (let x = 0; x < gridsize.x; x++) {
			tile = grid[y][x];
			tile.draw(context, new Vector(pos.x + (x * tile.size.x * scale.x), pos.y + (y * tile.size.y * scale.y)), scale);
		}
	}
}

function update(timestamp) {
	player.tick(keyboard);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(ctx, new Vector(width, height), map, new Vector(0, 0), new Vector(2, 2));
	player.image.draw(ctx, player.pos.multi(2), new Vector(2, 2));
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
