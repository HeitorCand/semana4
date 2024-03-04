class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  // Pré-carrega os recursos necessários antes da criação da cena
  preload() {
    // Carrega as imagens necessárias para a cena
    this.load.image('play', 'assets/play.png');
    this.load.image('background', 'assets/map/tiled_Background.png');
  }

  // Método chamado após a pré-carga, usado para criar elementos na cena
  create() {
    // Adiciona o fundo à cena e ajusta a escala
    var background = this.add.image(gameState.larguraJogo / 2, gameState.alturaJogo / 2, 'background');
    background.setScale(gameState.alturaJogo / background.height);

    // Adiciona um texto com o título do jogo
    this.add.text(gameState.larguraJogo / 3, 50, 'Dino Coin', { fontSize: '100px', fill: '#FFFFFF' });

    // Adiciona o botão 'play' à cena e ajusta a escala
    var btnPlay = this.add.image(gameState.larguraJogo / 2, gameState.alturaJogo / 2, 'play');
    btnPlay.setScale((gameState.alturaJogo / btnPlay.height) * 0.4);

    // Torna o botão clicável
    btnPlay.setInteractive();

    // Adiciona um evento de clique ao botão
    btnPlay.on('pointerdown', function () {
      // Adicione aqui a lógica para mudar de cena
     this.changeScene(); // função mudar cena
    }, this);
  }

  changeScene(){
     this.scene.start('GameScene'); // Substitua 'NomeDaCenaDestino' pelo nome da cena que você deseja iniciar
     this.scene.stop('StartScene'); // Encerra esta cena ao iniciar a próxima
  }
}
