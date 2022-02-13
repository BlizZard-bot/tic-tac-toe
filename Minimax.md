### Minimax Algorithm

The minimax algorithm works by calculating the best move by working backwards from the end of the game. It assumes that player one is trying to **maximize their chances of winning** while player two is trying to **minimize their chances of losing**. For example, if player one can win in one move, their best move is that move. If player two knows that there's a move which results in player one winning in one move, while another move will lead to a draw at best, its best move is the one which results in a draw.

The turn taking player would want to pick the move with the maximum score. However, the scores for the moves are determined by the opposing player deciding which move has the minimum score.
So, the basic idea would look like:

- If it's a game win, return the score from the currentPlayer(score should be 10-depth for win and depth-10 for loss)
- Otherwise get all the possible situations for every move
- Create a scores array and a moves array
- For each situation, add the score to the array and the move to the moves array
- If it's currentPlayer's win get the maximum score
- Otherwise, get the minimum score

#### Minimax Scenario

Let us consider this scenario (we are ignoring the depth here):

![Minimax scenario](./Images/minimax-image.png)

- It's X's turn in 1
- X places its marker at different positions in 2,3 and 4
- X immediately wins in 2 so pushes +10 to the array
- 3 and 4 are not in end states, so 3 generates 5 and 6 and calls minimax on them, while 4 generates 7 and 8 and calls minimax on them.
- 5 pushes a score of -10 onto 3's score array, while the same happens for 7 which pushes a score of -10 onto 4's score array.
- 6 and 8 generate the only available moves, which are end , and so both of them add the score of +10 to the move arrays of 3 and 4.
- Because it is O's turn in both 3 and 4, O will seek to find the minimum score, and given the choice between -10 and +10, both 3 and 4 will yield -10.
- Finally the score array for 2, 3, and 4 are populated with +10, -10 and -10 respectively, and 1 seeking to maximize the score will chose the winning move with score +10, 2.

#### Credit

The image for the situation was taken from [this blog post](https://www.neverstopbuilding.com/blog/minimax)
