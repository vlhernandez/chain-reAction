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

      if( allActions.length < 1 ){
        console.log('no actions logged')
      }

      const actions = entries[today];
      const name = ( this.querySelector('[name=actionName]')).value;
      const color = ( this.querySelector('[name=actionColor]')).value;

      const action = {
        name,
        color,
        done: false,
      }
      allActions.push(action);

      actions.push(action);
      entries['allActions'] = allActions;

      populateActions( entries, actionsList);
      localStorage.setItem('entries', JSON.stringify(entries));
      localStorage.setItem('allActions', JSON.stringify(allActions));
      this.reset();
    }




    //------------- DATE NAVIGATION AND DISPLAY -------------
    function displayDate(date = now) {
      currentDateBtn.innerHTML = `
          <div>${date.format('dddd')}</div>
          <div>${date.format('MMMM Do, YYYY')}</div>
      `
    }

    function handleDateNav(e) {
      console.log(e.target.dataset);

      if (e.target.dataset == 'goBack') {
        let back = now.subtract(1, 'day')
        displayDate(back);
        populateActions(entries, actionsList, back.format("YYYY-M-D"));

      } else if (e.target.dataset == 'goFoward') {
        if (moment().isSame( now, 'd' )) return
        let forward = now.add(1, 'day');
        displayDate(forward);
        populateActions(entries, actionsList, forward.format("YYYY-M-D"));

      } else {
        if (moment().isSame( now, 'd' )) return
        now = moment();
        displayDate(now);
        populateActions(entries, actionsList, now.format("YYYY-M-D"));
      }
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


    function populateActions( entries = {}, list, date = today) {
      const items = entries[date];

      if(Object.keys(entries).length < 1 && Object.keys(allActions).length < 1) {
        list.innerHTML = `<li>Enter an item to get started</li>`;
        return
      } else if ( !items && Object.keys(allActions).length > 0 ) {
          console.log('Nothing exists for this date. Entries for ', date, 'are...',  entries[date]);
          console.log('all Entries existing actions  are ...', entries['allActions']);

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
      entries[today][index].done = !entries[today][index].done;
      localStorage.setItem('entries', JSON.stringify(entries));
      populateList(entries, actionsList, today);
    }



    //------------- EVENT LISTENERS -------------
    // prevDateBtn.addEventListener('click', goBack);
    // nextDateBtn.addEventListener('click', goForward);
    // currentDateBtn.addEventListener('click', goToToday)
    dateNav.addEventListener('click', handleDateNav);

    displayDate(now);


    addAction.addEventListener( "submit", storeAction );
    actionsList.addEventListener('click', toggleDone);

    populateActions(entries, actionsList);
