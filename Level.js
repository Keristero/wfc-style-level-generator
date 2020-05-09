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
                ctx.fillText(tileID,worldX,worldY+10,16)
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