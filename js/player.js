// ============================================================
// JOGADOR / AMBULÂNCIA
// ============================================================

const ambulanceSprite = new Image();
ambulanceSprite.src = "assets/images/ambulancia-jogador.png";


class Player {

    constructor() {

        // ----------------------------------------------------
        // POSIÇÃO
        // ----------------------------------------------------

        this.x = 900;
        this.y = 700;


        // ----------------------------------------------------
        // TAMANHO DO CARRO
        // ----------------------------------------------------

        this.width = 42;
        this.height = 64;


        // ----------------------------------------------------
        // DIREÇÃO DO CARRO
        // ----------------------------------------------------
        //
        // O ângulo determina para onde a "frente" da
        // ambulância está apontando.
        //
        // 0 = apontando para cima
        // PI/2 = apontando para a direita
        // PI = apontando para baixo
        // -PI/2 = apontando para a esquerda
        //
        // Começamos apontando para cima.
        // ----------------------------------------------------

        this.angle = 0;


        // ----------------------------------------------------
        // VELOCIDADE
        // ----------------------------------------------------
        //
        // A ambulância SEMPRE anda para frente.
        //
        // Aumente esse valor para deixar o jogo mais rápido.
        // ----------------------------------------------------

        this.speed = 5;


        // ----------------------------------------------------
        // VELOCIDADE DE CURVA
        // ----------------------------------------------------
        //
        // Define o quanto o carro gira quando o jogador
        // segura esquerda/direita.
        //
        // Quanto maior, mais rápido o carro vira.
        // ----------------------------------------------------

        this.turnSpeed = 0.045;


        // ----------------------------------------------------
        // CONTROLES
        // ----------------------------------------------------

        this.direction = {

            left: false,
            right: false

        };


        // ----------------------------------------------------
        // RAIO DA COLISÃO
        // ----------------------------------------------------
        //
        // A colisão do carro será formada por círculos.
        // Isso evita que os cantos fiquem agarrando nas paredes.
        // ----------------------------------------------------

        this.collisionRadius = 10;
    }


    // ========================================================
    // ATUALIZAÇÃO
    // ========================================================

    update() {

        // ----------------------------------------------------
        // 1. ALTERA A DIREÇÃO
        // ----------------------------------------------------

        if (this.direction.left) {

            this.angle -= this.turnSpeed;
        }


        if (this.direction.right) {

            this.angle += this.turnSpeed;
        }


        // ----------------------------------------------------
        // 2. CALCULA A DIREÇÃO PARA FRENTE
        // ----------------------------------------------------
        //
        // Como a frente visual da ambulância está para cima,
        // usamos:
        //
        // X = sin(angle)
        // Y = -cos(angle)
        //
        // Assim:
        //
        // angle = 0
        //       ↓
        //      cima
        //
        // angle = PI/2
        //       →
        //    direita
        // ----------------------------------------------------

        const directionX =
            Math.sin(this.angle);

        const directionY =
            -Math.cos(this.angle);


        // ----------------------------------------------------
        // 3. CALCULA O MOVIMENTO
        // ----------------------------------------------------

        const movementX =
            directionX * this.speed;

        const movementY =
            directionY * this.speed;



        // ----------------------------------------------------
        // 4. MOVIMENTO COM DESLIZAMENTO NAS PAREDES
        // ----------------------------------------------------

        // Divide o deslocamento em pequenos passos para evitar
        // que a ambulância fique presa em cantos e curvas.
        const maxStep = 2;

        const steps = Math.max(
            1,
            Math.ceil(
                Math.max(
                    Math.abs(movementX),
                    Math.abs(movementY)
                ) / maxStep
            )
        );

        const stepX = movementX / steps;
        const stepY = movementY / steps;

        for (let i = 0; i < steps; i++) {

            // Tenta mover horizontalmente.
            this.x += stepX;

            if (checkWallCollision(this)) {
                this.x -= stepX;
            }

            // Tenta mover verticalmente, mesmo que o movimento
            // horizontal tenha sido bloqueado.
            this.y += stepY;

            if (checkWallCollision(this)) {
                this.y -= stepY;
            }
        }

        // ----------------------------------------------------
        // 6. LIMITES DO MAPA
        // ----------------------------------------------------

        // O centro do carro não pode sair do mapa.

        if (this.x < this.collisionRadius) {

            this.x = this.collisionRadius;
        }


        if (
            this.x >
            WORLD_WIDTH - this.collisionRadius
        ) {

            this.x =
                WORLD_WIDTH - this.collisionRadius;
        }


        if (this.y < this.collisionRadius) {

            this.y = this.collisionRadius;
        }


        if (
            this.y >
            WORLD_HEIGHT - this.collisionRadius
        ) {

            this.y =
                WORLD_HEIGHT - this.collisionRadius;
        }
    }


    // ========================================================
    // DESENHA A AMBULÂNCIA
    // ========================================================

    draw(ctx) {

        ctx.save();

        ctx.translate(
            this.x,
            this.y
        );

        ctx.rotate(this.angle);

        if (
            ambulanceSprite.complete &&
            ambulanceSprite.naturalWidth > 0
        ) {
            ctx.drawImage(
                ambulanceSprite,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );

            ctx.restore();
            return;
        }


        // ----------------------------------------------------
        // CORPO
        // ----------------------------------------------------
        //
        // A parte de cima do desenho é a FRENTE do carro.
        // Portanto, quando angle = 0, ele aponta para cima.
        // ----------------------------------------------------

        ctx.fillStyle = "#d62828";

        drawRoundedRect(
            ctx,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            8
        );

        ctx.fill();


        // ----------------------------------------------------
        // JANELA DA FRENTE
        // ----------------------------------------------------

        ctx.fillStyle = "#9ed8ff";

        drawRoundedRect(
            ctx,
            -10,
            -17,
            20,
            12,
            4
        );

        ctx.fill();


        // ----------------------------------------------------
        // FAIXA BRANCA
        // ----------------------------------------------------

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            -this.width / 2,
            -2,
            this.width,
            7
        );


        // ----------------------------------------------------
        // CRUZ
        // ----------------------------------------------------

        ctx.fillStyle = "#d62828";

        ctx.fillRect(
            -3,
            -1,
            6,
            14
        );

        ctx.fillRect(
            -7,
            3,
            14,
            6
        );


        // ----------------------------------------------------
        // LUZ DA AMBULÂNCIA
        // ----------------------------------------------------

        ctx.fillStyle = "#ffffff";

        drawRoundedRect(
            ctx,
            -5,
            -25,
            10,
            5,
            2
        );

        ctx.fill();


        ctx.restore();
    }


    // ========================================================
    // RESET
    // ========================================================

    reset(x, y, angle = 0) {

        this.x = x;
        this.y = y;

        this.angle = angle;

        this.direction.left = false;
        this.direction.right = false;
    }
}