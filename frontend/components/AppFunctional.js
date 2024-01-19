import React, { useState, useEffect} from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // It is not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    // Calculate the row and column based on the index
    const row = Math.floor(index / 3) + 1; // Adjusting row calculation and converting to 1-based indexing
    const col = index % 3 + 1; // Adjusting column calculation and converting to 1-based indexing
    return { row, col };
  }

  function getXYMessage() {
    const { row, col } = getXY();
    return `Coordinates (${col}, ${row})`; // Swap col and row in the template string
  }

  function getStepsMessage() {
    // Adjust the message based on the number of moves
    return `You moved ${steps} time${steps !== 1 ? 's' : ''}`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }


  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
   // Calculate the next index based on the current index and direction
   let nextIndex = index;

   if (direction === 'left' && index % 3 !== 0) {
     nextIndex -= 1;
   } else if (direction === 'up' && index >= 3) {
     nextIndex -= 3;
   } else if (direction === 'right' && index % 3 !== 2) {
     nextIndex += 1;
   } else if (direction === 'down' && index < 6) {
     nextIndex += 3;
   }

   return nextIndex;
 }

  function move(direction) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const nextIndex = getNextIndex(direction);

    // Update states only if the nextIndex is different from the current index
    if (nextIndex !== index) {
      setIndex(nextIndex);
      setSteps(steps + 1);
      setMessage('');
    } else {
      // Display appropriate message for reaching the edges
    switch (direction) {
      case 'up':
        setMessage("You can't go up");
        break;
      case 'right':
        setMessage("You can't go right");
        break;
      case 'left':
        setMessage("You can't go left");
        break;
      case 'down':
        setMessage("You can't go down");
        break;
      default:
        setMessage('Cannot move in that direction.');
    }
  }
}


  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }
  
  async function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
 // Check if the email is blank
 if (!email.trim()) {
  setMessage('Ouch: email is required.');
  return;
}

// Check if the email has a valid format
if (!isValidEmail(email)) {
  setMessage("Ouch: email must be a valid email.");
  return;
}

// Helper function to check if the email has a valid format
function isValidEmail(email) {
  // Use a simple regex pattern to check for a valid email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}


    const { row, col } = getXY();
  
    const payload = {
      x: col, 
      y: row, 
      steps,
      email
    };

    try {
      const response = await axios.post('http://localhost:9000/api/result', payload);
      console.log(payload);
      setMessage(response.data.message);
      console.log(response.data.message);
      setEmail('');

    } catch (error) {
      console.error(error);
  
      if (error.response) {
        // Handle error responses
        if (error.response.status === 422) {
          setMessage('Unprocessable Entity');
        } else if (error.response.status === 403) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Error submitting email.');
        }
      }
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{getStepsMessage()}</h3>
      </div>
      <div id="grid">
      {
    [1, 2, 3].map(row => (
      [1, 2, 3].map(col => (
        <div key={`${row}-${col}`} className={`square${row === getXY().row && col === getXY().col ? ' active' : ''}`}>
          {row === getXY().row && col === getXY().col ? 'B' : null}
        </div>
      ))
    ))
  }
</div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>LEFT</button>
        <button id="up" onClick={() => move('up')}>UP</button>
        <button id="right" onClick={() => move('right')}>RIGHT</button>
        <button id="down" onClick={() => move('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
