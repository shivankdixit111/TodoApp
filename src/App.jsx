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
               inset: "0", // Full-screen placement for mobile friendliness
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               padding: "0", // Remove default padding for Tailwind styling
               backgroundColor: "transparent", // Use Tailwind for background color
               border: "none",
            },
         }}
         >
         <div className="bg-[#1c2c4a] w-[90%] sm:w-[400px] max-w-[500px] h-[300px] p-6 sm:p-8 rounded-xl text-center shadow-lg">
            {/* Modal Header */}
            <div className="modal-header">
               <h2 className="text-[#61dafb] text-xl sm:text-2xl font-semibold mb-4">
               Welcome to Todo App!
               </h2>
            </div>
            {/* Modal Text */}
            <div className="modal-text mb-6">
               <p className="text-gray-300 text-sm sm:text-base font-medium mb-2">
               Stay organized and productive.
               </p>
               <p className="text-gray-300 text-sm sm:text-base font-medium">
               Please log in or sign up to access your tasks.
               </p>
            </div>
            {/* Modal Buttons */}
            <div className="modal-buttons">
               <button
               className="w-full py-1.5 mx-auto text-lg font-bold mt-8 text-[#61dafb] border-2 border-[#61dafb] rounded-lg hover:bg-[#61dafb] hover:text-[#1c2c4a] transition duration-300"
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