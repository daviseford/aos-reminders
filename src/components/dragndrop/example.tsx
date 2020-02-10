import React, { useState } from 'react'
import styled from '@emotion/styled' // TODO Probably remove
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface Quote {
  id: string
  content: string
}

const initial = Array.from({ length: 10 }, (v, k) => k).map(k => {
  const custom: Quote = {
    id: `id-${k}`,
    content: `Quote ${k}`,
  }

  return custom
})

const grid = 8

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const QuoteItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: lightblue;
  padding: ${grid}px;
`

const Quote = ({ quote, index }) => {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {provided => (
        <QuoteItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {quote.content}
        </QuoteItem>
      )}
    </Draggable>
  )
}

// @ts-ignore
const QuoteList = React.memo(function QuoteList({ quotes }) {
  return quotes.map((quote: Quote, index: number) => <Quote quote={quote} index={index} key={quote.id} />)
})

const QuoteApp = () => {
  const [state, setState] = useState<{ quotes: Quote[] }>({ quotes: initial })

  function onDragEnd(result) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const quotes = reorder(state.quotes, result.source.index, result.destination.index) as Quote[]

    setState({ quotes })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {/* 
              //@ts-ignore */}
            <QuoteList quotes={state.quotes} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default QuoteApp
