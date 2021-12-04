const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {
    headers: { username: usernameToFind },
  } = request;

  const user = users.find(({ username }) => username === usernameToFind);

  if (!user) return response.status(400).json({ message: "user not found" });

  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  const {
    body: { name, username },
  } = request;

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists)
    return response.status(400).json({
      error: "user already exists",
    });

  users.push(user);

  return response.status(201).json(user);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const {
    user,
    body: { title, deadline },
  } = request;

  const todo = {
    id: uuidv4(),
    done: false,
    title,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const {
    user: { username: usernameToFilter },
  } = request;

  const userTodos = users.filter(
    ({ username }) => username === usernameToFilter
  );

  return response.json(userTodos);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const {
    user,
    body: { title, deadline },
    params: { id: todoId },
  } = request;

  let userTodo = user.todos.find(({ id }) => id === todoId);

  usersTodo = {
    title,
    deadline,
    ...userTodo,
  };
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
