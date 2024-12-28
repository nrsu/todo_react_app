/*make show done, show doing, show not done buttons slifing when i press*/
import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  RadioGroup,
  Radio
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { Edit, MoonStars, Sun, Trash } from "tabler-icons-react";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [taskState, setTaskState] = useState("Not done");
  const [sortOrder, setSortOrder] = useState("Not done");
  const [activeButton, setActiveButton] = useState("Not done");
  const [editingTaskIndex, setEditingTaskIndex] = useState(null)

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");

  function createTask() {
    tasks.push({
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState
    });
    setTasks(tasks);
    saveTasks(tasks);
  }
  
  

  function deleteTask(index) {

    var clonedTasks = tasks;

    clonedTasks.splice(index, 1);
    setTasks(clonedTasks);
    saveTasks(clonedTasks);
    loadTasks()
    
  }
  function loadTasks() {
    let loadedTasks = localStorage.getItem("tasks");

    let tasks = JSON.parse(loadedTasks);

    if (tasks) {
      setTasks(tasks);
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function sortTasks(order) {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (order === "Done") {
        return a.state === "Done" ? -1 : b.state === "Done" ? 1 : 0;
      }
      if (order === "Doing right now") {
        return a.state === "Doing right now" ? -1 : b.state === "Doing right now" ? 1 : 0;
      }
      return a.state === "Not done" ? -1 : b.state === "Not done" ? 1 : 0;
    });
    setTasks(sortedTasks);
    setSortOrder(order);
  }
  function editTask(index) {
    setEditingTaskIndex(index);
    taskTitle.current.value = tasks[index].title;
    taskSummary.current.value = tasks[index].summary;
    setTaskState(tasks[index].state);
    setOpened(true);
  }
  function saveEditedTask() {
    const updatedTasks = [...tasks];
    updatedTasks[editingTaskIndex] = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState,
    };
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setOpened(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={editingTaskIndex !== null ? "Edit Task" : "New Task"}
            
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            
            
            <Group mt={"md"} position={"apart"}>
            
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setOpened(false);
                  createTask();
                }}
              >
                Create Task
              </Button>
              
              
              <RadioGroup
                value={taskState}
                onChange={setTaskState}
                label="State"
                name="state"
                required
              >
                <Radio value="Done" label="Done" />
                <Radio value="Not done" label="Not done" />
                <Radio value="Doing right now" label="Doing right now" />
              </RadioGroup>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
              </Group>
            <Group mt="md" position="apart">
              <Button
                onClick={() => {
                  sortTasks("Done");
                  setActiveButton("Done"); // Update active button
                }}
                style={{
                  transition: "transform 0.3s ease-in-out",
                  transform: activeButton === "Done" ? "scale(1.1)" : "scale(1)",
                }}
              >
                Show 'Done' first
              </Button>
              <Button
                onClick={() => {
                  sortTasks("Doing right now");
                  setActiveButton("Doing right now"); // Update active button
                }}
                style={{
                  transition: "transform 0.3s ease-in-out",
                  transform: activeButton === "Doing right now" ? "scale(1.1)" : "scale(1)",
                }}
              >
                Show 'Doing' first
              </Button>
              <Button
                onClick={() => {
                  sortTasks("Not done");
                  setActiveButton("Not done"); // Update active button
                }}
                style={{
                  transition: "transform 0.3s ease-in-out",
                  transform: activeButton === "Not done" ? "scale(1.1)" : "scale(1)",
                }}
              >
                Show 'Not done' first
              </Button>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                if (task.title) {
                  return (
                    <Card withBorder key={index} mt={"sm"}>
                      <Group position={"apart"}>
                        <Text weight={"bold"}>{task.title}</Text>
                        <ActionIcon
                        onClick={() => {
                          editTask(index)
                        }}
                        variant = {"transparent"}
                        >
                        <Edit/>

                      </ActionIcon>
                        <ActionIcon
                          onClick={() => {
                            deleteTask(index);
                          }}
                          color={"red"}
                          variant={"transparent"}
                        >
                          <Trash />
                        </ActionIcon>

                      </Group>
                      <Text color={"dimmed"} size={"md"} mt={"sm"}>
                        {task.summary
                          ? task.summary
                          : "No summary was provided for this task"}
                      </Text >
                      <Text color={"dimmed"} size={"md"} mt={"sm"}>{task.state}</Text>
                    </Card>
                  );
                }
              })
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}