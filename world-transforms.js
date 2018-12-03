// Stores TRANSFORMS ONLY for
//  -walls
//  -boundary & ground/ceiling AABBs

window.WorldTransforms = window.classes.WorldTransforms = 
class WorldTransforms {
  // initializes transforms for world that whose BOUNDARIES (not walls) span 2lenx2lenx2height units
  // @param len: unit distance of HALF of grid side. Will span the area spiderman can walk in
  // @param height: HALF of height of world
  // @param boundaryOffset: unit distance between walls and boundaries
  // @param numCells: # of cells on grid side
  constructor(len, height, boundaryOffset, numCells, numCoins) {
    this.groundTransform = Mat4.scale(Vec.of(len,1,len)).times(Mat4.translation(Vec.of(0,-1,0)));
    this.transforms = {
      ground: Mat4.scale(Vec.of((len+boundaryOffset),1,(len+boundaryOffset))).times(Mat4.translation(Vec.of(0,-1,0))),
      ceiling: Mat4.scale(Vec.of((len+boundaryOffset),1,(len+boundaryOffset))).times(Mat4.translation(Vec.of(0,(height+boundaryOffset)+1,0))),
      walls: {
        north: Mat4.scale(Vec.of((len+boundaryOffset),height,1)).times(Mat4.translation(Vec.of(0,1,-1*(len+boundaryOffset)))),
        south: Mat4.scale(Vec.of((len+boundaryOffset),height,1)).times(Mat4.translation(Vec.of(0,1,(len+boundaryOffset)))),
        west: Mat4.scale(Vec.of(1,height,(len+boundaryOffset))).times(Mat4.translation(Vec.of(-1*(len+boundaryOffset),1,0))),
        east: Mat4.scale(Vec.of(1,height,(len+boundaryOffset))).times(Mat4.translation(Vec.of((len+boundaryOffset),1,0)))
      },
      boundaries: {
        north: Mat4.scale(Vec.of(len,height,1)).times(Mat4.translation(Vec.of(0,1,-1*len))),
        south: Mat4.scale(Vec.of(len,height,1)).times(Mat4.translation(Vec.of(0,1,len))),
        west: Mat4.scale(Vec.of(1,height,len)).times(Mat4.translation(Vec.of(-1*len,1,0))),
        east: Mat4.scale(Vec.of(1,height,len)).times(Mat4.translation(Vec.of(len,1,0))),
        ground: Mat4.scale(Vec.of(len,1,len)).times(Mat4.translation(Vec.of(0,-1.00001,0))),
        ceiling: Mat4.scale(Vec.of(len,1,len)).times(Mat4.translation(Vec.of(0,height,0)))
      },
      buildings: [],
      lampposts: [],
      people:   [],
      cars: [],
      coins: []
    };

    // building generation parameters. Change them here
    const gridLength = (len+boundaryOffset)*2; //since grid will refer to wall-bounded world, not boundary-bounded
    const cellLength = gridLength/numCells;
    const buildingLength = 8;
    const buildingOffset = (cellLength - buildingLength)/2;
    const buildingMinHeight = 18;
    const buildingMaxHeight = 25;

    // lamppost generation parameters
    const numCellsBetweenLamps = 4;
    const lampOffset = 10; // w.r.t. right side of cell

    // people/car generation parameters
    const numCellsBetweenPeople = 1; //car uses same one

    // coin generation parameters
    const coinOffset = 3;
    const coinMinHeight = 1.5;
    const coinMaxHeight = buildingMaxHeight;
    const assumedLampSize = 3;

    // world's grid code. Add your objects here, within a cell or something!
    let numBuildings = 0;
    for (let x=gridLength/-2; x<=gridLength/2; x+=cellLength) {
      for (let y=gridLength/-2; y<=gridLength/2; y+=cellLength) {
        // generate and save building transforms
        if (cellLength >= buildingLength) {
          const buildingHeight = Math.floor(Math.random()*(buildingMaxHeight-buildingOffset) + buildingOffset);
          const buildingTransform = Mat4.translation(Vec.of(x+buildingOffset+buildingLength/2.,buildingHeight,y+buildingOffset+buildingLength/2.))
            .times(Mat4.scale(Vec.of(buildingLength/2.,buildingHeight,buildingLength/2.)));
          this.transforms.buildings.push(buildingTransform);
          numBuildings++;
        }
      }
    }
    console.log('Generated '+numBuildings+' buildings');

    // draw cars, people
    let numPeople = 0, numCars = 0;
    for (let x=gridLength/-2; x<=gridLength/2; x+=cellLength*numCellsBetweenPeople) {
      for (let y=gridLength/-2; y<=gridLength/2; y+=cellLength*numCellsBetweenPeople) {
        this.transforms.cars.push(Mat4.translation([x,0,y]));
        numCars++;

        this.transforms.people.push(Mat4.translation([x,0,y]));
        numPeople++;
      }
    }

    // draw lamps
    for (let x=gridLength/-2; x<gridLength/2; x+=cellLength*numCellsBetweenLamps) {
      for (let y=gridLength/-2; y<gridLength/2; y+=cellLength*numCellsBetweenLamps) { 
        const rLampTransform = Mat4.identity().times(Mat4.translation([x+cellLength-lampOffset,5,y+lampOffset]));
        const rOppositeLampTransform = Mat4.identity()
          .times(Mat4.translation([x+cellLength+lampOffset,5,y+lampOffset]))
          .times(Mat4.rotation(Math.PI, Vec.of(0,1,0)));
        const bLampTransform = Mat4.identity()
          .times(Mat4.translation([x+lampOffset,5,y+cellLength-lampOffset]))
          .times(Mat4.rotation(Math.PI/-2., Vec.of(0,1,0)));
        const bOppositeLampTransform = Mat4.identity()
          .times(Mat4.translation([x+lampOffset,5,y+cellLength+lampOffset]))
          .times(Mat4.rotation(Math.PI/2., Vec.of(0,1,0)));
        this.transforms.lampposts.push(rLampTransform);
        this.transforms.lampposts.push(rOppositeLampTransform);
        this.transforms.lampposts.push(bLampTransform);
        this.transforms.lampposts.push(bOppositeLampTransform);
      }
    }

    // randomly generate the cells within boundaries that coins will appear in, with no coin in the same cell
    const numCellsWithinBoundaries = Math.floor(2*len/cellLength);
    const numCellsOutsideBoundariesHalved = Math.floor((numCells - numCellsWithinBoundaries)/2);
    let allPossibleCells = [];
    for (let i=numCellsOutsideBoundariesHalved; i<numCellsOutsideBoundariesHalved+numCellsWithinBoundaries; i++) {
      for (let j=numCellsOutsideBoundariesHalved; j<numCellsOutsideBoundariesHalved+numCellsWithinBoundaries; j++) {
        allPossibleCells.push({ x: i, y: j });
      }
    }
    shuffleArray(allPossibleCells);

    // generate coins' transforms based on cells between buildings and lamps.
    // use lampOffset and buildingOffset to avoid colliding with them
    // (colliding with PPL or cars is OK, they'll 'collect' the coins)
    const baseCoord = gridLength/-2;
    for (let i=0; i<numCoins; i++) {
      const cellX = allPossibleCells[i].x;
      const cellY = allPossibleCells[i].y;

      // Choose x randomly first. y could depend on it
      const finalPosX = Math.random()*cellLength;
      let finalPosY;
      if (cellX % numCellsBetweenLamps == 0) {
        // In cell with lamps on top right or bottom left, lampOffset away from each cell boundary.
        // Assume lamp takes up lampOffset+assumedLampSize from each cell boundary on top right and bottom left.
        // Also assumes lampOffset < buildingOffset. Cell wouldn't make sense otherwise
        // Dont place coin there
        const totalLampOffset = lampOffset+assumedLampSize+coinOffset;
        if (finalPosX < totalLampOffset) {
          finalPosY = Math.random()*(cellLength-totalLampOffset);
        }
        else if (finalPosX >= totalLampOffset && finalPosX <= (cellLength - totalLampOffset)){
          finalPosY = Math.random()*totalLampOffset;
          if (Math.random() > 0.5) {
            finalPosY += cellLength - totalLampOffset;
          }
        }
        else {
          finalPosY = Math.random()*(cellLength - totalLampOffset) + totalLampOffset;
        }
      }
      else {
        //Just need to avoid the building in the cell
        const totalBuildingOffset = buildingOffset + coinOffset;
        if (finalPosX < totalBuildingOffset || finalPosX > (cellLength - totalBuildingOffset)) {
          finalPosY = Math.random()*cellLength;
        }
        else {
          finalPosY = Math.random()*totalBuildingOffset;
          if (Math.random() > 0.5) {
            finalPosY += cellLength - totalBuildingOffset;
          }
        }
      }
      
      const transform = Mat4.identity()
        .times(Mat4.translation([cellX*cellLength+finalPosX+baseCoord,0,cellY*cellLength+finalPosY+baseCoord])
        .times(Mat4.translation([0,Math.random()*(coinMaxHeight-coinMinHeight)+coinMinHeight,0])))
        .times(Mat4.scale([0.8,1,1]));
      this.transforms.coins.push(transform);
    }
  }
  getTransforms() {
    return this.transforms;
  }
  removeCoinTransform(transform) {
    const index = this.transforms.coins.findIndex(function(t) {
      return t.equals(transform);
    });
    if (index > -1) {
      this.transforms.coins.splice(index, 1);
    }
    else {
      console.log("error: world-transforms called on transform that shouldnt exist");
    }
  }
}

//function below copied from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}