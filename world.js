// Stores transforms for
//  -world boundaries: walls, ceiling, floor
//  -buildings
//  -spiderman pos

window.WorldTransforms = window.classes.WorldTransforms = 
class WorldTransforms {
  // initializes transforms for world that is 2lenx2lenx2height units
  constructor(len, height) {
      
	  const northWallTransform = Mat4.scale(Vec.of(50,50,1)).times(Mat4.translation(Vec.of(0,0.98,-51)));
	  const westWallTransform = Mat4.scale(Vec.of(1,50,50)).times(Mat4.translation(Vec.of(-51,0.98,0)));
	  const eastWallTransform = Mat4.scale(Vec.of(1,50,50)).times(Mat4.translation(Vec.of(51,0.98,0)));

    this.groundTransform = Mat4.scale(Vec.of(len,1,len)).times(Mat4.translation(Vec.of(0,-1,0)));
    this.transforms = {
      walls: {
        north: Mat4.scale(Vec.of(len,height,1)).times(Mat4.translation(Vec.of(0,1,-1*len))),
        south: Mat4.scale(Vec.of(len,height,1)).times(Mat4.translation(Vec.of(0,1,len))),
        west: Mat4.scale(Vec.of(1,height,len)).times(Mat4.translation(Vec.of(-1*len,1,0))),
        east: Mat4.scale(Vec.of(1,height,len)).times(Mat4.translation(Vec.of(len,1,0)))
      }
    }
  }
  get_transforms() {
    return this.transforms;
  }
}