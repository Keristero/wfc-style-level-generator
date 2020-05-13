class LevelGenerator{
    constructor(){

    }
    async Generate(tiles,rules,width = 20,height = 20){
        this.tiles = tiles
        this.rules = rules
        this.width = width
        this.height = height
        this.rippleQueue = []
        console.log(`Generating level with rules`,rules)

        this.InitializeAllPositionPossibilities()
        this.DisablePreexistingPositions()
        this.ApplyContraintsFromPrexistingPositions()
    
        //Use tiles provided and rules provided to discover which tiles are allowed to go where, add these to possibilities
        let generationFinished = this.GenerationIteration()
        while(!generationFinished){
            generationFinished = this.GenerationIteration()
            level.Draw(ctx)
            level.DrawPossibilities(ctx,this.positionPossibilities,this.tileIDs)
            await AsyncSleep(5000)
        }
    }
    GenerationIteration(){
        let lowestEntropyPosition = this.FindLowestEntropyPosition()
        console.log(`Selected position`,lowestEntropyPosition)
        this.ResolveTile(lowestEntropyPosition.x,lowestEntropyPosition.y,lowestEntropyPosition.entropy)
    }
    ResolveTile(x,y,entropy){
    }
    BurnTileToPosition(x,y,tileID){
        setCoordinate(this.tiles,x,y,tileID)
    }
    ApplyConstraintsAroundPosition(x,y){
        let tileID = getCoordinate(this.tiles,x,y)
        let banned = this.rules[tileID].banned
        for(let relX in banned){
            for(let relY in banned[relX]){
                let realX = parseInt(x)+parseInt(relX)
                let realY = parseInt(y)+parseInt(relY)
                
                if(realX >= this.width || realY >= this.height || realX < 0 || realY < 0){
                    //If rule is outside bounds, dont add possibility
                    continue
                }

                //Check if tile is already occupied
                let val = getCoordinate(this.tiles,realX,realY)
                if(val != null){
                    continue
                }
                let bannedTileIDs = banned[relX][relY]
                this.BlacklistPossibilitiesForPosition(realX,realY,bannedTileIDs)
            }
        }
    }
    ApplyContraintsFromPrexistingPositions(){
        for(let x in this.tiles){
            for(let y in this.tiles[x]){
                this.ApplyConstraintsAroundPosition(x,y)
            }
        }
    }
    CountTrue(array){
        let sum = 0
        for(let i in array){
            if(array[i]){
                sum++
            }
        }
        return sum
    }
    FindLowestEntropyPosition(){
        let leastOptions = Infinity
        let lowestEntropyPositions = [null]
        for(let x in this.positionPossibilities){
            for(let y in this.positionPossibilities[x]){
                let tileOptions = this.positionPossibilities[x][y]
                let optionCount = this.CountTrue(tileOptions)
                if(optionCount > 0){
                    if(optionCount < leastOptions){
                        //If there is a new lowest entropy
                        leastOptions = optionCount
                        lowestEntropyPositions = [{x:parseInt(x),y:parseInt(y),entropy:leastOptions}]
                        console.log('new low',tileOptions)
                    }else if(optionCount == leastOptions){
                        //If position entropy matches lowest entropy position
                        lowestEntropyPositions.push({x:parseInt(x),y:parseInt(y),entropy:leastOptions})
                    }
                }
            }
        }
        //Return a random tile from the lowest entropy list
        return lowestEntropyPositions[Math.floor(Math.random() * lowestEntropyPositions.length)]; 
    }
    InitializeAllPositionPossibilities(){
        //Create a big ol array representing all the possible tiles for each grid position
        this.positionPossibilities = {}
        this.tileIDs = Object.keys(this.rules)
        for(let index in this.tileIDs){
            this.tileIDs[index] = parseInt(this.tileIDs[index])
        }
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                for(let tileID of this.tileIDs){
                    pushToCoordinate(this.positionPossibilities,x,y,true)
                }
            }
        }
    }
    GetPossibilityIndexById(tileID){
        return this.tileIDs.indexOf(tileID)
    }
    GetTileIdFromPossibilityIndex(index){
        return this.rules[index]
    }
    BlacklistPossibilitiesForPosition(x,y,blacklist){
        let tile = this.positionPossibilities[x][y]
        for(let tileID of blacklist){
            let bannedIndex = this.GetPossibilityIndexById(tileID)
            tile[bannedIndex] = false
        }
    }
    DisablePosition(x,y){
        //Remove all possibilities for this position
        let tile = this.positionPossibilities[x][y]
        for(let i = 0; i < tile.length; i++){
            tile[i] = false
        }
    }
    LockPositionTile(x,y,tileID){
        //Remove all possibilities for this tile, except allow the specified tileID
        let tileIndex = this.GetPossibilityIndexById(tileID)
        let position = this.positionPossibilities[x][y]
        for(let i = 0; i < position.length; i++){
            if(i==tileIndex){
                position[i] = true
            }else{
                position[i] = false
            }
        }
    }
    DisablePreexistingPositions(){
        //Disable pre existing positions because they are already resolved
        for(let x in this.tiles){
            for(let y in this.tiles[x]){
                this.DisablePosition(x,y)
            }
        }
    }
}

class OldStuff{
    constructor(){

    }
    GenerationIteration(){
        this.possibilities = this.ScanForPossibilities()
        //console.log(`Possibilities=`,this.possibilities)
        let lowestEntropyTile = this.FindLowestEntropyTile()
        console.log(lowestEntropyTile)
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
        return collapsedTileId
    }
    ScanForPossibilities(){
        let possibilities = {}
        //this.AllowAllTiles(possibilities)
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
    AllowAllTiles(possibilities){
        let allTiles = Object.keys(this.rules)
        for(let tileID of allTiles){
            tileID = parseInt(tileID)
        }
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                if(!this.tiles[x] || !this.tiles[x][y]){
                    concatToCoordinate(possibilities,x,y,allTiles)
                }
            }
        }
    }
    ApplyAllowedRules(x,y,tileID,possibilities){
        let allowedTiles = this.rules[tileID].allowed
        for(let relX in allowedTiles){
            for(let relY in allowedTiles[relX]){
                let realX = parseInt(x)+parseInt(relX)
                let realY = parseInt(y)+parseInt(relY)
                
                if(realX >= this.width || realY >= this.height || realX < 0 || realY < 0){
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