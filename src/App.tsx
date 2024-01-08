import React, { useEffect, useRef, useState } from "react";
import NewTodo from "./components/NewTodo";
import Todo from "./components/Todo";
import { arraysAreEqual } from "./utils";

export interface TodoType {
  id: number;
  todo: string;
  completed: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function App() {
  const currTodoList: TodoType[] = JSON.parse(
    localStorage.getItem("todos") || "[]"
  );

  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [todos, setTodos] = useState<TodoType[]>(currTodoList);
  const [filterTodos, setFilterTodos] = useState<TodoType[]>(todos);

  const [currentFilterMode, setCurrentFilterMode] = useState<string>("all");

  function updateMobileAndDarkMode() {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
    }
  }

  // Use Effect hook to update mobile and dark mode on mount
  useEffect(() => {
    updateMobileAndDarkMode();
  }, []);

  // Use effect hook to set initial todos in local storage
  useEffect(() => {
    if (localStorage.getItem("todos") === null) {
      localStorage.setItem("todos", JSON.stringify([]));
    }
  }, []);

  // Use Effect hook to update the mobile state when the window is resized
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use Effect hook to update the dark theme
  useEffect(() => {
    if (isDarkMode) {
      document
        .querySelector("body")
        ?.classList.remove("bg-very-light-grayish-blue");
      document.querySelector("body")?.classList.add("bg-very-dark-blue");
    } else {
      document.querySelector("body")?.classList.remove("bg-very-dark-blue");
      document
        .querySelector("body")
        ?.classList.add("bg-very-light-grayish-blue");
    }
  }, [isDarkMode]);

  // update the todos state
  function updateTodoList(newTodoList: TodoType[]) {
    setTodos(newTodoList);
  }

  // update the localstorage every times the todos state changes
  useEffect(() => {
    if (!arraysAreEqual(todos, currTodoList)) {
      if (currentFilterMode === "all") {
        setFilterTodos(todos);
      } else if (currentFilterMode === "active") {
        setFilterTodos(todos.filter((todo) => todo.completed === false));
      } else {
        setFilterTodos(todos.filter((todo) => todo.completed === true));
      }
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const bgStyle = {
    height: "100vh",
    background: `url(/images/bg-${isMobile ? "mobile" : "desktop"}-${
      isDarkMode ? "dark" : "light"
    }.jpg) no-repeat top / 100% 33.3333%, ${
      isDarkMode ? "#161722" : "#e4e5f1"
    }`,
  };

  // Filter btns on Click
  function handleFilterBtnClick(typeOfFilter: string) {
    switch (typeOfFilter) {
      case "all":
        setFilterTodos(todos);
        setCurrentFilterMode("all");

        document.getElementById("all-btn")!.classList.add("active-filter");
        document.getElementById("all-btn")!.classList.remove("inactive-filter");

        document
          .getElementById("active-btn")!
          .classList.remove("active-filter");
        document.getElementById("active-btn")!.classList.add("inactive-filter");

        document
          .getElementById("completed-btn")!
          .classList.remove("active-filter");
        document
          .getElementById("completed-btn")!
          .classList.add("inactive-filter");

        break;

      case "completed":
        setFilterTodos(todos.filter((todo) => todo.completed === true));
        setCurrentFilterMode("completed");

        document
          .getElementById("completed-btn")!
          .classList.add("active-filter");
        document
          .getElementById("completed-btn")!
          .classList.remove("inactive-filter");

        document
          .getElementById("active-btn")!
          .classList.remove("active-filter");
        document.getElementById("active-btn")!.classList.add("inactive-filter");

        document.getElementById("all-btn")!.classList.remove("active-filter");
        document.getElementById("all-btn")!.classList.add("inactive-filter");

        break;

      case "active":
        setFilterTodos(todos.filter((todo) => todo.completed === false));
        setCurrentFilterMode("active");

        document.getElementById("active-btn")!.classList.add("active-filter");
        document
          .getElementById("active-btn")!
          .classList.remove("inactive-filter");

        document
          .getElementById("completed-btn")!
          .classList.remove("active-filter");
        document
          .getElementById("completed-btn")!
          .classList.add("inactive-filter");

        document.getElementById("all-btn")!.classList.remove("active-filter");
        document.getElementById("all-btn")!.classList.add("inactive-filter");

        break;
    }
  }

  function clearCompleted() {
    setTodos(todos.filter((todo) => todo.completed === false));
  }

  // Drag and reorder functionality
  const [isDragging, setIsDragging] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  function dragStart(e: React.PointerEvent, index: number) {
    if (!detectLeftButton(e)) return; // must be left mouse button

    setIsDragging(index);

    const container = containerRef.current;
    const items = Array.from(container!.childNodes).filter(
      (node): node is HTMLElement => node.nodeType === Node.ELEMENT_NODE
    );
    const draggedItem = items[index];
    const itemsBelowDraggedItem = items.slice(index + 1);
    const notDraggedItems = items.filter((_, i) => i !== index);
    const draggedTodoData = todos[index];
    let newList = [...todos];

    // make the text in the page unselectable
    document.querySelector("body")!.style.userSelect = "none";

    // getBoundingClientRect of dragged item
    const dragBoundingRect = draggedItem.getBoundingClientRect();

    // Set styles for dragged items
    draggedItem.style.position = "fixed";
    draggedItem.style.zIndex = "9999";
    draggedItem.style.width = dragBoundingRect.width + "px";
    draggedItem.style.height = dragBoundingRect.height + "px";
    draggedItem.style.top = dragBoundingRect.top + "px";
    draggedItem.style.left = dragBoundingRect.left + "px";

    // Create alternate div element
    const div = document.createElement("div");
    div.style.width = dragBoundingRect.width + "px";
    div.style.height = dragBoundingRect.height + "px";
    div.style.pointerEvents = "none";
    container!.appendChild(div);

    // move the elements below dragged item
    const distance = dragBoundingRect.height; // distance to be moved

    itemsBelowDraggedItem.forEach((item) => {
      item.style.transform = `translateY(${distance}px)`;
    });

    // Get the initial mouse coordinates of the pointer
    const x = e.clientX;
    const y = e.clientY;

    document.onpointermove = dragMove;

    function dragMove(e: PointerEvent) {
      // Calculate the distance the pointer has moved
      const posX = e.clientX - x;
      const posY = e.clientY - y;

      // move item
      draggedItem.style.transform = `translate(${posX}px, ${posY}px)`;

      // swap position and data
      notDraggedItems.forEach((item) => {
        // Check if two items are overlapping
        const rect1 = draggedItem.getBoundingClientRect();
        const rect2 = item.getBoundingClientRect();

        const isOverlapping =
          rect1.y < rect2.y + rect2.height / 2 &&
          rect1.y + rect1.height / 2 > rect2.y;

        if (isOverlapping) {
          if (item.getAttribute("style")) {
            item.style.transform = "";
            index++;
          } else {
            item.style.transform = `translateY(${distance}px)`;
            index--;
          }

          // swap data
          newList = todos.filter((todo) => todo.id !== draggedTodoData.id);
          newList.splice(index, 0, draggedTodoData);
        }
      });
    }

    // finish mouse pointer event
    document.onpointerup = dragEnd;
    function dragEnd() {
      document.onpointerup = null;
      document.onpointermove = null;
      setIsDragging(undefined);
      draggedItem.removeAttribute("style");
      container!.removeChild(div);

      items.forEach((item) => item.removeAttribute("style"));
      document.querySelector("body")!.style.userSelect = "auto";

      setTodos(newList);
    }
  }

  function detectLeftButton(e: React.PointerEvent): boolean {
    if ("buttons" in e) {
      return e.buttons === 1;
    }

    const button = (e as React.PointerEvent).button;
    return button === 1;
  }

  // Theme toggle
  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <div
      style={bgStyle}
      className={`${isDarkMode ? "dark" : ""} flex justify-center py-10 ${
        todos.length <= 5 ? "items-center" : ""
      }`}
    >
      <div className="w-[300px] md:w-[500px] flex flex-col gap-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-very-light-gray text-3xl tracking-[0.4em] font-extrabold uppercase">
            todo
          </h1>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
                <path
                  fill="#FFF"
                  fillRule="evenodd"
                  d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
                <path
                  fill="#FFF"
                  fillRule="evenodd"
                  d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="bg-very-light-gray dark:bg-very-desaturated-blue p-4 px-5 rounded-md">
          <NewTodo updateTodoList={updateTodoList} currTodoList={todos} />
        </div>
        <div className="w-full shadow-md dark:shadow-xl">
          <div ref={containerRef} className="pointer-events-auto touch-none">
            {filterTodos.map((todo, index) => (
              <div
                onPointerDown={(e) => dragStart(e, index)}
                className={`${isDragging === index ? "touch-none" : ""}`}
                key={todo.id}
              >
                <Todo
                  index={index}
                  todoObj={todo}
                  currTodoList={todos}
                  updateTodoList={updateTodoList}
                />
              </div>
            ))}
          </div>
          <div
            className={`flex justify-between py-4 px-5 dark:bg-very-desaturated-blue bg-very-light-gray ${
              todos.length === 0 ? "rounded-md" : "rounded-b-md"
            } dark:text-very-dark-grayish-blue-light text-light-grayish-blue-light`}
          >
            <p className="text-dark-grayish-blue-light">
              {todos.filter((todo) => !todo.completed).length} items left
            </p>
            <div className="md:flex md:gap-4 md:font-bold hidden">
              <button
                id="all-btn"
                className="active-filter"
                onClick={() => handleFilterBtnClick("all")}
              >
                All
              </button>
              <button
                id="active-btn"
                className="inactive-filter"
                onClick={() => handleFilterBtnClick("active")}
              >
                Active
              </button>
              <button
                id="completed-btn"
                className="inactive-filter"
                onClick={() => handleFilterBtnClick("completed")}
              >
                Completed
              </button>
            </div>
            <button
              onClick={clearCompleted}
              className="dark:md:hover:text-very-light-gray md:hover:text-very-dark-grayish-blue-light text-dark-grayish-blue-light "
            >
              clear completed
            </button>
          </div>
        </div>
        <div className="bg-very-light-gray dark:bg-very-desaturated-blue p-4 px-5 rounded-md flex justify-center dark:text-very-dark-grayish-blue-light font-bold text-dark-grayish-blue-light md:hidden">
          <div className="flex gap-4">
            <button
              id="all-btn"
              className="active-filter"
              onClick={() => handleFilterBtnClick("all")}
            >
              All
            </button>
            <button
              id="active-btn"
              className="inactive-filter"
              onClick={() => handleFilterBtnClick("active")}
            >
              Active
            </button>
            <button
              id="completed-btn"
              className="inactive-filter"
              onClick={() => handleFilterBtnClick("completed")}
            >
              Completed
            </button>
          </div>
        </div>
        <p className="text-center mt-5 dark:text-very-dark-grayish-blue-light text-dark-grayish-blue-light font-medium">
          Drag and drop to reorder list
        </p>
        <div className="text-center mb-3 dark:text-very-dark-grayish-blue-light text-dark-grayish-blue-light">
          Challenge by{" "}
          <a
            href="https://www.frontendmentor.io?ref=challenge"
            className="font-bold dark:text-very-light-gray text-very-dark-grayish-blue-light"
            target="_blank"
          >
            Frontend Mentor
          </a>
          . Coded by{" "}
          <a
            href="https://aungookhant-portfolio.onrender.com/"
            target="_blank"
            className="font-bold dark:text-very-light-gray text-very-dark-grayish-blue-light"
          >
            Aung Oo Khant
          </a>
          .
        </div>
      </div>
    </div>
  );
}

export default App;
