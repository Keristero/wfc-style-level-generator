class NewLevelGenerator{
    constructor(){

    }
    async Generate(positions,rules,width = 20,height = 20){
        this.positions = positions
        this.rules = rules
        this.width = width
        this.height = height

        console.log(`Generating level with rules`,this.rules)
        this.queue = []
        this.InitializeAllPositionPossibilities()
        this.ApplyPrexistingPositions()
    
        //Use tiles provided and rules provided to discover which tiles are allowed to go where, add these to possibilities
        let generationFinished = this.GenerationIteration()
        while(!generationFinished){
            generationFinished = this.GenerationIteration()
            //level.Draw(ctx)
            /*
            level.Draw(ctx)
            level.DrawPossibilities(ctx,this.positionPossibilities)
            await AsyncSleep(10)
            */
        }
        level.Draw(ctx)
        level.DrawPossibilities(ctx,this.positionPossibilities)
    }
    GenerationIteration(){
        while(this.queue.length > 0){
            let positionToProcess = this.queue.shift()
            this.UpdatePossibilitiesForTilesSurrounding(positionToProcess.x,positionToProcess.y)
        }
        let lowestEntropyPosition = this.FindLowestEntropyPosition()
        if(lowestEntropyPosition){
            this.RandomlyResolveTile(lowestEntropyPosition.x,lowestEntropyPosition.y)
            return false
        }else{
            return true
        }
    }
    RandomlyResolveTile(x,y){
        let tile = this.positionPossibilities[x][y]
        let options = []
        for(let tileID in tile){
            if(tile[tileID] === true){
                options.push(tileID)
            }
        }
        let newTileId = options[Math.floor(Math.random() * options.length)];
        this.SelectSinglePossibilityForPosition(x,y,newTileId)
        setCoordinate(this.positions,x,y,newTileId)
    }
    SelectSinglePossibilityForPosition(x,y,tileID){
        //Remove all possibilities for this position, except for one
        let tile = this.positionPossibilities[x][y]
        for(let i = 0; i < tile.length; i++){
            tile[i] = false
        }
        tile[tileID] = true
        this.UpdatePossibilitiesForTilesSurrounding(x,y)
    }
    UpdatePossibilitiesForTilesSurrounding(x,y){
        let possibilities = this.positionPossibilities[x][y]
        for(let relX = -1; relX <= 1; relX++){
            for(let relY = -1; relY <= 1; relY++){
                if(relX == 0 && relY == 0){
                    //Skip current position
                    continue
                }
                //Check if tile is already resolved
                let posX = x+relX
                let posY = y+relY
                let positionTile = getCoordinate(this.positions,posX,posY)
                if(positionTile === null){
                    this.UpdatePositionBasedOnPossibilities(posX,posY,possibilities,relX,relY)
                }
            }
        }
    }
    UpdatePositionBasedOnPossibilities(x,y,possibilitiesB,relX,relY){
        //Keep track of if we changed anything or not
        let changed = false
        if(x < 0 || y < 0 || x >= this.width || y >= this.height){
            //if position is outside of level, skip
            return
        }
        //We need to check if any of the possible tile ids in this tile are no longer possible
        let possibilitiesA = this.positionPossibilities[x][y]
        //Loop through all the tiles that could be here
        for(let hereId in possibilitiesA){
            if(!possibilitiesA[hereId]){
                continue
                //Skip if impossible already
            }
            //Keep track of the possibility of this tile id (hereId)
            let impossible = true
            //Loop through all the tiles that could be there
            placable:for(let thereId in possibilitiesB){
                if(possibilitiesB[thereId]){
                    let allowedIDs = this.rules[thereId].allowed[relX][relY]
                    //Loop through all the tiles that that tile there allows here
                    for(let allowedId of allowedIDs){
                        //As soon as we find a tile that allows this tile here, return
                        if(allowedId == hereId){
                            impossible = false
                            continue placable
                        }
                    }
                }
            }
            if(impossible == true){
                possibilitiesA[hereId] = false
                //Note that we changed something, now we will have to check every surrounding tile against this one
                changed = true
            }
        }
        if(changed){
            //add this tile to the queue to be tested
            this.queue.push({x:x,y:y})
        }
    }
    UpdatedPossibilitiesBasedOn
    InitializeAllPositionPossibilities(){
        //Create a big ol array representing all the possible tiles for each grid position
        this.positionPossibilities = {}
        for(let x = 0; x < this.width; x++){
            this.positionPossibilities[x] = {}
            for(let y = 0; y < this.height; y++){
                this.positionPossibilities[x][y] = []
                for(let tileID in this.rules){
                    this.positionPossibilities[x][y].push(true)
                }
            }
        }
        console.log("Initialized position possibilities",this.positionPossibilities)
    }
    ApplyPrexistingPositions(){
        //Disable pre existing positions because they are already resolved
        for(let x in this.positions){
            x = parseInt(x)
            for(let y in this.positions[x]){
                y = parseInt(y)
                this.SelectSinglePossibilityForPosition(x,y,this.positions[x][y])
                console.log(`${x},${y} is ${this.positions[x][y]}`)
            }
        }
    }
    FindLowestEntropyPosition(){
        let leastOptions = Infinity
        let lowestEntropyPositions = [null]
        for(let x in this.positionPossibilities){
            for(let y in this.positionPossibilities[x]){
                let tileOptions = this.positionPossibilities[x][y]
                let optionCount = this.CountTrue(tileOptions)
                if(optionCount > 1){
                    if(optionCount < leastOptions){
                        //If there is a new lowest entropy
                        leastOptions = optionCount
                        lowestEntropyPositions = [{x:parseInt(x),y:parseInt(y),entropy:leastOptions}]
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
    CountTrue(array){
        let sum = 0
        for(let i in array){
            if(array[i]){
                sum++
            }
        }
        return sum
    }
}