
 // ============================================================
 // SISTEMA DE COLISÃO
 // ============================================================


// ============================================================
// COLISÃO CÍRCULO x RETÂNGULO
// ============================================================

function circleRectangleCollision(
    circleX,
    circleY,
    radius,
    rectangle
) {
    const closestX = Math.max(
        rectangle.x,
        Math.min(circleX, rectangle.x + rectangle.width)
    );

    const closestY = Math.max(
        rectangle.y,
        Math.min(circleY, rectangle.y + rectangle.height)
    );

    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;

    const distanceSquared =
        distanceX * distanceX + distanceY * distanceY;

    return distanceSquared <= radius * radius;
}


// ============================================================
// PONTOS DE COLISÃO DA AMBULÂNCIA
// ============================================================
//
// A ambulância é tratada como uma cápsula:
//
//             ● frente
//             │
//             │
//             ● traseira
//
// Esses pontos acompanham a rotação do carro.
// ============================================================

function getPlayerCollisionPoints(player) {
    const radius = player.collisionRadius;
    const offset = player.height / 2 - radius;

    // Direção para a qual a frente do carro aponta.
    const directionX = Math.sin(player.angle);
    const directionY = -Math.cos(player.angle);

    const front = {
        x: player.x + directionX * offset,
        y: player.y + directionY * offset
    };

    const back = {
        x: player.x - directionX * offset,
        y: player.y - directionY * offset
    };

    return {
        front,
        back
    };
}


// ============================================================
// MÁSCARA DE PIXELS DA AMBULÂNCIA
// ============================================================

let ambulanceOpaqueMask = null;
let ambulanceOpaqueMaskWarningShown = false;
let fallbackOpaqueMask = null;


/**
 * Cria uma máscara retangular simples quando o sprite
 * não está disponível ou quando a leitura dos pixels falha.
 */
function createFallbackPlayerMask(player, width, height) {
    if (
        !fallbackOpaqueMask ||
        fallbackOpaqueMask.playerWidth !== player.width ||
        fallbackOpaqueMask.playerHeight !== player.height
    ) {
        const pixels = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                pixels.push({
                    x:
                        (x + 0.5) * player.width / width -
                        player.width / 2,

                    y:
                        (y + 0.5) * player.height / height -
                        player.height / 2
                });
            }
        }

        fallbackOpaqueMask = {
            pixels,
            left: -player.width / 2,
            top: -player.height / 2,
            right: player.width / 2,
            bottom: player.height / 2,
            playerWidth: player.width,
            playerHeight: player.height
        };
    }

    return fallbackOpaqueMask;
}


function getPlayerOpaqueMask(player) {
    const width = Math.max(1, Math.ceil(player.width));
    const height = Math.max(1, Math.ceil(player.height));

    // ambulanceSprite é carregada em outro arquivo,
    // normalmente player.js.
    const sprite =
        typeof ambulanceSprite !== "undefined"
            ? ambulanceSprite
            : null;

    const hasSprite = Boolean(
        sprite &&
        sprite.complete &&
        sprite.naturalWidth > 0 &&
        sprite.naturalHeight > 0
    );

    // Enquanto a imagem carrega, usa uma máscara retangular.
    if (!hasSprite) {
        return createFallbackPlayerMask(player, width, height);
    }

    const maskNeedsUpdate =
        !ambulanceOpaqueMask ||
        ambulanceOpaqueMask.playerWidth !== player.width ||
        ambulanceOpaqueMask.playerHeight !== player.height;

    if (maskNeedsUpdate) {
        try {
            const spriteCanvas = document.createElement("canvas");

            spriteCanvas.width = width;
            spriteCanvas.height = height;

            const spriteContext = spriteCanvas.getContext("2d", {
                willReadFrequently: true
            });

            if (!spriteContext) {
                return createFallbackPlayerMask(
                    player,
                    width,
                    height
                );
            }

            spriteContext.drawImage(
                sprite,
                0,
                0,
                spriteCanvas.width,
                spriteCanvas.height
            );

            // Se houver bloqueio CORS, getImageData pode lançar
            // SecurityError. O catch permite usar o fallback.
            const pixels = spriteContext.getImageData(
                0,
                0,
                spriteCanvas.width,
                spriteCanvas.height
            ).data;

            const opaquePixels = [];

            let left = spriteCanvas.width;
            let top = spriteCanvas.height;
            let right = -1;
            let bottom = -1;

            for (let y = 0; y < spriteCanvas.height; y++) {
                for (let x = 0; x < spriteCanvas.width; x++) {
                    // Ignora pixels totalmente transparentes.
                    if (
                        pixels[
                            (y * spriteCanvas.width + x) * 4 + 3
                        ] === 0
                    ) {
                        continue;
                    }

                    const localX =
                        (x + 0.5) *
                        player.width /
                        spriteCanvas.width -
                        player.width / 2;

                    const localY =
                        (y + 0.5) *
                        player.height /
                        spriteCanvas.height -
                        player.height / 2;

                    opaquePixels.push({
                        x: localX,
                        y: localY
                    });

                    left = Math.min(left, localX);
                    top = Math.min(top, localY);
                    right = Math.max(right, localX);
                    bottom = Math.max(bottom, localY);
                }
            }

            ambulanceOpaqueMask =
                opaquePixels.length > 0
                    ? {
                        pixels: opaquePixels,
                        left,
                        top,
                        right,
                        bottom,
                        playerWidth: player.width,
                        playerHeight: player.height
                    }
                    : null;

            // Uma imagem sem pixels opacos também usa fallback.
            if (!ambulanceOpaqueMask) {
                return createFallbackPlayerMask(
                    player,
                    width,
                    height
                );
            }

            return ambulanceOpaqueMask;

        } catch (error) {
            if (!ambulanceOpaqueMaskWarningShown) {
                console.warn(
                    "Não foi possível ler os pixels de ambulance.png. " +
                    "A colisão com as serras usará uma máscara retangular. " +
                    "Verifique o caminho da imagem e, se ela for externa, " +
                    "a configuração CORS.",
                    error
                );

                ambulanceOpaqueMaskWarningShown = true;
            }

            return createFallbackPlayerMask(
                player,
                width,
                height
            );
        }
    }

    return ambulanceOpaqueMask;
}


// ============================================================
// VERIFICA SE UM PONTO ESTÁ DENTRO DE UM POLÍGONO
// ============================================================

function pointInPolygon(point, polygon) {
    let inside = false;

    for (
        let current = 0, previous = polygon.length - 1;
        current < polygon.length;
        previous = current++
    ) {
        const currentPoint = polygon[current];
        const previousPoint = polygon[previous];

        const crossesY =
            (currentPoint.y > point.y) !==
            (previousPoint.y > point.y);

        const crossesX =
            point.x <
            (previousPoint.x - currentPoint.x) *
                (point.y - currentPoint.y) /
                (previousPoint.y - currentPoint.y) +
                currentPoint.x;

        if (crossesY && crossesX) {
            inside = !inside;
        }
    }

    return inside;
}


// ============================================================
// DISTÂNCIA ENTRE UM PONTO E UM SEGMENTO
// ============================================================

function pointToSegmentDistanceSquared(point, start, end) {
    const segmentX = end.x - start.x;
    const segmentY = end.y - start.y;

    const segmentLengthSquared =
        segmentX * segmentX + segmentY * segmentY;

    const projection =
        segmentLengthSquared === 0
            ? 0
            : Math.max(
                0,
                Math.min(
                    1,
                    (
                        (point.x - start.x) * segmentX +
                        (point.y - start.y) * segmentY
                    ) / segmentLengthSquared
                )
            );

    const closestX = start.x + projection * segmentX;
    const closestY = start.y + projection * segmentY;

    const distanceX = point.x - closestX;
    const distanceY = point.y - closestY;

    return (
        distanceX * distanceX +
        distanceY * distanceY
    );
}


// ============================================================
// COLISÃO ENTRE A AMBULÂNCIA E UMA SERRA
// ============================================================

function sawTouchesPlayer(player, saw) {
    const mask = getPlayerOpaqueMask(player);

    if (!mask) {
        return false;
    }

    const cos = Math.cos(player.angle);
    const sin = Math.sin(player.angle);

    const toothCount = 12;
    const radius = Math.min(saw.width, saw.height) / 2;
    const sawPoints = [];

    // Cria o contorno dentado da serra.
    for (let tooth = 0; tooth < toothCount * 2; tooth++) {
        const angle =
            tooth * Math.PI / toothCount - Math.PI / 2;

        const toothRadius =
            tooth % 2 === 0
                ? radius
                : radius * 0.78;

        sawPoints.push({
            x: saw.x + Math.cos(angle) * toothRadius,
            y: saw.y + Math.sin(angle) * toothRadius
        });
    }

    // Converte os pontos da serra para as coordenadas locais
    // da ambulância, considerando sua rotação.
    const playerLocalSawPoints = sawPoints.map((point) => {
        const offsetX = point.x - player.x;
        const offsetY = point.y - player.y;

        return {
            x: offsetX * cos + offsetY * sin,
            y: -offsetX * sin + offsetY * cos
        };
    });

    const left = Math.min(
        ...playerLocalSawPoints.map((point) => point.x)
    );

    const top = Math.min(
        ...playerLocalSawPoints.map((point) => point.y)
    );

    const right = Math.max(
        ...playerLocalSawPoints.map((point) => point.x)
    );

    const bottom = Math.max(
        ...playerLocalSawPoints.map((point) => point.y)
    );

    // Margem de colisão do contorno visível da serra.
    const collisionPadding = 2 + Math.SQRT1_2;

    // Verificação inicial das caixas delimitadoras.
    if (
        right < mask.left - collisionPadding ||
        left > mask.right + collisionPadding ||
        bottom < mask.top - collisionPadding ||
        top > mask.bottom + collisionPadding
    ) {
        return false;
    }

    const sawEdges = playerLocalSawPoints.map(
        (point, index) => [
            point,
            playerLocalSawPoints[
                (index + 1) % playerLocalSawPoints.length
            ]
        ]
    );

    const collisionPaddingSquared =
        collisionPadding * collisionPadding;

    // Testa os pixels opacos da ambulância contra a serra.
    return mask.pixels.some((pixel) => {
        if (
            pixel.x < left - collisionPadding ||
            pixel.x > right + collisionPadding ||
            pixel.y < top - collisionPadding ||
            pixel.y > bottom + collisionPadding
        ) {
            return false;
        }

        // O pixel está dentro do contorno da serra?
        if (pointInPolygon(pixel, playerLocalSawPoints)) {
            return true;
        }

        // Ou está suficientemente perto de uma das bordas?
        return sawEdges.some(([start, end]) =>
            pointToSegmentDistanceSquared(
                pixel,
                start,
                end
            ) <= collisionPaddingSquared
        );
    });
}


// ============================================================
// COLISÃO COM PAREDES
// ============================================================

function checkWallCollision(player) {
    const level = levels[currentLevel];

    const radius = player.collisionRadius;

    const points = getPlayerCollisionPoints(player);

    const collisionPoints = [
        { x: player.x, y: player.y },
        points.front,
        points.back
    ];

    // Verifica se a ambulância saiu dos limites da rota.

    if (level.route && level.route.length > 1) {
        const routeLimit = level.laneWidth / 2 - radius;
        const routeLimitSquared = routeLimit * routeLimit;

        // Usa o centro do veículo para verificar a rota.
        // A frente e a traseira continuam sendo verificadas
        // contra as paredes reais logo abaixo.
        if (
            routeLimit <= 0 ||
            distanceToRouteSquared(
                { x: player.x, y: player.y },
                level.route
            ) > routeLimitSquared
        ) {
            return true;
        }
    }


    const walls = level.walls ?? [];

    for (const wall of walls) {
        // Centro da ambulância.
        if (
            circleRectangleCollision(
                player.x,
                player.y,
                radius,
                wall
            )
        ) {
            return true;
        }

        // Frente da ambulância.
        if (
            circleRectangleCollision(
                points.front.x,
                points.front.y,
                radius,
                wall
            )
        ) {
            return true;
        }

        // Traseira da ambulância.
        if (
            circleRectangleCollision(
                points.back.x,
                points.back.y,
                radius,
                wall
            )
        ) {
            return true;
        }
    }

    return false;
}


// ============================================================
// DISTÂNCIA MÍNIMA ATÉ UMA ROTA
// ============================================================

function distanceToRouteSquared(point, route) {
    let minimumDistanceSquared = Infinity;

    for (let i = 0; i < route.length - 1; i++) {
        const start = route[i];
        const end = route[i + 1];

        const segmentX = end.x - start.x;
        const segmentY = end.y - start.y;

        const segmentLengthSquared =
            segmentX * segmentX + segmentY * segmentY;

        const projection =
            segmentLengthSquared === 0
                ? 0
                : Math.max(
                    0,
                    Math.min(
                        1,
                        (
                            (point.x - start.x) * segmentX +
                            (point.y - start.y) * segmentY
                        ) / segmentLengthSquared
                    )
                );

        const closestX =
            start.x + projection * segmentX;

        const closestY =
            start.y + projection * segmentY;

        const distanceX = point.x - closestX;
        const distanceY = point.y - closestY;

        const distanceSquared =
            distanceX * distanceX +
            distanceY * distanceY;

        minimumDistanceSquared = Math.min(
            minimumDistanceSquared,
            distanceSquared
        );
    }

    return minimumDistanceSquared;
}


// ============================================================
// COLISÃO COM SERRAS
// ============================================================

function checkSawCollision(player) {
    const saws = levels[currentLevel].saws ?? [];

    return saws.some((saw) =>
        sawTouchesPlayer(player, saw)
    );
}


// ============================================================
// COLISÃO COM O OBJETIVO
// ============================================================

function checkGoalCollision(
    player,
    target = levels[currentLevel].patient
) {
    return circleRectangleCollision(
        player.x,
        player.y,
        player.collisionRadius,
        target
    );
}
