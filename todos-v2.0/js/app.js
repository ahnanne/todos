// 💚GLOBAL state
let todos = [];

// 💚취득해온 노드 모음
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $all = document.getElementById('ck-complete-all');
const $clearBtn = document.querySelector('div.clear-completed > button.btn');
const $completedTodos = document.querySelector('.btn > span.completed-todos');
const $activeTodos = document.querySelector('div.clear-completed > strong.active-todos');

// 💚데이터 갱신을 위한 render function 정의
const render = () => {
  let html = '';

  $todos.innerHTML = todos.map(({ id, content, completed }) => {
    html = `<li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''} />
    <label for="ck-${id}">${content}</label>
    <i class="remove-todo far fa-times-circle"></i>
    </li>`;

    return html;
  }).join(''); // join 메서드의 기본 구분자는 쉼표(,)

  // console.dir(todos);
  return todos;
};

// 💚이벤트 핸들러 정의

// DOM 완료되면 제일 먼저 데이터 받아오기 이벤트 핸들러
const fetchTodos = () => {
  // TODO: 서버로부터 데이터 취득(잠정 처리)
  todos = [
    { id: 1, content: '포이에마 41장부터 예습', completed: false },
    { id: 2, content: '포이에마 복습', completed: false },
    { id: 3, content: '코딩 연습(유데미 클론 코딩)', completed: false },
    { id: 4, content: 'Todo v.2 실습', completed: false },
    { id: 5, content: 'Todo v.3 실습', completed: false },
    { id: 6, content: 'Exercise 알고리즘 연습 문제', completed: false }
  ];

  // id 기준으로 sort하기
  todos = todos.sort((todo1, todo2) => todo2.id - todo1.id);

  render();
};

// 새로운 todo 추가 이벤트 핸들러
const addTodo = newTodo => {
  const generateId = () => {
    const newId = $todos.firstChild === null ? 1 : Math.max(...todos.map(todo => todo.id)) + 1;
    // 목록이 비어있을 경우 -Infinity 값으로 아이디 생성되는 것 방지하기 위해 삼항 조건 연산자로 기본값 1 설정

    return newId;
  };

  todos = [...todos, { id: generateId(), content: newTodo, completed: false }];

  // id 기준으로 sort하기
  todos = todos.sort((todo1, todo2) => todo2.id - todo1.id);

  render();
};

// todo 제거 이벤트 핸들러
const removeTodo = targetId => {
  todos = todos.filter(({ id }) => id !== +targetId);

  render();
};

// completed 값 toggle 이벤트 핸들러
const toggleCompletedValue = targetId => {
  todos = todos.map(todo => (todo.id === +targetId ? { ...todo, completed: !todo.completed } : todo));
  // console.dir(todos);

  render();
};

// Mark all as complete 이벤트 핸들러
const markAll = ck => {
  todos.map(todo => {
    todo.completed = ck.checked ? true : false;
  });
  // console.dir(todos);

  render();
};

// Clear completed 이벤트 핸들러
const removeAll = () => {
  todos = todos.filter(todo => !todo.completed);

  // Completed todos 개수 0으로 초기화
  $completedTodos.innerHTML = 0;

  render();
};

// Completed todos 개수 카운팅 이벤트 핸들러
const countCompletedTodos = () => {
  let completedTodos = 0;
  const num = todos.reduce((_, todo) => {
    if (todo.completed) ++completedTodos;
    return completedTodos;
  }, 0);

  // text node 추가
  $completedTodos.innerHTML = num;
};

// Active todos 개수 카운팅 이벤트 핸들러
const countActiveTodos = () => {
  let activeTodos = 0;
  const num = todos.reduce((_, todo) => {
    if (!todo.completed) ++activeTodos;
    return activeTodos;
  }, 0);

  // text node 추가
  $activeTodos.innerHTML = num;
};

// DOM 동적 변경
// 💚이하는 이벤트 핸들러 등록 모음

// DOM 생성되면 가장 먼저 패치 시작
document.addEventListener('DOMContentLoaded', fetchTodos);
// Active todos 개수 카운트
document.addEventListener('DOMContentLoaded', countActiveTodos);

// 새로운 todo 추가하기
$inputTodo.onkeyup = e => {
  if (e.key !== 'Enter') return;
  if (e.target.value !== '') addTodo(e.target.value);
  countActiveTodos();

  // 인풋창 초기화
  e.target.value = '';

  // 엔터 치고 인풋창 따로 나가지 않으므로 자동 포커스 기능은 추가하지 않아도 됨.

  // Mark all as complete 체크 상태 초기화(체크 해제)
  $all.checked = false;
};

// todo 제거하기(이벤트 위임)
$todos.onclick = e => {
  // console.log(e.target.classList.contains('remove-todo'));
  if (!e.target.classList.contains('remove-todo')) return;
  // console.dir(e.target.parentNode.getAttribute('id'));
  removeTodo(e.target.parentNode.getAttribute('id'));
  countActiveTodos();
};

// 체크 여부에 따라 completed 값 toggle하기(이벤트 위임)
$todos.onchange = e => {
  toggleCompletedValue(e.target.parentNode.getAttribute('id'));

  // Completed todos 개수 카운팅하기
  countCompletedTodos();
  // Active todos 개수 카운팅하기
  countActiveTodos();

  // Mark all as complete 체크 상태 초기화(체크 해제)
  $all.checked = false;
};

// Mark all as complete 클릭 시 전체 체크 박스 선택/해제
$all.onchange = e => {
  // console.dir(e.target);
  markAll(e.target);

  // Completed todos 개수 카운팅하기
  countCompletedTodos();
  // Active todos 개수 카운팅하기
  countActiveTodos();
};

// Clear completed 버튼 클릭 시 completed 상태의 todo 모두 제거
$clearBtn.onclick = () => {
  removeAll();

  // Mark all as complete 체크 상태 초기화(체크 해제)
  $all.checked = false;
};
