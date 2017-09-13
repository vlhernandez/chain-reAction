    // Handle Date Navigator

    let now = moment();
    const dateNav = document.querySelector('.date-navigator');
    const prevDateBtn =  dateNav.querySelector('.prev-date');
    const currentDateBtn = dateNav.querySelector('.current-date');
    const nextDateBtn =  dateNav.querySelector('.next-date');

    function displayDate(date = now) {
      currentDateBtn.innerHTML = `
          <div>${date.format('dddd')}</div>
          <div>${date.format('MMMM Do, YYYY')}</div>
      `
    }

    function goBack() {
      displayDate(now.subtract(1, 'day'));
    }

    function goForward() {
      if (moment().isSame( now, 'd' )) return
      displayDate(now.add(1, 'day'));
    }

    function goToToday() {
      if (moment().isSame( now, 'd' )) return
      now = moment();
      displayDate(now);
    }

    prevDateBtn.addEventListener('click', goBack);
    nextDateBtn.addEventListener('click', goForward);
    currentDateBtn.addEventListener('click', goToToday)

    displayDate(now);
