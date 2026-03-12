import { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { tsParticles } from '@tsparticles/engine';

const MoodGame = () => {
  const [initalBubbleClick, setInitialBubbleClick] = useState(false);
  const [fourSecondBubbleChange, setFourSecondBubbleChange] = useState(false);
  const [sevenSecondBubbleChange, setSevenSecondBubbleChange] = useState(false);
  const [eightSecondBubbleChange, setEightSecondBubbleChange] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);

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

  const Draggable = ({ position }) => {
    const { setNodeRef, listeners, attributes, transform } = useDraggable({
      id: 'draggable',
    });

    const style = {
      width: '10vh',
      height: '10vh',
      borderRadius: '50%',
      position: 'absolute',
      top: position.y,
      left: 'calc(50% - 5vh)',
      zIndex: 10,
      transform: transform
        ? `translate3d(0px, ${transform.y}px, 0)`
        : undefined,
    };
    return (
      <button ref={setNodeRef} {...listeners} {...attributes} style={style} />
    );
  };

  const Droppable = ({ id, children }) => {
    const { isOver, setNodeRef } = useDroppable({ id });

    return (
      <div
        ref={setNodeRef}
        className={isOver ? 'droppable-active' : 'droppable'}
      >
        {children}
      </div>
    );
  };

  const GameBox = ({ position, gameStarted }) => {
    return (
      <div className="drop-container">
        <div className="drop" style={{ position: 'relative' }}>
          <div className="drop-inhale" style={{ position: 'relative' }}>
            {gameStarted && <Draggable position={position} />}
            <Droppable id="inhale">Inhale</Droppable>
          </div>
          <div className="drop-hold" style={{ position: 'relative' }}>
            <Droppable id="hold">Hold</Droppable>
          </div>
          <div className="drop-exhale" style={{ position: 'relative' }}>
            <Droppable id="exhale">Exhale</Droppable>
          </div>
          <div className="drop-pop " style={{ position: 'relative' }}>
            <Droppable id="pop">Pop</Droppable>
          </div>
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
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={({ over, delta }) => {
          if (over) {
            setPosition((prev) => ({
              x: 0,
              y: prev.y + delta.y,
            }));
          }
        }}
      >
        <GameBox position={position} gameStarted={gameStarted} />
      </DndContext>
      <Typewriter
        text={`Start the game and a bubble will appear.
      The game begins when you hold down the bubble.
      Drag the bubble to the box while you inhale for a full 4 seconds.
      Tap the bubble to hold your breath and hold for another 7 seconds.
      As you exhale, drag the bubble to the box and let go on 8 seconds.
      The bubble will pop and your score will go up for each successful cycle.
      When you complete 5 cycles, you are calm. Have sparkles. defonm`}
        delay={100}
      />
      <button onClick={() => setGameStarted(true)}>Start the Game</button>
      <div id="tsparticles"></div>
    </div>
  );
};
export default MoodGame;
