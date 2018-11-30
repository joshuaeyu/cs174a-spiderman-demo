// Represents an AABB by its XYZ axes bounds and the transform matrix of the shape it surrounds.
window.AABB = window.classes.AABB =
class AABB {
  // Note: usually won't use this to create a new AABB. Instead, call the static method AABB.generateAABBFromPoints(..)
  constructor( minX, maxX, minY, maxY, minZ, maxZ, baseMatrix ) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.minZ = minZ;
    this.maxZ = maxZ;
    this.baseMatrix = baseMatrix;
  }

  // Returns the AABB's transform matrix used to draw an AABB scaled according to its mins/maxes and centered at its baseMatrix.
  getTransformMatrix() {
    const center = this.baseMatrix.times(Vec.of(0,0,0,1));
    return Mat4.identity()
	  	.times(Mat4.translation(center))
	  	.times(Mat4.scale([(this.maxX-this.minX)/1.96, (this.maxY-this.minY)/1.96, (this.maxZ-this.minZ)/1.96]));
  }

  // Returns the smallest AABB for a shape based on the shape's points and transform matrix.
  static generateAABBFromPoints( points, transformMatrix ) {
    if (points.length < 1) return null;

    let globalPoints = points.map((p) => transformMatrix.times(p.to4(true)));
    let minx = globalPoints[0][0], miny = globalPoints[0][1], minz = globalPoints[0][2];
    let maxx = minx, maxy = miny, maxz = minz;
    for ( let i=1; i<globalPoints.length; i++ ) {
      const ptX = globalPoints[i][0], ptY = globalPoints[i][1], ptZ = globalPoints[i][2];
      if ( ptX < minx ) minx = ptX;
      if ( ptX > maxx ) maxx = ptX;
      if ( ptY < miny ) miny = ptY;
      if ( ptY > maxy ) maxy = ptY;
      if ( ptZ < minz ) minz = ptZ;
      if ( ptZ > maxz ) maxz = ptZ;
    }

    return new AABB(minx, maxx, miny, maxy, minz, maxz, transformMatrix);
  }

  // Returns the smallest AABB for an object composed of multiple shapes based on each subshape's points and transform matrix.
  // @param shapes: an object containing the points and transform matrix of each subshape. e.g. for a car, parameter may look like
  //   {
  //     body: {
  //       positions: [],
  //       transform: Mat4.identity()
  //     },
  //     wheel1: {
  //       positions: [],
  //       transform: Mat4.identity()
  //     },
  //     etc...
  //   }
  //   where "body" and "wheel1" are subshape names, and each are an object containing an array of the subshape's positions, and the subshape's transform matrix.
  //   The positions of a subshape are what's returned in main-scene.js by this.shapes.[subshapeDrawable].positions.
  //   The transform matrix is the final matrix you'd use to draw the subshape.
  //   MUST use the names "positions" and "transform" for each subshape's points and matrix. Other names are just to help you.
  //   Order of subshapes doesn't matter.
  static generateAABBFromShapes( shapes ) {
    if (Object.keys(shapes).length === 0) return undefined;

    let minx, maxx, miny, maxy, minz, maxz;
    for (let subshapeStr in shapes) {
      const currShape = shapes[subshapeStr];
      let subshapeGlobalPoints = currShape.positions.map((p) => currShape.transform.times(p.to4(true)));

      if (minx === undefined) minx = subshapeGlobalPoints[0][0];
      if (maxx === undefined) maxx = subshapeGlobalPoints[0][0];
      if (miny === undefined) miny = subshapeGlobalPoints[0][1];
      if (maxy === undefined) maxy = subshapeGlobalPoints[0][1];
      if (minz === undefined) minz = subshapeGlobalPoints[0][2];
      if (maxz === undefined) maxz = subshapeGlobalPoints[0][2];

      for ( let i=0; i<subshapeGlobalPoints.length; i++ ) {
        const ptX = subshapeGlobalPoints[i][0], ptY = subshapeGlobalPoints[i][1], ptZ = subshapeGlobalPoints[i][2];
        if ( ptX < minx ) minx = ptX;
        if ( ptX > maxx ) maxx = ptX;
        if ( ptY < miny ) miny = ptY;
        if ( ptY > maxy ) maxy = ptY;
        if ( ptZ < minz ) minz = ptZ;
        if ( ptZ > maxz ) maxz = ptZ;
      }
    }

    const halfDiffX = (maxx-minx)/2., halfDiffY = (maxy-miny)/2., halfDiffZ = (maxz-minz)/2.;
    const center = Vec.of(minx+halfDiffX,miny+halfDiffY,minz+halfDiffZ);
    const matrix = Mat4.identity().times(Mat4.translation(center)).times(Mat4.scale([halfDiffX, halfDiffY, halfDiffZ]));

    return new AABB(minx, maxx, miny, maxy, minz, maxz, matrix);
  }


  // Returns true if the given AABB's intersect.
  static doAABBsIntersect(a, b) {
    return (a.minX <= b.maxX && a.maxX >= b.minX) &&
           (a.minY <= b.maxY && a.maxY >= b.minY) &&
           (a.minZ <= b.maxZ && a.maxZ >= b.minZ);
  }
}

/*
// Returns true if spidermanAABB intersects with any AABB in buildingAABBs
function isSpidermanHittingBuilding(spidermanAABB, buildingAABBs) {
  for ( let i=0; i<buildingAABBs.length; i++ ) {
    if (AABB.doAABBsIntersect(spidermanAABB, buildingAABBs[i])) {
      return true;
    }
  }
  return false;
}

function isPointInsideAABB(point, box) {
  return (point.x >= box.minX && point.x <= box.maxX) &&
         (point.y >= box.minY && point.y <= box.maxY) &&
         (point.z >= box.minZ && point.z <= box.maxZ);
}

function Point( x,y,z ) { 
    this.x = x;
    this.y = y;
    this.z = z;
}

function Sphere( center, radius ) {
  this.center = center;
  this.radius = radius;
}

void SphereFromDistantPoints( Sphere &s, Point p[], int numPts )
{
  // find the most separated point pair encompassing the AABB
  int min, max;
  MostSeparatedPointsPointsOnAABB( min, max, pt, numPts );
  // setup sphere to emcompass just these two points
  s.c = ( pt[min] + pt[max] ) * 0.5;
  s.r = Dot( pt[max] – s.c, pt[max] – s.c );
  s.r = Sqrt( s.r );
}


function doSpheresIntersect( sphereA, sphereB )
{
  // Calculate squared distance between centers
  const d = sphereA.center.minus(sphereB.center);
  const dist2 = Dot( d, d );

  // Spheres intersect if squared distance is less than
  // squared sum of radii
  const radiusSum = sphereA.radius + sphereB.radius;
  return dist2 <= radiusSum * radiusSum;
}
*/