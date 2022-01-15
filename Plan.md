Tic tac toe has 3 main parts:

- The players and their markers - There are two players, each with their specific marker(x or o), specific type (player or bot) and specific name (if they aren't bots). Worry only about implementing the marker for now. Get the values of the markers and type of player through the buttons on the homepage. Generate players using a factory function

- the gameboard- Main module working with the entire game. First off worry about creating a gameboard array with indexes corresponding to specific data-attributes on the cells of the grid. Then pass over to the display after each click on the cell.
  Also, think about stopping all events when a win(a horizontal, vertical or diagonal cross of the same marker) or a draw happens.

- the display - Another module updating the display with the required markers and changing the markers after each click. Also, prevent players from placing markers where they are already placed.
