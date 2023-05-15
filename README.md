Tic Tac Toe Game
This project is a Tic Tac Toe game that aims to fulfill the following customer requirements:

Layout: The game is designed to have an optimal layout that adapts to different screen sizes. It follows responsive design principles to ensure a consistent and enjoyable experience on various devices.

Hover States: Interactive elements in the game, such as the game board cells and buttons, have hover states implemented using CSS. These hover effects provide visual feedback to users when they interact with the elements.

Game Modes: The game offers both solo and multiplayer modes. In solo mode, the player can compete against the computer, while in multiplayer mode, two players can play against each other.

Game State Preservation: The game state is saved in the browser, allowing players to refresh the page without losing their progress. Browser storage mechanisms, such as localStorage or cookies, are used to store and retrieve the game state.

Intelligent Computer Moves: The computer opponent in solo mode is not just making random moves. Instead, it employs a proactive strategy by blocking the player's moves and attempting to win the game. The computer analyzes the current game state, identifies winning patterns, and makes optimal moves accordingly.

Technologies Used
HTML: Provides the structure and layout of the game.
CSS: Handles the styling and hover effects for interactive elements.
JavaScript: Implements the game logic and handles user interactions.
Browser Storage (localStorage/cookies): Saves and loads the game state.
