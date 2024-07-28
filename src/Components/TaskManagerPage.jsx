import { useEffect, useState } from "react";
import Category from "./Category";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const TaskManagerPage = () => {
  const [categories, setCategories] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let storedCategories = localStorage.getItem("categories");
    if (!storedCategories) {
      localStorage.setItem(
        "categories",
        JSON.stringify({ categories: categories })
      );
    } else {
      setCategories(JSON.parse(storedCategories)["categories"]);
      setNeedsUpdate(true);
    }

    let storedDarkMode = localStorage.getItem("isDarkMode");
    if (storedDarkMode !== null) {
      setIsDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "categories",
      JSON.stringify({ categories: categories })
    );
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (needsUpdate) {
      setNeedsUpdate(false);
      let newCategories = [...categories];
      for (let i = 0; i < newCategories.length; i++) {
        let category = newCategories[i];

        category.categoryIndex = i;

        category.addTask = (task) => {
          handleAddTask(i, task);
        };

        category.handleChangeTask = (taskIndex, newTask) => {
          handleChangeTask(i, taskIndex, newTask);
        };

        category.handleChangeCategory = (newCategory) => {
          handleChangeCategory(i, newCategory);
        };

        category.handleDeleteTask = (taskIndex) => {
          handleDeleteTask(i, taskIndex);
        };

        category.handleDeleteCategory = () => {
          handleDeleteCategory(i);
        };

        for (let j = 0; j < category.tasks.length; j++) {
          category.tasks[j].handleChangeTask = (task) => {
            category.handleChangeTask(j, task);
          };
          category.tasks[j].handleDeleteTask = () => {
            category.handleDeleteTask(j);
          };
        }
      }
      setCategories(newCategories);
    }
  }, [needsUpdate]);

  const handleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleAddTask = (categoryIndex, task) => {
    let newCategories = [...categories];
    const targetCategory = newCategories[categoryIndex];
    if (targetCategory) {
      targetCategory.tasks.splice(0, 0, task);
      setCategories(newCategories);
    }
    setNeedsUpdate(true);
  };

  const addCategory = (name) => {
    setCategories([
      ...categories,
      {
        name: name,
        tasks: [],
        addTask: (task) => {
          handleAddTask(categories.length - 1, task);
        },
        handleChangeTask: (taskIndex, newTask) => {
          handleChangeTask(categories.length - 1, taskIndex, newTask);
        },
        handleChangeCategory: (newName) => {
          handleChangeCategory(categories.length - 1, newName);
        },
        handleDeleteTask: (taskIndex) => {
          handleDeleteTask(categories.length - 1, taskIndex);
        },
        handleDeleteCategory: () => {
          handleDeleteCategory(categories.length - 1);
        },
        categoryIndex: categories.length,
      },
    ]);
    setNeedsUpdate(true);
  };

  const handleChangeCategory = (categoryIndex, newName) => {
    let newCategories = [...categories];
    let targetCategory = newCategories[categoryIndex];
    if (targetCategory) {
      targetCategory.name = newName;
      setCategories(newCategories);
    }
    setNeedsUpdate(true);
  };

  const handleChangeTask = (categoryIndex, taskIndex, newTask) => {
    let newCategories = [...categories];
    const targetCategory = newCategories[categoryIndex];
    if (targetCategory) {
      targetCategory.tasks[taskIndex] = newTask;
      setCategories(newCategories);
    }
    setNeedsUpdate(true);
  };

  const handleDeleteTask = (categoryIndex, taskIndex) => {
    let newCategories = [...categories];
    newCategories[categoryIndex].tasks.splice(taskIndex, 1);
    setCategories(newCategories);
    setNeedsUpdate(true);
  };

  const handleDeleteCategory = (categoryIndex) => {
    let newCategories = [...categories];
    newCategories.splice(categoryIndex, 1);
    setCategories(newCategories);
    setNeedsUpdate(true);
  };

  const handleOnDragEnd = (result) => {
    if (result.reason !== "DROP" || !result.destination) {
      return;
    }

    let newCategories = [...categories];
    let fromIndex = result.source.index;
    let toIndex = result.destination.index;
    if (result.type === "cat-drop") {
      // dropped category
      let [removed] = newCategories.splice(fromIndex, 1);
      newCategories.splice(toIndex, 0, removed);
    } else {
      // dropped task
      let from = result.source.droppableId;
      let to = result.destination.droppableId;

      newCategories[from].tasks = newCategories[from].tasks || [];
      newCategories[to].tasks = newCategories[to].tasks || [];
      const [removed] = newCategories[from].tasks.splice(fromIndex, 1);
      newCategories[to].tasks.splice(toIndex, 0, removed);
    }
    setCategories(newCategories);
    setNeedsUpdate(true);
  };

  return (
    <div
      className="taskManagerParent"
      style={{ backgroundColor: isDarkMode ? "black" : "white" }}
    >
      <div className="taskManagerParent1">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="app" direction="horizontal" type="cat-drop">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                }}
              >
                {categories.map((category, index) => (
                  <Draggable
                    key={index}
                    draggableId={"CAT-" + index}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Category
                          {...category}
                          categoryIndex={index}
                          darkMode={isDarkMode}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          className="button mainBG ascend"
          style={{
            width: "8vw",
            height: "5vh",
          }}
          onClick={() => {
            addCategory("Category " + (categories.length + 1));
          }}
        >
          Add category
        </button>
      </div>
      <div
        style={{
          marginTop: "auto",
          marginLeft: "auto",
          padding: "0 1em 1em 0",
        }}
      >
        <button
          className="button mainBG ascend"
          style={{
            width: "8vw",
            height: "5vh",
            backgroundColor: isDarkMode ? "white" : "black",
            color: isDarkMode ? "black" : "white",
          }}
          onClick={handleDarkMode}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default TaskManagerPage;
