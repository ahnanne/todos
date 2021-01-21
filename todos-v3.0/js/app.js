// global
let todos = [];

// 💚 요소 노드 취득 모음
const $todos = document.querySelector('ul.todos');
const $input = document.querySelector('.input-todo');

// 💚 이벤트 핸들러 모음
// 렌더링
const render = () => {
  let html = '';

  todos.forEach(todo => {
    html += `<li id="${todo.id}" class="todo-item">
    <input id="ck-${todo.id}" class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}/>
    <label for="ck-${todo.id}">${todo.content}</label>
    <i class="remove-todo far fa-times-circle"></i>
  </li>
  `;

    $todos.innerHTML = html;
  });
};

// 데이터를 ID순으로 정렬
const sortData = () => {
  todos.sort((todo1, todo2) => todo2.id - todo1.id);
};

// 가장 먼저 데이터 fetch 해오기
const fetchTodos = () => {
  // TODO: 데이터 취득(잠정 처리)
  todos = [
    { id: 1, content: "HTML", completed: false },
    { id: 3, content: "JavaScript", completed: false },
    { id: 2, content: "CSS", completed: false }
  ];

  sortData();

  render();
};

// 새로운 ID 생성 함수
const generateId = () => {
  let maxId = -Infinity;

  if (todos[0] === undefined) return 1;
  todos.forEach(todo => {
    if (todo.id > maxId) maxId = todo.id;
  });

  return maxId + 1;
};

// 새로운 todo 추가하기
const addTodo = newTodo => {
  todos = [
    ...todos,
    { id: generateId(), content: newTodo, completed: false }
  ];

  sortData();

  render();
};

// 체크박스 체크 여부에 따라 데이터 갱신하기
const toggleCompleted = (targetId, checkbox) => {
  todos = todos.map(todo => todo.id === +targetId ? { ...todo, completed: checkbox.checked ? true : false } : todo);

  render();
};

// todo 삭제하기
const removeTodo = targetId => {
  todos = todos.filter(todo => todo.id !== +targetId);

  render();
};

// 개수 세기

// 💚 이벤트 핸들러 등록 모음
// 가장 먼저 데이터 fetch 해오기
document.addEventListener('DOMContentLoaded', fetchTodos);

// 새로운 todo 추가하기
$input.onkeyup = e => {
  if (e.key !== 'Enter') return;

  addTodo(e.target.value);
  e.target.value = '';
};

// 체크박스 체크 여부에 따라 데이터 갱신하기(이벤트 위임)
$todos.onchange = e => {
  toggleCompleted(e.target.parentNode.getAttribute('id'), e.target);
};

// todo 삭제하기(이벤트 위임)
$todos.onclick = e => {
  if (e.target.matches('i')) removeTodo(e.target.parentNode.getAttribute('id'));
};

// 개수 세기
