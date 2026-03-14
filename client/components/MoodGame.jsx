import { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';

import { tsParticles } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Instructions
const instructions = {
  text: `Start the game and a bubble will appear.
      The game begins when you hold down the bubble.
      Drag the bubble to the box while you inhale for a full 4 seconds.
      Tap the bubble to hold your breath and hold for another 7 seconds.
      As you exhale, drag the bubble to the box and let go on 8 seconds.
      The bubble will pop and your score will go up for each successful cycle.
      When you complete 5 cycles, you are calm. Have sparkles.`,
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Particles
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Boxes

const Boxes = {
  inhale: { name: 'inhale', duration: 4, next: 'hold', color: '#0d6efd' },
  hold: { name: 'hold', duration: 7, next: 'exhale', color: '#a7c3ee' },
  exhale: { name: 'exhale', duration: 8, next: 'pop', color: '#0d1725' },
  pop: { name: 'pop', duration: null, next: null, color: '#b6118d' },
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Instruction Typing
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Bubble

const Bubble = ({ bubbleColor }) => {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: 'draggable',
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        width: '10vh',
        height: '10vh',
        borderRadius: '50%',
        position: 'absolute',
        top: 0,
        left: 'calc(50% - 5vh)',
        zIndex: 10,
        transform: transform
          ? `translate3d(0px, ${transform.y}px, 0)`
          : undefined,
        backgroundColor: bubbleColor,
        border: 'none',
        cursor: 'grab',
        transition: 'background-color 0.5s ease',
      }}
    />
  );
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DropBox

const DropBox = ({ id, label, isActive }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: '2rem',
        margin: '0.5rem',
        borderRadius: '8px',
        border: `2px dashed ${isActive ? '#0d6efd' : '#ccc'}`,
        backgroundColor: isOver ? 'rgba(13, 110, 253, 0.1)' : 'transparent',
        textAlign: 'center',
        fontWeight: isActive ? 'bold' : 'normal',
        position: 'relative',
        minHeight: '80px',
      }}
    >
      {label}
    </div>
  );
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~GameBox
const GameBox = ({ gameStarted, bubbleColor, cycleKey, currentBox }) => (
  <div style={{ maxWidth: '300px', margin: '0 auto' }}>
    {gameStarted && (
      <div
        style={{ position: 'relative', height: '10vh', marginBottom: '1rem' }}
      >
        <Bubble bubbleColor={bubbleColor} key={cycleKey} />
      </div>
    )}
    <DropBox id="inhale" label="Inhale 4s" isActive={currentBox === 'inhale'} />
    <DropBox id="hold" label="Hold 7s" isActive={currentBox === 'hold'} />
    <DropBox id="exhale" label="Exhale 8s" isActive={currentBox === 'exhale'} />
    <DropBox id="pop" label="Pop!" isActive={currentBox === 'pop'} />
  </div>
);
// return (
//   <div className="drop-container">
//     <div className="drop" style={{ position: 'relative' }}>
//       <div className="drop-inhale" style={{ position: 'relative' }}>
//         {gameStarted && (
//           <Draggable
//             position={position}
//             bubbleColor={bubbleColor}
//             key={cycleKey}
//           />
//         )}
//         <Droppable id="inhale">Inhale</Droppable>
//       </div>
//       <div className="drop-hold" style={{ position: 'relative' }}>
//         <Droppable id="hold">Hold</Droppable>
//       </div>
//       <div className="drop-exhale" style={{ position: 'relative' }}>
//         <Droppable id="exhale">Exhale</Droppable>
//       </div>
//       <div className="drop-pop " style={{ position: 'relative' }}>
//         <Droppable id="pop">Pop</Droppable>
//       </div>
//     </div>
//   </div>
// );
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~GamePage
const MoodGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [box, setBox] = useState('inhale');
  const [boxTimer, setBoxTimer] = useState(0);
  const [activeZone, setActiveZone] = useState(null);
  const [cycleKey, setCycleKey] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);
  //timer will need to use 0-4 for inhale, 5-13 for hold, 14-22 exhale, and 23 for pop.

  const bubbleColor = Boxes[box]?.color ?? `#0d6efd`;

  const stopInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const startInterval = () => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      setBoxTimer((t) => t + 1);
    }, 1000);
  };

  useEffect(() => {
    const config = Boxes[box];
    if (!config?.duration) {
      return;
    }
    if (activeZone === config.name) {
      startInterval();
    } else {
      stopInterval();
      setBoxTimer(0);
    }
    return stopInterval;
  }, [box, activeZone]);

  useEffect(() => {
    const config = Boxes[box];
    if (!config?.duration) {
      return;
    }
    if (boxTimer >= config.duration) {
      stopInterval();
      setBoxTimer(0);
      setBox(config.next);
    }
  }, [boxTimer, box]);

  const handlePop = () => {
    if (box !== 'pop') {
      return;
    }
    stopInterval();
    triggerParticles();
    setCycleKey((k) => k + 1);
    setActiveZone(null);

    const nextCycles = cycles + 1;
    if (nextCycles >= 5) {
      setTimeout(() => {
        setGameStarted(false);
        setCycles(0);
        setBox('inhale');
        setBoxTimer(0);
      }, 3000);
    } else {
      setCycles(0);
      setTimeout(() => {
        setBox('inhale');
        setBoxTimer(0);
      }, 3000);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setBox('inhale');
    setBoxTimer(0);
    setActiveZone(null);
  };
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 5 },
    }),
  );
  return (
    <div
      className="wof-component container"
      style={{ alignContent: 'center', padding: 25 }}
    >
      <h1 className="text-primary">
        Angry? Calm down with 4-7-8 breathing bubbles!!
      </h1>
      {gameStarted && (
        <p style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          Box: <strong>{box}</strong>
          {Boxes[box]?.duration && ` · ${boxTimer} / ${Boxes[box].duration}s`} ·
          Cycle {cycles + 1} of 5
        </p>
      )}
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        collisionDetection={rectIntersection}
        onDragStart={() => setActiveZone(null)}
        onDragOver={({ over }) => setActiveZone(over?.id ?? null)}
        onDragEnd={({ over }) => {
          setActiveZone(over?.id ?? null);
          if (over?.id === 'pop') {
            handlePop();
          }
        }}
      >
        <GameBox
          gameStarted={gameStarted}
          bubbleColor={bubbleColor}
          cycleKey={cycleKey}
          currentBox={box}
        />
      </DndContext>
      <Typewriter text={instructions.text} delay={50} />
      {!gameStarted && (
        <button onClick={handleStartGame} style={{ marginTop: '1rem' }}>
          Start the Game
        </button>
      )}
      <div id="tsparticles" />
    </div>
  );
};
export default MoodGame;

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

// useEffect(() => {
//   if (timer === null) {
//     return;
//   }
//   console.log('timer:', timer);
//   if (timer <= 3) {
//     setBubbleColor('#0d6efd');
//   } else if (timer <= 12) {
//     setBubbleColor('#a7c3ee');
//   } else if (timer <= 22) {
//     setBubbleColor('#0d1725');
//   } else if (timer >= 23) {
//     setBubbleColor('#b6118d');
//   }
//   const time = setTimeout(() => {
//     setTimer((t) => t + 1);
//   }, 1000);

//   return () => clearTimeout(time);
// }, [timer]);

// const startTimer = () => setTimer(0);
// const resetTimer = () => setTimer(null);

// return (
//   <div
//     className="wof-component container"
//     style={{ alignContent: 'center', padding: 25 }}
//   >
//     <h1 className="text-primary">
//       Angry? Calm down with 4-7-8 breathing bubbles!!
//     </h1>
//     <DndContext
//       //modifiers={[restrictToVerticalAxis]}
//       onDragEnd={({ over, delta }) => {
//         console.log('drag ended, over:', over?.id, 'delta:', delta);
//         if (over?.id === 'pop') {
//           triggerParticles();
//           setPosition({ x: 0, y: 0 });
//           setCycleKey((k) => k + 1); // ← add this
//           setTimeout(() => {
//             setTimer(0);
//           }, 3000);
//         }
//       }}
//     >
//       <GameBox
//         position={position}
//         gameStarted={gameStarted}
//         bubbleColor={bubbleColor}
//         cycleKey={cycleKey}
//       />
//     </DndContext>
//     <Typewriter text={instructions.text} delay={100} />
//     <button
//       onClick={() => {
//         setGameStarted(true);
//         startTimer();
//       }}
//     >
//       Start the Game
//     </button>
//     <div id="tsparticles"></div>
//   </div>
// );
