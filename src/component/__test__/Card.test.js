import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { render, screen } from '@testing-library/react';
import Card from '../Card';

test('test the card to be in the document', function () {
  const props = {
    type: 'to-do',
    card: { title: 'submit' },
  };

  const { container } = render(
    <DndProvider backend={HTML5Backend}>
      <Card {...props} />
    </DndProvider>,
  );

  expect(container).toBeInTheDocument();
});

test('test card with provided title', function () {
  const props = {
    type: 'to-do',
    card: { title: 'submit' },
  };

  render(
    <DndProvider backend={HTML5Backend}>
      <Card {...props} />
    </DndProvider>,
  );

  expect(screen.getByText(/submit/i).textContent).toBe('submit');
});

test('test card with an empty title', function () {
  const props = {
    type: 'to-do',
    card: { title: '' },
  };

  render(
    <DndProvider backend={HTML5Backend}>
      <Card {...props} />
    </DndProvider>,
  );

  expect(screen.queryByText(/submit/i)).toBe(null);
});

test('test card with provided empty card', function () {
  const props = {
    type: 'to-do',
    card: {},
  };

  render(
    <DndProvider backend={HTML5Backend}>
      <Card {...props} />
    </DndProvider>,
  );

  expect(screen.queryByText(/submit/i)).toBe(null);
});
