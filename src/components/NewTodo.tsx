import { FormEvent, useState } from "react";
import { TodoType } from "../App";

function NewTodo({
  updateTodoList,
  currTodoList,
}: {
  updateTodoList: (newTodoList: TodoType[]) => void;
  currTodoList: TodoType[];
}) {
  const [newTodo, setNewTodo] = useState("");

  function submitForm(e: FormEvent) {
    e.preventDefault();

    const todo = {
      id: new Date().getTime(),
      todo: newTodo,
      completed: false,
    };

    const updatedTodoList = [...currTodoList, todo];
    updateTodoList(updatedTodoList);

    setNewTodo("");
  }

  return (
    <form
      onSubmit={submitForm}
      className="flex justify-center items-center gap-3 md:gap-5"
    >
      <input
        type="button"
        disabled
        className="w-[31px] h-7 border dark:border-very-dark-grayish-blue-light border-light-grayish-blue rounded-full"
      />
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        className="border-none outline-none bg-inherit dark:text-light-grayish-blue-dark text-very-dark-grayish-blue-light w-full m-0 text-[18px] pt-1"
        placeholder="Create a new todo..."
      />
    </form>
  );
}

export default NewTodo;
