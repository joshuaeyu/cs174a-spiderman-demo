window.Assignment_Four_Scene = window.classes.Assignment_Four_Scene =
class Assignment_Four_Scene extends Scene_Component
{ constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
    { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
      if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );

      const r = context.width/context.height;
      context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

      const shapes = {
      		body:       new Cube(),
      		wheels:     new Torus(20,20),
      		sphere:     new Subdivision_Sphere(4),
      		ground:		new Cube(),
      		building:   new Cube(),
      		wall: 	    new Cube(),
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
     
	  // DANIEL - Cars and People
	   //People
	  this.chest = new Node(Mat4.translation([0,2.8,0]).times(Mat4.scale([0.5,0.6,0.25])), this.shapes.body, this.materials.green);
	  this.neck = new Node(Mat4.translation([0,1.3,0]).times(Mat4.scale([0.25,0.4,0.5]).times(Mat4.rotation(0.7,[0,1,0]))), this.shapes.body, this.materials.white);
	  this.head = new Node(Mat4.translation([0,1.5,0]).times(Mat4.rotation(-0.7,[0,1,0]).times(Mat4.scale([2.5,1.4,2.2]))), this.shapes.sphere, this.materials.white);
	  this.hip = new Node(Mat4.translation([0,-1.5,0]).times(Mat4.scale([0.8,0.5,0.8])), this.shapes.body, this.materials.green);
	  this.right_upper_leg = new Node(Mat4.translation([0.5,-2,-0.6]).times(Mat4.rotation(0.7,[1,0,0]).times(Mat4.scale([0.4,1.6,0.8]))), this.shapes.body, this.materials.green);
	  this.right_shin = new Node(Mat4.translation([0,-1.4,0.4]).times(Mat4.rotation(-0.5, [1,0,0])).times(Mat4.scale([1,1,1])), this.shapes.body, this.materials.white);
	  this.right_shoe = new Node(Mat4.translation([0,-0.8,-0.6]).times(Mat4.rotation(-1.3,[1,0,0]).times(Mat4.scale([0.75,1.75,0.3]))), this.shapes.body, this.materials.black);
	  this.left_upper_leg = new Node(Mat4.translation([-0.5,-2,0.6]).times(Mat4.rotation(-0.7,[1,0,0]).times(Mat4.scale([0.4,1.6,0.8]))), this.shapes.body, this.materials.green);
	  this.left_shin = new Node(Mat4.translation([0,-1.4,0.4]).times(Mat4.rotation(-0.5, [1,0,0])).times(Mat4.scale([1,1,1])), this.shapes.body, this.materials.white);
	  this.left_shoe = new Node(Mat4.translation([0,-0.63,-0.6]).times(Mat4.rotation(-1.3,[1,0,0]).times(Mat4.scale([0.75,1.6,0.4]))), this.shapes.body, this.materials.black);
	  this.right_upper_arm = new Node(Mat4.translation([1,0.1,1]).times(Mat4.rotation(-1,[1,0,0]).times(Mat4.scale([0.25,1,0.4]))),this.shapes.body, this.materials.green);
	  this.right_lower_arm = new Node(Mat4.translation([0,-0.6,-1]).times(Mat4.rotation(3,[1,0,0]).times(Mat4.scale([1,0.5,1]))), this.shapes.body, this.materials.white);
	  this.right_hand = new Node(Mat4.rotation(1,[1,0,0]).times(Mat4.translation([0,1,0.5]).times(Mat4.scale([1,0.5,1]))), this.shapes.sphere, this.materials.white);
	  this.left_upper_arm = new Node(Mat4.translation([-1,0.1,-1]).times(Mat4.rotation(1,[1,0,0]).times(Mat4.scale([0.25,1,0.4]))),this.shapes.body, this.materials.green);
	  this.left_lower_arm = new Node(Mat4.translation([0,-0.6,-1]).times(Mat4.rotation(3,[1,0,0]).times(Mat4.scale([1,0.5,1]))), this.shapes.body, this.materials.tan);
	  this.left_hand = new Node(Mat4.rotation(1,[1,0,0]).times(Mat4.translation([0,1,0.5]).times(Mat4.scale([1,1.5,0.75]))), this.shapes.sphere, this.materials.white);
	  // Car
 	  this.car = new Node(Mat4.translation([0,1.33,0]).times(Mat4.scale([1,0.75,2.5])), this.shapes.body, this.materials.blue);
 	  this.hood = new Node(Mat4.translation([0,1.75,0]).times(Mat4.scale([1,0.75,0.5])), this.shapes.body, this.materials.blue);
 	  this.windows = new Node(Mat4.translation([0,1.6,-0.2]).times(Mat4.scale([1.1,0.6,0.2])), this.shapes.body, this.materials.black);
 	  this.wheel1 = new Node(Mat4.translation([0.5,-1.2,-0.5]).times(Mat4.scale([0.15,0.15,0.15]).times(Mat4.rotation(1.57, [0,1,0]))), this.shapes.wheels, this.materials.black);
 	  this.rim1 = new Node(Mat4.scale([0.75,1.25,1]), this.shapes.body, this.materials.white);
 	  this.wheel2 = new Node(Mat4.translation([-0.5,-1.2,-0.5]).times(Mat4.scale([0.15,0.15,0.15]).times(Mat4.rotation(1.57, [0,1,0]))), this.shapes.wheels, this.materials.black);
 	  this.rim2 = new Node(Mat4.scale([0.75,1.25,1]), this.shapes.body, this.materials.white);
 	  this.wheel3 = new Node(Mat4.translation([0.5,-1.2,0.5]).times(Mat4.scale([0.15,0.15,0.15]).times(Mat4.rotation(1.57, [0,1,0]))), this.shapes.wheels, this.materials.black);
 	  this.rim3 = new Node(Mat4.scale([0.75,1.25,1]), this.shapes.body, this.materials.white);
 	  this.wheel4 = new Node(Mat4.translation([-0.5,-1.2,0.5]).times(Mat4.scale([0.15,0.15,0.15]).times(Mat4.rotation(1.57, [0,1,0]))), this.shapes.wheels, this.materials.black);
 	  this.rim4 = new Node(Mat4.scale([0.75,1.25,1]), this.shapes.body, this.materials.white);
 	  this.left_light = new Node(Mat4.translation([-0.5,0.2,-0.8]).times(Mat4.scale([0.25,0.25,0.25])), this.shapes.body, this.materials.yellow);
 	  this.right_light = new Node(Mat4.translation([0.5,0.2,-0.8]).times(Mat4.scale([0.25,0.25,0.25])), this.shapes.body, this.materials.yellow);
 	  this.left_back_light = new Node(Mat4.translation([-0.6,0,0.8]).times(Mat4.scale([0.3,0.25,0.25])), this.shapes.body, this.materials.red);
 	  this.right_back_light = new Node(Mat4.translation([0.6,0,0.8]).times(Mat4.scale([0.3,0.2,0.25])), this.shapes.body, this.materials.red);
	  // Scene Graph Components
	  this.chest.add_child(this.neck);
	  this.neck.add_child(this.head);
	  this.chest.add_child(this.hip);
	  this.chest.add_child(this.right_upper_arm);
	  this.chest.add_child(this.left_upper_arm);
	  this.right_upper_arm.add_child(this.right_lower_arm);
	  this.left_upper_arm.add_child(this.left_lower_arm);
	  this.right_lower_arm.add_child(this.right_hand);
	  this.left_lower_arm.add_child(this.left_hand);
	  this.hip.add_child(this.right_upper_leg);
	  this.right_upper_leg.add_child(this.right_shin);
	  this.right_shin.add_child(this.right_shoe);
	  this.hip.add_child(this.left_upper_leg);
	  this.left_upper_leg.add_child(this.left_shin);
	  this.left_shin.add_child(this.left_shoe);
	  this.car.add_child(this.hood);
 	  this.car.add_child(this.windows);
 	  this.car.add_child(this.wheel1);
	  this.wheel1.add_child(this.rim1);
 	  this.car.add_child(this.wheel2);
 	  this.wheel2.add_child(this.rim2);
	  this.car.add_child(this.wheel3);
	  this.wheel3.add_child(this.rim3);
	  this.car.add_child(this.wheel4);
	  this.wheel4.add_child(this.rim4);
	  this.car.add_child(this.left_light);
	  this.car.add_child(this.right_light);
	  this.car.add_child(this.left_back_light);
	  this.car.add_child(this.right_back_light);

	  // JOSH - Spiderman object
	  this.spiderman = new Spiderman( context.globals.graphics_state );

	  // JOSH - Pointer capture and mouse tracking
	  document.getElementById("canvas1").addEventListener( "click", () => {document.getElementById("canvas1").requestPointerLock();} );	// Click inside canvas to capture cursor
	  document.body.addEventListener( "mousemove", (m) => {
	  	if(document.pointerLockElement === document.getElementById("canvas1"))
	  		this.spiderman.camera_swivel( m ); } );

	  // JOSH - Implement Minsoo's smooth motion
	  this.movement_directions = { forward: false, backward: false, left: false, right: false };

	  // ================= GLADYS - generate world & buildings statically, since they'll never change.

	  // generate world with inputted size
	  this.worldTransforms = new WorldTransforms(150,100,100,16);

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
	  /*
	  let lampShapes = [];
	  const lampTransforms = this.worldTransforms.getTransforms().lampposts;
	  for (let i=0; i<lampTransforms.length; i++) {
	  	const lampTransform = lampTransforms[i];
		lampShapes.push({
			lamppost: {
				positions: 
			}
		})
	  }
	  */

	  //spiderman. its transform is copied from display(), crappy but we're changing it later so w/e
	  const spidermanShape = {
	  	body: { positions: this.shapes.spiderman.positions, transform: this.spiderman.model_transform.times(Mat4.scale([.5,1,1])) }
	  };

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
	  
	  this.collisionManager = new CollisionManager(boundaryShapes, buildingShapes, [], spidermanShape, [], [], null);

	  // ============= end of static world generation

	  // Josh todo: save this.collisionManager instance in Spiderman somehow. Maybe a setter for spiderman?
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
     
 	  // DANIEL - Draw cars and people and update positions
 	  var w,x,y,z;
 	  var drawing_list = [], drawing_list2 = [], node_list = [], node_list2 = [];
	  this.chest.list_draw_compounded(drawing_list, Mat4.identity(), node_list);
	  var size = drawing_list.length, tempMatrix = Mat4.identity, transformation = Mat4.translation([10,0,15]);
	  for (w = 0; w < 8; w++, transformation = transformation.times(Mat4.rotation(-1.57,[0,1,0]).times(Mat4.translation([15,0,-5]))))
	  {
	  	if (w == 4)
	  		transformation = Mat4.translation([-30,0,-25])
	  	for (x = 0; x != size; x++)
	  		node_list[x].shape.draw( graphics_state, transformation.times(drawing_list[x]), node_list[x].color);
	  }
	  this.car.list_draw_compounded(drawing_list2, Mat4.identity(), node_list2);
	  var size2 = drawing_list2.length, tempMatrix2 = Mat4.identity(), transformation2 = Mat4.translation([-10,0,-15]);
	  for (y = 0; y < 8; y++, transformation2 = transformation2.times(Mat4.rotation(1.57,[0,1,0]).times(Mat4.translation([15,0,-5]))))
	  {
	  	if (y == 4)
	  		transformation2 = Mat4.translation([30,0,25]);
	  	for (z = 0; z < size2; z++)
	  		node_list2[z].shape.draw( graphics_state, transformation2.times(drawing_list2[z]), node_list2[z].color);
	  }

	  this.wheel1.position = this.wheel1.position.times(Mat4.rotation(Math.cos(2*t)/10,[0,0,1]));
	  this.wheel2.position = this.wheel2.position.times(Mat4.rotation(Math.cos(2*t)/10,[0,0,1]));
	  this.wheel3.position = this.wheel3.position.times(Mat4.rotation(Math.cos(2*t)/10,[0,0,1]));
	  this.wheel4.position = this.wheel4.position.times(Mat4.rotation(Math.cos(2*t)/10,[0,0,1]));
	  this.car.position = this.car.position.times(Mat4.translation([0,0,Math.cos(2*t)/15]));
	  this.chest.position = this.chest.position.times(Mat4.translation([0,0,Math.cos(t) * 0.5]));
      
	  // JOSH - Use model transform stored in Spiderman object.
	  const spidermanPosMatrix = this.spiderman.model_transform.times(Mat4.scale([.5,1,1]));
	  const spidermanHeadPosMatrix = this.spiderman.model_transform.times(Mat4.translation([0,2,0])).times(Mat4.scale(1,1,1));

	  this.shapes.spiderman.draw( graphics_state, spidermanPosMatrix, this.materials.tan);
	  
	  // GLADYS - draw justin's lamppost
	  this.shapes.lamp.draw(graphics_state,Mat4.identity().times(Mat4.translation([0,4,0])),this.materials.gray);
	  const lampTransforms = allWorldTransforms.lampposts;
	  for (let i=0; i<lampTransforms.length; i++) {
	  	const currTransform = lampTransforms[i];
	  	this.shapes.lamp.draw( graphics_state, currTransform, this.materials.gray);
	  	//this.shapes.ball.draw(graphics_state,Mat4.identity().times(Mat4.translation([7.5,8,4])).times(Mat4.scale([0.8,0.8,0.8])),this.materials.light);
	  }

	  // Check input and attempt to move spiderman for the next frame
	  for (let dirString in this.movement_directions) {
		  if (this.movement_directions[dirString]) {
		  	const nextTransform = this.spiderman.simulate_keyboard_move(dirString).times(Mat4.scale([.5,1,1]));
			const nextSpidermanShape = {
				body: { positions: this.shapes.spiderman.positions, transform: nextTransform }
			};

			if (this.collisionManager.tryMoveSpiderman(nextSpidermanShape)) {
				this.spiderman.keyboard_move(dirString);
			}
			else {
				//TEMP FOR JOSH: demo to color the building spiderman hit as red, if any
				const buildingTransform = this.collisionManager.findBuildingThatSpidermanHits(nextSpidermanShape);
				if (buildingTransform != null) {
					this.shapes.building.draw( graphics_state, buildingTransform.times(Mat4.scale([1.01,1.01,1.01])), this.materials.red);
				}
				//JOSH demo #2: how to use the function to check if camera is within a building
				//console.log(this.collisionManager.isCameraWithinBuilding(this.spiderman.camera.locals.camera_PosVec));
			}
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
