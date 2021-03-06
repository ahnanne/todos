// global
let todos = [];

// 💚 요소 노드 취득 모음
const $todos = document.querySelector('ul.todos');
const $input = document.querySelector('.input-todo');
const $numOfCompleted = document.querySelector('span.completed-todos');
const $numOfActive = document.querySelector('strong.active-todos');
const $nav = document.querySelector('.nav');
const $allTab = document.getElementById('all');
const $activeTab = document.getElementById('active');
const $completedTab = document.getElementById('completed');
const $ckAll = document.getElementById('ck-complete-all');
const $clearBtn = document.querySelector('.clear-completed > button.btn');

// 💚 이벤트 핸들러 모음
// item 개수 세기
const countNum = () => {
  let cnt = 0;
  let cntTodos = 0;

  // count completed
  todos.reduce((_, todo) => {
    if (todo.completed) return ++cnt;
    else return cnt;
  }, 0);
  $numOfCompleted.textContent = cnt;

  // count active
  todos.reduce(() => ++cntTodos, 0);
  $numOfActive.textContent = cntTodos - cnt;
};

// 렌더링
const render = () => {
  let html = '';

  // 조회 중인 탭별 렌더링
  /*
  if ($allTab.className === 'active') {
    todos.forEach(todo => {
      html += `<li id="${todo.id}" class="todo-item">
      <input id="ck-${todo.id}" class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}/>
      <label for="ck-${todo.id}">${todo.content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>
    `;
    });
  } else if ($activeTab.className === 'active') {
    todos.forEach(todo => {
      if (!todo.completed) {
        html += `<li id="${todo.id}" class="todo-item">
      <input id="ck-${todo.id}" class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}/>
      <label for="ck-${todo.id}">${todo.content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>
    `;
      }
    });
  } else {
    todos.forEach(todo => {
      if (todo.completed) {
        html += `<li id="${todo.id}" class="todo-item">
      <input id="ck-${todo.id}" class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}/>
      <label for="ck-${todo.id}">${todo.content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>
    `;
      }
    });
  }
  */
  todos.forEach(todo => {
    const renderHtml = () => {
      html += `<li id="${todo.id}" class="todo-item">
      <input id="ck-${todo.id}" class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}/>
      <label for="ck-${todo.id}">${todo.content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>
    `;
    };

    if ($allTab.className === 'active') renderHtml();
    else if ($activeTab.className === 'active') {
      if (!todo.completed) renderHtml();
    } else {
      if (todo.completed) renderHtml();
    }
  });

  $todos.innerHTML = html;

  // item 개수 세기
  countNum();
};

// 데이터를 ID순으로 정렬
const sortData = () => {
  todos.sort((todo1, todo2) => todo2.id - todo1.id);
};

// 가장 먼저 데이터 fetch 해오기
const fetchTodos = () => {
  // TODO: 데이터 취득(잠정 처리)
  todos = [
    {
      id: 1,
      content: "HTML",
      completed: false
    },
    {
      id: 3,
      content: "JavaScript",
      completed: false
    },
    {
      id: 2,
      content: "CSS",
      completed: false
    }
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
    {
      id: generateId(),
      content: newTodo,
      completed: false
    }
  ];

  sortData();

  render();
};

// 체크박스 체크 여부에 따라 데이터 갱신하기
const toggleCompleted = (targetId, checkbox) => {
  todos = todos.map(todo => todo.id === +targetId
    ? { ...todo, completed: checkbox.checked ? true : false }
    : todo);

  render();
};

// todo 삭제하기
const removeTodo = targetId => {
  todos = todos.filter(todo => todo.id !== +targetId);

  render();
};

// 탭별 item 조회하기
const showEachTab = (targetTab, array) => {
  targetTab.classList.toggle('active', true);
  array.forEach(node => {
    if (node.matches('ul.nav > li') && node !== targetTab) node.classList.toggle('active', false);
  });

  render();
};

// Mark all as complete
const markAllck = () => {
  todos = todos.map(todo => ({ ...todo, completed: true }));

  render();
};

// Clear completed
const clearCompleted = () => {
  todos = todos.filter(todo => todo.completed !== true);

  render();
};

// 💚 이벤트 핸들러 등록 모음
// 가장 먼저 데이터 fetch 해오기
document.addEventListener('DOMContentLoaded', fetchTodos);

// 새로운 todo 추가하기
$input.onkeyup = e => {
  if (e.key !== 'Enter') return;

  addTodo(e.target.value);

  // 입력창 초기화
  e.target.value = '';

  if ($ckAll.checked) $ckAll.checked = false;
};

// 체크박스 체크 여부에 따라 데이터 갱신하기(이벤트 위임)
$todos.onchange = e => {
  toggleCompleted(e.target.parentNode.getAttribute('id'), e.target);
};

// todo 삭제하기(이벤트 위임)
$todos.onclick = e => {
  if (e.target.matches('i')) removeTodo(e.target.parentNode.getAttribute('id'));
};

// 탭별 item 조회하기
$nav.onclick = e => {
  if (e.target === e.currentTarget) return;

  showEachTab(e.target, [...e.currentTarget.children]);

  if ($ckAll.checked) $ckAll.checked = false;
};

// Mark all as complete
$ckAll.onchange = () => {
  markAllck();
};

// Clear completed
$clearBtn.onclick = () => {
  clearCompleted();

  if ($ckAll.checked) $ckAll.checked = false;
};
