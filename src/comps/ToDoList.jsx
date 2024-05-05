import {useEffect, useState} from "react";
import './ToDoList.css';
import ModalButton from "./ModalButton.jsx";
import Modal from "./Modal.jsx";
import TaskList from "./TaskList.jsx";
import ListItem from '@mui/material/ListItem';
import {Checkbox, Divider, IconButton, ListItemSecondaryAction, ListItemText} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const ToDoList = () => {

    const [list, setList] = useState([]);
    const [task, setTask] = useState('');
    const [category, setCategory] = useState(['Studies', 'Home tasks', 'Important', 'Day tasks']);
    const [modal, setModal] = useState(false);
    const [renderedList, setRenderedList] = useState([]);
    const [availableCategories, setAvailableCategories] = useState(['Studies', 'Home tasks', 'Important', 'Day tasks']);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/pro_players");
            if (!response.ok) {
                throw new Error("Failed to fetch todos");
            }
            const data = await response.json();
            setList(data.todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const addTask = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/todos/pro_players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: task,
                    is_done: false
                })
            });
            if (!response.ok) {
                throw new Error("Failed to add task");
            }
            const newTask = await response.json();
            setList([...list, newTask]);
            setTask('');
            setCategory(category);
            openModal();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const dropDownChange = (e) => {
        setCategory(e.target.value)
    }

    const openModal = () => {
        setModal(!modal);
    }

    const Cancel = () => {
        setTask('');
        setCategory(category);
        openModal();
    }

    const RemoveTask = async (id) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, { method: "DELETE",});

            if(!response.ok) {
                throw new Error("Failed to delete task");
            }
            const updatedList = list.filter(item => item.id !== id);
            setList(updatedList);
        }catch(error) {
            console.error("Error adding task:", error);
        }
    };

    const Submit = (e) => {
        e.preventDefault();
        addTask();
    }

    const selectedItem = (id) => {
        setList(prevList => {
            return prevList.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        is_done: !item.is_done
                    };
                }
                return item;
            });
        });
        setCategory(category)
    }

    useEffect(() => {
        const newList = list.map((item, index) => (
            <div className='List_Container' key={index}>
                <ListItem>
                    <Checkbox
                        checked={item.is_done}
                        onChange={() => selectedItem(item.id)}
                    />
                    <ListItemText primary={item.label} secondary={item.category}/>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => RemoveTask(item.id)}>
                            <DeleteIcon color='#fff'/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider/>
            </div>
        ));
        setRenderedList(newList);
    }, [list]);

    return (
        <section className='Container'>
            <h1 className='List_Title'>Tasks</h1>
            {!modal && <ModalButton openModal={openModal}/>}
            <Modal
                modalState={openModal}
                task={task}
                setTask={setTask}
                Submit={Submit}
                Cancel={Cancel}
                category={availableCategories}
                modal={modal}
                dropDownChange={dropDownChange}
            />
            <TaskList renderedList={renderedList}/>
        </section>
    )
}

export default ToDoList;
