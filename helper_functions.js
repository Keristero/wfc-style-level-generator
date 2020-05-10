function LoadImage(path){
    console.log(`Loading Image ${path}`)
    return new Promise((resolve,reject)=>{
        let image = new Image()
        image.onload = ()=>{
            console.log(`Loaded Image ${path}`)
            resolve(image)
        }
        image.src = path
    });
}

function setCoordinate(grid,x,y,value){
    if(!grid[x]){
        grid[x] = {}
    }
    grid[x][y] = value
}

function concatToCoordinate(grid,x,y,array_b){
    if(!grid[x]){
        grid[x] = {}
    }
    if(!grid[x][y]){
        grid[x][y] = []
    }
    grid[x][y] = grid[x][y].concat(array_b)
}

function pushToCoordinateNonDuplicate(grid,x,y,value){
    if(!grid[x]){
        grid[x] = {}
    }
    if(!grid[x][y]){
        grid[x][y] = []
    }
    for(let existing of grid[x][y]){
        if(value == existing){
            return
        }
    }
    grid[x][y].push(value)
}

function reverseConcatFromCoordinate(grid,x,y,array_b){
    if(!grid[x]){
        grid[x] = {}
    }
    if(!grid[x][y]){
        grid[x][y] = []
    }
    for(let val of array_b){
        grid[x][y] = arrayRemove(grid[x][y],val)
    }
    if(grid[x][y].length == 0){
        delete grid[x][y]
    }
}

function arrayRemove(arr, value) { 
    return arr.filter(function(ele){ return ele != value; });
}

function pushToCoordinate(grid,x,y,value){
    if(!grid[x]){
        grid[x] = {}
    }
    if(!grid[x][y]){
        grid[x][y] = []
    }
    grid[x][y].push(value)
}

function getCoordinate(grid,x,y){
    if(grid[x] && typeof(grid[x][y]) == "number"){
        return grid[x][y]
    }else{
        return null
    }
}

function AsyncSleep(time){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,time)
    })
}

function GetRequest(path){
    return new Promise((resolve,reject)=>{
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                resolve(xhr.responseText)
            } else {
                console.error(xhr.statusText);
                reject(xhr.statusText)
            }
        }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
            reject(xhr.statusText)
        };
        xhr.send(null); 
    })
}