window.Assignment_Four_Scene = window.classes.Assignment_Four_Scene =
class Assignment_Four_Scene extends Scene_Component
{ constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
    { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:

      const r = context.width/context.height;
      context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

      const shapes = {
      		body:       new Cube(),
      		wheels:     new Torus(20,20),
      		sphere:     new Subdivision_Sphere(4),
      		ground:		new Cube(),
      		building:   new Cube(),
      		wall: 	    new Cube(),
      		boundary: 	new Cube(),
      		spiderman:  new Cube(),
      		AABB: 		new Cube(),
      		lamp: new Lamp(),
      		ball: new Subdivision_Sphere(4)
      }
      this.submit_shapes( context, shapes );

      this.materials =
      { tan:   context.get_instance( Phong_Shader ).material( Color.of( 1,0.87,0.68,1 ) ),		// Color: Navajowhite
      	gray:  context.get_instance( Phong_Shader ).material( Color.of( 0.86,0.86,0.86, 1) ),	// Color: Gainsboro
      	silver:context.get_instance( Phong_Shader ).material( Color.of( 0.74,0.74,0.74, 1) ),	// Color: Silver
      	white: context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1) ),
      	light: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1)),
      	black: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1) ),
      	yellow:context.get_instance( Phong_Shader ).material( Color.of (1,1,0,1) ),
      	red:   context.get_instance( Phong_Shader ).material( Color.of (1,0.2,0.2,1) ),
      	blue:  context.get_instance( Phong_Shader ).material( Color.of (0.2,0.6,0.8,1) ),
      	green: context.get_instance( Phong_Shader ).material( Color.of (0.18,0.55,0.34,1) ),
      	AABB:  context.get_instance( Phong_Shader ).material( Color.of( 1,0,0,0.25) ),
      	buildings: [
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/1.png", true) } ),
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/2.png", true) } ),
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/3.png", true) } )	
      	],
      	ground: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/ground.png", true) }),
      	sky: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/sky-solid.png", true) }),
      	skyWall: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/sky-wall.png", true) }),
      	invisible: context.get_instance( Phong_Shader ).material( Color.of( 0,1,0,0.1 ) )
      }

	  this.lights = [ new Light( Vec.of( 0,50,0,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

	  // JOSH - Spiderman object
	  this.spiderman = new Spiderman( context.globals.graphics_state );

	  //spiderman. its transform is copied from display(), crappy but we're changing it later so w/e
	  const spidermanShape = {
	  	body: { positions: this.shapes.spiderman.positions, transform: this.spiderman.model_transform.times(Mat4.scale([.5,1,1])) }
	  };

	  // JOSH - Pointer capture and mouse tracking
	  document.getElementById("canvas1").addEventListener( "click", () => {document.getElementById("canvas1").requestPointerLock();} );	// Click inside canvas to capture cursor
	  document.body.addEventListener( "mousemove", (m) => {
	  	if(document.pointerLockElement === document.getElementById("canvas1"))
	  		this.spiderman.camera_swivel( m ); } );

	  // JOSH - Implement Minsoo's smooth motion
	  this.movement_directions = { forward: false, backward: false, left: false, right: false };

	  // ================= GLADYS - generate world & buildings statically, since they'll never change.

	  // generate world with inputted size
	  this.worldTransforms = new WorldTransforms(75,50,50,8);

	  // now format all world objects for collision manager.

	  // boundaries (NSEW, ground, ceiling)
	  const boundaryTransforms = this.worldTransforms.getTransforms().boundaries;
	  let boundaryShapes = {};
	  for (let boundaryTransformStr in boundaryTransforms) {
	  	const boundaryTransform = boundaryTransforms[boundaryTransformStr];
	  	boundaryShapes[boundaryTransformStr] = {
	  		positions: this.shapes.wall.positions,
	  		transform: boundaryTransform
	  	};
	  }

	  // buildings
	  let buildingShapes = [];
	  const buildingTransforms = this.worldTransforms.getTransforms().buildings;
	  for (let i=0; i<buildingTransforms.length; i++) {
	  	  const buildingTransform = buildingTransforms[i];
		  buildingShapes.push({
		  	positions: this.shapes.building.positions,
		  	transform: buildingTransform
		  });
	  }
	  // while you're at it, generate building objects with random textures
	  this.buildings = [];
	  for (let i=0; i<buildingTransforms.length; i++) {
	  	  const buildingTransform = buildingTransforms[i];
		  const buildingMat = this.materials.buildings[Math.floor(Math.random()*this.materials.buildings.length)];
      	  this.buildings.push(new Building(buildingMat, buildingTransform));
	  }

	  //lampposts
	  let lampShapes = [];
	  const lampTransforms = this.worldTransforms.getTransforms().lampposts;
	  for (let i=0; i<lampTransforms.length; i++) {
	  	const lampTransform = lampTransforms[i];
		lampShapes.push({
			lamppost: {
				positions: this.shapes.lamp.positions,
				transform: lampTransform
			}
		})
	  }

	  // DANIEL - Cars and People
	  this.people = [];
	  const peopleTransforms = this.worldTransforms.getTransforms().people;
	  for (let i=3; i<peopleTransforms.length; i+=14) {
	  	this.people.push(new Person(peopleTransforms[i], this.shapes.body, this.shapes.sphere, this.materials.green, this.materials.white, this.materials.black, this.materials.tan));
	  }
      let peopleArray = []; // to initialize collision-manager
      for (let i=0; i<this.people.length; i++)
	  {
	 		var position_array = [], node_array = [];
	 		this.people[i].get_array(position_array, node_array);
	 		for(let j=0; j<position_array.length; j++)
	 		{
	 			peopleArray.push(
	 			{	torso:	{ positions: node_array[0].shape.positions, transform: position_array[0] },
// 					head:	{ positions: node_array[2].shape.positions, transform: position_array[2] },
//					hip:    { positions: node_array[3].shape.positions, transform: position_array[3] },
 					r_shin: { positions: node_array[5].shape.positions, transform: position_array[5] },
 					l_shin: { positions: node_array[8].shape.positions, transform: position_array[8] } })
	 		}
	  }

	  this.cars = [];
	  const carTransforms = this.worldTransforms.getTransforms().cars;
	  for (let i=0; i<carTransforms.length; i+=5) {
	  	this.cars.push(new Car(carTransforms[i], this.shapes.body, this.shapes.wheels, this.materials.blue, this.materials.black, this.materials.white, this.materials.yellow, this.materials.red));
	  }

	  // TODO: lampposts, cars, people
	  /*
		note to daniel & justin about how to prepare collisionmanager for your game object. This wont do anything now,
		but collisionmanager will eventually use this info to detect any collisions b/w your game object and something else.

		1) for each game object, prepare a "shapes" Javascript object. e.g. for a person, its shapes object would look like
			  {
                //1st person
                torso: { positions: [], transform: Mat4 }, 
                head: { positions: [], transform: Mat4 },
                ...
              }
          where the {} brackets make it a JS object whose properties are set to "torso" and "head" to represent
          subshapes of the person. Each subshape must have 2 properties. 
          	1. 1st property is "positions", which is the array returned by this.shapes.[person drawable].positions, 
          	where [person drawable] is the shape you use in main-scene to draw the person. 
          	2. 2nd property is "transform", which is the transform matrix of that subshape. Note that this must be
          	a global matrix, i.e. the matrix you'll ultimately call draw on. No local matrices!!
       2) compile the game objects into an array. e.g. for people, the array would look like
		  [ 	
		  	  {
				//1st person
				torso: { positions: [], transform: Mat4 }, 
				head: { positions: [], transform: Mat4 },
				...
			  },
			  { 
				//2nd
				torso: { positions: [], transform: Mat4 }, 
				head: { positions: [], transform: Mat4 } 
				...
			  },
			  ...
		]
	  3) pass this array as the appropriate parameter into CollisionManager's constructor below. Check collision-manager
	  for the details.
	  */
	  
	  this.collisionManager = new CollisionManager(boundaryShapes, buildingShapes, lampShapes, spidermanShape, "body", peopleArray, "torso", [], "body?", null);
	  this.spiderman.setCollisionManager( this.collisionManager );

	  // ============= end of static world generation
    }
    make_control_panel()
    { // Takes user input for button presses
        this.key_triggered_button( "Move Forward", [ "i" ], () => this.movement_directions.forward = true, undefined,
        													                          () => this.movement_directions.forward = false );
        this.key_triggered_button( "Move Left", [ "j" ], () => this.movement_directions.left = true, undefined,
        												                         () => this.movement_directions.left = false );
        this.key_triggered_button( "Move Backward", [ "k" ], () => this.movement_directions.backward = true, undefined,
        													                           () => this.movement_directions.backward = false );
        this.key_triggered_button( "Move Right", [ "l" ], () => this.movement_directions.right = true, undefined,
        												                          () => this.movement_directions.right = false );
       	// JOSH - Toggle "map" view
    	this.key_triggered_button( "Bird's-Eye View", [ "m" ], () => { this.spiderman.camera_toggle_birdseye(); } );
		// JOSH - Turn camera to Spiderman's forward direction
		this.key_triggered_button( "Look forward", ["v"], () => { this.spiderman.camera_look_forward(); } );
		//JUSTIN - Allow object to jump
		this.key_triggered_button( "Jump", [ "q" ], () => { this.spiderman.jump(); } );
		//JUSTIN - Shoot Out Web
		this.key_triggered_button( "Shoot Web", [ "x" ], () => {this.spiderman.change_web(); } );
    }
    display( graphics_state )
    { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
      const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
     
	  const allWorldTransforms = this.worldTransforms.getTransforms();

	  //draw ground and ceiling
	  const groundTransform = allWorldTransforms.ground;
	  this.shapes.ground.draw( graphics_state, groundTransform, this.materials.ground);
	  const ceilingTransform = allWorldTransforms.ceiling;
	  this.shapes.ground.draw( graphics_state, ceilingTransform, this.materials.sky);

	  //draw walls
	  const wallTransforms = allWorldTransforms.walls;
	  for (let dirString in wallTransforms) {
	  	const transform = wallTransforms[dirString];
	  	this.shapes.wall.draw(graphics_state, transform, this.materials.skyWall);
	  }
	  
	  // draw all buildings
	  for (let i=0; i<this.buildings.length; i++) {
	  	const building = this.buildings[i];
	  	const transform = building.get_transform();
	  	const material = building.get_material();
	  	this.shapes.building.draw( graphics_state, transform, material );
	  	//this.shapes.AABB.draw( graphics_state, transform, this.materials.AABB); //Uncomment to see building AABBs in red
	  }
	  
     // Draw all people
     var peopleArray = [];
     const peopleTranslateMatrix = Mat4.translation([0,0,Math.cos(t)*2]);
     for (let i=0; i<this.people.length; i++)
	 	{
	 		var position_array = [], node_array = [];
	 		this.people[i].get_array(position_array, node_array);
	 		for(let j=0; j<position_array.length; j++)
	 		{
	 			node_array[j].shape.draw( graphics_state, position_array[j], node_array[j].color);
	 			peopleArray.push(
	 			{	body:   { positions: this.shapes.body.positions,    transform: position_array[0].times(Mat4.translation([0,-1,0]).times(Mat4.scale([1.25,3.5,3.3]))) } })
//	 			    torso:	{ positions: node_array[0].shape.positions, transform: position_array[0] },
// 					head:	{ positions: node_array[2].shape.positions, transform: position_array[2] },
//					hip:    { positions: node_array[3].shape.positions, transform: position_array[3] },
// 					r_shin: { positions: node_array[5].shape.positions, transform: position_array[5] },
// 					l_shin: { positions: node_array[8].shape.positions, transform: position_array[8] } })
	 		}
	 		
	 		// Can add a boolean here to determine if cars will move or not
	 		this.people[i].move(peopleTranslateMatrix);
	 	}

     // Draw all cars
	 var carArray = [];
	 for (let i=0; i<this.cars.length; i++)
	 {
		var position_array = [], node_array = [];
		this.cars[i].get_array(position_array, node_array);
		for(let j=0; j<position_array.length; j++)
		{
			node_array[j].shape.draw( graphics_state, position_array[j], node_array[j].color);
			carArray.push(
			{	car:	{ positions: node_array[0].shape.positions, transform: position_array[0] },
				hood:	{ positions: node_array[1].shape.positions, transform: position_array[1] } })
		}
		// Can add a boolean here to determine if cars will move or not
		this.cars[i].move(Mat4.translation([0,0,Math.cos(2*(t%(2*Math.PI)))/5]), Mat4.rotation(Math.cos(2*(t%(2*Math.PI)))/10,[0,0,1]));
	 }	 
	 
	  // Limit # of AABB updates
	  var count = 0;
	  if (count == 0)	
	  {
		this.collisionManager.regenerateCarsAABBs(carArray);
		this.collisionManager.regeneratePeopleAABBs(peopleArray, "body"); 
	 	//this.collisionManager.updatePeopleAABBsWithTranslationMatrix(peopleTranslateMatrix); //Gladys' faster AABB for translations ONLY
	 	 count++;
	  }
	  else if (count == 10)
	  	count = 0;
	  else
	  	count++;

	 // For debugging: draw peoples' AABBs
	 const peopleAABBs = this.collisionManager.AABBs.people;
	 for (let i=0; i<peopleAABBs.length; i++) {
	 	this.shapes.AABB.draw( graphics_state, peopleAABBs[i].getTransformMatrix(), this.materials.AABB);
	 }

	  // GLADYS - draw justin's lamppost
	  const lampTransforms = allWorldTransforms.lampposts;
	  for (let i=0; i<lampTransforms.length; i++) {
	  	const currTransform = lampTransforms[i];
	  	this.shapes.lamp.draw( graphics_state, currTransform, this.materials.gray);
	  	//this.shapes.ball.draw(graphics_state,Mat4.identity().times(Mat4.translation([7.5,8,4])).times(Mat4.scale([0.8,0.8,0.8])),this.materials.light);
	  }

	  // JOSH - Use model transform stored in Spiderman object.
	  const spidermanPosMatrix = this.spiderman.model_transform.times(Mat4.scale([.5,1,1]));
	  //this.spiderman.update();
	  this.shapes.spiderman.draw( graphics_state, spidermanPosMatrix.times(Mat4.translation([0,0,0])), this.materials.tan);

	  
	  //JUSTIN - turn gravity on
	  //this.spiderman.get_position();

	  // Check input and move Spiderman for the next frame
	  for (let dirString in this.movement_directions) {
		  if (this.movement_directions[dirString]) {
		  	const nextTransform = this.spiderman.simulate_keyboard_move(dirString).times(Mat4.scale([.5,1,1]));
			const nextSpidermanShape = {
				body: { positions: this.shapes.spiderman.positions, transform: nextTransform }
			};

			const canMove = this.collisionManager.tryMoveSpiderman(nextSpidermanShape);
			
			// if Spiderman hit a building, stick to the wall
			const shouldChangeContact = (this.collisionManager.getBuildingThatSpidermanJustHit() != null);
			this.spiderman.change_contact(shouldChangeContact);

// 			if (canMove) {
// 			  this.spiderman.setNextShape(nextSpidermanShape);
// 			  this.spiderman.keyboard_move(dirString);
// 			}
// 			else {
			  //if hit boundary, highlight it
			  const boundaryTransform = this.collisionManager.getBoundaryThatSpidermanJustHit();
			  if (boundaryTransform != null) {
				this.shapes.boundary.draw( graphics_state, boundaryTransform.times(Mat4.scale([1.01,1.01,1.01])), this.materials.AABB);
			  }
			  if (this.collisionManager.tryMoveSpiderman(nextSpidermanShape) // Regular collisions
					|| this.collisionManager.findBuildingThatSpidermanHits(nextSpidermanShape)	// If spiderman hits a building
					|| this.spiderman.model_transform.times(Vec.of(0,0,0,1)) <= 1 ) { // If spiderman is at or below ground; y_ground = 1 = Mat4.translation([0,1,0]).times(Vec.of(0,0,0,1))[1]
			    this.spiderman.setNextShape(nextSpidermanShape);
			    this.spiderman.keyboard_move(dirString);	// spiderman.keyboard_move will handle cases where spiderman hits a building or is attempting to go below ground
			  }
			  /*
			//TEMP FOR JOSH: demo to color the building spiderman hit as red, if any
			const buildingTransform = this.collisionManager.findBuildingThatSpidermanHits(nextSpidermanShape);
			if (buildingTransform != null) {
				this.shapes.building.draw( graphics_state, buildingTransform.times(Mat4.scale([1.01,1.01,1.01])), this.materials.red);
			}
			*/
			//JOSH demo #2: how to use the function to check if camera is within a building
			//console.log(this.collisionManager.isCameraWithinBuilding(this.spiderman.camera.locals.camera_PosVec));
// 			}
		 }
	 }
  }
}

class Texture_Scroll_X extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    {
	// TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #6.
      return `
	  uniform sampler2D texture;
      void main()
      { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
	      { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.
		  return;
	      }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
	  // Phong shading is not to be confused with the Phong Reflection Model.
          vec4 tex_color = texture2D( texture, f_tex_coord );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w );
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
      }`;
    }
}

class Texture_Rotate extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    {
	// TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #7.
      return `
	  uniform sampler2D texture;
      void main()
      { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
	      { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.
		  return;
	      }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
	  // Phong shading is not to be confused with the Phong Reflection Model.
          vec4 tex_color = texture2D( texture, f_tex_coord );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w );
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
      }`;
    }
}