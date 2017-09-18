    const addAction = document.querySelector(".add-action");

    let now = moment();
    const today = now.format("YYYY-M-D");
    const dateNav = document.querySelector('.date-navigator');
    const prevDateBtn =  dateNav.querySelector('.prev-date');
    const currentDateBtn = dateNav.querySelector('.current-date');
    const nextDateBtn =  dateNav.querySelector('.next-date');

    const actionsList= document.querySelector('.actions');
    const entries = JSON.parse(localStorage.getItem('entries')) || {};
    const allActions = JSON.parse(localStorage.getItem('allActions')) || [];

    //------------- STORE DATE and ACTION -------------
    function storeAction(e) {
      e.preventDefault();

      // make an entry for the date if it hasn't been entered yet
      if(!(today in entries)) {
        entries[today] = [];
      }

      const actions = entries[today];
      const name = ( this.querySelector('[name=actionName]')).value;
      const color = ( this.querySelector('[name=actionColor]')).value;

      const action = {
        name,
        color,
        done: false,
      }
      actions.push(action);
      allActions.push(action);
      entries['allActions'] = allActions;

      populateActions( entries, actionsList);
      localStorage.setItem('entries', JSON.stringify(entries));
      localStorage.setItem('allActions', JSON.stringify(allActions));
      this.reset();
    }




    //------------- DISPLAY DATE -------------
    function displayDate(date = now) {
      currentDateBtn.innerHTML = `
          <div>${date.format('dddd')}</div>
          <div>${date.format('MMMM Do, YYYY')}</div>
      `
    }

    function goBack() {
      let back = now.subtract(1, 'day')
      displayDate(back);
      populateActions(entries, actionsList, back.format("YYYY-M-D"));
    }

    function goForward() {
      if (moment().isSame( now, 'd' )) return
      let forward = now.add(1, 'day');
      displayDate(forward);
      populateActions(entries, actionsList, forward.format("YYYY-M-D"));
    }

    function goToToday() {
      if (moment().isSame( now, 'd' )) return
      now = moment();
      displayDate(now);
      populateActions(entries, actionsList, now.format("YYYY-M-D"));
    }

    prevDateBtn.addEventListener('click', goBack);
    nextDateBtn.addEventListener('click', goForward);
    currentDateBtn.addEventListener('click', goToToday)

    displayDate(now);





    function populateActions( entries = {}, list, date = today) {
      const items = entries[date];

      if(Object.keys(entries).length < 1) {
        list.innerHTML = `<li>Enter an item to get started</li>`;
        return
      } else if ( !items ) {
          list.innerHTML = `<p>Nothing exists for this date</p>`
          console.log('entries for ', date, 'are...',  entries[date])
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




    //------------- EVENT LISTENERS -------------
    addAction.addEventListener( "submit", storeAction );

    populateActions(entries, actionsList);
