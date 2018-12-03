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
        e.g. [ {
                //1st lampposts
                id: 0,
                pole: { positions: [], transform: Mat4 }, 
                lightbulb: { positions: [], transform: Mat4 },
                ...
              },
              { 
                //2nd
                id: 1,
                pole: { positions: [], transform: Mat4 }, 
                lightbulb: { positions: [], transform: Mat4 },
                ...
              },
              ...
            ]
      -peopleMainSubshapeName: name of the main subshape of a person whose transform would be used to move the entire person
      -cars: array of all cars. Same format as people
      -web: TODO since depends on web being line or not

  */
  constructor(boundaries, buildings, lampposts, spiderman, spidermanMainSubshapeName, people, peopleMainSubshapeName, cars, carsMainSubshapeName, web, coins) {
    // Set up "cache" for extracting exactly what spiderman hits
    this.hitTargetsTransform = {
      boundary: null,
      building: null,
      lamppost: null,
      person: null,
      car: null,
      coin: null
    }
    this.coinsTransformToAABB = {};

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
    this.regenerateSpidermanAABB(spiderman, spidermanMainSubshapeName);

    //people
    this.regeneratePeopleAABBs(people, peopleMainSubshapeName);

    //cars
    this.regenerateCarsAABBs(cars);

    //web: todo

    //coins
    this.regenerateCoinsAABBs(coins);
  }

  // regenerates spiderman's AABB from scratch. spidermanShape follows same format as 'spiderman' in constructor
  regenerateSpidermanAABB(spidermanShape, spidermanMainSubshapeName) {
    this.AABBs.spiderman = AABB.generateAABBFromShapes(spidermanShape, spidermanShape[spidermanMainSubshapeName].transform);
  }

  // regenerates all peoples' AABBs from scratch. peopleShapes follows same format as 'people' in constructor
  regeneratePeopleAABBs(peopleShapes, peopleMainSubshapeName) {
    this.AABBs.people = {};
    for (let i=0; i<peopleShapes.length; i++) {
      const currShape = peopleShapes[i];
      const mainTransform = currShape[peopleMainSubshapeName].transform;
      this.AABBs.people[currShape.id] = AABB.generateAABBFromShapes(currShape, mainTransform);
    }
  }

  // regenerates all cars' AABBs from scratch. carsShapes follows same format as 'cars' in constructor,
  //  e.g.        [ {
  //                 //1st car
  //                 id: 0,
  //                 body: { positions: [], transform: Mat4 }, 
  //                 hood: { positions: [], transform: Mat4 },
  //                 ...
  //               },
  //               { 
  //                 //2nd car
  //                 id: 1,
  //                 body: { positions: [], transform: Mat4 }, 
  //                 hood: { positions: [], transform: Mat4 },
  //                 ...
  //               },
  //               ...
  //             ]
  regenerateCarsAABBs(carsShapes, carMainSubshapeName) {
    this.AABBs.cars = {};
    for (let i=0; i<carsShapes.length; i++) {
      const currShape = carsShapes[i];
      const mainTransform = currShape[carMainSubshapeName].transform;
      this.AABBs.cars[currShape.id] = AABB.generateAABBFromShapes(currShape, mainTransform);
    }
  }

  // regenerates all coins' AABBs from scratch.
  regenerateCoinsAABBs(coinsShapes) {
    this.AABBs.coins = [];
    for (let i=0; i<coinsShapes.length; i++) {
      const currShape = coinsShapes[i];
      const points = currShape.positions;
      const transform = currShape.transform;
      const coinAABB = AABB.generateAABBFromPoints(points, transform);
      this.AABBs.coins.push(coinAABB);
      this.coinsTransformToAABB[transform] = coinAABB;
    }
  }

  generateCoinAABB(currShape) {
      const points = currShape.positions;
      const transform = currShape.transform;
      const coinAABB = AABB.generateAABBFromPoints(points, transform);
      this.AABBs.coins.push(coinAABB);
      this.coinsTransformToAABB[transform] = coinAABB;
  }

  // updates all peoples' AABBs with the translation change of the given matrix. Lets us keep old AABBs and speed up program
  updatePeopleAABBsWithTranslationMatrix(transform) {
    const peopleAABBs = this.AABBs.people;
    for (let i=0; i<peopleAABBs.length; i++) {
      peopleAABBs[i].updateAABBWithTranslationMatrix(transform);
    }
  }

  // returns true if car of the given carID won't collide with spiderman, other cars, or a person.
  // doesnt check anything else since it def won't collide with them
  // parameters:
  //  -carShape should be like 
  //     {
  //       id: 0,
  //       body: { positions: [], transform: Mat4 }, 
  //       hood: { positions: [], transform: Mat4 },
  //       ...
  //     },
  tryMoveCar(carShape, carMainSubshapeName) {
    const newCarAABB = AABB.generateAABBFromShapes(carShape, carShape[carMainSubshapeName].transform);
    const carID = carShape.id;

    const carsAABBs = this.AABBs.cars;
    for (let id in carsAABBs) {
        if (id == carID) continue;
        if (!AABB.doAABBsNotIntersect(newCarAABB, carsAABBs[id])) {
            return false;
        }
    }

    const peopleAABBs = this.AABBs.people;
    for (let id in peopleAABBs) {
        if (!AABB.doAABBsNotIntersect(newCarAABB, peopleAABBs[id])) {
            return false;
        }
    }

    const spidermanAABB = this.AABBs.spiderman;
    if (!AABB.doAABBsNotIntersect(newCarAABB, spidermanAABB)) {
        return false;
    }
    return true;
  }

  // returns true if person of the given ID won't collide with spiderman, other cars, or a person.
  // doesnt check anything else since it def won't collide with 
  // parameters:
  //  -personShape should be like 
  //     {
  //       id: 0,
  //       body: { positions: [], transform: Mat4 }, 
  //       arm: { positions: [], transform: Mat4 },
  //       ...
  //     },
  tryMovePerson(personShape, personMainSubshapeName) {
    const newPersonAABB = AABB.generateAABBFromShapes(personShape, personShape[personMainSubshapeName].transform);
    const personID = personShape.id;

    const carsAABBs = this.AABBs.cars;
    for (let id in carsAABBs) {
        if (!AABB.doAABBsNotIntersect(newPersonAABB, carsAABBs[id])) {
            return false;
        }
    }

    const peopleAABBs = this.AABBs.people;
    for (let id in peopleAABBs) {
        if (id == personID) continue;
        if (!AABB.doAABBsNotIntersect(newPersonAABB, peopleAABBs[id])) {
            return false;
        }
    }

    const spidermanAABB = this.AABBs.spiderman;
    if (!AABB.doAABBsNotIntersect(newPersonAABB, spidermanAABB)) {
        return false;
    }
    return true;
  }

  // returns true if the spiderman shape (encoded w/ a transform) won't collide with anything
  tryMoveSpiderman(spidermanShape, spidermanMainSubshapeName) {
    const newSpidermanAABB = AABB.generateAABBFromShapes(spidermanShape, spidermanShape[spidermanMainSubshapeName].transform);
    this.hitTargetsTransform = {
      boundary: null,
      building: null,
      lamppost: null,
      person: null,
      car: null,
      coin: null
    };
    let canMove = true;

    const boundaryAABBs = this.AABBs.boundaries;
    for (let dirString in boundaryAABBs) {
      const currAABB = boundaryAABBs[dirString];
      if (!AABB.doAABBsNotIntersect(newSpidermanAABB, currAABB)) {
          canMove = false;
          this.hitTargetsTransform.boundary = currAABB.baseMatrix;
          break;
      }
    }

    const buildingAABBs = this.AABBs.buildings;
    for (let i=0; i<buildingAABBs.length; i++) {
        if (!AABB.doAABBsNotIntersect(newSpidermanAABB, buildingAABBs[i])) {
            canMove = false;
            this.hitTargetsTransform.building = buildingAABBs[i].baseMatrix;
            break;
        }
    }

    const lamppostAABBs = this.AABBs.lampposts;
    for (let i=0; i<lamppostAABBs.length; i++) {
        if (!AABB.doAABBsNotIntersect(newSpidermanAABB, lamppostAABBs[i])) {
            canMove = false;
            this.hitTargetsTransform.lamppost = lamppostAABBs[i].baseMatrix;
            break;
        }
    }

    const carsAABBs = this.AABBs.cars;
    for (let id in carsAABBs) {
        if (!AABB.doAABBsNotIntersect(newSpidermanAABB, carsAABBs[id])) {
            canMove = false;
            break;
        }
    }

    const peopleAABBs = this.AABBs.people;
    for (let id in peopleAABBs) {
        if (!AABB.doAABBsNotIntersect(newSpidermanAABB, peopleAABBs[id])) {
            canMove = false;
            break;
        }
    }

    const coinsAABBs = this.AABBs.coins;
    for (let i=0; i<coinsAABBs.length; i++) {
        if (!AABB.doAABBsNotIntersect(newSpidermanAABB, coinsAABBs[i])) {
            canMove = false;
            this.hitTargetsTransform.coin = coinsAABBs[i].baseMatrix;
            break;
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
  findBuildingThatSpidermanHits(spidermanShape, spidermanMainSubshapeName) {
    const newSpidermanAABB = AABB.generateAABBFromShapes(spidermanShape, spidermanShape[spidermanMainSubshapeName].transform);
    let buildingTransform = null;
    const buildingAABBs = this.AABBs.buildings;
    for (let i=0; i<buildingAABBs.length; i++) {
      const buildingAABB = buildingAABBs[i];
      if (!AABB.doAABBsNotIntersect(newSpidermanAABB, buildingAABB)) {
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

  // gets the transform matrix of the building spiderman last hit. if none, returns null.
  // should be called after tryMoveSpiderman() to be useful
  getBuildingThatSpidermanJustHit() {
    return this.hitTargetsTransform.building;
  }

  // gets the transform matrix of the coin spiderman last hit. if none, returns null.
  // should be called after tryMoveSpiderman() to be useful
  getCoinThatSpidermanJustHit() {
    return this.hitTargetsTransform.coin;
  }

  // removes the coin AABB with baseMatrix == the given transform
  removeCoinAABB(transform) {
    const index = this.AABBs.coins.findIndex(function(aabb) {
      return aabb.baseMatrix.equals(transform);
    });
    if (index > -1) {
      this.AABBs.coins.splice(index, 1);
    }
    else {
      console.log("Error in collision-manager: coin AABB map inconsistent with transforms");
    }
  }
}