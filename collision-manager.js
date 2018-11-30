/*
A class to generate all AABBs and handle all necessary collisions.
Before any collidable object moves, it should call this class' function.
*/

window.CollisionManager = window.classes.CollisionManager = 
class CollisionManager {
  /* 
    Constructor:
    Generates and internally stores all AABBs of all game objects based on their shape's positions array (e.g. returned by
    this.shapes.ground.positions in main-scene.js) and their GLOBAL transform matrix.

    General format: if a game object is composed of subparts, represent the object as a JS object with a property for each
    subpart. The name of the property is up to you, but its value should be another JS object with 2 properties:
    a "positions" property for the SUBPART shape's positions array, and "transform" for the SUBPART's GLOBAL transform
    matrix. See below for concrete examples

    Each parameter:
      -boundaries: single object for all NSEW and ceiling/ground boundaries
        e.g. { north: { positions: [], transform: Mat4.identity() }, south: {....} ... }
      -buildings: array of all buildings in world
        e.g. [ { positions: [], transform: Mat4.identity() }, { positions: [], ...} ...]
      -streetlamps: array of all streetlamps
        e.g. [ {
                //1st streetlamp
                pole: { positions: [], transform: Mat4 }, 
                lightbulb: { positions: [], transform: Mat4 },
                ...
              },
              { 
                //2nd
                pole: { positions: [], transform: Mat4 }, 
                lightbulb: { positions: [], transform: Mat4 },
                ...
              },
              ...
            ]
      -spiderman: single object
        e.g. {
          body: { positions: [], transform: Mat4 }, 
          head: { positions: [], transform: Mat4 }, 
          ...
        }
      -people: array of all people
        e.g. just like streetlamps.
              l
      -cars: array of all cars. Same format as people (i just wanted 1 relevant ex for justin & daniel each 8D)
      -web: TODO since depends on web being line or not

  */
  constructor(boundaries, buildings, streetlamps, spiderman, people, cars, web) {
    //Generate and save all AABBs
    this.AABBs = {};
    
    //boundaries
    this.AABBs.boundaries = {};
    for (let dirString in boundaries) {
      const currShape = boundaries[dirString];
      const points = currShape.positions;
      const transform = currShape.transform;
      this.AABBs.boundaries[dirString] = AABB.generateAABBFromPoints(points, transform);
    }

    //buildings
    this.AABBs.buildings = [];
    for (let i=0; i<buildings.length; i++) {
      const currShape = buildings[i];
      const points = currShape.positions;
      const transform = currShape.transform;
      this.AABBs.buildings.push(AABB.generateAABBFromPoints(points, transform));
    }

    //streetlamps
    this.AABBs.streetlamps = [];
    for (let i=0; i<streetlamps.length; i++) {
      const currShape = streetlamps[i];
      this.AABBs.streetlamps.push(AABB.generateAABBFromShapes(currShape));
    }

    //spiderman
    //this.regenerateSpidermanAABB(spiderman);

    //people
    this.regeneratePeopleAABBs(people);

    //cars
    this.regenerateCarsAABBs(cars);

    //web: todo
  }

  // regenerates spiderman's AABB from scratch. spidermanShape follows same format as 'spiderman' in constructor
  regenerateSpidermanAABB(spidermanShape) {
    console.log('flag1');
    this.AABBs.spiderman = AABB.generateAABBFromShapes(spidermanShape);
    console.log('flag2');
  }

  // regenerates all peoples' AABBs from scratch. peopleShapes follows same format as 'people' in constructor
  regeneratePeopleAABBs(peopleShapes) {
    this.AABBs.people = [];
    for (let i=0; i<peopleShapes.length; i++) {
      const currShape = peopleShapes[i];
      this.AABBs.peopleShapes.push(AABB.generateAABBFromShapes(currShape));
    }
  }

  // regenerates all cars' AABBs from scratch. carsShapes follows same format as 'cars' in constructor
  regenerateCarsAABBs(carsShapes) {
    this.AABBs.cars = [];
    for (let i=0; i<carsShapes.length; i++) {
      const currShape = carsShapes[i];
      this.AABBs.carsShapes.push(AABB.generateAABBFromShapes(currShape));
    }
  }

  // returns true if the spiderman shape (encoded w/ a transform) won't collide with anything
  tryMoveSpiderman(spidermanShape) {
    const newSpidermanAABB = AABB.generateAABBFromShapes(spidermanShape);
    let canMove = true;

    const boundaryAABBs = this.AABBs.boundaries;
    for (let dirString in boundaryAABBs) {
      const currAABB = boundaryAABBs[dirString];
      if (AABB.doAABBsIntersect(newSpidermanAABB, currAABB)) {
          canMove = false;
      }
    }

    const buildingAABBs = this.AABBs.buildings;
    for (let i=0; i<buildingAABBs.length; i++) {
        if (AABB.doAABBsIntersect(newSpidermanAABB, buildingAABBs[i])) {
            canMove = false;
        }
    }

    return canMove;
  }

  tryMovePerson(personShape) {
    //todo
  }

  tryMoveCar(carShape) {
    //todo
  }
}