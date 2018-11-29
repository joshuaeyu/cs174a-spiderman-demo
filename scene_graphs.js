// Scene Graphs functions
window.Node = window.classes.Node =
class Node {
  constructor(node_transform) {
    this.position = node_transform;
    this.children = [];
  }

  add_child(node_transform) {
    this.children.push(node_transform);
  }

  get_pos() {
    return this.position;
  }

  number_child() {
    return this.children.length;
  }

  update_position(some_matrix) {
    this.position = some_matrix.times(this.position);
    var i, children = this.number_child();
    for (i = 0; i != children; i++)
      this.children[i].update_position(some_matrix);
  }

  set_position(some_matrix) {
    this.position = some_matrix;
  }

  list_draw(array) {
    array.push(this.get_pos());
    var i, size = this.number_child();
    for (i = 0; i != size; i++)
      this.children[i].list_draw(array);
  }

  list_draw_compounded(array, some_matrix) {
    var i, size = this.number_child(), new_matrix = some_matrix.times(this.get_pos());
    array.push(new_matrix);
    for (i = 0; i != size; i++)
      this.children[i].list_draw_compounded(array, new_matrix);
  } 

}