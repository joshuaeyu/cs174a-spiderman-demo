// Stores TRANSFORMS ONLY for
//  -walls
//  -boundary & ground/ceiling AABBs

window.WorldTransforms = window.classes.WorldTransforms = 
class WorldTransforms {
  // initializes transforms for world that whose BOUNDARIES (not walls) span 2lenx2lenx2height units
  // boundaryOffset: unit distance between walls and boundaries
  constructor(len, height, boundaryOffset) {
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
      }
    };
  }
  getTransforms() {
    return this.transforms;
  }
}