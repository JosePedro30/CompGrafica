//definição do objeto ENEMY
export default class Enemy {
  constructor(ctx, x) {
    this.x = x;	//posição horizontal inicial
    this.y = 10;	//posição vertical inicial
    this.cor = "green";	//cor do rectângulo
    this.w = 40;	//comprimento
    this.h = 40;	//altura
    this.state = "alive";
    this.ctx = ctx;
  }

  draw() {
    this.ctx.fillStyle = this.cor;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}