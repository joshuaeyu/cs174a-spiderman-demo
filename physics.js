//physics class will contain all physics functions and member variables
	//member variables
		//mass - single value
		//position - three coordinates
		//velocity_xz - single variable, not under the influence of any force, either 0 or velocity value
		//velocity_y - single variable, is under the influence of gravity
		//gravity - single variable
		//radius - single value, used for moment of inertia calculation
		//rotation - three values: pitch roll yaw
		//angular velocity - three values for each coordinate
		//angular acceleration - three values for each coordinate
		//moment of inertia - 3 x 3 matrix. will be created in calculating angular acceleration
	
	//functions
		//all will return position to spider man class or the world class
		//jumping
		//angular calculation when shooting web 

window.Physics = window.classes.Physics =
class Physics
{
	constructor( graphics_state, spidermanUnscaledPosMat)
	{
		Object.assign( this, {gs: graphics_state, spiderman_PosMat: spidermanUnscaledPosMat});
		this.mass = 70; //defined in kg
		this.position = { x: spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[0], 
						  y: spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[1],
						  z: spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[2] };
		this.ground_y = 1;
		this.pt_of_rotation = {x: 0, y: 0, z: 0 };
		this.velocity_xz = 10;
		this.velocity_y = 0;
		this.acc_grav = -9.8; 
		this.radius = 0.5; //defined in length unit
		this.rotation = {pitch: 0, roll: 0, yaw: 0 };
		this.ang_vel = {x: 0, y: 0, z: 0 };
		this.ang_acc = {x: 0, y: 0, z: 0 };
		this.grounded = true;
	}
	//update position function
	update_pos(spidermanUnscaledPosMat){
		this.spiderman_PosMat = spidermanUnscaledPosMat;
		this.position.x = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[0], 
		this.position.y = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[1],
		this.position.z = spidermanUnscaledPosMat.times(Vec.of(0,0,0,1))[2]
	}
	//grav - so calculating motion after initial jump that gives y-velocity
	//always called
	//TODO
	//add spidermanUnscaledPosMat as an argument
	//translate(spidermanUnscaledPosMat) --> gives updated position 
	//do calculation changing position, spiderman_Posmat, spiderman_Posvec <-- get rid of position later and base all on spiderman_Posvec
	//return updated spiderman_Posmat using 
	//spidermanUnscaledPosMat.times
	//(Mat4.translation([0,this.velocity_y * this.gs.animation_delta_time / 1000, 0])
	gravity(spidermanUnscaledPosMat)
	{
		//get updated spiderman_Posmat, spiderman_Posvec, position
		var previous_pos_y = this.position.y;
		//do calculation giving updated position and velocity
		this.velocity_y += this.acc_grav * this.gs.animation_delta_time / 1000;
		this.position.y += this.velocity_y * this.gs.animation_delta_time / 1000;
		if(this.position.y < (this.ground_y + 0.01)){
			this.position.y = this.ground_y;
			this.velocity_y = 0.0;
			this.grounded = true;
		}
		if(this.grounded == true){
			this.velocity_y = 0.0;
		}
		//update spiderman_Posvec and spiderman_Posmat from position
		this.spiderman_PosMat = this.spiderman_PosMat.times(Mat4.translation([0,this.position.y - previous_pos_y,0]));
		return this.spiderman_PosMat;
	}
	//Should be fine, not high priority
	//jumping -- only called when spacebar pressed
	jump()
	{
		if (this.position.y < this.ground_y || this.grounded == true){
			//change y-velocity and then let gravity take care of the rest
			this.velocity_y = 10;
			this.grounded = false;
		}
	}
	//velocity verlet
	//calculate current position from last frame's position, velocity, and acceleration
	//goes first
	velocity_verlet()
	{
		this.rotation.pitch += this.ang_vel.x * dt + (0.5 * this.ang_acc.x * (this.gs.animation_delta_time / 1000) * (this.gs.animation_delta_time / 1000));
		this.rotation.yaw += this.ang_vel.y * dt + (0.5 * this.ang_acc.y * (this.gs.animation_delta_time / 1000) * (this.gs.animation_delta_time / 1000));
		this.rotation.roll += this.ang_vel.z * dt + (0.5 * this.ang_acc.z * (this.gs.animation_delta_time / 1000) * (this.gs.animation_delta_time / 1000));		
	}
	//calculate torque from current position then acceleration
	//calculate the angular acceleration as inverse of moment of inertia times torque vector, giving components 
	//calculate the angular velocity component-wise using previous and current angular acceleration
	//update pitch, roll, yaw
	//function should only be called when y-position is greater than 0.1 or grounded is false
	update_ang_comp()
	{
		//find the force vector which will be perpendicular to the xz components of the pt of rotation-position vector
		var mag_force = this.mass * (this.velocity_xz)/4.0;
		var z_component = -(this.position.x - this.pt_of_rotation.x)/(this.position.z - this.pt_of_rotation.z);
			T = Vec.of(this.position.x - this.pt_of_rotation.x,this.position.y  - this.pt_of_rotation.y,this.position.z -  - this.pt_of_rotation.z)
			.cross(Vec.of(1.0,this.gravity,z_component));
		//calculate the moment of inertia, assuming a sphere b/c why not
		var J = [[0.4 * this.mass * this.radius, 0.0, 0.0],
				 [0.0, 0.4 * this.mass * this.radius, 0.0],
				 [0.0, 0.0, 0.4 * this.mass * this.radius]];
		//calculate the angular acceleration
		var alpha = math.divide(T,J);
		//calculate the velocity component-wise
		this.omega.x += 0.5 *(alpha[0] * this.alpha.x) * (this.gs.animation_delta_time / 1000);
		this.omega.y += 0.5 *(alpha[1] * this.alpha.y) * (this.gs.animation_delta_time / 1000);
		this.omega.z += 0.5 *(alpha[2] * this.alpha.z) * (this.gs.animation_delta_time / 1000);
		//update acceleration
		this.alpha.x = alpha[0];
		this.alpha.y = alpha[1];
		this.alpha.z = alpha[2]; 
		//draw the torus with the updated position and rotation
		//get rotation by integrating omega
		this.rotation.pitch += this.omega.x * (this.gs.animation_delta_time / 1000);
		this.rotation.yaw += this.omega.y * (this.gs.animation_delta_time / 1000);
		this.rotation.roll += this.omega.z * (this.gs.animation_delta_time / 1000);		
	}
	//convert pitch, roll, yaw to quaternion
	toQuaternion()
	{
		// Abbreviations for the various angular functions
		var cy = Math.cos(this.rotation.yaw * 0.5);
		var sy = Math.sin(this.rotation.yaw * 0.5);
		var cr = Math.cos(this.rotation.roll * 0.5);
		var sr = Math.sin(this.rotation.roll * 0.5);
		var cp = Math.cos(this.rotation.pitch * 0.5);
		var sp = Math.sin(this.rotation.pitch * 0.5);

		var q = [];
		q[0] = cy * cr * cp + sy * sr * sp;
		q[1] = cy * sr * cp - sy * cr * sp;
		q[2] = cy * cr * sp + sy * sr * cp;
		q[3] = sy * cr * cp - cy * sr * sp;
		return q;
	}
	//uses a quaternion to find the new position
    findPosition(q)
	{
		var previous_x = this.position.x;
		var previous_y = this.position.y;
		var previous_z = this.position.z;
		this.position.x = this.position.x * ((q[0] * q[0]) + (q[1] * q[1]) - (q[2] * q[2]) - (q[3] * q[3])) +
						  2.0 * this.position.y * ((q[1]*q[2])-(q[0]*q[3])) +
						  2.0 * this.position.z * ((q[0]*q[2])+(q[1]*q[3]));
		this.position.y = 2.0 * this.position.x * ((q[0] * q[3]) + (q[1] * q[2])) +
						  this.position.y * ((q[0] * q[0]) - (q[1] * q[1]) + (q[2] * q[2]) - (q[3] * q[3])) +
						  2.0 * this.position.z * ((q[2]*q[3])-(q[0]*q[1]));
		this.position.z = 2.0 * this.position.x * ((q[1] * q[3]) - (q[0] * q[2])) +
						  2.0 * this.position.y * ((q[0] * q[1]) + (q[2] * q[3])) +
						  this.position.z * ((q[0] * q[0]) - (q[1] * q[1]) - (q[2] * q[2]) + (q[3] * q[3]));
		//update spiderman_Posvec and spiderman_Posmat from position
		this.spiderman_PosMat = this.spiderman_PosMat.times(Mat4.translation([0,this.position.y - previous_pos_y,0]));
		return this.spiderman_PosMat;
	}
}