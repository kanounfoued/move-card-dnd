import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Channel from '../../component/Channel';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { onProgressCards, toDoCards } from '../../data/data';
import './style.css';

export default function App() {
  const [toDos, setTodos] = useState([]);
  const [progressCards, setProgressCards] = useState([]);

  const removeToDoCard = (removedCard) => {
    const cardList = toDos.filter((card) => {
      return card.id !== removedCard.id;
    });
    setTodos(cardList);
  };

  const removeProgressCard = (removedCard) => {
    const cardList = progressCards.filter((card) => {
      return card.id !== removedCard.id;
    });
    setProgressCards(cardList);
  };

  const addProgressCard = useCallback(
    (card) => {
      const index = progressCards.findIndex((item) => item.id === card.id);
      if (index < 0) {
        removeToDoCard(card);
        setProgressCards([card, ...progressCards]);
      }
    },
    [progressCards, toDos],
  );

  const addToDoCard = useCallback(
    (card) => {
      const index = toDos.findIndex((item) => item.id === card.id);

      if (index < 0) {
        removeProgressCard(card);
        setTodos([card, ...toDos]);
      }
    },
    [progressCards, toDos],
  );

  useEffect(() => {
    setTodos(toDoCards);
    setProgressCards(onProgressCards);
  }, []);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <div className="container">
            <Channel type="to-do" title="To Do" cards={toDos} removeCard={removeToDoCard} addCard={addToDoCard} />
            <Channel
              type="progress"
              title="On Progress"
              cards={progressCards}
              removeCard={removeProgressCard}
              addCard={addProgressCard}
            />
          </div>
        </div>
      </DndProvider>
    </>
  );
}
