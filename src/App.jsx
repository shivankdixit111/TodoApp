import {React,useState, useEffect} from 'react'
import { TodoProvider } from './context';
import TodoForm from './components/TodoForm.jsx'
import TodoItem from './components/TodoItem' 
import { useAuth0} from '@auth0/auth0-react'
import Modal from "react-modal"; 
Modal.setAppElement("#root"); // This is required for accessibility

const App = () => {
  const {user,loginWithRedirect, logout , isAuthenticated} = useAuth0();
  const [todos, setTodos] = useState([]);
  const addTodo = (todo) => {
     setTodos((prev) => [ {id: Date.now(), ...todo}, ...prev])
  }
  const updateTodo = (id, todo) => {
     setTodos((prev) => prev.map((prevTodo) => (
        prevTodo.id == id ? todo : prevTodo
     )))
  }
  const deleteTodo = (id) => {
     setTodos((prev) => prev.filter(
        (prevTodo) => (prevTodo.id != id)
     ))
  }
  const toggleComplete = (id) => {
     setTodos((prev) => prev.map((prevTodo) => (
        prevTodo.id == id ? {...prevTodo, completed: !prevTodo.completed} : prevTodo
     )))
  }

  useEffect(()=>{
     const todos = JSON.parse(localStorage.getItem("todos"));
     if(todos && todos.length>0) {
       setTodos(todos);
     }
  },[]);

  useEffect(()=>{
     localStorage.setItem("todos", JSON.stringify(todos));
  },[todos])

  return (
    <TodoProvider value={{todos, addTodo, updateTodo, deleteTodo, toggleComplete}}>
       <Modal
        isOpen={!isAuthenticated}
        contentLabel="Authentication Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          content: {
            margin: "auto",
            width: "500px",
            height: "350px",
            backgroundColor: "#1c2c4a",
            color: "#fff",
            borderRadius: "15px",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
            border: "none",
            padding: "20px",
          },
        }}
      >
        <div className="modal-header">
          <h2 className='text-center' style={{ color: "#61dafb", fontSize: "1.8rem", marginBottom: "10px" }}>
            Welcome to Todo App! ,,
          </h2>
        </div>
        <p className="modal-text" style={{ marginBottom: "20px", fontSize: "1.1rem" }}>
            <p className='text-center font-bold'> Stay organized and productive.</p>
            <p className='text-center font-bold'>Please log in or sign up to access your tasks.</p>
        </p>
        <div className="modal-buttons mt-20">
        <div className="flex flex-col space-y-4">
            <button
              className="w-5/6 py-2 mx-auto text-lg font-bold text-[#61dafb] border-2 border-[#61dafb] rounded-lg hover:bg-[#61dafb] hover:text-[#1c2c4a] transition duration-300"
              onClick={()=> loginWithRedirect()}
            >
              Login
            </button> 
          </div>
        </div>
      </Modal> 

      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
             {/* Logout Button */}
               {isAuthenticated && (
                  <button
                     onClick = {() => logout()}
                     className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                     Logout
                  </button>
               )}
             <h1 className="text-2xl font-bold text-center mb-8 mt-2"> 
               {isAuthenticated && (
                  <div>
                  <h1>Welcome {user.name} !!</h1> 
                  <p>Write Your TODO's</p>
                  </div>
               )}
            </h1>
                <div className="mb-4">
                        {/* Todo form goes here */} 
                    <TodoForm/>
                </div>
                <div className="flex flex-wrap gap-y-3">
                        {/*Loop and Add TodoItem here */}
                    {
                      todos.map((todo) => (
                         <div key={todo.id} className="w-full">
                             <TodoItem todo={todo}/>
                         </div>
                      ))
                    }
                </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App