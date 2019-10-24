let rmcCalendar = (function() {
  document.addEventListener("DOMContentLoaded", function() {
    // Tingle modal - generic generator code
    var modal = new tingle.modal({
      footer: true
    });

    // Creating a close button for any modal we create. Button text, css classes, logic on-click.
    modal.addFooterBtn(
      `<strong>Close</strong>`,
      "tingle-btn tingle-btn--primary tingle-btn--pull-right",
      function() {
        modal.close();
      }
    );

    let desiredViews = ["rmc-library-hours"];

    var calendarEl = document.getElementById("calendar");

    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: ["dayGrid", "googleCalendar", "list", "momentPlugin"],
      buttonIcons:false,
      defaultView: "listWeek",

      // titleFormat: '{MMMM {D}}, YYYY',
      googleCalendarApiKey: "AIzaSyCqfo0l4nCGE2FLGgnXxKDv6SJVPLund4Q",

      /* this is where we put all the source calendars information, as a series of objects */
      eventSources: [
        {
          googleCalendarId:
            "rocky.edu_1dp49oqqq33o04tsoeq7khug3g@group.calendar.google.com",
          className: "rmc-library-hours"
        }
      ],

      // defaultView: "dayGridMonth",
      nowIndicator: true,
      header: {
        left: "RMC Library Hours",
        center: "title"
        // right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek"
      },

      eventRender: function(info) {
        let theClassNames = info.el.className;
        const found = desiredViews.some(r => theClassNames.includes(r));
        return found;
      },

      /* What happens when someone clicks a particular event. In this case, open a modal with additional information about the event. */
      // The modal is using TingleJS
      eventClick: function(info) {
        let timeConvert = arg => {
          let m = FullCalendarMoment.toMoment(arg, calendar);
          // console.log("Converte!", m.format("HH:mmA"));
          return m.format("ddd, MMM Do h:mmA");
        };
        let theLocation, theDescription, theTitle, startTime, endTime;
        // A series of if statements to ensure that if an event doesn't have some particular info (like description or location) it doesn't get rendered as undefined
        if (info.event.extendedProps.location) {
          theLocation = `LOCATION: ${info.event.extendedProps.location}`;
        } else {
          theLocation = "";
        }
        if (info.event.title) {
          theTitle = info.event.title.toUpperCase();
        } else {
          theTitle = "";
        }
        if (info.event.extendedProps.description) {
          theDescription = `DESCRIPTION: ${info.event.extendedProps.description}`;
        } else {
          theDescription = "";
        }
        //Don't need start/end times if it is an all day event
        if (info.event.start && info.event.allDay == false) {
          startTime = `TIME: ${timeConvert(info.event.start)} - `;
        } else {
          startTime = "";
        }
        if (info.event.end && info.event.allDay == false) {
          endTime = `${timeConvert(info.event.end)}`;
        } else endTime = "";
        let theURL = info.event.url;
        modal.setContent(
          `<h3>${theTitle}</h3><p>${startTime}${endTime}</p><p>${theLocation}</p><p>${theDescription}</p><p><a href="${theURL}" target="_blank">More Information</a></p>`
        );

        modal.open();

        info.jsEvent.preventDefault();
      }
    });

    calendar.render();

 

    //this selects the button of the view thats displayed on page load. So that it's visually represented as active.
    $(document).ready(function() {
      calendar.changeView("listWeek");
      calendar.setOption('aspectRatio', .7);
    });
  });
})();
