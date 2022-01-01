import React from 'react';
import Card from './Card';
import { useDrop } from 'react-dnd';

const Channel = (props) => {
  const { title, cards, addCard, type } = props;

  const moveCard = (item, monitor) => {
    //console.log("item", item);
    // console.log(monitor.get);
    addCard(item);
  };

  const canItemDrop = (item, monitor) => {
    return monitor.isOver();
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['to-do', 'progress'],
      drop: moveCard,
      canDrop: canItemDrop,

      collect: (monitor) => {
        // console.log(monitor.getDifferenceFromInitialOffset());
        //console.log(monitor.getInitialSourceClientOffset());
        return {
          isOver: !!monitor.isOver(),
          didDrop: !!monitor.didDrop(),
        };
      },
    }),
    [cards, addCard],
  );

  return (
    <div className="to-do">
      <h3>{title}</h3>

      <div data-testid="channel" ref={drop} className="to-do-list">
        {cards.map((card) => {
          return <Card key={card.id} card={card} type={type} />;
        })}
      </div>
    </div>
  );
};

export default Channel;
