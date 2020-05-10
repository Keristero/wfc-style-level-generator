let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')

let level = new Level(16,32)
let levelGenerator = new LevelGenerator()
let ruleGenerator = new RuleGenerator()

async function Setup(){
    ctx.imageSmoothingEnabled= false
    await level.LoadTileSheet(`emerald_tiles.png`)
    await level.loadTiledMapJSON(`test-tiled-map.json`)
    let rules = ruleGenerator.generateRules(level.tiles)
    level.clearTiles()
    setCoordinate(level.tiles,0,0,1)
    setCoordinate(level.tiles,1,0,1)
    await levelGenerator.Generate(level.tiles,rules)
}

async function Main(){
    await Setup()
    Draw()
}

function Draw(){
    level.Draw(ctx)
    window.requestAnimationFrame(Draw)
}

Main()