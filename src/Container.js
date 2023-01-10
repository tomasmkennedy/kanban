import { useDrop } from 'react-dnd'
import { COLUMN_NAMES } from "./constants";
import './App.css';

const Column = ({ children, className, title }) => {

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'task',
        drop: () => ({ name: title }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        // Override monitor.canDrop() function
        canDrop: (item) => {
            const { PLAN, DESIGN, DEVELOP, TEST, DEPLOY } = COLUMN_NAMES;
            const { currentColumnName } = item;
            return (currentColumnName === title) ||
                (currentColumnName === PLAN && title === DESIGN && children.length < 5) ||
                (currentColumnName === DESIGN && (title === PLAN || title === DEVELOP) && children.length < 5) ||
                (currentColumnName === DEVELOP && (title === DESIGN || title === TEST) && children.length < 5) ||
                (currentColumnName === TEST && (title === DEVELOP || title === DEPLOY) && children.length < 5) ||
                (currentColumnName === DEPLOY && (title === TEST) && children.length < 5)
        },
    });

    const getOpacity = () => {
        if (isOver) {
            if (canDrop) {
                return '0.7'
            } else if (!canDrop) {
                return '1'
            }
        } else {
            return '';
        }
    };

    return (
        <div ref={drop} className={className} style={{ opacity: getOpacity() }}>
            <div className='column-title'>{title}</div>
            {children}
        </div>
    )
}

export default Column;