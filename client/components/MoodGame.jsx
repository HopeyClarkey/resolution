import { useState, useEffect } from 'react';

const MoodGame = () => {
  const [initalMouseClick, setInitialMouseClick] = useState(false);
  const [fourSecondMouseChange, setFourSecondMouseChange] = useState(false);
  const [sevenSecondMouseChange, setSevenSecondMouseChange] = useState(false);
  const [eightSecondMouseChange, setEightSecondMouseChange] = useState(false);

  // const handleInitialMouseClick = (e) => {
  //   setInitialMouseClick(true);
  // };
  // const handleFourSecondMouseChange = (e) => {
  //   setFourSecondMouseChange(true);
  // };
  // const handleSevenSecondMouseChange = (e) => {
  //   setSevenSecondMouseChange(true);
  // };
  // const handleEightSecondMouseChange = (e) => {
  //   setEightSecondMouseChange(true);
  // };
  //   className={isEnterMouse ? 'MouseEnterClass' : ''}
  //   onClick={() => handleInitialMouseClick(true)}
  //   ondrag={() => handleFourSecondMouseChange(true)}
  //   onFocus={() => handleSevenSecondMouseChange(true)}
  //   onDrop={() => handleEightSecondMouseChange(true)}
  // >
  return (
    <div className="wof-component container" style={{ 'alignContent': 'center' }}>
      <h1 className="text-primary">
        This is where mood game will eventually go!
      </h1>
      <div
        className="mood-game-box"
        style={{
          'height': '50vh',
          'width': '50vh',
          'alignContent': 'center',
          'background-color': '#DEC37a',
        }}
      >
        Gamebox
      </div>
    </div>
  );
};
export default MoodGame;
