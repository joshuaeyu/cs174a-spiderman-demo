// Holds Spiderman's model transform and attached camera, and handles Spiderman's movement.
  // physics_move           - (Can be used for physics-based movement?)
  // keyboard_move          - Takes a direction input (i.e., through a key press) and updates Spiderman's and camera's transforms accordingly.
  // rotate                 - Rotate Spiderman without moving camera.
  // camera_swivel          - Handle mouse movement using this.camera.swivel().
  // camera_toggle_birdseye - Toggles minimap (overhead) view through this.camera.
  // camera_look_forward    - Force camera to look at Spiderman's forward direction.
window.Spiderman = window.classes.Spiderman = 
class Spiderman 
{
  constructor( graphics_state ) // Add world object argument to constructor, also create new member variable for it so that Spidey is aware of world
  {
    Object.assign( this, { model_transform: Mat4.translation([0,1,0]),
                           camera: new Camera( graphics_state, Mat4.translation([0,1,0]) ),
                           physics: new Physics( graphics_state, Mat4.translation([0,1,0]) ),
                           gs: graphics_state } );
<<<<<<< Updated upstream
	this.contact = false;
	this.webbed = false;
    //Object.defineProperty( this, 'VELOCITY', { value: 10,  writable: false } ); // Adjustable
||||||| merged common ancestors
    Object.defineProperty( this, 'VELOCITY', { value: 25,  writable: false } ); // Adjustable
=======
    Object.defineProperty( this, 'VELOCITY', { value: 15, writable: false } ); // Adjustable
>>>>>>> Stashed changes
  }
  physics_move( displacement_Vec, distance = this.physics.velocity_xz * this.gs.animation_delta_time/1000 ) //use velocity derived from physics class
  {
    this.model_transform = this.model_transform.times( Mat4.translation( displacement_Vec.times(distance) ) );
    this.camera.translate( this.model_transform );
  }
  simulate_keyboard_move( direction )
  {
    // Gladys - exactly Josh's keyboard_move() except it doesn't change Spiderman. Instead, returns Spiderman's new would-be position.
    // Used for predicting AABB collisions
    let distance = this.physics.velocity_xz * this.gs.animation_delta_time / 1000; //use velocity derived from physics class
    let rotation_mult = 0;
    switch ( direction )
    {
      case ("forward"):  break;
      case ("backward"): rotation_mult = 2; break;
      case ("left"):     rotation_mult = 1; break;
      case ("right"):    rotation_mult = 3; break;
    }
    // Calculate Spiderman movement (translation) vector according to input direction and current camera orientation
    let camera_xz_orientation = this.camera.locals.spidermanToCamera_Vec.mult_pairs( Vec.of(-1,0,-1) ).normalized();  // Unit vector, relative to Spiderman's current orientation
    let movement_vector = Mat4.rotation( Math.PI/2*rotation_mult, Vec.of(0,1,0) ).times( camera_xz_orientation.to4(1) ).to3();  // Unit vector, relative to camera_xz_orientation
    
    // Rotate Spiderman to face input direction, then move in that direction.
    let theta = 0;
    let cross_product = Vec.of(0,0,-1).cross( movement_vector ),
        dot_product = Vec.of(0,0,-1).dot( movement_vector );
    let CCW_or_CW = cross_product.dot( Vec.of(0,1,0) ) > 0 ? 1 : -1;
    theta = Math.acos( dot_product ) * CCW_or_CW; // Theta becomes negative if movement_vector is CW of spiderman_orientation

    return this.model_transform.times(  Mat4.rotation(theta, Vec.of(0,1,0)) )
                               .times( Mat4.translation(Vec.of(0,0,-distance) ) );
  }
  //needs to be a jump option so spiderman can just jump in place
  keyboard_move( direction )
  {
    let distance = this.physics.velocity_xz * this.gs.animation_delta_time / 1000; 
    let rotation_mult = 0;
    switch ( direction )
    {
      case ("forward"):  break;                     // upwards when on walls
      case ("backward"): rotation_mult = 2; break;  // downwards when on walls
      case ("left"):     rotation_mult = 1; break;
      case ("right"):    rotation_mult = 3; break;
    }
    let building_transform = this.collisionManager.findBuildingThatSpidermanHits( this.nextShape );
    // GROUND MOVEMENT
    if ( building_transform === null && !this.isOnWall ) 
    {  
      // Calculate Spiderman movement (translation) vector according to input direction and current camera orientation
      let camera_xz_orientation = this.camera.locals.spidermanToCamera_Vec.mult_pairs( Vec.of(-1,0,-1) ).normalized();  // Unit vector, relative to Spiderman's current orientation
      let movement_vector = Mat4.rotation( Math.PI/2*rotation_mult, Vec.of(0,1,0) ).times( camera_xz_orientation.to4(1) ).to3();  // Unit vector, relative to camera_xz_orientation

<<<<<<< Updated upstream
      // Rotate Spiderman to face input direction, then move in that direction.
      this.rotate( Vec.of(0,0,-1), movement_vector );
      this.model_transform = this.model_transform.times( Mat4.translation(Vec.of(0,0,-distance)) );
    }
    // WALL MOVEMENT
    else
    {  
      // Determine which direction building is relative to Spiderman
      var dirs = { NORTH: Vec.of( 0, 0,-1), 
                   SOUTH: Vec.of( 0, 0, 1), 
                   EAST:  Vec.of( 1, 0, 0), 
                   WEST:  Vec.of(-1, 0, 0)  };
      let spiderpos = this.model_transform.times(Vec.of(0,0,0,1)).to3();

      // If attaching to new wall, update local building transform
      if (!this.isOnWall) 
        this.building_transform = building_transform;        
      
      this.spidermanToBuilding_Vec = this.building_transform.times(Vec.of(0,0,0,1)).to3().minus(spiderpos);
      let x = this.spidermanToBuilding_Vec[0], z = this.spidermanToBuilding_Vec[2];
      
      // If attaching to new wall, determine which side of building
      if (!this.isOnWall) { 
        if ( z > Math.abs(x) )        // Spiderman is on the NORTH wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.SOUTH;
        else if ( z < -Math.abs(x) )  // Spiderman is on the SOUTH wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.NORTH;
        else if ( x < -Math.abs(z) )  // Spiderman is on the EAST wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.WEST;
        else if ( x > Math.abs(z) )   // Spiderman is on the WEST wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.EAST;
        this.isOnWall = true;
      }

      // Rotate Spiderman to face wall
      let absolute_spiderman_orientation = this.model_transform.times(Vec.of(0,0,-1,1)).to3().minus(spiderpos).normalized();
      this.rotate( absolute_spiderman_orientation, this.spidermanToBuildingCardinal_Vec );

      // Move in appropriate direction
      let movement_vector = Mat4.rotation( -Math.PI/2*rotation_mult, Vec.of(0,0,-1) ).times( Vec.of(0,1,0,1) ).to3();
      this.model_transform = this.model_transform.times( Mat4.translation(movement_vector.times(distance)) );

      // If Spiderman moves too far left/right of the building wall, he should "fall" to the ground
      spiderpos = this.model_transform.times(Vec.of(0,0,0,1)).to3();
      let height = spiderpos[1],
          ground = 1; // Mat4.translation([0,1,0]).times(Vec.of(0,0,0,1))[1]; 
      let should_fall = false;
      const nextTransform = this.simulate_keyboard_move("forward").times(Mat4.scale([.5,1,1]));
      const nextShape = { body: { positions: this.nextShape.body.positions, transform: nextTransform } };
      if ( this.isOnWall && this.collisionManager.findBuildingThatSpidermanHits(nextShape) === null ) // If wall is no longer in front, fall
        should_fall = true;

      // Ground shenanigans 
      if ( height < ground || should_fall ) {
        this.model_transform = this.model_transform.times( Mat4.translation([0,ground-height+0.01,0]) );
        this.isOnWall = false;
      }
||||||| merged common ancestors
    return this.model_transform.times(  Mat4.rotation(theta, Vec.of(0,1,0)) )
                               .times( Mat4.translation(Vec.of(0,0,-distance) ) );
  }
  keyboard_move( direction )
  {
    let distance = this.VELOCITY * this.gs.animation_delta_time / 1000; 
    let rotation_mult = 0;
    switch ( direction )
    {
      case ("forward"):  break;                     // upwards when on walls
      case ("backward"): rotation_mult = 2; break;  // downwards when on walls
      case ("left"):     rotation_mult = 1; break;
      case ("right"):    rotation_mult = 3; break;
=======
    return this.model_transform.times(  Mat4.rotation(theta, Vec.of(0,1,0)) )
                               .times( Mat4.translation(Vec.of(0,0,-distance) ) );
  }
  keyboard_move( direction )
  {
    let distance = this.VELOCITY * this.gs.animation_delta_time / 1000; 
    let rotation_mult = 0;
    switch ( direction )
    {
      case ("forward"):  break;                     // upwards when on walls
      case ("backward"): rotation_mult = 2; break;  // downwards when on walls
      case ("left"):     rotation_mult = 1; break;
      case ("right"):    rotation_mult = 3; break;
>>>>>>> Stashed changes
    }
<<<<<<< Updated upstream
<<<<<<< Updated upstream
||||||| merged common ancestors
    // Calculate Spiderman movement (translation) vector according to input direction and current camera orientation
    let camera_xz_orientation = this.camera.locals.spidermanToCamera_Vec.mult_pairs( Vec.of(-1,0,-1) ).normalized();  // Unit vector, relative to Spiderman's current orientation
    let movement_vector = Mat4.rotation( Math.PI/2*rotation_mult, Vec.of(0,1,0) ).times( camera_xz_orientation.to4(1) ).to3();  // Unit vector, relative to camera_xz_orientation
    
    // Rotate Spiderman to face input direction, then move in that direction.
    let theta = 0;
    let cross_product = Vec.of(0,0,-1).cross( movement_vector ),
        dot_product = Vec.of(0,0,-1).dot( movement_vector );
    let CCW_or_CW = cross_product.dot( Vec.of(0,1,0) ) > 0 ? 1 : -1;
    theta = Math.acos( dot_product ) * CCW_or_CW; // Theta becomes negative if movement_vector is CW of spiderman_orientation
    this.rotate( theta );
    this.model_transform = this.model_transform.times( Mat4.translation(Vec.of(0,0,-distance) ) );
<<<<<<< Updated upstream
	// Update camera
||||||| merged common ancestors
    
    // Update camera
=======
=======
    let building_transform = this.collisionManager.findBuildingThatSpidermanHits( this.nextShape );
    // GROUND MOVEMENT
    if ( building_transform === null && !this.isOnWall ) 
    {  
      // Calculate Spiderman movement (translation) vector according to input direction and current camera orientation
      let camera_xz_orientation = this.camera.locals.spidermanToCamera_Vec.mult_pairs( Vec.of(-1,0,-1) ).normalized();  // Unit vector, relative to Spiderman's current orientation
      let movement_vector = Mat4.rotation( Math.PI/2*rotation_mult, Vec.of(0,1,0) ).times( camera_xz_orientation.to4(1) ).to3();  // Unit vector, relative to camera_xz_orientation

      // Rotate Spiderman to face input direction, then move in that direction.
      this.rotate( Vec.of(0,0,-1), movement_vector );
      this.model_transform = this.model_transform.times( Mat4.translation(Vec.of(0,0,-distance)) );
    }
    // WALL MOVEMENT
    else
    {  
      // Determine which direction building is relative to Spiderman
      var dirs = { NORTH: Vec.of( 0, 0,-1), 
                   SOUTH: Vec.of( 0, 0, 1), 
                   EAST:  Vec.of( 1, 0, 0), 
                   WEST:  Vec.of(-1, 0, 0)  };
      let spiderpos = this.model_transform.times(Vec.of(0,0,0,1)).to3();

      // If attaching to new wall, update local building transform
      if (!this.isOnWall) 
        this.building_transform = building_transform;        
      
      this.spidermanToBuilding_Vec = this.building_transform.times(Vec.of(0,0,0,1)).to3().minus(spiderpos);
      let x = this.spidermanToBuilding_Vec[0], z = this.spidermanToBuilding_Vec[2];
      
      // If attaching to new wall, determine which side of building
      if (!this.isOnWall) { 
        if ( z > Math.abs(x) )        // Spiderman is on the NORTH wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.SOUTH;
        else if ( z < -Math.abs(x) )  // Spiderman is on the SOUTH wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.NORTH;
        else if ( x < -Math.abs(z) )  // Spiderman is on the EAST wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.WEST;
        else if ( x > Math.abs(z) )   // Spiderman is on the WEST wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.EAST;
        this.isOnWall = true;
      }

      // Rotate Spiderman to face wall
      let absolute_spiderman_orientation = this.model_transform.times(Vec.of(0,0,-1,1)).to3().minus(spiderpos).normalized();
      this.rotate( absolute_spiderman_orientation, this.spidermanToBuildingCardinal_Vec );

      // Move in appropriate direction
      let movement_vector = Mat4.rotation( -Math.PI/2*rotation_mult, Vec.of(0,0,-1) ).times( Vec.of(0,1,0,1) ).to3();
      this.model_transform = this.model_transform.times( Mat4.translation(movement_vector.times(distance)) );

      // If Spiderman moves too far left/right of the building wall, he should "fall" to the ground
      spiderpos = this.model_transform.times(Vec.of(0,0,0,1)).to3();
      let height = spiderpos[1],
          ground = 1; // Mat4.translation([0,1,0]).times(Vec.of(0,0,0,1))[1]; 
      let should_fall = false;
      const nextTransform = this.simulate_keyboard_move("forward").times(Mat4.scale([.5,1,1]));
      const nextShape = { body: { positions: this.nextShape.body.positions, transform: nextTransform } };
      if ( this.isOnWall && this.collisionManager.findBuildingThatSpidermanHits(nextShape) === null ) // If wall is no longer in front, fall
        should_fall = true;

      // Ground shenanigans 
      if ( height < ground || should_fall ) {
        this.model_transform = this.model_transform.times( Mat4.translation([0,ground-height+0.01,0]) );
        this.isOnWall = false;
      }
    }
>>>>>>> Stashed changes
||||||| merged common ancestors
    // Calculate Spiderman movement (translation) vector according to input direction and current camera orientation
    let camera_xz_orientation = this.camera.locals.spidermanToCamera_Vec.mult_pairs( Vec.of(-1,0,-1) ).normalized();  // Unit vector, relative to Spiderman's current orientation
    let movement_vector = Mat4.rotation( Math.PI/2*rotation_mult, Vec.of(0,1,0) ).times( camera_xz_orientation.to4(1) ).to3();  // Unit vector, relative to camera_xz_orientation
    
    // Rotate Spiderman to face input direction, then move in that direction.
    let theta = 0;
    let cross_product = Vec.of(0,0,-1).cross( movement_vector ),
        dot_product = Vec.of(0,0,-1).dot( movement_vector );
    let CCW_or_CW = cross_product.dot( Vec.of(0,1,0) ) > 0 ? 1 : -1;
    theta = Math.acos( dot_product ) * CCW_or_CW; // Theta becomes negative if movement_vector is CW of spiderman_orientation
    this.rotate( theta );
    this.model_transform = this.model_transform.times( Mat4.translation(Vec.of(0,0,-distance) ) );
=======
    let building_transform = this.collisionManager.findBuildingThatSpidermanHits( this.nextShape );
    // GROUND MOVEMENT
    if ( building_transform === null && !this.isOnWall ) 
    {  
      // Calculate Spiderman movement (translation) vector according to input direction and current camera orientation
      let camera_xz_orientation = this.camera.locals.spidermanToCamera_Vec.mult_pairs( Vec.of(-1,0,-1) ).normalized();  // Unit vector, relative to Spiderman's current orientation
      let movement_vector = Mat4.rotation( Math.PI/2*rotation_mult, Vec.of(0,1,0) ).times( camera_xz_orientation.to4(1) ).to3();  // Unit vector, relative to camera_xz_orientation

      // Rotate Spiderman to face input direction, then move in that direction.
      this.rotate( Vec.of(0,0,-1), movement_vector );
      this.model_transform = this.model_transform.times( Mat4.translation(Vec.of(0,0,-distance)) );
    }
    // WALL MOVEMENT
    else
    {  
      // Determine which direction building is relative to Spiderman
      var dirs = { NORTH: Vec.of( 0, 0,-1), 
                   SOUTH: Vec.of( 0, 0, 1), 
                   EAST:  Vec.of( 1, 0, 0), 
                   WEST:  Vec.of(-1, 0, 0)  };
      let spiderpos = this.model_transform.times(Vec.of(0,0,0,1)).to3();

      // If attaching to new wall, update local building transform
      if (!this.isOnWall) 
        this.building_transform = building_transform;        
      
      this.spidermanToBuilding_Vec = this.building_transform.times(Vec.of(0,0,0,1)).to3().minus(spiderpos);
      let x = this.spidermanToBuilding_Vec[0], z = this.spidermanToBuilding_Vec[2];
      
      // If attaching to new wall, determine which side of building
      if (!this.isOnWall) { 
        if ( z > Math.abs(x) )        // Spiderman is on the NORTH wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.SOUTH;
        else if ( z < -Math.abs(x) )  // Spiderman is on the SOUTH wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.NORTH;
        else if ( x < -Math.abs(z) )  // Spiderman is on the EAST wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.WEST;
        else if ( x > Math.abs(z) )   // Spiderman is on the WEST wall of the building
          this.spidermanToBuildingCardinal_Vec = dirs.EAST;
        this.isOnWall = true;
      }

      // Rotate Spiderman to face wall
      let absolute_spiderman_orientation = this.model_transform.times(Vec.of(0,0,-1,1)).to3().minus(spiderpos).normalized();
      this.rotate( absolute_spiderman_orientation, this.spidermanToBuildingCardinal_Vec );

      // Move in appropriate direction
      let movement_vector = Mat4.rotation( -Math.PI/2*rotation_mult, Vec.of(0,0,-1) ).times( Vec.of(0,1,0,1) ).to3();
      this.model_transform = this.model_transform.times( Mat4.translation(movement_vector.times(distance)) );

      // If Spiderman moves too far left/right of the building wall, he should "fall" to the ground
      spiderpos = this.model_transform.times(Vec.of(0,0,0,1)).to3();
      let height = spiderpos[1],
          ground = 1; // Mat4.translation([0,1,0]).times(Vec.of(0,0,0,1))[1]; 
      let should_fall = false;
      const nextTransform = this.simulate_keyboard_move("forward").times(Mat4.scale([.5,1,1]));
      const nextShape = { body: { positions: this.nextShape.body.positions, transform: nextTransform } };
      if ( this.isOnWall && this.collisionManager.findBuildingThatSpidermanHits(nextShape) === null ) // If wall is no longer in front, fall
        should_fall = true;

      // Ground shenanigans 
      if ( height < ground || should_fall ) {
        this.model_transform = this.model_transform.times( Mat4.translation([0,ground-height+0.01,0]) );
        this.isOnWall = false;
      }
    }
>>>>>>> Stashed changes
    
    // Update camera
>>>>>>> Stashed changes
    this.camera.translate( this.model_transform );
    //update physical position
    this.physics.update_pos( this.model_transform );
  }
<<<<<<< Updated upstream
  //may need to add another keyboard just to let him move up
  rotate( theta )
||||||| merged common ancestors
  rotate( theta )
=======
  rotate( current_orientation, desired_orientation )
>>>>>>> Stashed changes
  {
    // Determine angle of rotation
    let theta = 0;
    let cross_product = current_orientation.cross( desired_orientation ),
        dot_product = current_orientation.dot( desired_orientation  );
    let CCW_or_CW = cross_product.dot( Vec.of(0,1,0) ) > 0 ? 1 : -1;
    theta = Math.acos( dot_product ) * CCW_or_CW; // Theta becomes negative if movement_vector is CW of spiderman_orientation

    // Apply rotation to model transform. Make sure camera is aware that Spiderman has rotated but it should stay in place.
    this.model_transform = this.model_transform.times( Mat4.rotation(theta, Vec.of(0,1,0)) );
    this.camera.rotate_subject( theta );
  }
<<<<<<< Updated upstream
  
  //get position
  get_position(){
	//From this model transform, will need to use that to get the position and update position in the physics instance in this object
	console.log("x: " + this.physics.position.x + " y: " + this.physics.position.y + " z: " + this.physics.position.z );
  }
  
  //jump function that will call the physics class jump function
  //should only be called when button pressed
  jump(){ this.physics.jump(); };
//----------------------------------------------------------------------------------//  
  //update/gravity
  update(){
	if (this.contact){
	}
	if (!this.webbed && !this.contact){ //if neither in contact or spider web out
		this.model_transform = this.physics.gravity();
		this.physics.reset_angular();
	}
	if (this.webbed && !this.contact){ //if web is out and he is not in contact with anything
		if (this.model_transform.times(Vec.of(0,0,0,1))[1] > 1){
			this.model_transform = this.physics.pendulum(this.model_transform);
		}
		else{
			this.webbed = false; //forces web back and stop pendulum when at ground
		}
	} 
		this.camera.translate(this.model_transform); 
  }
  
  change_contact(bool){
  	this.contact = bool;
  }
  change_web(){
	  if (this.webbed){
		this.webbed = false;
	  }
	  else{
		  this.webbed = true;
	  }
  }
//----------------------------------------------------------------------------------// 
||||||| merged common ancestors

=======

  // Setters
  setNextShape( nextShape ) { this.nextShape = nextShape; }
  setCollisionManager( cm ) { this.collisionManager = cm; }

>>>>>>> Stashed changes
  // Direct camera functions
  camera_swivel( mouseEvent ) { this.camera.swivel( mouseEvent ); }
  camera_toggle_birdseye() { this.camera.toggle_birdseye(); }
  camera_look_forward() { this.camera.look_forward(); }
}