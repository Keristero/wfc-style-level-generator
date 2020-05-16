let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')

let trainingLevel = new Level(16,32)
let levelGenerator = new NewLevelGenerator()
let ruleGenerator = new RuleGenerator()
let level = new Level(16,32)
let rules = null

async function GenerateRules(){
    await trainingLevel.loadTiledMapJSON(`training-map.json`)
    rules = ruleGenerator.generateRules(trainingLevel.tiles)
    downloadFile(JSON.stringify(rules),"rules.json","'text/plain'")
}

async function Setup(){
    //await GenerateRules()
    let response = await GetRequest("rules.json")
    let rules = JSON.parse(response)
    ctx.imageSmoothingEnabled= false
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