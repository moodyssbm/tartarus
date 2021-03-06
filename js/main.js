/*
 * Module by: Ethan Moody
 * March 5th, 2018
*/

let gameboy     = document.getElementById('gameboy');       // Setting gameboy definitions
gameboy.screen  = gameboy.getContext('2d');
gameboy.w       = 160;
gameboy.h       = 144;

let palette = ["#9bbc0f", "#8bac0f", "#306230", "#0f380f"]; // Light -> Dark

function newScreen() {                                      // Function that clears the screen
    gameboy.screen.fillStyle = palette[0];
    gameboy.screen.fillRect(0, 0, gameboy.w, gameboy.h);
}

newScreen();                                                // Setting a base for our screen

function drawHUD() {
    gameboy.screen.fillStyle = palette[2];
    gameboy.screen.fillRect(gameboy.w - 16, 0, 16, 144);
}

drawHUD();

let wall = {
    passable: false,
    sprite: sprites.wall
};

let floor = {
    passable: true,
    sprite: sprites.floor
};

let downStairs = {
    pos: {
        x: 0,
        y: 0
    },
    sprite: sprites.downStairs,
    passable: true
}

let upStairs = {
    pos: {
        x: 11,
        y: 0
    },
    sprite: sprites.upStairs,
    passable: true
}

let player = {
    sprite: sprites.player,
    pos: {
        x: 0,
        y: 0
    }
};

function drawTile(x, y, tile) {
    x *= 8;
    y *= 8;

    for(i=0; i!=tile.length; i++) {
        for(j=0; j!=tile[i].length; j++) {
            gameboy.screen.fillStyle = palette[tile[i][j]];
            gameboy.screen.fillRect(x+j, y+i, 1, 1);
        }
    }
}

function getTile() {
    let rand = Math.floor(Math.random() * 2);
    if(rand == 0) {
        return wall;
    } else {
        return floor;
    }
}

let map = [];

function drawMap() {
    let x = 0;
    let y = 0;
    while(y != 18) {
        while(x != 18) {
            drawTile(x,y,map[y][x].sprite);
            x++
        }
        x = 0;
        y++;
    }
}

function makePath(side) {
    map[player.pos.y][0] = downStairs;
    downStairs.pos.y = player.pos.y;
    if(side == 0) {
        player.pos.x++;
    } else {
        player.pos.x--;
    }

    let pathX = 1;
    let pathY = player.pos.y;

    while(pathX < 18) {
        map[pathY][pathX] = floor;

        if(pathX == 17) {
            upStairs.pos.x = pathX;
            upStairs.pos.y = pathY;
            map[pathY][pathX] = upStairs;
        }
        let nextStep = Math.floor(Math.random() * 3);
        if(map[pathY][pathX] == upStairs) {
            nextStep = 0;
        }
        switch(nextStep) {
            case 0:
                pathX++;
                break;
            case 1:
                pathY++;
                if(pathY == 18) {
                    pathY--;
                }
                break;
            case 2:
                pathY--;
                if(pathY == -1) {
                    pathY++;
                }
                break;
        }
    }
}

function rollFloor(side) {
    map = [];

    for(i=0; i!=18; i++) {
        map.push(new Array());
    }

    for(i=0; i!=18; i++) {
        for(j=0; j!=18; j++) {
            map[i].push(getTile());
        }
    }

    player.pos.y = Math.floor(Math.random() * 18);
    player.pos.x = side;

    makePath(side);
    drawMap();

    if(side != 0) {
        player.pos.y = upStairs.pos.y;
    }

    drawTile(player.pos.x, player.pos.y, player.sprite);
}

rollFloor(0);

addEventListener("keydown", function(event) {
    if(event.keyCode == 68 && map[player.pos.y][player.pos.x+1].passable == true) {
        drawTile(player.pos.x, player.pos.y, map[player.pos.y][player.pos.x].sprite);
        player.pos.x++;
        if(player.pos.x == 18) {
            player.pos.x--;
        }
        drawTile(player.pos.x, player.pos.y, player.sprite);
    } else if(event.keyCode == 83 && map[player.pos.y+1][player.pos.x].passable == true) {
        drawTile(player.pos.x, player.pos.y, map[player.pos.y][player.pos.x].sprite);
        player.pos.y++;
        if(player.pos.y == 18) {
            player.pos.y--;
        }
        drawTile(player.pos.x, player.pos.y, player.sprite);
    } else if(event.keyCode == 65 && map[player.pos.y][player.pos.x-1].passable == true) {
        drawTile(player.pos.x, player.pos.y, map[player.pos.y][player.pos.x].sprite);
        player.pos.x--;
        if(player.pos.x == -1) {
            player.pos.x++;
        }
        drawTile(player.pos.x, player.pos.y, player.sprite);
    } else if(event.keyCode == 87 && map[player.pos.y-1][player.pos.x].passable == true) {
        drawTile(player.pos.x, player.pos.y, map[player.pos.y][player.pos.x].sprite);
        player.pos.y--;
        if(player.pos.y == -1) {
            player.pos.y++
        }
        drawTile(player.pos.x, player.pos.y, player.sprite);
    }

    if(player.pos.x == upStairs.pos.x && player.pos.y == upStairs.pos.y) {
        rollFloor(0);
    } else if(player.pos.x == downStairs.pos.x && player.pos.y == downStairs.pos.y) {
        rollFloor(17);
    }
},false);