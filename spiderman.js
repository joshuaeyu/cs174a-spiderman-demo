// Holds Spiderman's model transform and attached camera, and handles Spiderman's movement.
  // physics_move           - (Can be used for physics-based movement?)
  // keyboard_move          - Takes a direction input (i.e., through a key press) and updates Spiderman's and camera's transforms accordingly.
  // rotate                 - Rotate Spiderman without moving camera.
  // camera_update_rotate   - Handle mouse movement using this.camera.update_rotate().
  // camera_toggle_birdseye - Toggles minimap (overhead) view through this.camera.
  // camera_look_forward    - Force camera to look at Spiderman's forward direction.
window.Spiderman = window.classes.Spiderman = 
class Spiderman 
{
  constructor( graphics_state )
  {
    Object.assign( this, { model_transform: Mat4.translation([0,1,0]), camera: new Camera( graphics_state, Mat4.translation([0,1,0]) ) } );
  }
  physics_move( displacement_Vec, distance = 1 )
  {
    this.model_transform = this.model_transform.times( Mat4.translation( displacement_Vec.times(distance) ) );
    this.camera.update_translate( this.model_transform );
  }
  keyboard_move( direction )
  {
    let distance = 1; // Adjustable
    let rotation_mult = 0;
    switch ( direction )
    {
      case ("forward"):  break;
      case ("backward"): rotation_mult = 2; break;
      case ("left"):     rotation_mult = 1; break;
      case ("right"):    rotation_mult = 3; break;
    }
    // Calculate Spiderman movement (translation) vector according to input direction and current camera orientation
    let camera_xz_orientation = this.camera.locals.spidermanToCamera_Vec.mult_pairs( Vec.of(-1,0,-1) ).normalized();  // Unit vector
    let movement_vector = Mat4.rotation( Math.PI/2*rotation_mult, Vec.of(0,1,0) ).times( camera_xz_orientation.to4(1) ).to3();  // Unit vector
    // Rotate Spiderman from current orientation to face in direction of movement vector if direction = "forward",
    // otherwise translate according to movement vector without rotation
    let theta = 0;
    if ( direction == "forward" ) {
      let cross_product = Vec.of(0,0,-1).cross( movement_vector );
      let dot_product = Vec.of(0,0,-1).dot( movement_vector );
      theta = Math.acos( dot_product ) * cross_product.dot( Vec.of(0,1,0) ); // Theta becomes negative if movement_vector is CW of spiderman_orientation
      this.rotate( theta );
      movement_vector = Vec.of(0,0,-1);
    }
    this.model_transform = this.model_transform.times( Mat4.translation(movement_vector).times(distance) );
    // Update camera transform
    this.camera.update_translate( this.model_transform );
  }
  rotate( theta )
  {
    // Apply rotation to model transform. Make sure camera is aware that Spiderman has rotated but it should stay in place.
    this.model_transform = this.model_transform.times( Mat4.rotation(theta, Vec.of(0,1,0)) );
    this.camera.update_stationary( theta );
  }

  // Direct camera functions
  camera_update_rotate( mouseEvent ) { this.camera.update_rotate( mouseEvent ); }
  camera_toggle_birdseye() { this.camera.toggle_birdseye(); }
  camera_look_forward() { this.camera.look_forward(); }
}