window.Building = window.classes.Building = 
class Building {
  constructor( material, transform, aabb ) {
    this.material = material;
    this.transform = transform;
    this.aabb = aabb;
  }
  get_material() {
    return this.material;
  }
  get_transform() {
    return this.transform;
  }
  get_aabb() {
    return this.aabb;
  }
}

/*
// Returns an array of Building objects in a grid. Buildings will have random heights and textures.
// @param numCells: # of cells on grid side. 1 building per cell
// @param cellLength: unit length of cell side
// @param bLength: unit length of building side
// @param bMinHeight, bMaxHeight: unit min and max heights of buildings
// @param bShape: the drawable, i.e. the new Cube() instance from main-scene.js
// @param bMats: array of possible building materials to randomly choose from. Each material should have a different texture.
function generate_buildings_on_grid( numCells, cellLength, bLength, bMinHeight, bMaxHeight, bShape, bMats ) {
  let buildings = [];
  if (bLength > cellLength) {
    console.log('ERROR in generate_buildings_on_grid in building.js: building length should fit within cell');
    return undefined;
  }
  const gridLength = numCells * cellLength;
  const buildingOffset = (cellLength - bLength)/2;
  for (let x=gridLength/(-2); x<gridLength/2; x+=cellLength) {
    for (let y=gridLength/(-2); y<gridLength/2; y+=cellLength) {
      const buildingHeight = Math.floor(Math.random()*(bMaxHeight-bMinHeight) + bMinHeight);
      const buildingTransform = Mat4.translation(Vec.of(x+buildingOffset+bLength/2.,buildingHeight,y+buildingOffset+bLength/2.))
        .times(Mat4.scale(Vec.of(bLength/2.,buildingHeight,bLength/2.)));
      const buildingMat = bMats[Math.floor(Math.random()*bMats.length)];
      const aabb = AABB.generateAABBFromPoints(bShape.positions, buildingTransform);

      buildings.push(new Building(bShape, buildingMat, buildingTransform, aabb));
    }
  }
  return buildings;
}
*/