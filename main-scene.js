window.Assignment_Four_Scene = window.classes.Assignment_Four_Scene =
class Assignment_Four_Scene extends Scene_Component
{ constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
    { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
      if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );

      const r = context.width/context.height;
      context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

      const shapes = {
      		ground:		new Cube(),
      		building:   new Cube(),
      		wall: 	new Cube(),
      		spiderman:  new Cube(),
      		AABB: new Cube(),
      		lamp: new lamp(),
      		ball: new Subdivision_Sphere(4)
      }
      this.submit_shapes( context, shapes );

      this.materials =
      { tan:   context.get_instance( Phong_Shader ).material( Color.of( 1,0.87,0.68,1 ) ),		// Color: Navajowhite
      	gray:  context.get_instance( Phong_Shader ).material( Color.of( 0.86,0.86,0.86, 1) ),	// Color: Gainsboro
      	silver:context.get_instance( Phong_Shader ).material( Color.of( 0.74,0.74,0.74, 1) ),	// Color: Silver
      	white: context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1) ),
      	light: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1)),
      	AABB:  context.get_instance( Phong_Shader ).material( Color.of( 1,0,0,0.25) ),
      	buildings: [
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/1.png", true) } ),
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/2.png", true) } ),
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/3.png", true) } )	
      	],
      	ground: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/ground.png", true) }),
      	sky: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/sky.png", true) }),
      	skyWall: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/sky-wall.png", true) }),
      	invisible: context.get_instance( Phong_Shader ).material( Color.of( 0,1,0,0.1 ) )
      }

		this.lights = [ new Light( Vec.of( 0,50,0,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

	  // ================= GLADYS - generate world & buildings statically, since they'll never change.

	  //generate world with inputted size
	  this.worldTransforms = new WorldTransforms(100,100,100);

	  // GLADYS - generate building objects with random heights and materials/textures
	  this.buildings = generate_buildings_on_grid( 16, 25, 8, 12, 20, this.shapes.building, this.materials.buildings );
	  
	  // GLADYS - generate boundary AABBs based on values in this.worldTransforms
	  this.boundaryAABBs = [];
	  for (let boundaryTransformStr in this.worldTransforms.getTransforms().boundaries) {
	  	const boundaryTransform = this.worldTransforms.getTransforms().boundaries[boundaryTransformStr];
	  	this.boundaryAABBs.push(AABB.generateAABBFromPoints(this.shapes.wall.positions, boundaryTransform));
	  }
	  
	  // ============= end of static world generation
     
	  // JOSH - Spiderman object
	  this.spiderman = new Spiderman( context.globals.graphics_state );

	  // JOSH - Pointer capture and mouse tracking
	  document.getElementById("canvas1").addEventListener( "click", () => {document.getElementById("canvas1").requestPointerLock();} );	// Click inside canvas to capture cursor
	  document.body.addEventListener( "mousemove", (m) => {
	  	if(document.pointerLockElement === document.getElementById("canvas1"))
	  		this.spiderman.camera_swivel( m ); } );

	  // JOSH - Implement Minsoo's smooth motion
	  this.movement_directions = { forward: false, backward: false, left: false, right: false };
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
    {graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
      const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

      // Sorry for the confusing layout. The ground is based at a height of -1. You can shift it up if you'd like, it would only change our overall max height.
      // The south wall and ceiling are commented out so you can see inside the boundaries. The more complicated model doesn't use a for loop so each building 
      // can be adjusted to look more reailistic.
      this.shapes.lamp.draw(graphics_state,Mat4.identity().times(Mat4.translation([3,4,4])),this.materials.gray);
      this.shapes.ball.draw(graphics_state,Mat4.identity().times(Mat4.translation([7.5,8,4])).times(Mat4.scale([0.8,0.8,0.8])),this.materials.light);
	  this.shapes.ground.draw( graphics_state, Mat4.scale(Vec.of(50,1,50)).times(Mat4.translation(Vec.of(0,-2,0))), this.materials.silver);
	  this.shapes.boundary.draw( graphics_state, Mat4.scale(Vec.of(50,50,1)).times(Mat4.translation(Vec.of(0,0.98,-51))), this.materials.white);	// North Wall
	  this.shapes.boundary.draw( graphics_state, Mat4.scale(Vec.of(1,50,50)).times(Mat4.translation(Vec.of(-51,0.98,0))), this.materials.gray);		// West Wall
	  this.shapes.boundary.draw( graphics_state, Mat4.scale(Vec.of(1,50,50)).times(Mat4.translation(Vec.of(51,0.98,0))), this.materials.gray);		// East Wall
	  //this.shapes.boundary.draw( graphics_state, Mat4.scale(Vec.of(50,50,1)).times(Mat4.translation(Vec.of(0,0.98,51))), this.materials.white);		// South Wall
	  //this.shapes.ground.draw( graphics_state, Mat4.scale(Vec.of(50,1,50)).times(Mat4.translation(Vec.of(0,98,0))), this.materials.silver);		// Ceiling

      /*
      //Beginning of a more complicated model
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-25,15,-33)).times(Mat4.scale(Vec.of(3,16,4))), this.materials.tan);
	  this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-25,15,-33)).times(Mat4.scale(Vec.of(3,16,4))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-25,19,-44)).times(Mat4.scale(Vec.of(2,20,2))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-25,15,-25)).times(Mat4.scale(Vec.of(4,16,4))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-25,13,-10)).times(Mat4.scale(Vec.of(5,14,3))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-26, 7,  3)).times(Mat4.scale(Vec.of(2,8,2))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-18, 6,  3)).times(Mat4.scale(Vec.of(2,7,2))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-22,10,  15)).times(Mat4.scale(Vec.of(3,11,2))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-28,8,  25)).times(Mat4.scale(Vec.of(2,9,4))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-19,13, 24)).times(Mat4.scale(Vec.of(4,12,3))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-20,19,34)).times(Mat4.scale(Vec.of(2,20,2))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-34,8, 37)).times(Mat4.scale(Vec.of(6,9,2))), this.materials.tan);
       
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-39,17,-44)).times(Mat4.scale(Vec.of(2,18,4))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-38,13,-33)).times(Mat4.scale(Vec.of(3,14,4))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-39,9,-22)).times(Mat4.scale(Vec.of(6,10,4))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-36,4,-12)).times(Mat4.scale(Vec.of(2,5,3))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-38,21,0)).times(Mat4.scale(Vec.of(3,22,3))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-36,16,17)).times(Mat4.scale(Vec.of(2,17,8))), this.materials.tan);

	  this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(0,9,0)).times(Mat4.scale(Vec.of(2,10,3))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(8,2,2)).times(Mat4.scale(Vec.of(1,3,4))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(0,13,10)).times(Mat4.scale(Vec.of(2,14,2))), this.materials.tan);
      this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(-1,12,-13)).times(Mat4.scale(Vec.of(4,13,2))), this.materials.tan);
      */

	  // Simple Model
	  /*
	  var i, j;
	  for (i = -40; i < 50; i+=10)
	  	for (j = -40; j < 50; j+=10)
	  		this.shapes.building.draw( graphics_state, Mat4.translation(Vec.of(i,9,j)).times(Mat4.scale(Vec.of(2,10,2))), this.materials.tan);
	  */
     
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
	  	const drawable = building.get_drawable();
	  	const transform = building.get_transform();
	  	const material = building.get_material();
	  	drawable.draw( graphics_state, transform, material );
	  	//this.shapes.AABB.draw( graphics_state, transform, this.materials.AABB); //Uncomment to see building AABBs in red
	  }
     
	  // JOSH - Use model transform stored in Spiderman object.
	  const spidermanPosMatrix = this.spiderman.model_transform.times(Mat4.scale([.5,1,1]));
	  const spidermanHeadPosMatrix = this.spiderman.model_transform.times(Mat4.translation([0,2,0])).times(Mat4.scale(1,1,1));

	  this.shapes.spiderman.draw( graphics_state, spidermanPosMatrix.times(Mat4.translation([0,0,0])), this.materials.tan);

	  // Create spiderman's AABB
	  const spidermanAABB = AABB.generateAABBFromPoints(this.shapes.spiderman.positions, spidermanPosMatrix.times(Mat4.translation([0,0,0])));
	  //this.shapes.AABB.draw( graphics_state, spidermanAABB.getTransformMatrix(), this.materials.AABB);

	  // Check input and move Spiderman for the next frame
	  const gapCollisionDetection = true; // if true, there will be gap between colliding objects
	  for (let dirString in this.movement_directions) {
	  	if (gapCollisionDetection) {
			if (this.movement_directions[dirString]) {
				const next_transform = this.spiderman.simulate_keyboard_move(dirString).times(Mat4.scale([.5,1,1])).times(Mat4.translation([0,0,0]));
				const future_AABB = AABB.generateAABBFromPoints(this.shapes.spiderman.positions, next_transform);
				
				let canMove = true;
				for (let i=0; i<this.buildings.length; i++) {
					if (AABB.doAABBsIntersect(future_AABB, this.buildings[i].aabb)) {
						canMove = false;
					}
				}

				const boundaryAABBs = this.boundaryAABBs;
				for (let i=0; i<boundaryAABBs.length; i++) {
					this.shapes.AABB.draw( graphics_state, boundaryAABBs[i].getTransformMatrix(), this.materials.AABB ); //Uncomment to see boundary AABBs in red
					if (AABB.doAABBsIntersect(future_AABB, boundaryAABBs[i])) {
						canMove = false;
					}
				}
				if (canMove) {
					this.spiderman.keyboard_move(dirString);
				}
	  		}
	  	}
	  	else {
        if (this.movement_directions[dirString]) {
          if (AABB.doAABBsIntersect(spidermanAABB, buildingAABB)) {
            const next_transform = this.spiderman.simulate_keyboard_move(dirString).times(Mat4.scale([.5,1,.5])).times(Mat4.translation([0,-1,0]));
            const future_AABB = AABB.generateAABBFromPoints(this.shapes.spiderman.positions, next_transform);
            if (!AABB.doAABBsIntersect(future_AABB, buildingAABB))
            {
              this.spiderman.keyboard_move(dirString);
            }
          }
          else {
            this.spiderman.keyboard_move(dirString);
          }
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