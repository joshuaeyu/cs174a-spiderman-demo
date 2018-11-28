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
  constructor(len, height, boundaryOffset, numCells) {
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
        ground: Mat4.scale(Vec.of(len,1,len)).times(Mat4.translation(Vec.of(len,-1,0))),
        ceiling: Mat4.scale(Vec.of(len,1,len)).times(Mat4.translation(Vec.of(0,height,0)))
      },
      buildings: []
    };

    // building generation parameters. Change them here
    const gridLength = (len+boundaryOffset)*2; //since grid will refer to wall-bounded world, not boundary-bounded
    const cellLength = gridLength/numCells;
    const buildingLength = 8;
    const buildingOffset = (cellLength - buildingLength)/2;
    const buildingMinHeight = 18;
    const buildingMaxHeight = 25;

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

        //todo: adding lampposts, etc
      }
    }
    console.log('Generated '+numBuildings+' buildings');
  }
  getTransforms() {
    return this.transforms;
  }
}