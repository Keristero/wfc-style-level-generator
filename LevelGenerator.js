class LevelGenerator{
    constructor(){

    }
    async Generate(tiles,rules,width = 20,height = 20){
        this.tiles = tiles
        this.rules = rules
        this.width = width
        this.height = height
        console.log(`Generating level with rules`,rules)
    
        //Use tiles provided and rules provided to discover which tiles are allowed to go where, add these to possibilities
        let generationFinished = this.GenerationIteration()
        while(!generationFinished){
            generationFinished = this.GenerationIteration()
            level.Draw(ctx)
            level.DrawPossibilities(ctx,this.possibilities)
            await AsyncSleep(1)
        }
    }
    GenerationIteration(){
        this.possibilities = this.ScanForPossibilities()
        //console.log(`Possibilities=`,this.possibilities)
        let lowestEntropyTile = this.FindLowestEntropyTile()
        //console.log(`lowest entropy tile = `,lowestEntropyTile)
        if(lowestEntropyTile){
            this.CollapseTilePossibilitiesRandomly(lowestEntropyTile)
        }else{
            return true
        }
    }
    CollapseTilePossibilitiesRandomly(tile){
        let collapsedTileId = tile.possibilities[Math.floor(Math.random() * tile.possibilities.length)]
        setCoordinate(this.tiles,tile.x,tile.y,collapsedTileId)
    }
    ScanForPossibilities(){
        let possibilities = {}
        for(let x in this.tiles){
            for(let y in this.tiles[x]){
                let tileID = this.tiles[x][y]
                this.ApplyAllowedRules(x,y,tileID,possibilities)
            }
        }
        for(let x in this.tiles){
            for(let y in this.tiles[x]){
                let tileID = this.tiles[x][y]
                this.ApplyBanRules(x,y,tileID,possibilities)
            }
        }
        return possibilities
    }
    FindLowestEntropyTile(){
        let leastOptions = Infinity
        let lowestEntropyTiles = [null]
        for(let x in this.possibilities){
            for(let y in this.possibilities[x]){
                let tileOptions = this.possibilities[x][y]
                if(tileOptions.length < leastOptions){
                    //If there is a new lowest entropy
                    leastOptions = tileOptions.length
                    lowestEntropyTiles = [{x:parseInt(x),y:parseInt(y),possibilities:tileOptions}]
                }else if(tileOptions.length == leastOptions){
                    //If tile entropy matches lowest entropy tile
                    lowestEntropyTiles.push({x:parseInt(x),y:parseInt(y),possibilities:tileOptions})
                }
            }
        }
        //Return a random tile from the lowest entropy list
        return lowestEntropyTiles[Math.floor(Math.random() * lowestEntropyTiles.length)]; 
    }
    ApplyAllowedRules(x,y,tileID,possibilities){
        let allowedTiles = this.rules[tileID].allowed
        for(let relX in allowedTiles){
            for(let relY in allowedTiles[relX]){
                let realX = parseInt(x)+parseInt(relX)
                let realY = parseInt(y)+parseInt(relY)
                
                if(realX > this.width || realY > this.height || realX < 0 || realY < 0){
                    //If rule is outside bounds, dont add possibility
                    continue
                }

                //Check if tile is already occupied
                let val = getCoordinate(this.tiles,realX,realY)
                if(val != null){
                    continue
                }

                let allowedTilesArray = allowedTiles[relX][relY]
                concatToCoordinate(possibilities,realX,realY,allowedTilesArray)
            }
        }
    }
    ApplyBanRules(x,y,tileID,possibilities){
        let bannedTiles = this.rules[tileID].banned
        for(let relX in bannedTiles){
            for(let relY in bannedTiles[relX]){
                let realX = parseInt(x)+parseInt(relX)
                let realY = parseInt(y)+parseInt(relY)
                
                if(realX > this.width || realY > this.height || realX < 0 || realY < 0){
                    //If rule is outside bounds, dont add possibility
                    continue
                }

                //Check if tile is already occupied
                let val = getCoordinate(this.tiles,realX,realY)
                if(val != null){
                    continue
                }

                let bannedTilesArray = bannedTiles[relX][relY]
                reverseConcatFromCoordinate(possibilities,realX,realY,bannedTilesArray)
            }
        }
    }
}