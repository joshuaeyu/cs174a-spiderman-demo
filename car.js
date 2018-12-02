// Car object
window.Car = window.classes.Car =
class Car{
  constructor(starting_pos, cube, torus, blue, black, white, yellow, red) {
      this.car = new Node(starting_pos.times(Mat4.translation([0,1.21,0]).times(Mat4.scale([1,0.75,2.5]))), cube, blue);
 	  this.hood = new Node(Mat4.translation([0,1.75,0]).times(Mat4.scale([1,0.75,0.5])), cube, blue);
 	  this.windows = new Node(Mat4.translation([0,1.6,-0.2]).times(Mat4.scale([1.1,0.6,0.2])), cube, black);
 	  this.wheel1 = new Node(Mat4.translation([0.5,-1.2,-0.5]).times(Mat4.scale([0.15,0.15,0.15]).times(Mat4.rotation(1.57, [0,1,0]))), torus, black);
 	  this.rim1 = new Node(Mat4.scale([0.75,1.25,1]), cube, white);
 	  this.wheel2 = new Node(Mat4.translation([-0.5,-1.2,-0.5]).times(Mat4.scale([0.15,0.15,0.15]).times(Mat4.rotation(1.57, [0,1,0]))), torus, black);
 	  this.rim2 = new Node(Mat4.scale([0.75,1.25,1]), cube, white);
 	  this.wheel3 = new Node(Mat4.translation([0.5,-1.2,0.5]).times(Mat4.scale([0.15,0.15,0.15]).times(Mat4.rotation(1.57, [0,1,0]))), torus, black);
 	  this.rim3 = new Node(Mat4.scale([0.75,1.25,1]), cube, white);
 	  this.wheel4 = new Node(Mat4.translation([-0.5,-1.2,0.5]).times(Mat4.scale([0.15,0.15,0.15]).times(Mat4.rotation(1.57, [0,1,0]))), torus, black);
 	  this.rim4 = new Node(Mat4.scale([0.75,1.25,1]), cube, white);
 	  this.left_light = new Node(Mat4.translation([-0.5,0.2,-0.8]).times(Mat4.scale([0.25,0.25,0.25])), cube, yellow);
 	  this.right_light = new Node(Mat4.translation([0.5,0.2,-0.8]).times(Mat4.scale([0.25,0.25,0.25])), cube, yellow);
 	  this.left_back_light = new Node(Mat4.translation([-0.6,0,0.8]).times(Mat4.scale([0.3,0.25,0.25])), cube, red);
 	  this.right_back_light = new Node(Mat4.translation([0.6,0,0.8]).times(Mat4.scale([0.3,0.2,0.25])), cube, red);
 	  //this.intersection_box = new Node(Mat4.)

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
  }

  get_array(position_array, node_array) {
    this.car.list_draw_compounded(position_array, Mat4.identity(), node_array);
  }

  move(car_matrix, wheel_matrix) {
    this.car.position = this.car.position.times(car_matrix);
    this.wheel1.position = this.wheel1.position.times(wheel_matrix);
    this.wheel2.position = this.wheel2.position.times(wheel_matrix);
    this.wheel3.position = this.wheel3.position.times(wheel_matrix);
    this.wheel4.position = this.wheel4.position.times(wheel_matrix);
  }
}