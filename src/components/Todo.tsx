import { useState } from "react";
import { TodoType } from "../App";

type TodoComponentType = {
  index: number;
  todoObj: TodoType;
  currTodoList: TodoType[];
  updateTodoList: (newTodoList: TodoType[]) => void;
};

function Todo({
  index,
  todoObj,
  currTodoList,
  updateTodoList,
}: TodoComponentType) {
  const [isCompleted, setIsCompleted] = useState(todoObj.completed);

  function deleteTodo() {
    const updatedList = currTodoList.filter((todo) => todo.id !== todoObj.id);
    updateTodoList(updatedList);
  }

  function toggleComplete() {
    const newTodoList = currTodoList.map((todo) => {
      if (todo.id === todoObj.id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });

    setIsCompleted(!isCompleted);
    updateTodoList(newTodoList);
  }

  return (
    <div
      className={`group flex justify-between py-4 px-5 dark:bg-very-desaturated-blue bg-very-light-gray ${
        index === 0
          ? "rounded-t-md border-b dark:border-b-very-dark-grayish-blue-light border-b-light-grayish-blue-dark"
          : "border-b dark:border-b-very-dark-grayish-blue-light border-b-light-grayish-blue-dark"
      }`}
    >
      <div className="flex gap-3 md:gap-5">
        <button
          type="button"
          className={`flex-shrink-0 flex justify-center items-center relative p-[1.5px] w-7 h-7 rounded-full md:hover:bg-gradient-to-br md:hover:from-gradient-1 md:hover:to-gradient-2 ${
            isCompleted
              ? "bg-gradient-to-br from-gradient-1 to-gradient-2"
              : "dark:bg-very-dark-grayish-blue-light bg-light-grayish-blue-light"
          }`}
          onClick={toggleComplete}
        >
          <span
            className={`flex h-full w-full rounded-full ${
              isCompleted
                ? "bg-transparent"
                : "dark:bg-very-desaturated-blue bg-very-light-gray"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="9"
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                isCompleted ? "block" : "hidden"
              }`}
            >
              <path
                fill="none"
                stroke="#FFF"
                strokeWidth="2"
                d="M1 4.304L3.696 7l6-6"
              />
            </svg>
          </span>
        </button>
        <p
          className={`pt-1 md:hover:cursor-pointer ${
            isCompleted
              ? "line-through text-light-grayish-blue-dark dark:text-dark-grayish-blue-dark"
              : "text-very-dark-grayish-blue-light dark:text-light-grayish-blue-dark"
          }`}
        >
          {todoObj.todo}
        </p>
      </div>
      <button
        onClick={deleteTodo}
        className="md:hidden block md:group-hover:block"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
          <path
            fill="#494C6B"
            fillRule="evenodd"
            d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
          />
        </svg>
      </button>
    </div>
  );
}

export default Todo;
