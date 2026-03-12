import { useState, useEffect } from 'react';
import {
  useDraggable,
  useDroppable,
  DragOverlay,
  DragDropProvider,
} from '@dnd-kit/react';
import { RestrictToElement, RestrictToWindow } from '@dnd-kit/dom/modifiers';
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';

const MoodGame = () => {
  const [initalBubbleClick, setInitialBubbleClick] = useState(false);
  const [fourSecondBubbleChange, setFourSecondBubbleChange] = useState(false);
  const [sevenSecondBubbleChange, setSevenSecondBubbleChange] = useState(false);
  const [eightSecondBubbleChange, setEightSecondBubbleChange] = useState(false);

  const instructions = {
    text: `Start the game and a bubble will appear.
      The game begins when you hold down the bubble.
      Drag the bubble to the box while you inhale for a full 4 seconds.
      Tap the bubble to hold your breath and hold for another 7 seconds.
      As you exhale, drag the bubble to the box and let go on 8 seconds.
      The bubble will pop and your score will go up for each successful cycle.
      When you complete 5 cycles, you are calm. Have sparkles.`,
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
  const Draggable = () => {
    const { ref } = useDraggable({
      id: 'draggable',
      modifiers: [RestrictToElement, RestrictToVerticalAxis],
    });
    return (
      <button
        ref={ref}
        style={{ width: '10vh', height: '10vh', borderRadius: '50%' }}
      ></button>
    );
  };

  const Droppable = ({ id, children }) => {
    const { ref } = useDroppable({
      id,
    });

    return (
      <div
        className="drop-box"
        ref={ref}
        style={{ width: '10vh', height: '10vh' }}
      >
        {children}
      </div>
    );
  };

  const GameBox = () => {
    const targets = ['4 seconds', '7 seconds', '8 seconds', 'pop'];
    const [target, setTarget] = useState();
    const draggable = <Draggable id="draggable">Drag me</Draggable>;

    return (
      <div className="drop-container">
        <div className="dropkit-container">
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) {
                return;
              }

              setTarget(event.operation.target?.id);
            }}
          >
            {!target ? draggable : null}

            {targets.map((id) => (
              <Droppable key={id} id={id}>
                {target === id ? draggable : `Droppable ${id}`}
              </Droppable>
            ))}
          </DragDropProvider>
        </div>
      </div>
    );
  };

  return (
    <div
      className="wof-component container"
      style={{ alignContent: 'center', padding: 25 }}
    >
      <h1 className="text-primary">
        Angry? Calm down with 4-7-8 breathing bubbles!!
      </h1>
      <GameBox />
      <Typewriter
        text={`Start the game and a bubble will appear.
      The game begins when you hold down the bubble.
      Drag the bubble to the box while you inhale for a full 4 seconds.
      Tap the bubble to hold your breath and hold for another 7 seconds.
      As you exhale, drag the bubble to the box and let go on 8 seconds.
      The bubble will pop and your score will go up for each successful cycle.
      When you complete 5 cycles, you are calm. Have sparkles.`}
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
// const Bubble = () => {
//   const { ref } = useDraggable({
//     id: 'bubble',
//   });
//   return (
//     <button
//       ref={ref}
//       style={{
//         height: '25%',
//         width: '25%',
//         borderRadius: '50%',
//         backgroundColor: ' #7fa99b ',
//       }}
//     ></button>
//   );
// };

// const BubbleBox = ({ id, children }) => {
//   const { ref } = useDroppable({
//     id,
//   });
//   return (
//     <div ref={ref} style={{ width: 300, height: 300 }}>
//       {children}
//     </div>
//   );
// };

// const GameBox = () => {
//   const targets = ['A', 'B', 'C'];
//   const [target, setTarget] = useState();

//   return (
//     <DragDropProvider
//       onDragEnd={(event) => {
//         if (event.canceled) {
//           return;
//         }
//         setTarget(event.operation.target?.id);
//       }}
//     >
//       {!target ? bubble : null}

//       {targets.map((id) => (
//         <BubbleBox key={id} id={id}>
//           {target === id ? bubble : `BubbleBox ${id}`}
//         </BubbleBox>
//       ))}
//     </DragDropProvider>
//   );
// return (
//   <div
//     className="mood-game-box"
//     style={{
//       height: '50vh',
//       width: '50vh',
//       alignContent: 'center',
//       backgroundColor: '#DEC37a',
//     }}
//   >
//     <Bubble ref={ref} />
//   </div>
// );
// };
//   const bubble = () => {
//   const { ref } = usebubble({
//     id: 'bubble',
//   });

//   return <button ref={ref}>bubble</button>;
// };

// const Droppable = ({ id, children }) => {
//   const { ref } = useDroppable({
//     id,
//   });

//   return (
//     <div ref={ref} style={{ width: 300, height: 300 }}>
//       {children}
//     </div>
//   );
// };
