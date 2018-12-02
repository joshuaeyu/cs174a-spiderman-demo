// Updates camera according to Spiderman's position and mouse movement, then updates the graphics state.
  // swivel           - Rotate camera around Spiderman according to mouse movement.
  // translate        - Translate camera (follow Spiderman) without changing camera angle relative to Spiderman's forward direction.
  // rotate_subject   - Use to update camera when Spiderman rotates. (Update local S-to-C vector without modifying camera transform)
  // look_forward     - Force camera to look at Spiderman's forward direction.
  // toggle_birdseye  - Toggles map (overhead) view.
  // update_transform - Update local camera transform using local Spiderman and camera positions.
  // push_to_gs       - Update the global graphics state with locally stored camera transform.
window.Camera = window.classes.Camera =
class Camera
{
  constructor( graphics_state, spidermanUnscaledPosMat )
  {
    // Initialize global (actual graphics state) and local (stored in Camera object) member objects/variables with temporary initial values
    Object.assign( this, { globals: { gs: graphics_state },
                           locals:  { spiderman_Mat:         spidermanUnscaledPosMat, // Spiderman's unscaled position matrix (model transform)
                                      spiderman_PosVec:      Vec.of(0,0,0),           // Spiderman's absolute position vector
                                      spidermanToCamera_Vec: Vec.of(0,0,0),           // Vector between Spiderman's position and camera's position ("S-to-C"),
                                                                                      // relative to Spiderman's coordinate transform
                                      camera_Mat:            Mat4.identity(),         // Camera transform
                                      camera_PosVec:         Vec.of(0,0,0)            /* Camera's absolute position vector */ } } );
    // Constant default Spiderman-to-camera ("S-to-C") vector (looks forward)
    Object.defineProperty( this, 'defaultSToC', { value: Vec.of(0,3,15),  writable: false } );
    Object.defineProperty( this, 'inBirdsEye', { value: false,  writable: true } );
    // Assign real initial values and push to gs
    this.locals.spiderman_PosVec = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1)).to3();
    this.locals.spidermanToCamera_Vec = this.defaultSToC;
    this.locals.camera_PosVec = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1)).to3().plus( this.locals.spidermanToCamera_Vec );
    this.update_and_push();
  }
  swivel( mouseEvent )
  {
    let dX = mouseEvent.movementX, dY = mouseEvent.movementY;
    if ( dX == 0 && dY == 0 ) // Do nothing if mouse isn't moved
      return;

    let magn_default = this.defaultSToC.norm(),
        xz_radius_min = 2, // Adjustable
        y_max_default = Math.sqrt( magn_default**2 - xz_radius_min**2 );

    // Rotate vector connecting Spiderman position and camera position
    let horiz_sens = 5, vert_sens = 5; // Adjustable
    let xz_axis = this.locals.spidermanToCamera_Vec.mult_pairs(Vec.of(1,0,1)).cross(Vec.of(0,-1,0)); // Calculate x-z axis of rotation
    let y_current = this.locals.spidermanToCamera_Vec.dot(Vec.of(0,1,0));
    let horiz_change = dX == 0 ?
                Vec.of(0,0,0) : Mat4.rotation( horiz_sens * dX/250, Vec.of(0,-1,0) ).times( this.locals.spidermanToCamera_Vec.to4(1) ).to3().minus( this.locals.spidermanToCamera_Vec ),
        vert_change  = dY == 0 || Math.abs(y_current) >= y_max_default ?
                Vec.of(0,0,0) : Mat4.rotation( vert_sens * -dY/250, xz_axis        ).times( this.locals.spidermanToCamera_Vec.to4(1) ).to3().minus( this.locals.spidermanToCamera_Vec );
    this.locals.spidermanToCamera_Vec = this.locals.spidermanToCamera_Vec.plus( horiz_change ).plus( vert_change );
    // Make sure camera doesn't go crazy when mouse moves very quickly
    let magn_proposed = this.locals.spidermanToCamera_Vec.norm();
    if ( magn_proposed != magn_default )
      this.locals.spidermanToCamera_Vec.scale( magn_default / magn_proposed );
    // Don't let camera come to close to Spiderman when y=0, and don't let camera be directly overhead (causes weirdness)
    let xz_radius_proposed = this.locals.spidermanToCamera_Vec.mult_pairs( Vec.of(1,0,1) ).norm()
    if ( xz_radius_proposed < xz_radius_min ) {
      let y_proposed = this.locals.spidermanToCamera_Vec.dot(Vec.of(0,1,0));
      this.locals.spidermanToCamera_Vec = this.locals.spidermanToCamera_Vec.mult_pairs( Vec.of( xz_radius_min/xz_radius_proposed,
                                                                                                y_max_default/Math.abs(y_proposed),
                                                                                                xz_radius_min/xz_radius_proposed ) );
    }

    this.update_and_push();
    this.inBirdsEye = false;
  }
  translate( spidermanUnscaledPosMat )
  {
    // Update local Spiderman matrix and position vector according to the new spidermanUnscaledPosMat
    this.locals.spiderman_Mat = spidermanUnscaledPosMat;
    this.locals.spiderman_PosVec = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1)).to3();

    this.update_and_push();
    this.inBirdsEye = false;
  }
  rotate_subject( theta )
  {
    // Update local Spiderman matrix and position vector according to theta
    this.locals.spiderman_Mat = this.locals.spiderman_Mat.times( Mat4.rotation(theta, Vec.of(0,1,0)) );
    this.locals.spiderman_PosVec = this.locals.spiderman_Mat.times(Vec.of(0,0,0,1)).to3();

    // Obtain new S-to-C vector by rotating existing one
    this.locals.spidermanToCamera_Vec = Mat4.rotation(-theta, Vec.of(0,1,0)).times( this.locals.spidermanToCamera_Vec.to4(1) ).to3();
  }
  look_forward()
  {
    // Revert S-to-C vector back to default
    this.locals.spidermanToCamera_Vec = this.defaultSToC;

    this.update_and_push();
    this.inBirdsEye = false;
  }
  toggle_birdseye()
  {
    // Bird's-eye view is when the camera is positioned 125 units above the origin looking straight down
    this.globals.gs.camera_transform = !this.inBirdsEye ?
        Mat4.look_at( Vec.of(0,200,0), Vec.of(0,0,0), Vec.of(0,0,-1) ) : this.locals.camera_Mat;
    this.inBirdsEye = !this.inBirdsEye;
  }

  update_and_push()
  {
    // Determine camera position and camera transform, then push to gs
    let camera_Pos_proposed = this.locals.spiderman_Mat.times( Mat4.translation(this.locals.spidermanToCamera_Vec) )
                                                       .times( Vec.of(0,0,0,1) ).to3();
    let y_mult = camera_Pos_proposed[1] < 0 ? 0 : 1; // If the camera is below the ground, force camera's y-coordinate to 0.
    this.locals.camera_PosVec = camera_Pos_proposed.mult_pairs( Vec.of(1,y_mult,1) );

    // Update local camera transform according to local camera position and local Spiderman position
    this.locals.camera_Mat = Mat4.look_at( this.locals.camera_PosVec, this.locals.spiderman_PosVec, Vec.of(0,1,0) );
    
    // Update global (graphics_state) camera transform according to local camera transform
    this.globals.gs.camera_transform = this.locals.camera_Mat;
  }
}
