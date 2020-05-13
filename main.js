let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')

let trainingLevel = new Level(16,32)
let levelGenerator = new NewLevelGenerator()
let ruleGenerator = new RuleGenerator()
let level = new Level(16,32)
let rules = null

async function Setup(){
    ctx.imageSmoothingEnabled= false
    await trainingLevel.loadTiledMapJSON(`training-map.json`)
    rules = ruleGenerator.generateRules(trainingLevel.tiles)
    await level.LoadTileSheet(`emerald_tiles.png`)
    await level.loadTiledMapJSON(`incomplete-map.json`)
    level.ConvertLevelFormat(rules)
    await levelGenerator.Generate(level.tiles,rules)
}

async function Main(){
    await Setup()
    //Draw()
}

Main()