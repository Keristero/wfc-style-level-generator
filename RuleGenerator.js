class RuleGenerator{
    constructor(){

    }
    generateRules(tiles,allowedRuleRadius=1,bannedRuleRadius=1){
        this.tiles = tiles;
        this.allowedRuleRadius = allowedRuleRadius
        this.bannedRuleRadius = bannedRuleRadius
        this.rules = {}
        console.log(`generating rules for tiles`,this.tiles)
        //RULES OF NAAATUUURE
        let scanRadus = Math.max(this.allowedRuleRadius,this.bannedRuleRadius)
        for(let x in this.tiles){
            for(let y in this.tiles[x]){
                this.addAllowedTiles(parseInt(x),parseInt(y),scanRadus)
            }
        }
        //Generate banned tile rules based on tiles missing from allowed tile rules
        for(let tileID in this.rules){
            this.addBannedTiles(tileID)
        }
        for(let tileID in this.rules){
            this.trimRules(this.rules[tileID].allowed,this.allowedRuleRadius)
            this.trimRules(this.rules[tileID].banned,this.bannedRuleRadius)
        }
        
        //Convert rules into an optimized format for the level generator
        this.spriteIDs = Object.keys(this.rules)
        for(let i in this.spriteIDs){
            this.spriteIDs[i] = parseInt(this.spriteIDs[i])
        }
        console.log(this.spriteIDs)
        console.log(this.rules)
        let newRules = this.ExportLevelGeneratorRules(this.rules)
        console.log("The emperor's new rules",newRules)
        return newRules
    }
    trimRules(rules,maxRadius){
        for(let x in rules){
            if(x > maxRadius || x < -maxRadius){
                delete rules[x]
                continue
            }
            for(let y in rules[x]){
                if(y > maxRadius || y < -maxRadius){
                    delete rules[y]
                    continue
                }
            }
        }
    }
    addBannedTiles(subjectTileID){
        let tileRules = this.rules[subjectTileID]
        let tileIdList = Object.keys(this.rules)
        //Convert tile IDS in tileIdList to numbers
        for(let index in tileIdList){
            tileIdList[index] = parseInt(tileIdList[index])
        }
        //Go through each coordinate in allowed tile rules
        for(let x in tileRules.allowed){
            for(let y in tileRules.allowed[x]){
                //Copy list of every tile
                let bannedList = JSON.parse(JSON.stringify(tileIdList))
                //Now generate a banned list by removing the allowed tiles
                for(let allowedTileID of tileRules.allowed[x][y]){
                    for(let i = 0; i < bannedList.length; i++){
                        if(bannedList[i] == allowedTileID){
                            bannedList.splice(i, 1)
                        }
                    }
                }
                concatToCoordinate(tileRules.banned,x,y,bannedList)
            }
        }
    }
    addAllowedTiles(tileX,tileY,radius){
        let tileID = getCoordinate(this.tiles,tileX,tileY)
        for(let x = -radius; x <= radius; x++){
            for(let y = -radius; y <= radius; y++){
                if(x == 0 && y == 0){
                    //Skip adding rules relative to own tile
                    continue
                }
                let subjectTileID = getCoordinate(this.tiles,tileX+x,tileY+y)
                if(subjectTileID === null){
                    continue
                }
                this.addAllowedTile(tileID,x,y,subjectTileID)
            }
        }
    }
    addAllowedTile(forTileID,x,y,subjectTileID){
        if(!this.rules[forTileID]){
            this.rules[forTileID] = {
                allowed:{},
                banned:{}
            }
        }
        let tileRules = this.rules[forTileID]
        pushToCoordinateNonDuplicate(tileRules.allowed,x,y,subjectTileID)
    }
    GetPossibilityIndexById(spriteID){
        console.log("in sprite id",spriteID)
        let out = this.spriteIDs.indexOf(spriteID)
        console.log("out",out)
        return out
    }
    ExportLevelGeneratorRules(rules){
        /* Optimize input rules for easy use */
        let newRules = []
        for(let spriteID in rules){
            let allowed = rules[spriteID].allowed
            let banned = rules[spriteID].banned

            for(let x in allowed){
                for(let y in allowed[x]){
                    for(let i in allowed[x][y]){
                        allowed[x][y][i] = this.GetPossibilityIndexById(allowed[x][y][i])
                    }
                }
            }
            for(let x in banned){
                for(let y in banned[x]){
                    for(let i in banned[x][y]){
                        banned[x][y][i] = this.GetPossibilityIndexById(banned[x][y][i])
                    }
                }
            }
            let newTileInfo = {allowed:allowed,spriteID:spriteID}
            newRules.push(newTileInfo)
        }
        return newRules
    }
}