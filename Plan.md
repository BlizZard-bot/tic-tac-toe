Tic tac toe has 3 main parts:

- The players and their markers - There are two players, each with their specific marker(x or o), specific type (player or bot) and specific score. Get the values of the markers and type of player through the buttons on the homepage. Generate players using a factory function

- Gameboard- Main module working with the entire game. First off create a gameboard array with indexes corresponding to specific data-attributes on the cells of the grid. Then pass over to the display after each click on the cell.
  Also, stop all events when a win(a horizontal, vertical or diagonal cross of the same marker) or a draw happens.

- Display - Another module updating the display with the required markers and changing the markers after each click. Also, prevent players from placing markers where they are already placed.

### Win conditions: 
3 horizontal, 3 vertical and 2 diagonal conditions are possible for wins

All visual representations of win conditions are for X

  #### Horizontal

            1        2       3
          x x x    o x o   o x o
          o x o    x x x   o x o
          o o x    o x o   x x x    

Indices for the 3 cases:

1. 0 1 2
2. 3 4 5
3. 6 7 8

All indices for a particular situation are consecutive and each situation differs from the other by 3

  #### Vertical
        
            1        2       3
          x o x    o x o   x o o
          o x x    x x x   x o o
          o o x    o x o   x x x

Indices for the 3 cases:

1. 2 5 8
2. 1 4 7
3. 0 3 6

All indices for a particular situation differ from each other by 3 and each situation differs from the other by 1

  #### Diagonal
          Left     Right  
          x o x    o x x
          o x x    x x o
          o o x    x x o

Indices for the 2 cases:

Left:   0 4 8

Right:  2 4 7

Here, there is no pattern between indices

## Plan for Bot moves

First check if first player is bot. If its a bot then show marker immediately. If it isn't, then add a function inside the main event listener after the player's turn to instantly add a marker.
Else if both are bots then, continue the game till one of them loses or wins