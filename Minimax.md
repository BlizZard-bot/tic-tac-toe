### Minimax Algorithm

The minimax algorithm works by calculating the best move by working backwards from the end of the game. It assumes that player one is trying to **maximize their chances of winning** while player two is trying to **minimize their chances of losing**. For example, if player one can win in one move, their best move is that move. If player two knows that there's a move which results in player one winning in one move, while another move will lead to a draw at best, its best move is the one which results in a draw.

The turn taking player would want to pick the move with the maximum score. However, the scores for the moves are determined by the opposing player deciding which move has the minimum score.
So, the basic idea would look like:

- If it's a game win, return the score from the currentPlayer(score should be 10-depth for win and -10-depth for loss)
- Otherwise get all the possible situations for every move
- Create a scores array 
- For each situation, add the score to the array
- If it's currentPlayer's turn get the maximum score
- Otherwise, get the minimum score

#### Minimax Scenario
Let's consider this scenario and compute all possible outcomes:

                        1  
                     o     x
                     x      
                     x  o  o

                    X's turn

   2              3                       4
o     x        o  x  x                 o     x
x  x  x        x                       x     x 
x  o  o        x  o  o                 x  o  o

Win              |                        |
                         O's turn 

         5             6     |      7            8
      o  x  x       o  x  x  |   o     x      o  o  x
      x  o          x     o  |   x  o  x      x     x
      x  o  o       x  o  o  |   x  o  o      x  o  o
        Loss                      Loss
        
                          X's turn  

                             |                  10
                             |                o  o  x
                       9     |                x  x  x  
                    o  x  x  |                x  o  o  
                    x  o  o  |   
                    x  x  o  |                  Win
                             |   
                    Draw     |   
                             

- It's X's turn in 1
- X places its marker at different positions in 2,3 and 4
- X immediately wins in 2 so pushes +10 to the array
- 3 and 4 are not in end states, so 3 generates 5 and 6 and calls minimax on them, while 4 generates 7 and 8 and calls minimax on them.
- 5 pushes a score of -10 onto 3's score array, while the same happens for 7 which pushes a score of -10 onto  4's score array.
- 6 and 8 generate the only available moves, which are end , and so both of them add the score of +10 to the move arrays of  3 and 4.
- Because it is O's turn in both  3 and 4, O will seek to find the minimum score, and given the choice between -10 and +10, both  3 and 4 will yield -10.
- Finally the score array for  2, 3, and 4 are populated with +10, -10 and -10 respectively, and  1 seeking to maximize the score will chose the winning move with score +10,  2. 



