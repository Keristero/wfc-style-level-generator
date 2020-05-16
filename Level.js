class Level{
    constructor(tileSize,mapSize){
        this.tileSize = tileSize
        this.width = mapSize
        this.height = mapSize
        this.useSpriteIDs = false
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
                if(loadedTileID != -1){
                    setCoordinate(this.tiles,x,y,loadedTileID)
                }
            }
        }
        console.log('tiledMap',this.tiles)
    }
    ConvertLevelFormat(rules){
        this.spriteIDs = {}
        let tileIDs = {}
        this.useSpriteIDs = true
        for(let tileIndex in rules){
            let spriteID = parseInt(rules[tileIndex].spriteID)
            tileIDs[spriteID] = tileIndex
            this.spriteIDs[tileIndex] = spriteID
        }
        console.log('tile ids',tileIDs)
        //Convert existing tiles to new IDs
        for(let x in this.tiles){
            for(let y in this.tiles[x]){
                this.tiles[x][y] = tileIDs[this.tiles[x][y]]
            }
        }
        console.log("tiles",this.tiles)
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
                let spriteID = tileID
                if(this.useSpriteIDs){
                    spriteID = this.spriteIDs[tileID]
                }
                let sheet = this.getTileSheetPosById(spriteID)
                let worldX = parseInt(x)*this.tileSize*this.scale
                let worldY = parseInt(y)*this.tileSize*this.scale
                ctx.drawImage(this.tileSheetImage,sheet.x,sheet.y,this.tileSize,this.tileSize,worldX,worldY,this.tileSize*this.scale,this.tileSize*this.scale)
                //ctx.fillText(spriteID,worldX,worldY+10,this.tileSize*this.scale)
            }
        }
    }
    DrawPossibilities(ctx,positionPossibilities){
        for(let x in positionPossibilities){
            for(let y in positionPossibilities[x]){
                ctx.globalAlpha = 0.4;
                let worldX = parseInt(x)*this.tileSize*this.scale
                let worldY = parseInt(y)*this.tileSize*this.scale
                let sum = 0
                for(let tileIndex in positionPossibilities[x][y]){
                    if(positionPossibilities[x][y][tileIndex] === true){
                        sum++
                        let spriteID = tileIndex
                        if(this.useSpriteIDs){
                            spriteID = this.spriteIDs[tileIndex]
                        }
                        let sheet = this.getTileSheetPosById(spriteID)
                        ctx.drawImage(this.tileSheetImage,sheet.x,sheet.y,this.tileSize,this.tileSize,worldX,worldY,this.tileSize*this.scale,this.tileSize*this.scale)
                    }
                }
                ctx.globalAlpha = 1;
                ctx.fillText(sum,worldX,worldY-this.tileSize)
            }
        }
        ctx.globalAlpha = 1;
    }
}