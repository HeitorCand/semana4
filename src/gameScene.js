class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  // Função de pré-carregamento de recursos do jogo
  preload() {
    // Carregamento de imagens para o jogo
    this.load.image('background', 'assets/map/tiled_Background.png');
    this.load.image('plataforma1', 'assets/map/Platform1.png');
    this.load.image('plataforma2', 'assets/map/Platform2.png');
    this.load.image('plataforma3', 'assets/map/Platform3.png');
    this.load.image('porta', 'assets/map/Door.png');
    this.load.image('moeda', 'assets/map/Coin.png');
    this.load.image('nuvens', 'assets/map/Clouds.png');

    // Carregamento de uma spritesheet para a animação do jogador
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 240, frameHeight: 300,
    });
  }

  // Função chamada na inicialização do jogo para configurar os elementos
  create() {
    // Adição do plano de fundo
    var background = this.add.image(gameState.larguraJogo / 2, gameState.alturaJogo / 2, 'background');
    background.setScale(gameState.alturaJogo / background.height);

    // Adição de nuvens estáticas
    var nuvens = this.physics.add.staticSprite(gameState.larguraJogo / 2, gameState.alturaJogo * 0.93, 'nuvens');
    nuvens.setScale(gameState.larguraJogo / nuvens.width);
    nuvens.setSize(1500, 100);
    nuvens.setOffset(0, nuvens.height);

    // Adição de uma porta estática
    var porta = this.physics.add.staticSprite(gameState.larguraJogo / 1.075, gameState.alturaJogo / 10, 'porta');
    porta.setScale(0.8);
    porta.setSize(50, 200);
    porta.setOffset(porta.width / 2);

    // Configuração do placar
    gameState.pontuacao = 0;
    gameState.placar = this.add.text(50, 50, 'Moedas:' + gameState.pontuacao, { fontSize: '45px', fill: '#FFFFFF  ' });

    // Configuração de diferentes plataformas
    // ======== PLATAFORMA 1 ========
    gameState.plataforma = this.physics.add.staticGroup();
    const platPositions = [
      { x: gameState.larguraJogo / 14, y: gameState.alturaJogo / 1.13 },
      { x: gameState.larguraJogo / 1.08, y: gameState.alturaJogo / 3 },
    ];
    platPositions.forEach(plat => {
      const plataforma = gameState.plataforma.create(plat.x, plat.y, 'plataforma1');
      plataforma.setSize(plataforma.width / 1.14, plataforma.height / 1.5);
      plataforma.setOffset(plataforma.width / 12, plataforma.height / 7);
    });

    // ======== PLATAFORMA 2 ========
    gameState.plataforma2 = this.physics.add.staticGroup();
    const platPositions2 = [
      { x: gameState.larguraJogo / 2.7, y: gameState.alturaJogo / 1.3 },
      { x: gameState.larguraJogo / 1.55, y: gameState.alturaJogo / 2 },
    ];
    platPositions2.forEach(plat => {
      const plataforma = gameState.plataforma2.create(plat.x, plat.y, 'plataforma2');
      plataforma.setSize(plataforma.width / 1.14, plataforma.height / 1.5);
      plataforma.setOffset(plataforma.width / 12, plataforma.height / 7);
    });

    // ======== PLATAFORMA 3 ========
    gameState.plataforma3 = this.physics.add.staticGroup();
    const platPositions3 = [
      { x: gameState.larguraJogo / 6, y: gameState.alturaJogo / 2.3 },
      { x: gameState.larguraJogo / 2.5, y: gameState.alturaJogo / 4 },
    ];
    platPositions3.forEach(plat => {
      const plataforma = gameState.plataforma3.create(plat.x, plat.y, 'plataforma3');
      plataforma.setSize(plataforma.width / 1.14, plataforma.height / 2);
      plataforma.setOffset(plataforma.width / 12, plataforma.height / 4);
    });

    // Configuração da moeda (Física e sprite)
    gameState.moeda = this.physics.add.sprite(platPositions2[0].x, platPositions2[0].y * 0.7, 'moeda');
    gameState.moeda.setCollideWorldBounds(true);
    this.physics.add.collider(gameState.moeda, gameState.plataforma);
    this.physics.add.collider(gameState.moeda, gameState.plataforma2);
    this.physics.add.collider(gameState.moeda, gameState.plataforma3);

    // Configuração do personagem principal (player)
    gameState.player = this.physics.add.sprite(gameState.larguraJogo / 18, 0, 'player').setScale(0.4);
    gameState.player.setCollideWorldBounds(true);
    gameState.player.body.setSize(200, 250);
    gameState.player.body.setOffset(gameState.player.width / 10, gameState.player.height / 14);

    this.physics.add.collider(gameState.player, gameState.plataforma);
    this.physics.add.collider(gameState.player, gameState.plataforma2);
    this.physics.add.collider(gameState.player, gameState.plataforma3);

    // Criação da animação de correr
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1
    });

    // Criação da animação de parado
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 10, end: 20 }),
      frameRate: 5,
      repeat: -1
    });

    // Configuração do teclado
    gameState.cursor = this.input.keyboard.createCursorKeys();

    // Configuração da colisão entre o player e a moeda
    this.physics.add.overlap(gameState.player, gameState.moeda, function () {
      gameState.moeda.setVisible(false);

      // "Gera" uma nova moeda (apenas reposiciona a antiga)
      let posicaoMoedaY = Phaser.Math.RND.between(0, gameState.larguraJogo - 100);
      gameState.moeda.setPosition(posicaoMoedaY, 100);

      gameState.pontuacao++; // aumenta a pontuação
      gameState.placar.setText('Moeda: ' + gameState.pontuacao); 
      gameState.moeda.setVisible(true);
    });

    // Configuração da colisão entre o jogador e as nuvens
    this.physics.add.collider(gameState.player, nuvens, function () {
      // Ação a ser realizada quando houver colisão (por exemplo, game over, pontuação, etc.)
      console.log('Colisão com nuvens!');
      gameState.player.setPosition(gameState.larguraJogo / 18, 0);
    });

    // Configuração da colisão entre a moeda e as nuvens
    this.physics.add.collider(gameState.moeda, nuvens, function () {
      gameState.moeda.setVisible(false);

      // "Gera" uma nova moeda (apenas reposiciona a antiga)
      let posicaoMoedaY = Phaser.Math.RND.between(0, gameState.larguraJogo - 100);
      gameState.moeda.setPosition(posicaoMoedaY, 100);
      gameState.moeda.setVisible(true);
    });

    // Configuração da colisão entre o jogador e a porta
    this.physics.add.collider(gameState.player, porta, () => {
      // Adiciona texto na tela
      this.add.text(gameState.larguraJogo / 3, 50, 'PONTUAÇÃO', { fontSize: '100px', fill: '#FFFFFF' });
      this.add.text(gameState.larguraJogo / 3, 200, 'Moedas:' + gameState.pontuacao, { fontSize: '45px', fill: '#FFFFFF' });
      // Pausa a física
      this.physics.world.pause();
      // Pausa todas as animações
      this.anims.pauseAll();
    });
  }

  // Função chamada a cada quadro para atualização contínua do jogo
  update() {
    // Controle de movimento do jogador com base nas teclas pressionadas
    if (gameState.cursor.left.isDown) {
      gameState.player.setVelocityX(-160);
      gameState.player.anims.play('run', true);
      gameState.player.flipX = true;
    } else if (gameState.cursor.right.isDown) {
      gameState.player.setVelocityX(160);
      gameState.player.anims.play('run', true);
      gameState.player.flipX = false;
    } else {
      gameState.player.setVelocityX(0);
      gameState.player.anims.play('idle', true);
    }

    // Controle de pulo do jogador
    if ((gameState.cursor.up.isDown || gameState.cursor.space.isDown) && gameState.player.body.touching.down) {
      gameState.player.setVelocityY(-500);
    }
  }
}
