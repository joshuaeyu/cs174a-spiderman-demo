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
      -lampposts: array of all lampposts
        e.g. [ {
                //1st lampposts
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
  constructor(boundaries, buildings, lampposts, spiderman, people, cars, web) {
    // Set up "cache" for extracting exactly what spiderman hits
    this.hitTargetsTransform = {
      boundary: null,
      building: null,
      lamppost: null,
      person: null,
      car: null
    }

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
    this.AABBs.lampposts = [];
    for (let i=0; i<lampposts.length; i++) {
      const currShape = lampposts[i];
      this.AABBs.lampposts.push(AABB.generateAABBFromShapes(currShape));
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
    this.AABBs.spiderman = AABB.generateAABBFromShapes(spidermanShape);
  }

  // regenerates all peoples' AABBs from scratch. peopleShapes follows same format as 'people' in constructor
  regeneratePeopleAABBs(peopleShapes) {
    this.AABBs.people = [];
    for (let i=0; i<peopleShapes.length; i++) {
      const currShape = peopleShapes[i];
      this.AABBs.people.push(AABB.generateAABBFromShapes(currShape));
    }
  }

  // regenerates all cars' AABBs from scratch. carsShapes follows same format as 'cars' in constructor
  regenerateCarsAABBs(carsShapes) {
    this.AABBs.cars = [];
    for (let i=0; i<carsShapes.length; i++) {
      const currShape = carsShapes[i];
      this.AABBs.cars.push(AABB.generateAABBFromShapes(currShape));
    }
  }

  // returns true if the spiderman shape (encoded w/ a transform) won't collide with anything
  tryMoveSpiderman(spidermanShape) {
    const newSpidermanAABB = AABB.generateAABBFromShapes(spidermanShape);
    this.hitTargetsTransform = {
      boundary: null,
      building: null,
      lamppost: null,
      person: null,
      car: null
    }
    let canMove = true;

    const boundaryAABBs = this.AABBs.boundaries;
    for (let dirString in boundaryAABBs) {
      const currAABB = boundaryAABBs[dirString];
      if (AABB.doAABBsIntersect(newSpidermanAABB, currAABB)) {
          canMove = false;
          this.hitTargetsTransform.boundary = currAABB.baseMatrix;
          break;
      }
    }

    const buildingAABBs = this.AABBs.buildings;
    for (let i=0; i<buildingAABBs.length; i++) {
        if (AABB.doAABBsIntersect(newSpidermanAABB, buildingAABBs[i])) {
            canMove = false;
            this.hitTargetsTransform.building = buildingAABBs[i].baseMatrix;
            break;
        }
    }

    const lamppostAABBs = this.AABBs.lampposts;
    for (let i=0; i<lamppostAABBs.length; i++) {
        if (AABB.doAABBsIntersect(newSpidermanAABB, lamppostAABBs[i])) {
            canMove = false;
            this.hitTargetsTransform.lamppost = lamppostAABBs[i].baseMatrix;
            break;
        }
    }

    const carsAABBs = this.AABBs.cars;
    for (let i=0; i<carsAABBs.length; i++) {
        if (AABB.doAABBsIntersect(newSpidermanAABB, carsAABBs[i])) {
            canMove = false;
        }
    }

    const peopleAABBs = this.AABBs.people;
    for (let i=0; i<peopleAABBs.length; i++) {
        if (AABB.doAABBsIntersect(newSpidermanAABB, peopleAABBs[i])) {
            canMove = false;
        }
    }

    return canMove;
  }

  // returns true if the camera is within a building
  isCameraWithinBuilding(cameraPos) {
    //const cameraPos = cameraTransform.times(Vec.of(0,0,0,1));
    //console.log("Camera pos: "+cameraPos);
    const buildingAABBs = this.AABBs.buildings;
    for (let i=0; i<buildingAABBs.length; i++) {
      const buildingAABB = buildingAABBs[i];
      if (buildingAABB.minX <= cameraPos[0] && buildingAABB.maxX >= cameraPos[0]
          && buildingAABB.minY <= cameraPos[1] && buildingAABB.maxY >= cameraPos[1]
          && buildingAABB.minZ <= cameraPos[2] && buildingAABB.maxZ >= cameraPos[2]) {
          return true;
      }
    }
    return false;
  }

  // returns the transform matrix of the building spiderman is hitting. if none, returns null
  findBuildingThatSpidermanHits(spidermanShape) {
    const newSpidermanAABB = AABB.generateAABBFromShapes(spidermanShape);
    let buildingTransform = null;
    const buildingAABBs = this.AABBs.buildings;
    for (let i=0; i<buildingAABBs.length; i++) {
      const buildingAABB = buildingAABBs[i];
      if (AABB.doAABBsIntersect(newSpidermanAABB, buildingAABB)) {
          buildingTransform = buildingAABB.baseMatrix;
          break;
      }
    }
    return buildingTransform;
  }

  // gets the transform matrix of the boundary spiderman last hit. if none, returns null.
  // should be called after tryMoveSpiderman() to be useful
  getBoundaryThatSpidermanJustHit() {
    return this.hitTargetsTransform.boundary;
  }

  tryMovePerson(personShape) {
    //todo
  }

  tryMoveCar(carShape) {
    //todo
  }
}