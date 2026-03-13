import { useState, useEffect, useRef } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';

import { tsParticles } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';

const instructions = {
  text: `Start the game and a bubble will appear.
      The game begins when you hold down the bubble.
      Drag the bubble to the box while you inhale for a full 4 seconds.
      Tap the bubble to hold your breath and hold for another 7 seconds.
      As you exhale, drag the bubble to the box and let go on 8 seconds.
      The bubble will pop and your score will go up for each successful cycle.
      When you complete 5 cycles, you are calm. Have sparkles.`,
};

const GameBox = ({ position, gameStarted, bubbleColor }) => {
  const [cycleKey, setCycleKey] = useState(0);
  return (
    <div className="drop-container">
      <div className="drop" style={{ position: 'relative' }}>
        <div className="drop-inhale" style={{ position: 'relative' }}>
          {gameStarted && (
            <Draggable
              position={position}
              bubbleColor={bubbleColor}
              key={cycleKey}
            />
          )}
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

const Typewriter = ({ text, delay, infinite }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout;
    if (currentIndex < text.length) {
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

const Draggable = ({ position, bubbleColor }) => {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: 'draggable',
  });
  const style = {
    className: 'bubble',
    width: '10vh',
    height: '10vh',
    borderRadius: '50%',
    position: 'absolute',
    top: position.y,
    left: 'calc(50% - 5vh)',
    zIndex: 10,
    transform: transform ? `translate3d(0px, ${transform.y}px, 0)` : undefined,
    backgroundColor: bubbleColor,
  };
  return (
    <button ref={setNodeRef} {...listeners} {...attributes} style={style} />
  );
};

const Droppable = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={isOver ? 'droppable-active' : 'droppable'}>
      {children}
    </div>
  );
};

const triggerParticles = async () => {
  await loadFull(tsParticles);
  await tsParticles.load({
    id: 'tsparticles',
    options: {
      fullScreen: { enable: true },
      particles: {
        number: { value: 100 },
        color: { value: ['#ff5733', '#0d6efd', '#b6118d', '#a7c3ee'] },
        shape: { type: 'circle' },
        opacity: { value: 0.8 },
        size: { value: { min: 5, max: 15 } },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          outModes: 'out',
        },
        life: { duration: { value: 2 }, count: 1 },
      },
      emitters: { life: { count: 1, duration: 0.3 } },
    },
  });
};

const MoodGame = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [bubbleColor, setBubbleColor] = useState('#ff5733');
  const [timer, setTimer] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  //timer will need to use 0-4 for inhale, 5-13 for hold, 14-22 exhale, and 23 for pop.

  const changeBubbleColor = () => {};

  // const timeReference = useRef(0);
  // const intervalRef = useRef(null);
  // const timeBubble = () => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //   }
  //   timeReference.current = 0;
  //   intervalRef.current = setInterval(() => {
  //     timeReference.current += 1;
  //     setTimer(timeReference.current);
  //   }, 1000);
  // };

  useEffect(() => {
    if (timer === null) {
      return;
    }
    console.log('timer:', timer);
    if (timer <= 3) {
      setBubbleColor('#0d6efd');
    } else if (timer <= 12) {
      setBubbleColor('#a7c3ee');
    } else if (timer <= 22) {
      setBubbleColor('#0d1725');
    } else if (timer >= 23) {
      setBubbleColor('#b6118d');
    }
    const time = setTimeout(() => {
      setTimer((t) => t + 1);
    }, 1000);

    return () => clearTimeout(time);
  }, [timer]);

  const startTimer = () => setTimer(0);
  const resetTimer = () => setTimer(null);

  return (
    <div
      className="wof-component container"
      style={{ alignContent: 'center', padding: 25 }}
    >
      <h1 className="text-primary">
        Angry? Calm down with 4-7-8 breathing bubbles!!
      </h1>
      <DndContext
        //modifiers={[restrictToVerticalAxis]}
        onDragEnd={({ over, delta }) => {
          console.log('drag ended, over:', over?.id, 'delta:', delta);
          if (over?.id === 'pop') {
            triggerParticles();
            setPosition({ x: 0, y: 0 });
            setCycleKey((k) => k + 1); // ← add this
            setTimeout(() => {
              setTimer(0);
            }, 3000);
          }
        }}
      >
        <GameBox
          position={position}
          gameStarted={gameStarted}
          bubbleColor={bubbleColor}
          cycleKey={cycleKey}
        />
      </DndContext>
      <Typewriter text={instructions.text} delay={100} />
      <button
        onClick={() => {
          setGameStarted(true);
          startTimer();
        }}
      >
        Start the Game
      </button>
      <div id="tsparticles"></div>
    </div>
  );
};
export default MoodGame;
