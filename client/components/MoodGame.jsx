import { useState, useEffect } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import { DragDropProvider } from '@dnd-kit/react';

const MoodGame = () => {
  const [initalBubbleClick, setInitialBubbleClick] = useState(false);
  const [fourSecondBubbleChange, setFourSecondBubbleChange] = useState(false);
  const [sevenSecondBubbleChange, setSevenSecondBubbleChange] = useState(false);
  const [eightSecondBubbleChange, setEightSecondBubbleChange] = useState(false);

  const instructions = `Start the game and a bubble will appear.
      The game begins when you hold down the bubble.
      Drag the bubble to the box while you inhale for a full 4 seconds.
      Tap the bubble to hold your breath and hold for another 7 seconds.
      As you exhale, drag the bubble to the box and let go on 8 seconds.
      The bubble will pop and your score will go up for each successful cycle.
      When you complete 5 cycles, you are calm. Have sparkles.`;

  const Draggable = () => {
    const { ref } = useDraggable({
      id: 'draggable',
    });

    return <button ref={ref}>Draggable</button>;
  };

  const Droppable = ({ id, children }) => {
    const { ref } = useDroppable({
      id,
    });

    return (
      <div ref={ref} style={{ width: 300, height: 300 }}>
        {children}
      </div>
    );
  };

  const Typewriter = ({ text, delay, infinite }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      let timeout;

      if (currentIndex <= text.length) {
        timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);
      } else if (infinite) {
        setCurrentIndex(0);
        setCurrentText('');
      }

      return () => clearTimeout(timeout);
    }, [currentIndex, delay, infinite, text]);

    return <span>{currentText}</span>;
  };

  //   return (
  //     <div>
  //       <div>A bubble will appear when you start the game.</div>
  //       <div> Breath in! Hold the bubble for 4 seconds while inhaling</div>
  //       <div> Hold your Breath! Tap the bubble and Hold for 7 seconds</div>
  //       <div> Exhale! Tap the Bubble and Hold for 8 seconds.</div>
  //       <div> Get the timing correct and the bubble will pop!</div>
  //     </div>
  //   );
  // };

  const Bubble = () => {
    return (
      <div
        style={{
          height: '25%',
          width: '25%',
          borderRadius: '50%',
          backgroundColor: ' #7fa99b ',
        }}
      ></div>
    );
  };

  const GameBox = () => {
    return (
      <div
        className="mood-game-box"
        style={{
          height: '50vh',
          width: '50vh',
          alignContent: 'center',
          backgroundColor: '#DEC37a',
        }}
      >
        <Bubble />
      </div>
    );
  };

  return (
    <div className="wof-component container" style={{ alignContent: 'center' }}>
      <h1 className="text-primary">
        Angry? Calm down with 4-7-8 breathing bubbles!!
      </h1>
      <GameBox />
      <Typewriter
        text={instructions}
        delay={100}
      />
      <button> Start the Game </button>
    </div>
  );
};
export default MoodGame;

// const handleInitialBubbleClick = (e) => {
//   setInitialBubbleClick(true);
// };
// const handleFourSecondBubbleChange = (e) => {
//   setFourSecondBubbleChange(true);
// };
// const handleSevenSecondBubbleChange = (e) => {
//   setSevenSecondBubbleChange(true);
// };
// const handleEightSecondBubbleChange = (e) => {
//   setEightSecondBubbleChange(true);
// };

//   className={isEnterBubble ? 'BubbleEnterClass' : ''}
//   onClick={() => handleInitialBubbleClick(true)}
//   ondrag={() => handleFourSecondBubbleChange(true)}
//   onFocus={() => handleSevenSecondBubbleChange(true)}
//   onDrop={() => handleEightSecondBubbleChange(true)}
// >
