import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const DragDropContainer = ({ children, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
};

export default DragDropContainer; 