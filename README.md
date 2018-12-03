# term-project-group-17

Our project is a playable game that allows a player to explore a city as Spider-Man. 
Spider-Man can move, jump, shoot webs with sound effects, swing in the air, and stick to and climb walls. 
He can also collect coins scattered around the map. 
Our advanced topics were implementing physics, collision detection, and scene graphs.

The work breakdown was as follows: 
Justin Lee - physics engine, jumping, gravity, swinging, web, sounds
Gladys Ng - collision detection (bounding boxes), coins, building generation, texture mapping, object placement, game aspect
Daniel Park - scene graphs, smoothing out movement, car/people design, collisions involving cars/people,
movement of cars/people, world design
Joshua Yu - physics engine, player movement/control, camera movement/control, climbing/sticking to walls, bird's-eye view

Keyboard inputs control Spider-Man’s movements while the mouse controls which direction he is facing. 
Controls: 
    "w" - grounded: move forward (relative to camera orientation); on wall: move upward
    "a" - grounded: move left (relative to camera orientation); on wall: move left
    "s" - grounded: move backward (relative to camera orientation); on wall: move downward
    "d" - grounded: move right (relative to camera orientation); on wall: move right
    spacebar - jump
    click and hold - while airborne, shoot web and swing (release to retract web)
    "m" - toggle bird's-eye view of world
    "v" - reset camera view to face forward
    "h" - reset Spider-Man back to spawnpoint
    esc - release pointer from game

To play, simply run host.command or host.bat, then navigate to localhost:8000 in Google Chrome.
