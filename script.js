const SOURCE_FILES = {
  board: "data/board.json",
  events: "data/events.json",
  calendar: "data/calendar.json",
  resources: "data/resources.json",
  publications: "data/publications.json",
  gallery: "data/gallery.json"
};

// Fallback content allows the page to still render when opened directly as file:// in some browsers.
// For production and GitHub Pages, data is loaded from the JSON files in /data.
const FALLBACK_DATA = {
  board: [
    {
      name: "Arman Farhadi",
      role: "President",
      group: "Executive Board",
      bio: "Senior in Economics focused on community leadership and student mentorship.",
      image: "assets/images/mini-logo.png"
    },
    {
      name: "Niloofar Rahimi",
      role: "Vice President",
      group: "Executive Board",
      bio: "Leads partnerships and supports planning across cultural and academic events.",
      image: "assets/images/mini-logo.png"
    },
    {
      name: "Sara Ahmadi",
      role: "Treasurer",
      group: "Executive Board",
      bio: "Oversees budgeting and funding logistics for annual programming.",
      image: "assets/images/mini-logo.png"
    },
    {
      name: "Reza Karimi",
      role: "Director of Events",
      group: "Board",
      bio: "Coordinates event calendars and student engagement initiatives.",
      image: "assets/images/mini-logo.png"
    },
    {
      name: "Darya Mohammadi",
      role: "Secretary",
      group: "Board",
      bio: "Manages internal communications and organizational records.",
      image: "assets/images/mini-logo.png"
    }
  ],
  events: [
    {
      title: "Graduate Pathways Panel",
      date: "2026-04-18",
      location: "Huntsman Hall",
      description: "Penn alumni discuss graduate school options and research careers.",
      status: "upcoming"
    },
    {
      title: "Persian Poetry Night",
      date: "2026-05-02",
      location: "Kelly Writers House",
      description: "Reading circle and student-led conversation on Persian literature.",
      status: "upcoming"
    },
    {
      title: "Nowruz Celebration",
      date: "2026-03-20",
      location: "Houston Hall",
      description: "Community gathering and cultural celebration to mark the Persian new year.",
      status: "past"
    }
  ],
  calendar: [
    {
      title: "Board Meeting",
      date: "2026-04-15",
      time: "6:00 PM",
      location: "McNeil Building"
    },
    {
      title: "Open Member Check-in",
      date: "2026-04-22",
      time: "7:00 PM",
      location: "Perelman Center"
    },
    {
      title: "End-of-Semester Reflection",
      date: "2026-05-01",
      time: "5:30 PM",
      location: "Van Pelt Library"
    }
  ],
  resources: [
    {
      title: "Club Constitution",
      description: "Official governing document of PIRAN.",
      url: "assets/pdfs/constitution.pdf",
      category: "Governance"
    },
    {
      title: "PennClubs Profile",
      description: "Official Penn student organization listing for PIRAN.",
      url: "https://pennclubs.com",
      category: "Campus"
    },
    {
      title: "Instagram",
      description: "Follow updates, event highlights, and announcements.",
      url: "https://instagram.com/",
      category: "Social"
    }
  ],
  publications: [
    {
      title: "Spring Programming Announcement",
      type: "Announcement",
      date: "2026-04-01",
      description: "Overview of workshops, speaker events, and community programming.",
      url: "#"
    },
    {
      title: "Community Statement",
      type: "Statement",
      date: "2026-02-10",
      description: "A message on inclusion, respect, and shared values in our community.",
      url: "#"
    }
  ],
  gallery: [
    {
      image: "assets/images/logo.png",
      caption: "Members and guests at our spring cultural gathering.",
      date: "2026-03-20",
      event: "Nowruz Celebration"
    },
    {
      image: "assets/images/mini-logo.png",
      caption: "PIRAN student organizers during welcome week.",
      date: "2025-09-03",
      event: "Welcome Mixer"
    }
  ]
};

function formatDate(dateValue) {
  const date = new Date(dateValue + "T00:00:00");
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadJson(key) {
  const url = SOURCE_FILES[key];

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to load ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Falling back to embedded data for ${key}.`, error);
    return FALLBACK_DATA[key] ?? [];
  }
}

function renderUpcomingPreview(events) {
  const target = document.getElementById("upcoming-event");
  if (!target) return;

  const today = new Date();
  const upcoming = events
    .filter((event) => new Date(event.date + "T00:00:00") >= today || event.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  if (!upcoming) {
    target.innerHTML = '<p class="message">No upcoming events posted yet. Please check back soon.</p>';
    return;
  }

  target.innerHTML = `
    <h4>${escapeHtml(upcoming.title)}</h4>
    <p class="meta">${formatDate(upcoming.date)} | ${escapeHtml(upcoming.location)}</p>
    <p class="description">${escapeHtml(upcoming.description)}</p>
  `;
}

function renderEvents(events) {
  const upcomingTarget = document.getElementById("events-upcoming");
  const pastTarget = document.getElementById("events-past");
  if (!upcomingTarget || !pastTarget) return;

  const today = new Date();
  const sorted = events.slice().sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((event) => new Date(event.date + "T00:00:00") >= today || event.status === "upcoming");
  const past = sorted
    .filter((event) => !upcoming.includes(event))
    .sort((a, b) => b.date.localeCompare(a.date));

  const eventMarkup = (event) => `
    <article class="card">
      <h4>${escapeHtml(event.title)}</h4>
      <p class="meta">${formatDate(event.date)} | ${escapeHtml(event.location)}</p>
      <p class="description">${escapeHtml(event.description)}</p>
    </article>
  `;

  upcomingTarget.innerHTML = upcoming.length
    ? upcoming.map(eventMarkup).join("")
    : '<p class="message">No upcoming events at this time.</p>';

  pastTarget.innerHTML = past.length
    ? past.map(eventMarkup).join("")
    : '<p class="message">Past events will appear here.</p>';
}

function renderCalendar(items) {
  const target = document.getElementById("calendar-list");
  if (!target) return;

  target.innerHTML = items.length
    ? items
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(
          (item) => `
            <article class="card">
              <h4>${escapeHtml(item.title)}</h4>
              <p class="meta">${formatDate(item.date)} | ${escapeHtml(item.time)} | ${escapeHtml(item.location)}</p>
            </article>
          `
        )
        .join("")
    : '<p class="message">No calendar items posted yet.</p>';
}

function renderBoard(members) {
  const target = document.getElementById("board-groups");
  if (!target) return;

  if (!members.length) {
    target.innerHTML = '<p class="message">Board details will be shared soon.</p>';
    return;
  }

  const groups = {};
  members.forEach((member) => {
    const key = member.group || "Board";
    if (!groups[key]) groups[key] = [];
    groups[key].push(member);
  });

  target.innerHTML = Object.entries(groups)
    .map(
      ([groupName, groupMembers]) => `
        <section>
          <h3 class="group-title">${escapeHtml(groupName)}</h3>
          <div class="card-grid">
            ${groupMembers
              .map(
                (member) => `
                  <article class="card">
                    ${member.image ? `<img class="member-image" src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}" />` : ""}
                    <h4>${escapeHtml(member.name)}</h4>
                    <p class="meta">${escapeHtml(member.role)}</p>
                    ${member.bio ? `<p class="description">${escapeHtml(member.bio)}</p>` : ""}
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function renderResources(resources) {
  const target = document.getElementById("resources-list");
  if (!target) return;

  target.innerHTML = resources.length
    ? resources
        .map(
          (resource) => `
            <article class="card">
              <h4>${escapeHtml(resource.title)}</h4>
              <p class="description">${escapeHtml(resource.description)}</p>
              <p><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">Open Resource</a></p>
              <span class="resource-category">${escapeHtml(resource.category)}</span>
            </article>
          `
        )
        .join("")
    : '<p class="message">No resources available yet.</p>';
}

function renderPublications(publications) {
  const target = document.getElementById("publications-list");
  if (!target) return;

  target.innerHTML = publications.length
    ? publications
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(
          (item) => `
            <article class="archive-item">
              <h4>${escapeHtml(item.title)}</h4>
              <p class="meta">${escapeHtml(item.type)} | ${formatDate(item.date)}</p>
              <p class="description">${escapeHtml(item.description)}</p>
              ${item.url ? `<p><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">View Item</a></p>` : ""}
            </article>
          `
        )
        .join("")
    : '<p class="message">No publications posted yet.</p>';
}

function renderGallery(items) {
  const target = document.getElementById("gallery-grid");
  if (!target) return;

  target.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <figure class="gallery-item">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.caption || item.event || "PIRAN gallery image")}" />
              <figcaption>
                ${escapeHtml(item.caption || "PIRAN event moment")}<br />
                <strong>${formatDate(item.date)}</strong>${item.event ? ` | ${escapeHtml(item.event)}` : ""}
              </figcaption>
            </figure>
          `
        )
        .join("")
    : '<p class="message">Gallery images will be added soon.</p>';
}

function initMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

async function initPage() {
  // Detect which page we're on by checking for render targets
  const hasUpcomingPreview = document.getElementById("upcoming-event");
  const hasEvents = document.getElementById("events-upcoming");
  const hasCalendar = document.getElementById("calendar-list");
  const hasBoard = document.getElementById("board-groups");
  const hasResources = document.getElementById("resources-list");
  const hasPublications = document.getElementById("publications-list");
  const hasGallery = document.getElementById("gallery-grid");

  // Load only the data needed for this page
  const loadPromises = [];
  let board, events, calendar, resources, publications, gallery;

  if (hasUpcomingPreview) loadPromises.push(loadJson("events").then((data) => { events = data; }));
  if (hasEvents) loadPromises.push(loadJson("events").then((data) => { events = data; }));
  if (hasCalendar) loadPromises.push(loadJson("calendar").then((data) => { calendar = data; }));
  if (hasBoard) loadPromises.push(loadJson("board").then((data) => { board = data; }));
  if (hasResources) loadPromises.push(loadJson("resources").then((data) => { resources = data; }));
  if (hasPublications) loadPromises.push(loadJson("publications").then((data) => { publications = data; }));
  if (hasGallery) loadPromises.push(loadJson("gallery").then((data) => { gallery = data; }));

  await Promise.all(loadPromises);

  // Render only the content present on this page
  if (hasUpcomingPreview && events) renderUpcomingPreview(events);
  if (hasEvents && events) renderEvents(events);
  if (hasCalendar && calendar) renderCalendar(calendar);
  if (hasBoard && board) renderBoard(board);
  if (hasResources && resources) renderResources(resources);
  if (hasPublications && publications) renderPublications(publications);
  if (hasGallery && gallery) renderGallery(gallery);
}

document.getElementById("year").textContent = String(new Date().getFullYear());
initMenu();
initPage();
