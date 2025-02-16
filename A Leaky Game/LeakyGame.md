# A LEAKY GAME
### Author: K27
### POINTS : 500

## Description:
I just moved into this place, and my neighbor is… weird. A mad scientist—wild hair, crazy eyes, always muttering about “the perfect game for my plan.” The other night, I saw a strange chessboard through his window, pieces arranged in a way that felt... wrong. The board was conquered by white and the game was weirdly verrry loong. but I think he's hiding something. Something big.

HINT: is this even a normal game ? ?

---


> files given : an image of a chess board game

What all can be deduced from the image ?
> -> The board obviously seems weird, also it looks like a lichess game. checking the variants in lichess , we find crazyhouse variant that fits the requirement (too many pieces on one side).

> -> metadata gives the date and time of the game

Now, one can search the lichess database for a crazyhouse game played around 5th Feb 2025. the description also suggests a long game where white has won.

by filtering , we find few games that checks all the boxes .

One game that piques interest is one with one of user named "DocGoof52025126".

Now digging more into the account, we find many imported games.

scanning through the PGNs, we find few red herring and a username "DrFeinzGoof4545". 
Interesting. Searching it on other sites reveal an account on Github with the same username.

It has one repo only named "Deepest-Secret-inator" which is forked from wintrcat's Chesscryption .

We can now use this to decrypt the PGNs of the user and find the flag from one imported game.