const gameState = {
  larguraJogo: window.innerWidth,
  alturaJogo: window.innerHeight,
};

const config = {
  type: Phaser.AUTO,
  width: gameState.larguraJogo,
  height: gameState.alturaJogo,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      enableBody: true,
      debug:true,
    }
  },
  scene: [StartScene , GameScene],
};

const game = new Phaser.Game(config);
