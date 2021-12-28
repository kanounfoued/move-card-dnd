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
