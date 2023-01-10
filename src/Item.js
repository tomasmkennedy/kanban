import React, { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { COLUMN_NAMES } from "./constants";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Form } from './form';

const MovableItem = ({ id, name, description, index, currentColumnName, moveCardHandler, setItems }) => {
    const ref = useRef(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [sName, setName] = useState(() => {
        const saved = localStorage.getItem(id + 'n');
        console.log(saved)
        console.log(name);
        if (saved !== null && saved !== undefined) {
            const initialValue = JSON.parse(saved);
            return initialValue;
        }
        else {
            return name;
        }
    })
    const [sDesc, setDescription] = useState(() => {
        const saved = localStorage.getItem(id + 'd')
        if (saved !== 'null' && saved !== 'undefined') {
            const initialValue = JSON.parse(saved);
            return initialValue;
        }
        else {
            return description;
        }
    })

    useEffect(() => {
        localStorage.setItem(id + 'd', JSON.stringify(sDesc));
    }, [sDesc])
    useEffect(() => {
        localStorage.setItem(id + 'n', JSON.stringify(sName));
    }, [sName])

    const onSubmit = (event) => {
        event.preventDefault();
        if (event.target.description.value.trim()) {
            setDescription(event.target.description.value);
        }
        if (event.target.name.value.trim()) {
            setName(event.target.name.value);
        }
        handleClose();
    }

    const changeItemColumn = (currentItem, columnName) => {
        setItems((prevState) => {
            return prevState.map(e => {
                return {
                    ...e,
                    column: e.name === currentItem.name ? columnName : e.column,
                }
            })
        });
    }

    const [, drop] = useDrop({
        accept: 'task',
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveCardHandler(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        item: { index, name, currentColumnName },
        type: 'task',
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();

            if (dropResult) {
                const { name } = dropResult;
                const { PLAN, DESIGN, DEVELOP, TEST, DEPLOY } = COLUMN_NAMES;
                switch (name) {
                    case PLAN:
                        changeItemColumn(item, PLAN);
                        break;
                    case DESIGN:
                        changeItemColumn(item, DESIGN);
                        break;
                    case DEVELOP:
                        changeItemColumn(item, DEVELOP);
                        break;
                    case TEST:
                        changeItemColumn(item, TEST);
                        break;
                    case DEPLOY:
                        changeItemColumn(item, DEPLOY);
                        break;
                    default:
                        break;
                }
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;

    drag(drop(ref));

    return (
        <div ref={ref} className='movable-item' style={{ opacity }}>
            <div className='item-title' onClick={handleShow}>{sName}</div>
            <div className='item-description' onClick={handleShow}>{sDesc}</div>
            <Modal
                className="modal"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body><Form onSubmit={onSubmit} sDesc={sDesc} sName={sName} /></Modal.Body>
            </Modal>
        </div>
    )
}

export default MovableItem;