import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '../';
import { onProgressCards, toDoCards } from '../../../data/data';

beforeEach(() => {
  cleanup();
});

test('Test the whole data is displayed in the app.', function () {
  render(
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>,
  );

  //  Check if the channel's title exists on the DOM.
  const channel1Title = screen.queryByText(/To Do/i);
  expect(channel1Title.textContent).toBe('To Do');

  const channel2Title = screen.queryByText(/On Progress/i);
  expect(channel2Title.textContent).toBe('On Progress');

  //   Check the number of channels.
  const channels = screen.queryAllByTestId('channel');
  expect(channels.length).toBe(2);

  const todoChannel = channels[0].children;
  const progressChannel = channels[1].children;

  //   Check the length of each channel.
  expect(todoChannel.length).toBe(2);
  expect(progressChannel.length).toBe(1);

  //   Check all todoCards
  const todoCardTitle = toDoCards.map((_, index) => {
    expect(screen.queryByText(todoChannel.item(index).textContent)).toBeInTheDocument();
    return todoChannel.item(index).textContent;
  });

  todoCardTitle.map((title, index) => {
    expect(title).toBe(toDoCards[index].title);
  });

  //   Check all progressCards
  const progressCardTitle = onProgressCards.map((_, index) => {
    expect(screen.queryByText(progressChannel.item(index).textContent)).toBeInTheDocument();
    return progressChannel.item(index).textContent;
  });

  progressCardTitle.map((title, index) => {
    expect(title).toBe(onProgressCards[index].title);
  });
});

// The last test, is to check drag and drop.
test('Test DRAG AND DROP from TO DO channel to PROGRESS channel', function () {
  render(
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>,
  );

  const channels = screen.queryAllByTestId('channel');
  const todoChannel = channels[0];
  const progressChannel = channels[1];

  const card = screen.queryByText(/Brouillon/i).parentElement;
  fireEvent.dragStart(card);
  fireEvent.dragEnter(progressChannel);
  fireEvent.dragOver(progressChannel);
  fireEvent.drop(progressChannel);

  expect(todoChannel.children.length).toBe(1);
  expect(progressChannel.children.length).toBe(2);
});

test('Test DRAG AND DROP from PROGRESS channel to TO DO channel', function () {
  render(
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>,
  );

  const channels = screen.queryAllByTestId('channel');
  const todoChannel = channels[0];
  const progressChannel = channels[1];

  const card = screen.queryByText(/tagguage/i).parentElement;
  fireEvent.dragStart(card);
  fireEvent.dragEnter(todoChannel);
  fireEvent.dragOver(todoChannel);
  fireEvent.drop(todoChannel);

  expect(todoChannel.children.length).toBe(3);
  expect(progressChannel.children.length).toBe(0);
});
