import { useRef, useEffect } from 'react';
import Pinata from '../img/pinata.png';
const Canvas = ({ userPhoto }) => {
  const canvas = useRef();
  const rotate = Math.PI / 180;
  const maxRotate = 25 * rotate;
  const FREQUENCY = 0.3; //swings per second

  const draw = (ctx) => {
    const gradient = ctx.createLinearGradient(10, 0, 500, 0);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1 / 6, 'orange');
    gradient.addColorStop(2 / 6, 'yellow');
    gradient.addColorStop(3 / 6, 'green');
    gradient.addColorStop(4 / 6, 'blue');
    gradient.addColorStop(5 / 6, 'indigo');
    gradient.addColorStop(1, 'violet');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
  };

  const sinT = (time) => {
    return Math.sin(FREQUENCY * time * Math.PI * 0.002); // 0.002 allow time in ms
  };

  const drawPinata = (ctx, x, y, photo) => {
    let time;
    if (!time) {
      time = performance.now();
    }
    const pinataImg = new Image();
    const userImg = new Image();
    pinataImg.onload = () => {
      ctx.setTransform(1, 0, 0, 1, canvas.current.width * 0.5, 0);
      ctx.clearRect(
        -canvas.current.width * 0.5,
        0,
        canvas.current.width,
        canvas.current.height,
      );
      ctx.rotate(sinT(time) * maxRotate);
      //draw(ctx);
      ctx.save();
      ctx.drawImage(pinataImg, 105, 70, 300, 300, x, y, 300, 300);
      userImg.onload = () => {
        ctx.beginPath();
        ctx.arc(x + 45, y + 80, 45, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(userImg, 0, 0, 100, 100, x, y + 20, 100, 100);
        ctx.beginPath();
        ctx.arc(x + 45, y + 80, 45, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.restore();
      };

      requestAnimationFrame(() => drawPinata(ctx, x, y, photo));
    };
    pinataImg.src = Pinata;
    userImg.src = photo;
  };

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    drawPinata(ctx, -100, 100, userPhoto);
  }, [userPhoto]);

  return (
    <canvas
      ref={canvas} // ADDED
      width="500"
      height="400"
    />
  );
};

export default Canvas;
