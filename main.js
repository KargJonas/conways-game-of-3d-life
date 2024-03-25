
const width = 700;
const height = width;

const grid_size = 24;
const box_size = width / grid_size;
const max_states = 32;

let front_buffer = new Array(grid_size ** 2);
let back_buffer = new Array(grid_size ** 2);
const states = [];

const displacements = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

function setup() {
  createCanvas(width, height, WEBGL);
  frameRate(24);

  directionalLight(255, 255, 255, 0, 0, -1);

  stroke(200);
  smooth();

  for (let i = 0; i < front_buffer.length; i++) {
    front_buffer[i] = Math.random() < .3;
  }
}

function draw() {
  background(0, 0, 0, 0);
  translate(-50, -400, -600);
  rotateX(PI / 3);
  rotateZ(PI / 3);

  lights();
  specularMaterial(255);

  for (const state of states) {
    translate(-width / 2, -height / 2, 0);

    for (let r = 0; r < grid_size; r++) {
      for (let c = 0; c < grid_size; c++) {
        if (state[r * grid_size + c]) box(box_size);
        translate(box_size, 0);
      }
      
      translate(-width, box_size);
    }

    translate(width / 2, -height / 2, -box_size);
  }

  update_game();
}

function update_game() {
  states.unshift([...front_buffer]);
  if (states.length >= max_states) states.pop();

  for (let r = 0; r < grid_size; r++) for (let c = 0; c < grid_size; c++) {
    const n = get_neighbors(r, c);
    const alive = front_buffer[r * grid_size + c];

    if (alive) back_buffer[r * grid_size + c] = n === 2 || n === 3;
    else back_buffer[r * grid_size + c] = n === 3;
  }

  // swap buffers
  [front_buffer, back_buffer] = [back_buffer, front_buffer];
}

function get_neighbors(r, c) {
  let neighbors = 0;
  
  for (const [dr, dc] of displacements) {
    // // non periodice boundary conditions
    // const ar = r + dr;
    // const ac = c + dc;

    // periodic boundary conditions
    const ar = (grid_size + r + dr) % grid_size;
    const ac = (grid_size + c + dc) % grid_size;

    if (ar < 0 || ar >= grid_size || ac < 0 || ac >= grid_size) continue;
    if (front_buffer[ar * grid_size + ac]) neighbors++;
  }

  return neighbors;
}
