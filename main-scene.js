window.Assignment_Four_Scene = window.classes.Assignment_Four_Scene =
class Assignment_Four_Scene extends Scene_Component
{ constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
    { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
      if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

      context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( -25,100,100 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
      //context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 15,0,0 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );

      const r = context.width/context.height;
      context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

      const shapes = { 
      		ground:		new Cube(),
      		building:   new Cube(),
      		boundary: 	new Cube(),
      		spiderman:  new Cube(),
      		AABB: new Cube()
      }
      this.submit_shapes( context, shapes );

      this.materials =
      { tan:   context.get_instance( Phong_Shader ).material( Color.of( 1,0.87,0.68,1 ) ),		// Color: Navajowhite
      	gray:  context.get_instance( Phong_Shader ).material( Color.of( 0.86,0.86,0.86, 1) ),	// Color: Gainsboro
      	silver:context.get_instance( Phong_Shader ).material( Color.of( 0.74,0.74,0.74, 1) ),	// Color: Silver
      	white: context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1) ),
      	AABB:  context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,0 ) )
      }

      //this.lights = [ new Light( Vec.of( -5,5,5,1 ), Color.of( 1,1,1,1 ), 100000 ) ];
		this.lights = [ new Light( Vec.of( 0,50,0,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

	  this.spidermanUnscaledPosMatrix = Mat4.identity();
    }
    make_control_panel()
    { // Takes user input for button presses
        this.key_triggered_button( "Move Forward", [ "i" ], () => { this.spidermanUnscaledPosMatrix = this.spidermanUnscaledPosMatrix.times(Mat4.translation([0,0,-1])); } );
        this.key_triggered_button( "Rotate Left", [ "j" ], () => { this.spidermanUnscaledPosMatrix = this.spidermanUnscaledPosMatrix.times(Mat4.rotation(0.25, [0,1,0])); } );
        this.key_triggered_button( "Move Backward", [ "k" ], () => { this.spidermanUnscaledPosMatrix = this.spidermanUnscaledPosMatrix.times(Mat4.translation([0,0,1])); } );
        this.key_triggered_button( "Rotate Right", [ "l" ], () => { this.spidermanUnscaledPosMatrix = this.spidermanUnscaledPosMatrix.times(Mat4.rotation(-0.25, [0,1,0])); } );
    }
    display( graphics_state )
    { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
      const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

      // Sorry for the confusing layout. The ground is based at a height of -1. You can shift it up if you'd like, it would only change our overall max height.
      // The south wall and ceiling are commented out so you can see inside the boundaries. The more complicated model doesn't use a for loop so each building 
      // can be adjusted to look more reailistic.
  
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
	  
	  const spidermanPosMatrix = this.spidermanUnscaledPosMatrix.times(Mat4.scale([2,1,1]));
	  
	  //draw stuff
	  const buildingPosMatrix = Mat4.identity().times(Mat4.translation(Vec.of(10,0,0))).times(Mat4.scale([3,10,3]));
	  this.shapes.building.draw( graphics_state, buildingPosMatrix, this.materials.tan);
	  this.shapes.spiderman.draw( graphics_state, spidermanPosMatrix, this.materials.tan);

	  //create AABBs
	  const buildingAABB = AABB.generateAABBFromPoints(this.shapes.building.positions, buildingPosMatrix);
	  const spidermanAABB = AABB.generateAABBFromPoints(this.shapes.spiderman.positions, spidermanPosMatrix);

	  //potentially change AABB color to red if AABBs intersect
	  this.materials.AABB.color = AABB.doAABBsIntersect(buildingAABB, spidermanAABB)? Color.of(1,0,0,0.5) : Color.of(0,0,0,0);
	 
	  //draw AABBs
	  this.shapes.AABB.draw( graphics_state, buildingAABB.getTransformMatrix(), this.materials.AABB );
	  this.shapes.AABB.draw( graphics_state, spidermanAABB.getTransformMatrix(), this.materials.AABB);
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