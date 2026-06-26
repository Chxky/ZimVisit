import React, { useEffect, useState } from 'react';

const WalkingAnimal: React.FC = () => {
  const [position, setPosition] = useState(0);
  const [verticalPosition, setVerticalPosition] = useState(10);
  const [isWalking, setIsWalking] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [facingRight, setFacingRight] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let flyTimeout: ReturnType<typeof setTimeout>;
    let lastScrollY = window.scrollY;
    let lastMouseX = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      const absDiff = Math.abs(scrollDiff);
      
      if (absDiff > 1) {
        if (absDiff > 25) {
          setIsFlying(true);
          setIsWalking(false);
          setVerticalPosition(120); 
        } else if (!isFlying) {
          setIsWalking(true);
          setVerticalPosition(10); 
        }

        const moveAmount = isFlying ? 12 : 4;

        if (scrollDiff > 0) {
          setFacingRight(true);
          setPosition(prev => (prev + moveAmount) % (window.innerWidth + 100));
        } else {
          setFacingRight(false);
          setPosition(prev => (prev - moveAmount < -100 ? window.innerWidth + 100 : prev - moveAmount));
        }
      }
      
      lastScrollY = currentScrollY;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsWalking(false);
      }, 150);

      clearTimeout(flyTimeout);
      flyTimeout = setTimeout(() => {
        setIsFlying(false);
        setVerticalPosition(10); 
      }, 800);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mouseDiff = e.clientX - lastMouseX;
      if (Math.abs(mouseDiff) > 60) {
        setIsFlying(true);
        setVerticalPosition(80); 
        
        if (mouseDiff > 0) {
          setFacingRight(true);
          setPosition(prev => (prev + 15) % (window.innerWidth + 100));
        } else {
          setFacingRight(false);
          setPosition(prev => (prev - 15 < -100 ? window.innerWidth + 100 : prev - 15));
        }
        
        clearTimeout(flyTimeout);
        flyTimeout = setTimeout(() => {
          setIsFlying(false);
          setVerticalPosition(10); 
        }, 800);
      }
      lastMouseX = e.clientX;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
      clearTimeout(flyTimeout);
    };
  }, [isFlying]);

  let animationClass = '';
  if (isFlying) {
    animationClass = 'flying';
  } else if (isWalking) {
    animationClass = 'walking';
  } else {
    animationClass = 'idle';
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: verticalPosition,
        left: -150, 
        transform: `translateX(${position}px) scaleX(${facingRight ? 1 : -1})`,
        zIndex: 9999, 
        transition: 'transform 0.1s linear, bottom 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        pointerEvents: 'none', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80px',
        width: '80px',
      }}
    >
      <style>
        {`
          .css-bird {
            position: relative;
            width: 60px;
            height: 60px;
            filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3));
          }
          .bird-body {
            position: absolute;
            top: 15px; left: 10px;
            width: 35px; height: 25px;
            background: #f59e0b; /* Amber/gold */
            border-radius: 50% 50% 40% 40%;
            z-index: 2;
          }
          .bird-head {
            position: absolute;
            top: -12px; right: -8px;
            width: 22px; height: 22px;
            background: #f59e0b;
            border-radius: 50%;
          }
          .bird-beak {
            position: absolute;
            top: 6px; right: -12px;
            width: 0; height: 0;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
            border-left: 12px solid #d97706;
          }
          .bird-eye {
            position: absolute;
            top: 5px; right: 5px;
            width: 4px; height: 4px;
            background: black;
            border-radius: 50%;
          }
          .bird-wing {
            position: absolute;
            top: 5px; left: 5px;
            width: 20px; height: 12px;
            background: #fbbf24;
            border-radius: 50% 50% 50% 50%;
            transform-origin: top left;
            z-index: 3;
            border: 1px solid #d97706;
          }
          .bird-tail {
            position: absolute;
            top: 3px; left: -10px;
            width: 15px; height: 8px;
            background: #f59e0b;
            border-radius: 50%;
            transform: rotate(-20deg);
          }
          .bird-leg {
            position: absolute;
            top: 35px;
            width: 3px; height: 18px;
            background: #d97706;
            z-index: 1;
            transform-origin: top center;
            border-radius: 2px;
          }
          .leg-left { left: 18px; }
          .leg-right { left: 26px; }
          
          /* ANIMATIONS */
          @keyframes walk-leg {
            0% { transform: rotate(-40deg); }
            100% { transform: rotate(40deg); }
          }
          @keyframes walk-body {
            0% { transform: translateY(0) rotate(-3deg); }
            100% { transform: translateY(-4px) rotate(3deg); }
          }
          @keyframes flap-wing {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-70deg); }
          }
          @keyframes flap-wing-fast {
            0% { transform: rotate(20deg); }
            100% { transform: rotate(-80deg); }
          }
          @keyframes fly-body {
            0% { transform: translateY(0) rotate(-15deg); }
            100% { transform: translateY(-5px) rotate(-10deg); }
          }

          /* STATES */
          .walking .leg-left { animation: walk-leg 0.25s infinite alternate; }
          .walking .leg-right { animation: walk-leg 0.25s infinite alternate-reverse; }
          .walking .bird-body { animation: walk-body 0.125s infinite alternate; }
          .walking .bird-wing { animation: flap-wing 0.3s infinite alternate; }

          .flying .bird-body { animation: fly-body 0.2s infinite alternate; }
          .flying .bird-wing { animation: flap-wing-fast 0.1s infinite alternate; }
          .flying .leg-left { transform: rotate(-45deg); transition: transform 0.2s; }
          .flying .leg-right { transform: rotate(-60deg); transition: transform 0.2s; }
          
          .idle .bird-wing { transform: rotate(10deg); transition: transform 0.3s; }
          .idle .leg-left { transform: rotate(0deg); transition: transform 0.3s; }
          .idle .leg-right { transform: rotate(0deg); transition: transform 0.3s; }
        `}
      </style>
      
      <div className={`css-bird ${animationClass}`}>
        <div className="bird-leg leg-left"></div>
        <div className="bird-leg leg-right"></div>
        <div className="bird-body">
          <div className="bird-head">
            <div className="bird-beak"></div>
            <div className="bird-eye"></div>
          </div>
          <div className="bird-wing"></div>
          <div className="bird-tail"></div>
        </div>
      </div>
    </div>
  );
};

export default WalkingAnimal;
