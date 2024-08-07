# Welcome to Elon Mustris

## Task

The application is a web-based single player tetris game that is a parody of Elon Musk.

## Description

### Backend

The backend uses Node.js with SQLite as the databse. The model is *sqlite_db.js* and controller is *server.js*. The database is *sqlite_score.db*. Additional depencies are Express, CORS and dotenv.

### Frontend

The frontend (i.e. view) resides in the *public* folder. The core frontend application resides in *main.js* for game logic and *render.js* for game rendering. In addition, there are several supporting files.

## Tech Stack

- JavaScript
  - Node.js:
  - Express
- CSS
- HTML

## Installation

The application runs on standard internet browers. No installation is required.

## Usage

The application is hosted on Heroku and is accessible via the following link: <a href='https://tetris-8mjm.onrender.com/game.html'> tetris-8mjm.onrender.com/game.html</a>.

- Click the **start** button to commence the game and **end game** button to end the game.
- High score table can be accessed via the **high score** button.
- Audio is initally muted. To unmute, click the button with the sound icon in the bottom righthand corner. There are also additional audio controls.

### Controls
Information on keys can be found in the **keys** button.

<p><kbd>→</kbd>, or <kbd>6</kbd> Move right</p>
<p><kbd>←</kbd>, or <kbd>4</kbd> Move left</p>
<p><kbd>↓</kbd>, or <kbd>2</kbd> Soft drop</p>
<p><kbd>space</kbd>, or <kbd>8</kbd> Hard drop</p>
<p><kbd>↑</kbd>, <kbd>x</kbd>, <kbd>X</kbd>, <kbd>1</kbd>, <kbd>5</kbd>, or <kbd>9</kbd> Rotate clockwise</p>
<p><kbd>3</kbd>, <kbd>7</kbd>, <kbd>ctrl + z</kbd>, or <kbd>ctrl + Z</kbd> Rotate counterclockwise</p>
<p><kbd>0</kbd>, <kbd>shift + c</kbd>, or <kbd>shift + C</kbd> Hold</p>
<p><kbd>esc</kbd>, <kbd>p</kbd>, <kbd>P</kbd>, or <kbd>f1</kbd> Pause / resume</p>

Although the game is not optimized for mobile phones, there are specific keys for mobile phones. Click on the the **keys** button for more information. Note: users on a desktop computer will receive no information on controls for mobile phones.

### The Core Team

Junaid Alam

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt="Qwasar SV -- Software Engineering School's Logo" src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px'></span>
