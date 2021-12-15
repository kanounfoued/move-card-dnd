import React, { memo } from 'react';
import { useDrag } from 'react-dnd';

const Card = memo((props) => {
  const { card, type } = props;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: card,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [card],
  );

  return (
    <div ref={drag} className="card" style={isDragging ? { border: '1px dashed red', opacity: 0.4 } : null}>
      <h3>{card.title}</h3>
    </div>
  );
});

export default Card;
