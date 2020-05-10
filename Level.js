class Level{
    constructor(tileSize,mapSize){
        this.tileSize = tileSize
        this.width = mapSize
        this.height = mapSize
        this.tiles = {
            0:{
                0:270
            },
        }
        this.scale = 2
    }
    clearTiles(){
        this.tiles = {}
    }
    async loadTiledMapJSON(jsonPath){
        let response = await GetRequest(jsonPath)
        let tiledMap = JSON.parse(response)
        let layerIndexToLoad = 0
        let layer = tiledMap.layers[layerIndexToLoad]
        this.tiles = {}
        for(let x = 0; x < layer.width; x++){
            for(let y = 0; y < layer.height; y++){
                let oneDimensionalIndex = (y*layer.width)+x
                let loadedTileID = layer.data[oneDimensionalIndex]-1
                setCoordinate(this.tiles,x,y,loadedTileID)
            }
        }
        console.log('tiledMap',this.tiles)
    }
    async LoadTileSheet(path){
        this.tileSheetImage = await LoadImage(path)
        this.tileSheetColumns = this.tileSheetImage.naturalWidth/this.tileSize
        this.tileSheetRows = this.tileSheetImage.naturalHeight/this.tileSize
        console.log(`Loaded tilesheet ${path}, columns=${this.tileSheetColumns} rows=${this.tileSheetRows}`)
    }
    getTileSheetPosById(id){
        let x = id % this.tileSheetColumns
        let y = Math.floor(id/this.tileSheetColumns)
        return {x:x*this.tileSize,y:y*this.tileSize}
    }
    Draw(ctx){
        ctx.clearRect(0,0,9999,9999)
        for(let x in this.tiles){
            for(let y in this.tiles[x]){
                let tileID = this.tiles[x][y]
                let sheet = this.getTileSheetPosById(tileID)
                let worldX = parseInt(x)*this.tileSize*this.scale
                let worldY = parseInt(y)*this.tileSize*this.scale
                ctx.drawImage(this.tileSheetImage,sheet.x,sheet.y,this.tileSize,this.tileSize,worldX,worldY,this.tileSize*this.scale,this.tileSize*this.scale)
                ctx.fillText(tileID,worldX,worldY+10,this.tileSize*this.scale)
            }
        }
    }
    DrawPossibilities(ctx,possibilities){
        ctx.globalAlpha = 0.2;
        for(let x in possibilities){
            for(let y in possibilities[x]){
                for(let tileID of possibilities[x][y]){
                    let sheet = this.getTileSheetPosById(tileID)
                    let worldX = parseInt(x)*this.tileSize*this.scale
                    let worldY = parseInt(y)*this.tileSize*this.scale
                    ctx.drawImage(this.tileSheetImage,sheet.x,sheet.y,this.tileSize,this.tileSize,worldX,worldY,this.tileSize*this.scale,this.tileSize*this.scale)
                }
            }
        }
        ctx.globalAlpha = 1;
    }
}