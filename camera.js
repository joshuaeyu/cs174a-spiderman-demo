// Updates camera according to Spiderman's position and mouse movement, then updates the graphics state.
  // update_rotate     - Rotate camera around Spiderman according to mouse movement.
  // update_translate  - Translate camera (follow Spiderman) without changing camera angle relative to Spiderman's forward direction.
  // update_stationary - Use when Spiderman rotates while camera is stationary. (Update local S-to-C vector without modifying camera transform)
  // look_forward      - Force camera to look at Spiderman's forward direction.
  // toggle_birdseye   - Toggles map (overhead) view.
  // push_to_gs        - Update the global graphics state with locally stored camera transform.
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
    Object.defineProperty( this, 'defaultSToC', { value: Vec.of(0,6,11),  writable: false } );
    // Assign real initial values and push to gs
    this.locals.spiderman_PosVec = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1)).to3();
    this.locals.spidermanToCamera_Vec = this.defaultSToC;
    this.locals.camera_PosVec = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1)).to3().plus( this.locals.spidermanToCamera_Vec );
    this.locals.camera_Mat = Mat4.look_at( this.locals.camera_PosVec, this.locals.spiderman_PosVec, Vec.of(0,1,0) );
    this.push_to_gs();
  }
  update_rotate( mouseEvent ) 
  {
    let dX = mouseEvent.movementX, dY = mouseEvent.movementY;
    if ( dX == 0 && dY == 0 ) // Do nothing if mouse isn't moved
      return;

    // Rotate vector connecting Spiderman position and camera position
    dY = this.locals.spidermanToCamera_Vec.dot(Vec.of(0,0,-1)) > 0 ? -dY : dY; // If the camera is in front of Spiderman, invert rotation about the x-axis
    this.locals.spidermanToCamera_Vec = Mat4.rotation( Math.sqrt(dX**2+dY**2)/50, Vec.of(-dY,-dX,0) ).times( this.locals.spidermanToCamera_Vec.to4(1) ).to3();  
      
    // Determine camera position and camera transform, then push to gs
    let y_mult = this.locals.spidermanToCamera_Vec.dot(Vec.of(0,-1,0)) > 0 ? 0 : 1; // If the camera is below the ground, force camera's y-coordinate to 0.
    this.locals.camera_PosVec = this.locals.spiderman_Mat.times( Mat4.translation(this.locals.spidermanToCamera_Vec) )
                                                         .times( Vec.of(0,0,0,1) ).to3()
                                                         .mult_pairs( Vec.of(1,y_mult,1) );
    this.locals.camera_Mat = Mat4.look_at( this.locals.camera_PosVec, this.locals.spiderman_PosVec, Vec.of(0,1,0) );
    
    this.push_to_gs();
  }
  update_translate( spidermanUnscaledPosMat )
  {
    // Update local Spiderman matrix and position vector according to the new spidermanUnscaledPosMat
    this.locals.spiderman_Mat = spidermanUnscaledPosMat;
    this.locals.spiderman_PosVec = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1)).to3(); 

    // Use existing S-to-C to determine new camera position and new camera transform, then push to gs
    this.locals.camera_PosVec = this.locals.spiderman_Mat.times( Mat4.translation(this.locals.spidermanToCamera_Vec) )
                                                         .times( Vec.of(0,0,0,1) ).to3();
    this.locals.camera_Mat = Mat4.look_at( this.locals.camera_PosVec, this.locals.spiderman_PosVec, Vec.of(0,1,0) ); 
    
    this.push_to_gs();
  }
  update_stationary( theta )
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
    // Update camera position and camera transform according, then push to gs
    this.locals.camera_PosVec = this.locals.spiderman_Mat.times( Mat4.translation(this.locals.spidermanToCamera_Vec) )
                                                         .times( Vec.of(0,0,0,1) ).to3();
    this.locals.camera_Mat = Mat4.look_at( this.locals.camera_PosVec, this.locals.spiderman_PosVec, Vec.of(0,1,0) );
    
    this.push_to_gs();  // Push to gs
  }
  toggle_birdseye()
  {
    // Bird's-eye view is when the camera is positioned 125 units above the origin looking straight down
    this.globals.gs.camera_transform = this.globals.gs.camera_transform === this.locals.camera_Mat ? 
        Mat4.look_at( Vec.of(0,125,0), Vec.of(0,0,0), Vec.of(0,0,-1) ) : this.locals.camera_Mat;    
  }
  push_to_gs()
  {
    // Update global (graphics_state) camera transform according to local camera transform
    this.globals.gs.camera_transform = this.locals.camera_Mat;
  }
}