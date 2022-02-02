const fs = require('fs');
let binaryData = fs.readFileSync('categories_V3.json');
//let binaryData = fs.readFileSync('small_data_sample.json');
let jsonData = JSON.parse(binaryData);
jsonData = jsonData.categories;

function checkLevel(node) {
    return node.Level;
}

let listOfLetters =
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"]

let currentLetter = "U"

// create the tree array
let tree = [];
let builder = {}
let level1 = {}
let level2 = {}
let level3 = {}
let level4 = {}
let level5 = {}
let level6 = {}


jsonData.forEach(function (node) {
    let level = checkLevel(node);
    let levelSplitter;

    let SICkey = node.SIC;

    // delete node.ID;
    delete node.Level;
    delete node.ParentSIC;

    if (SICkey.includes(currentLetter)) {
        if (level === 1) {

            level1 = {
                [SICkey]: node,
            }

        } else if (level === 2) {
            levelSplitter = SICkey.split(".");
            level2 = node;
            level1[levelSplitter[0]][SICkey] = level2

        } else if (level === 3) {
            levelSplitter = SICkey.split(".");
            let level2 = levelSplitter[0] + "." + levelSplitter[1];
            level3 = node;
            level1[levelSplitter[0]][level2][SICkey] = level3
        } else if (level === 4) {
            levelSplitter = SICkey.split(".");
            let level2 = levelSplitter[0] + "." + levelSplitter[1];
            let level3 = levelSplitter[0] + "." + levelSplitter[1] + "." + levelSplitter[2];
            level4 = node;
            level1[levelSplitter[0]][level2][level3][SICkey] = level4
        } else if (level === 5) {
            levelSplitter = SICkey.split(".");
            let level2 = levelSplitter[0] + "." + levelSplitter[1];
            let level3 = levelSplitter[0] + "." + levelSplitter[1] + "." + levelSplitter[2];

            let level4 =
                levelSplitter[0] + "." +
                levelSplitter[1] + "." +
                levelSplitter[2] + "." +
                levelSplitter[3];

            level5 = node;
            level1[levelSplitter[0]][level2][level3][level4][SICkey] = level5;
        } else if (level === 6) {
            level6 = node;
            levelSplitter = SICkey.split(".");
            let level2 = levelSplitter[0] + "." + levelSplitter[1];
            let level3 = levelSplitter[0] + "." + levelSplitter[1] + "." + levelSplitter[2];
            let level4 = levelSplitter[0] + "." + levelSplitter[1] + "." + levelSplitter[2] + "." + levelSplitter[3];
            let level5 = levelSplitter[0] + "." + levelSplitter[1] + "." + levelSplitter[2] + "." + levelSplitter[3] + "." + levelSplitter[4];

            if (level1[levelSplitter[0]][level2][level3][level4][level5] === undefined) {
                level1[levelSplitter[0]][level2][level3][level4][SICkey] = level6;
            } else {
                level1[levelSplitter[0]][level2][level3][level4][level5][SICkey] = level6;
            }
        }
    }
    return level1;
});


fs.writeFile("output" + currentLetter + "_v3.json", JSON.stringify(level1), function (err) {
    if (err) {
        console.log(err);
    }
});

