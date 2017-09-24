let now = moment();
const today = now.format("YYYY-M-D");

const dateNav = document.querySelector('.date-navigator');
const dateNavBtns = dateNav.querySelectorAll('button')

const drawer = document.querySelector(".form-drawer");
const addAction = document.querySelector(".add-action");
const actionsList= document.querySelector('.actions');

const allActions = JSON.parse(localStorage.getItem('allActions')) || [];




//------------- DISPLAY DATE -------------
function displayDate( date = now ) {
  dateNav.querySelector('.current-date').innerHTML = `
      ${date.format('dddd')}<br>
      ${date.format('MMMM Do, YYYY')}
  `
}



//------------- STORE ACTION -------------
function storeAction(e) {
  e.preventDefault();

  const name = ( this.querySelector('[name=actionName]')).value;
  const color = ( this.querySelector('[name=actionColor]')).value;

  const action = {
    name,
    color,
    done: {},
  }
  action.done[today] = false;

  allActions.push(action);
  populateActions( allActions, actionsList);

  localStorage.setItem('allActions', JSON.stringify(allActions));

  this.reset();
}




//------------- DATE NAVIGATION -------------
function handleDateNav(e) {
  if (e.target.dataset.datenav == 'goBack') {
    const back = now.subtract(1, 'day')
    displayDate(back);
    populateActions(allActions, actionsList, back.format("YYYY-M-D"));
  }

  else if (e.target.dataset.datenav == 'goForward') {
    if (moment().isSame( now, 'd' )) return
    const forward = now.add(1, 'day');
    displayDate(forward);
    populateActions(allActions, actionsList, forward.format("YYYY-M-D"));

  }

  else if (e.target.dataset.datenav == "goToToday") {
    if (moment().isSame( now, 'd' )) return
    now = moment();
    displayDate(now);
    populateActions(allActions, actionsList, now.format("YYYY-M-D"));
  }
}




//------------- DISPLAY ACTIONS -------------
function populateActions( allActions = [], list, date = today ) {
  if ( allActions.length < 1 ) {
    list.innerHTML = `<li>Enter an item to get started</li>`;
    return;
  }
  list.innerHTML = allActions.map( (action, i) => {
    document.documentElement.style.setProperty(`--action${i}`, action.color);
    let styles = action.done[date] ? `color:#fff;` : `color:transparent;`;
    let classes = action.done[date] ? 'done' : '';
    return `
      <li class="action" >
        <input type="checkbox" data-index=${i} id="action${i}" ${action.done[date] ? "checked" : ""} />
        <label for="action${i}" style="border: 1px solid var(--action${i}); background-color:var(--action${i}); ${styles}" class="${classes}">${action.name}</label>
      </li>
    `;
  }).join("")
}


function toggleDone(e) {
  if (!e.target.matches('input')) return;
  const el = e.target;
  const index = el.dataset.index;
  const currentDate = now.format('YYYY-M-D');

  allActions[index].done[currentDate] = !allActions[index].done[currentDate];

  populateActions(allActions, actionsList, currentDate);
}




//------------- EVENT LISTENERS -------------
addAction.addEventListener( "submit", storeAction );
actionsList.addEventListener('click', toggleDone);
dateNavBtns.forEach(dateBtn => dateBtn.addEventListener('click', handleDateNav, {
  capture: false,
  once: false
  }
));

displayDate(now);
populateActions(allActions, actionsList);
