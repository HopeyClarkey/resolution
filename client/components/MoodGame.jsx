import { useState, useEffect } from 'react';

const MoodGame = () => {
  const [initalMouseClick, setInitialMouseClick] = useState(false);
  const [fourSecondMouseChange, setFourSecondMouseChange] = useState(false);
  const [sevenSecondMouseChange, setSevenSecondMouseChange] = useState(false);
  const [eightSecondMouseChange, setEightSecondMouseChange] = useState(false);

  const handleInitialMouseClick = (e) => {
    setInitialMouseClick(true);
  };
  const handleFourSecondMouseChange = (e) => {
    setFourSecondMouseChange(true);
  };
  const handleSevenSecondMouseChange = (e) => {
    setSevenSecondMouseChange(true);
  };
  const handleEightSecondMouseChange = (e) => {
    setEightSecondMouseChange(true);
  };

  return (
    <div
      className={isEnterMouse ? 'MouseEnterClass' : ''}
      onClick={() => handleInitialMouseClick(true)}
      ondrag={() => handleFourSecondMouseChange(true)}
      onFocus={() => handleSevenSecondMouseChange(true)}
      onDrop={() => handleEightSecondMouseChange(true)}
    >

      This is where mood game will eventually go!
    </div>
  );
};
export default MoodGame;
