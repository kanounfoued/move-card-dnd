import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { render, screen } from '@testing-library/react';
import Channel from '../Channel';

test('test the Channel to be in the document', function () {
  const props = {
    title: 'to do',
    type: 'to-do',
    cards: [],
    addCard: () => {},
  };

  const { container } = render(
    <DndProvider backend={HTML5Backend}>
      <Channel {...props} />
    </DndProvider>,
  );

  expect(container).toBeInTheDocument();
});

test("test Channel's title with provided title", function () {
  const props = {
    title: 'to do',
    type: 'to-do',
    cards: [],
    addCard: () => {},
  };

  render(
    <DndProvider backend={HTML5Backend}>
      <Channel {...props} />
    </DndProvider>,
  );

  expect(screen.queryByText(/to do/i).textContent).toBe(props.title);
});

test("test Channel's title with empty title", function () {
  const props = {
    title: '',
    type: 'to-do',
    cards: [],
    addCard: () => {},
  };

  render(
    <DndProvider backend={HTML5Backend}>
      <Channel {...props} />
    </DndProvider>,
  );

  expect(screen.queryByText(/to do/i)).toBe(null);
});

test("test Channel's title with undefined title", function () {
  const props = {
    type: 'to-do',
    cards: [],
    addCard: () => {},
  };

  render(
    <DndProvider backend={HTML5Backend}>
      <Channel {...props} />
    </DndProvider>,
  );

  expect(screen.queryByText(/to do/i)).toBe(null);
});

describe('Test the list of Cards inside Channel', function () {
  test('test Channel with no cards in the channel', function () {
    const props = {
      type: 'to-do',
      cards: [],
      addCard: () => {},
    };

    render(
      <DndProvider backend={HTML5Backend}>
        <Channel {...props} />
      </DndProvider>,
    );

    expect(screen.queryByTestId('channel').children.length).toBe(0);
  });

  test('test Channel with list of cards', function () {
    const props = {
      type: 'to-do',
      cards: [{ id: 'title 1', title: 'title 1' }],
      cards: [{ id: 'title 2', title: 'title 2' }],
      addCard: () => {},
    };

    render(
      <DndProvider backend={HTML5Backend}>
        <Channel {...props} />
      </DndProvider>,
    );

    expect(screen.queryByTestId('channel').children.length).toBe(props.cards.length);

    const cards = props.cards.map((card) => {
      return screen.queryByText(card.title);
    });

    cards.forEach((element, index) => {
      expect(element.textContent).toBe(props.cards[index].title);
    });
  });
});
