// Person Object
window.Person = window.classes.Person =
class Person {
  constructor(starting_pos, cube, sphere, green, white, black, tan) {
      this.torso = new Node(starting_pos.times(Mat4.translation([0,2.8,0]).times(Mat4.scale([0.5,0.6,0.25]))), cube, green);
	  this.neck = new Node(Mat4.translation([0,1.3,0]).times(Mat4.scale([0.25,0.4,0.5]).times(Mat4.rotation(0.7,[0,1,0]))), cube, white);
	  this.head = new Node(Mat4.translation([0,1.5,0]).times(Mat4.rotation(-0.7,[0,1,0]).times(Mat4.scale([2.5,1.4,2.2]))), sphere, white);
	  this.hip = new Node(Mat4.translation([0,-1.5,0]).times(Mat4.scale([0.8,0.5,0.8])), cube, green);
	  this.right_upper_leg = new Node(Mat4.translation([0.5,-2,-0.6]).times(Mat4.rotation(0.7,[1,0,0]).times(Mat4.scale([0.4,1.6,0.8]))), cube, green);
	  this.right_shin = new Node(Mat4.translation([0,-1.4,0.4]).times(Mat4.rotation(-0.5, [1,0,0])).times(Mat4.scale([0.95,1,0.95])), cube, white);
	  this.right_shoe = new Node(Mat4.translation([0,-0.8,-0.6]).times(Mat4.rotation(-1.3,[1,0,0]).times(Mat4.scale([0.75,1.75,0.3]))), cube, black);
	  this.left_upper_leg = new Node(Mat4.translation([-0.5,-2,0.6]).times(Mat4.rotation(-0.7,[1,0,0]).times(Mat4.scale([0.4,1.6,0.8]))), cube, green);
	  this.left_shin = new Node(Mat4.translation([0,-1.4,0.4]).times(Mat4.rotation(-0.5, [1,0,0])).times(Mat4.scale([0.95,1,0.95])), cube, white);
	  this.left_shoe = new Node(Mat4.translation([0,-0.63,-0.6]).times(Mat4.rotation(-1.3,[1,0,0]).times(Mat4.scale([0.75,1.6,0.4]))), cube, black);
	  this.right_upper_arm = new Node(Mat4.translation([1,0.1,1]).times(Mat4.rotation(-1,[1,0,0]).times(Mat4.scale([0.25,1,0.4]))),cube, green);
	  this.right_lower_arm = new Node(Mat4.translation([0,-0.6,-1]).times(Mat4.rotation(3,[1,0,0]).times(Mat4.scale([0.95,0.5,0.95]))), cube, white);
	  this.right_hand = new Node(Mat4.rotation(1,[1,0,0]).times(Mat4.translation([0,1,0.5]).times(Mat4.scale([1,0.5,1]))), sphere, white);
	  this.left_upper_arm = new Node(Mat4.translation([-1,0.1,-1]).times(Mat4.rotation(1,[1,0,0]).times(Mat4.scale([0.25,1,0.4]))),cube, green);
	  this.left_lower_arm = new Node(Mat4.translation([0,-0.6,-1]).times(Mat4.rotation(3,[1,0,0]).times(Mat4.scale([0.95,0.5,0.95]))), cube, tan);
	  this.left_hand = new Node(Mat4.rotation(1,[1,0,0]).times(Mat4.translation([0,1,0.5]).times(Mat4.scale([1,1.5,0.75]))), sphere, white);

	  this.torso.add_child(this.neck);
	  this.neck.add_child(this.head);
	  this.torso.add_child(this.hip);
	  this.hip.add_child(this.right_upper_leg);
	  this.right_upper_leg.add_child(this.right_shin);
	  this.right_shin.add_child(this.right_shoe);
	  this.hip.add_child(this.left_upper_leg);
	  this.left_upper_leg.add_child(this.left_shin);
	  this.left_shin.add_child(this.left_shoe);
	  this.torso.add_child(this.right_upper_arm);
	  this.torso.add_child(this.left_upper_arm);
	  this.right_upper_arm.add_child(this.right_lower_arm);
	  this.left_upper_arm.add_child(this.left_lower_arm);
	  this.right_lower_arm.add_child(this.right_hand);
	  this.left_lower_arm.add_child(this.left_hand);
  }

  get_array(position_array, node_array) {
    this.torso.list_draw_compounded(position_array, Mat4.identity(), node_array);
  }

  move(person_matrix) {
    this.torso.position = person_matrix.times(this.torso.position); //this.torso.position.times(person_matrix);
  }
}