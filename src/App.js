import { DndProvider } from 'react-dnd';
import { useState } from 'react';
import MovableItem from './Item';
import Column from './Container';
import { COLUMN_NAMES } from "./constants";
import { tasks } from "./tasks";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from "react-dnd-touch-backend";
import './App.css';

const App = () => {
    const [items, setItems] = useState(tasks);
    const isMobile = window.innerWidth < 600;

    const moveCardHandler = (dragIndex, hoverIndex) => {
        const dragItem = items[dragIndex];

        if (dragItem) {
            setItems((prevState => {
                const copiedStateArray = [...prevState];

                // remove item by "hoverIndex" and put "dragItem" instead
                const prevItem = copiedStateArray.splice(hoverIndex, 1, dragItem);

                // remove item by "dragIndex" and put "prevItem" instead
                copiedStateArray.splice(dragIndex, 1, prevItem[0]);

                return copiedStateArray;
            }));
        }
    };

    const returnItemsForColumn = (columnName) => {
        return items
            .filter((item) => item.column === columnName)
            .map((item, index) => (
                <MovableItem key={item.id}
                             id={item.id}
                             name={item.name}
                             description={item.description}
                             currentColumnName={item.column}
                             setItems={setItems}
                             index={index}
                             moveCardHandler={moveCardHandler}
                />
            ))
    }

    const {PLAN, DESIGN, DEVELOP, TEST, DEPLOY} = COLUMN_NAMES;

    return (
        <div className="Kcontainer">
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
                <Column title={PLAN} className='column plan-column'>
                    {returnItemsForColumn(PLAN)}
                </Column>
                <Column title={DESIGN} className='column design-column'>
                    {returnItemsForColumn(DESIGN)}
                </Column>
                <Column title={DEVELOP} className='column develop-column'>
                    {returnItemsForColumn(DEVELOP)}
                </Column>
                <Column title={TEST} className='column test-column'>
                    {returnItemsForColumn(TEST)}
                </Column>
                <Column title={DEPLOY} className='column deploy-column'>
                    {returnItemsForColumn(DEPLOY)}
                </Column>
            </DndProvider>
        </div>
    );
}

export default App;