import React, { useEffect, useState } from 'react';

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Add clickable class to all interactive elements
    const addClickableClass = () => {
      const clickableElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
      clickableElements.forEach(el => {
        el.classList.add('clickable-element');
      });
    };

    // Update cursor position
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
    };

    // Hide cursor when it leaves the window
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    // Add event listeners
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial setup for clickable elements
    addClickableClass();
    
    // Setup mutation observer to add class to new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          addClickableClass();
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [hidden]);

  return (
    <>
      <div 
        className="cursor-dot" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: hidden ? 0 : 1
        }}
      />
      <div 
        className="cursor-circle" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: hidden ? 0 : 1
        }}
      />
    </>
  );
};

export default CursorEffect; 