//definição da classe PLAYER
export default class Player {
  constructor(ctx, W) {
    this.x = W / 2 - 5;	//posição horizontal inicial
    this.y = 350;	      //posição vertical inicial
    this.cor = "red";	  //cor do rectângulo
    this.w = 20;	      //comprimento
    this.h = 50;	      //altura
    this.v = 10;	      //velocidade horizontal (constante)
    this.move = "";     //parado no início
    this.bullets = [];  //array de balas
    this.ctx = ctx;
    this.maxX = W;
  }

  draw() {
    this.ctx.fillStyle = this.cor;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  moveRight() {
    //move para a direita 
    if (this.x + this.w < this.maxX)
      this.x += this.v;
  }

  moveLeft() {
    //move para a esquerda 
    if (this.x > 0)
      this.x -= this.v;
  }

  updateBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].y -= 5; //move a bala para cima
      if (this.bullets[i].y < 0) {
        this.bullets.splice(i, 1);  // remove bala se esta atingir o topo do Canvas
        i--;
      }
    }
  }

  createBullet() {
    // acrescenta uma nova bala no array de balas, apartir da posição do player
    this.bullets.push({
      x: this.x,
      y: this.y - 5,
      w: 10,
      h: 10,
    });
  }


  drawBullets() {
    // desenha todas as balas
    for (let i = 0; i < this.bullets.length; i++) {
      // console.log(this.bullets[i])
      this.ctx.fillStyle = "yellow";
      this.ctx.fillRect(this.bullets[i].x, this.bullets[i].y, this.bullets[i].w, this.bullets[i].h);
    }
  }
}
