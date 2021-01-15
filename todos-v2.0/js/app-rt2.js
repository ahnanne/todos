// 💚Global state
let todos = [];

// 💚취득 노드 모음
const $todos = document.querySelector('ul.todos');
const $input = document.querySelector('.input-todo');
const $markAll = document.querySelector('.complete-all > .checkbox');
const $clearBtn = document.querySelector('button.btn');

// 💚이벤트 핸들러 모음
// 렌더 함수
const render = () => {
  let html = '';

  todos.forEach(({ id, content, completed }) => {
    html += `<li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${(completed ? 'checked' : '')} />
    <label for="ck-${id}">${content}</label>
    <i class="remove-todo far fa-times-circle"></i>
    </li>`;

    return html;
  });

  $todos.innerHTML = html;
};
// sort todos(내림차순)
const sortTodos = () => {
  todos.sort((todo1, todo2) => todo2.id - todo1.id);
};

// count completed todos, left todos
const countCompleted = () => {
  let $numOfCompleted = document.querySelector('.completed-todos');
  let cnt = 0;

  $numOfCompleted.textContent = todos.reduce((_, todo) => {
    if (todo.completed) return ++cnt;
    else return cnt;
  }, 0);

  let $numOfLeft = document.querySelector('.active-todos');
  $numOfLeft.textContent = todos.length - $numOfCompleted.textContent;
};

// fetch todos
const fetchTodos = () => {
  // TODO: 서버로부터 데이터 받아오기(잠정 처리)
  todos = [
    { id: 1, content: '꽃집에서 인기 있는 꽃', completed: false },
    { id: 2, content: '서브웨이 샌드위치 칼로리 계산기', completed: false },
    { id: 3, content: 'MBTI 팩폭 해설', completed: false },
    { id: 4, content: '스티커 제작', completed: false }
  ];

  sortTodos();

  render();
};

// add new todo
const addTodo = newContent => {
  if (newContent === '') return;
  const generateNewId = () => ($todos.childElementCount ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

  todos = [
    ...todos,
    { id: generateNewId(), content: newContent, completed: false }
  ];

  sortTodos();

  render();
};

// remove todo
const removeTodo = targetId => {
  todos = todos.filter(todo => todo.id !== +targetId);
  render();
};

// toggle completed
const toggleCompleted = targetId => {
  todos = todos.map(todo => {
    if (todo.id === +targetId) return { ...todo, completed: !todo.completed };
    else return todo;
  });

  render();
};

// Mark all as complete
const markAllTodos = checked => {
  if (checked) todos = todos.map(todo => ({ ...todo, completed: true }));
  else todos = todos.map(todo => ({ ...todo, completed: false }));
  // 화살표 함수에서 객체 리터럴을 반환하는 경우에는,
  // 객체 리터럴을 소괄호()로 감싸주어야 한다.✨

  render();
};

// Clear completed
const clearCompleted = () => {
  todos = todos.filter(todo => !todo.completed);

  render();
};

// 💚이벤트 핸들러 등록
// fetch todos
document.addEventListener('DOMContentLoaded', fetchTodos);
document.addEventListener('DOMContentLoaded', countCompleted);

// add new todo
$input.onkeyup = e => {
  if (e.key !== 'Enter') return;
  addTodo($input.value);

  // 인풋창 초기화
  $input.value = '';

  // mark all 체크 해제
  $markAll.checked = false;
  // Mark all 체크 상태 동기화(수동)
  if ($markAll.hasAttribute('checked')) $markAll.removeAttribute('checked');

  // count completed, left
  countCompleted();
};

// remove todo(이벤트 위임)
$todos.onclick = e => {
  // 아이콘 요소 노드를 직접 취득해서 조작하려고 하면 취득하는 부분에서 막혀버린다. (null)
  if (!e.target.matches('.todos > li > i')) return;
  removeTodo(e.target.parentNode.getAttribute('id'));
  // 🥵string으로 반환됨에 주의!!!

  // count completed, left
  countCompleted();
};

// toggle completed(이벤트 위임)
$todos.onchange = e => {
  toggleCompleted(e.target.parentNode.getAttribute('id'));
  // 🥵string으로 반환됨에 주의!!!

  // count completed, left
  countCompleted();
};

// Mark all as complete
$markAll.onchange = () => {
  // Mark all 체크 상태 동기화(수동)
  if ($markAll.checked) $markAll.setAttribute('checked', '');
  else if ($markAll.hasAttribute('checked')) $markAll.removeAttribute('checked');

  // 이벤트 핸들러 호출
  markAllTodos($markAll.checked);

  // count completed, left
  countCompleted();
};

// Clear completed
$clearBtn.onclick = () => {
  clearCompleted();

  // count completed, left
  countCompleted();
};
