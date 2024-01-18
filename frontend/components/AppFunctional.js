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
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  // Calculate the row and column based on the index
  const row = Math.floor(index / 3);
  const col = index % 3;
  return { row: 2 - row - 1, col }; // Adjusting the row calculation to show correct coordinates
}


  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { row, col } = getXY();
    return `Coordinates (${row + 1}, ${col + 1})`; // Adding 1 to convert from 0-based to 1-based indexing
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
      setMessage('Cannot move in that direction.');
    }
  }


  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();const { row, col } = getXY();

    const payload = {
      x: col + 1, // Converting from 0-based to 1-based indexing
      y: row + 1, // Converting from 0-based to 1-based indexing
      steps,
      email
    };

    axios.post('http://localhost:9000/api/result', payload)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        if (error.response && error.response.status === 422) {
          setMessage('Unprocessable Entity');
        } else {
          setMessage('Error submitting email.');
        }
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
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
