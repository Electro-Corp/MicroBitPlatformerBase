// Save states
let last_x = 0;
let last_y = 0;
let onGround = false;

let hangFrames = 2;
let heldFrames = 0;

function LoadMap(map: number[][]) {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            if (map[y][x] == 1) {
                led.plot(x, y);
            }
        }
    }
}

function ClearMap(){
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            led.unplot(x, y);
        }
    }
}

function UpdatePlayer(px: number, py: number, map: number[][]) {
    // Clear current location
    led.unplot(px, py);
    // Run our calculations
    // Check x
    if (map[py][px] == 1) {
        px = last_x;
    }
    // Check y
    if (map[py + 1][px] != 1) {
        heldFrames++;
        onGround = false;
        if (heldFrames > hangFrames) {
            heldFrames = 0;
            py++;
        }
        if(py > 3){
            py = 0;
            px = 0;
        }
    } else if (map[py][px] == 1) {
        onGround = false;
        heldFrames++;
        if (heldFrames > hangFrames) {
            heldFrames = 0;
            py--;
        }
    } else {
        heldFrames = 0;
        onGround = true;
    }
    // Draw
    led.plot(px, py);

    player_x = px;
    player_y = py;
}

let map_1: number[][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1]
];
let map_2: number[][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1]
];
let map_3: number[][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 1]
];

let currentMap = map_1;

let maps = [map_1, map_2, map_3];
let currentIndex = 0;

LoadMap(currentMap);

let player_x = 0;
let player_y = 0;


// Play the game
basic.forever(function () {
    LoadMap(currentMap);
    last_x = player_x;
    last_y = player_y;
    led.unplot(last_x, last_y);


    if (input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B) && onGround) {
        onGround = !onGround;
        // Check if someone is above us or if we're too higj
        if (player_y - 2 < 0) {
            if(player_y-- > 0){
                if (currentMap[player_y--][player_x] != 1){
                    player_y--;
                }
            }
        } else {
            if (currentMap[player_y - 2][player_x] != 1 && currentMap[player_y--][player_x] != 1) {
                player_y-=2;
            }
        }
    } else if (input.buttonIsPressed(Button.B) && player_x < 4) {
        player_x++;
    } else if (input.buttonIsPressed(Button.A) && player_x > 0) {
        player_x--;
    }

    if(player_x > 3){
        // Next map
        if(currentIndex < maps.length - 1){
            currentIndex++;
            // Clear screen
            ClearMap();
            currentMap = maps[currentIndex];
            player_x = 0;
            player_y = 0;
        }
    }

    UpdatePlayer(player_x, player_y, currentMap);
    control.waitMicros(50000);
})
