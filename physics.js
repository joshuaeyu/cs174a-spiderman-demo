//physics class will contain all physics functions and member variables
window.Physics = window.classes.Physics =
class Physics
{
	constructor( graphics_state, spidermanUnscaledPosMat)
	{
		Object.assign( this, {gs: graphics_state, spiderman_PosMat: spidermanUnscaledPosMat});
		this.mass = 10; //defined in kg
		this.position = { x: spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[0], 
						  y: spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[1],
						  z: spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[2] };
		this.permanent_ground = 1;
		//this.pt_of_rotation = {x: 0, y: 0, z: 0 };
		this.velocity_xz = 10;
		this.velocity_y = 0;
		this.up_velocity = 2; //for when he is climbing up walls
		this.acc_grav = -25; 
		this.rotation = -0.0996686525; //arctan(10/100) 10 is units in xz plane 100 is units in y axis
		this.ang_vel = 0;
		this.ang_acc = 0;
		this.grounded = true;
	}
	//update position function
	update_pos(spidermanUnscaledPosMat){
		this.spiderman_PosMat = spidermanUnscaledPosMat;
		this.position.x = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[0]; 
		this.position.y = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[1];
		this.position.z = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[2];
	}
	//update ground function, used for when sticking
	//reset ground function, used for when he is not sticking
	//grav - so calculating motion after initial jump that gives y-velocity
	//always called
	gravity()
	{
		//get updated spiderman_Posmat, spiderman_Posvec, position
		var previous_pos_y = this.position.y;
		//do calculation giving updated position and velocity
		this.velocity_y += this.acc_grav * this.gs.animation_delta_time / 1000;
		this.position.y += this.velocity_y * this.gs.animation_delta_time / 1000;
		//for if on  ground
		if(this.position.y < (this.permanent_ground + 0.01)){ //will need to change in future with AABB
			this.position.y = this.permanent_ground;
			this.velocity_xz = 10.0; //can have a higher velocity when in air like swinging but will only have one speed on ground
			this.velocity_y = 0.0;
			this.grounded = true;
		}
		//update spiderman_Posvec and spiderman_Posmat from position
		this.spiderman_PosMat = this.spiderman_PosMat.times(Mat4.translation([0,this.position.y - previous_pos_y,0]));
		return this.spiderman_PosMat;
	}
	//Should be fine
	//jumping -- only called when spacebar pressed
	jump()
	{
		if (this.position.y < this.permanent_ground || this.grounded == true){
			//change y-velocity and then let gravity take care of the rest
			this.velocity_y = 15.0;
			this.grounded = false;
		}
	}
	//when the web is shoot, just pendulum motion
	pendulum(spidermanUnscaledPosMat)
	{
		var length = 1;
		this.rotation += this.ang_vel * (this.gs.animation_delta_time / 1000) + (0.5 * this.ang_acc * (this.gs.animation_delta_time / 1000) * (this.gs.animation_delta_time / 1000));
		var moment_of_inertia = this.mass * length * length; //100.5 is just an arbitary number at this point sqrt(10^2 + 100^2)
		//calculate  net force on object
		var torque = this.mass * -this.acc_grav * Math.cos(this.rotation) * length;
		//calculate acceleration
		var ang_acc = torque/moment_of_inertia;
		//calculate velocity
		this.ang_vel += 0.5 * (ang_acc + this.ang_acc) * (this.gs.animation_delta_time / 1000);
		this.ang_acc = ang_acc;
		//calculate position
		this.spiderman_PosMat = this.spiderman_PosMat.times(Mat4.translation([0,length * Math.sin(this.rotation), length * -Math.cos(this.rotation)]));
		this.update_pos(this.spiderman_PosMat);
		//return position
		return this.spiderman_PosMat;
	}
	//reset the angular components when not swinging
	reset_angular(){
		this.rotation = -0.0996686525; //arctan(10/100) 10 is units in xz plane 100 is units in y axis
		this.ang_vel = 0;
		this.ang_acc = 0;
	}
}