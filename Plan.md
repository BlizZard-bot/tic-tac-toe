Tic tac toe has 3 main parts:

- The players and their markers - There are two players, each with their specific marker(x or o), specific type (player or bot) and specific score. Worry only about implementing the marker for now. Get the values of the markers and type of player through the buttons on the homepage. Generate players using a factory function

- the gameboard- Main module working with the entire game. First off worry about creating a gameboard array with indexes corresponding to specific data-attributes on the cells of the grid. Then pass over to the display after each click on the cell.
  Also, think about stopping all events when a win(a horizontal, vertical or diagonal cross of the same marker) or a draw happens.

  Win conditions: 3 horizontal, 3 vertical or 2 diagonal

  #### Horizontal

          x x x    o x o   o x o
          o x o    x x x   o x o
          o o x    o x o   x x x

  Indexes:0 1 2    3 4 5   6 7 8

        All indices basically are consecutive numbers

  #### Vertical

          x o x    o x o   x o o
          o x x    x x x   x o o
          o o x    o x o   x x x

  Indexes:2 5 8    1 4 7   0 3 6
  All indices are basically differing by 3

  #### Diagonal
          Left     Right  
          x o x    o x x
          o x x    x x o
          o o x    x x o

  Indexes:0 4 8    2 4 6
  No common pattern between indices

- the display - Another module updating the display with the required markers and changing the markers after each click. Also, prevent players from placing markers where they are already placed.
