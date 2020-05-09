let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')

let level = new Level(16,32)
let levelGenerator = new LevelGenerator()

async function Setup(){
    await level.LoadTileSheet(`emerald_tiles.png`)
    await levelGenerator.Generate(level.tiles,levelGenerationRules)
}

async function Main(){
    await Setup()
    Draw()
}

function Draw(){
    //level.Draw(ctx)
    window.requestAnimationFrame(Draw)
}

Main()