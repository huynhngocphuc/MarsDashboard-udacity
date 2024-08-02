let store = {
  user: { name: "Student" },
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  currentRover: null,
};

const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

const handleClickRover = async (rover) => {
  const data = await getImageCar(rover);
  updateStore(store, { currentRover: data });
  console.log("🚀 ~ handleClickRover ~ data:", data);
};

const App = (state) => {
  let { currentRover } = state;
  if (!currentRover?.latest_photos?.length) {
    return `
        <main>
           ${renderImagesOfTheDay(state)}
          <div class="list-car">
            ${renderButton()}
          </div>
        </main>
        <footer></footer>
    
   `;
  } else {
    return `
    <main>
      ${renderImagesOfTheDay(state)}
      <div class="list-car">
        ${renderButton()}
      </div>
      <div class="list-card">
        ${renderImages(state)}
      </div>
    </main>
      `;
  }
};

window.addEventListener("load", () => {
  render(root, store);
});

const Greeting = (name) => {
  if (name) {
    return `
            <h1 class= "title">Welcome, ${name}!</h1>
        `;
  }
  return `
        <h1>Hello!</h1>
    `;
};

const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" class="image" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

const getImageOfTheDay = (state) => {
  let { apod } = state;
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
  return data;
};

const getImageCar = async (nameCar) => {
  // fetch data from API and update the store
  const response = await fetch(`http://localhost:3000/mars-photos/${nameCar}`);
  const data = await response.json();
  return data;
};

const renderImages = (state) => {
  const { currentRover } = state;
  return currentRover.latest_photos
    .map((item) => {
      return `
       <div class="container card">
        <img
          src=${item.img_src}
          alt="placeholder"
          class="card-image"
          placeholder="image not available"
        />
        <div class="content">
         <div>Name: <span>${item.rover.name}</span></div>
          <div>Launch Date: <span>${item.rover.launch_date}</span></div>
          <div>Landing Date: <span>${item.rover.landing_date}</span></div>
          <div>Status: <span>${item.rover.status}</span></div>
          <div>
            Date taken:
            <span>${item.earth_date}</span>
          </div>
        </div> 
      </div>
      `;
    })
    .join("");
};

const renderButton = () => {
  return `
    <button class="btn" onclick="handleClickRover('${store.rovers[0]}')">Curiosity</button>
    <button class="btn" onclick="handleClickRover('${store.rovers[1]}')">Opportunity</button>
    <button class="btn" onclick="handleClickRover('${store.rovers[2]}')">Spirit </button>
  `;
};

const renderImagesOfTheDay = (state) => {
  let { apod } = state;
  return `
      ${Greeting(store.user.name)}
        <section>
          <h3>Put things on the page!</h3>
          <p>Here is an example section.</p>
          <p>
              One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
              the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
              This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
              applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
              explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
              but generally help with discoverability of relevant imagery.
          </p>
          ${ImageOfTheDay(apod)}
        </section>   
    `;
};
