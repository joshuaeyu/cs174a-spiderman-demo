//lamp post
//notes on the lamp post:
//	to place on ground, will need to place it 2 units above the ground
//  a circle and light need to be scaled at 0.8 and placed at +4.5 x units and +4 y-units of where the lamp post is created
window.Lamp = window.classes.Lamp =
class Lamp extends Shape     
{ 
  constructor() { 
    super( "positions", "normals", "texture_coords" );
    Closed_Cone.insert_transformed_copy_into(this,[15,15],Mat4.identity().times(Mat4.translation([0,-4,0]).times(Mat4.rotation(-Math.PI/2,Vec.of(1,0,0)))));
    Cube.insert_transformed_copy_into(this,[],Mat4.identity().times(Mat4.scale([0.25,4,0.25])));
    Cube.insert_transformed_copy_into(this,[],Mat4.identity().times(Mat4.translation([1.75,4,0])).times(Mat4.scale([2,0.25,0.25])));
    Half_Sphere.insert_transformed_copy_into(this,[15,15],Mat4.identity().times(Mat4.translation([4.5,4,0]).times(Mat4.rotation(-Math.PI/2,Vec.of(1,0,0)))));
    Subdivision_Sphere.insert_transformed_copy_into(this,[4],Mat4.identity().times(Mat4.translation([4.5,4,0])).times(Mat4.scale([0.75,0.75,0.75])));
  } 
}