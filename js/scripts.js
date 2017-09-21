let now = moment();
const today = now.format("YYYY-M-D");

const dateNav = document.querySelector('.date-navigator');
const dateNavBtns = dateNav.querySelectorAll('button')

const addAction = document.querySelector(".add-action");
const actionsList= document.querySelector('.actions');

const dailyEntries = JSON.parse(localStorage.getItem('dailyEntries')) || {};
const allActions = JSON.parse(localStorage.getItem('allActions')) || [];


//------------- STORE DATE and ACTION -------------
function storeAction(e) {
  e.preventDefault();
  if( !(today in dailyEntries) ) {
    // make an entry for the date if it hasn't been entered yet
    dailyEntries[today] = [];
  }

  if( allActions.length < 1 ){
    console.log('no actions logged yet')
  }

  const todayActions = dailyEntries[today];
  const name = ( this.querySelector('[name=actionName]')).value;
  const color = ( this.querySelector('[name=actionColor]')).value;

  const action = {
    name,
    color,
  }

  const actionStatus = {
    name,
    done: false
  }

  allActions.push(action);
  populateActions( allActions, actionsList);

  todayActions.push(actionStatus);

  localStorage.setItem('dailyEntries', JSON.stringify(dailyEntries));
  localStorage.setItem('allActions', JSON.stringify(allActions));

  this.reset();
}




//------------- DATE NAVIGATION AND DISPLAY -------------
function displayDate(date = now) {
  dateNav.querySelector('.current-date').innerHTML = `
      ${date.format('dddd')}<br>
      ${date.format('MMMM Do, YYYY')}
  `
}


function handleDateNav(e) {
  if (e.target.dataset.datenav == 'goBack') {
    const back = now.subtract(1, 'day')
    displayDate(back);
    populateActions(dailyEntries, actionsList, back.format("YYYY-M-D"));

  } else if (e.target.dataset.datenav == 'goFoward') {
    if (moment().isSame( now, 'd' )) return
    const forward = now.add(1, 'day');
    displayDate(forward);
    populateActions(dailyEntries, actionsList, forward.format("YYYY-M-D"));

  } else if (e.target.dataset.datenav == "goToToday") {
    if (moment().isSame( now, 'd' )) return
    now = moment();
    displayDate(now);
    populateActions(dailyEntries, actionsList, now.format("YYYY-M-D"));
  }
}


function populateActions( dailyEntries = {}, list, date = today) {
  const items = dailyEntries[date];

  if ( Object.keys(dailyEntries).length < 1 && Object.keys(allActions).length < 1 ) {
    list.innerHTML = `<li>Enter an item to get started</li>`;
    return;
  } else if ( !items && Object.keys(allActions).length > 0 ) {
      list.innerHTML = allActions.map((action, i) => {
      document.documentElement.style.setProperty(`--action${i}`, action.color);
        return `
          <li class="action" style="color:var(--action${i}); border: 1px solid var(--action${i});">
            <input type="checkbox" data-index=${i} id="action${i}" ${action.done ? 'checked' : ""} />
            <label for="action${i}">${action.name}</label>
          </li>
        `;
      }).join("")

      return
  }

  list.innerHTML = items.map((item, i) => {
   document.documentElement.style.setProperty(`--action${i}`, item.color);
    return `
      <li class="action" style="color:var(--action${i}); border: 1px solid var(--action${i});">
        <input type="checkbox" data-index=${i} id="action${i}" ${item.done ? 'checked' : ""} />
        <label for="action${i}">${item.name}</label>
      </li>
    `;
  }).join("")
}


function toggleDone(e) {
  if (!e.target.matches('input')) return; // skip this unless it's an input
  const el = e.target;
  const index = el.dataset.index;

  dailyEntries[today][index].done = !dailyEntries[today][index].done;
  localStorage.setItem('dailyEntries', JSON.stringify(dailyEntries));

  populateList(dailyEntries, actionsList, today);
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
populateActions(dailyEntries, actionsList);



/*******************************
dailyEntries = {
  2017-09-17: {
        name: sew,
        done: true
      },
      {
        name: play,
        done: false
      }
},
  2017-09-18: {
        name: sew,
        done: true
      },
      {
        name: play,
        done: false
    }
}

allActions = [
  {
      name: sew,
      color: blue
  },
  {
      name: play,
      color: pink
  }
]
*/
