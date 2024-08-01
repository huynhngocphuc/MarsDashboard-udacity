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
  let { rovers, apod, currentRover } = state;
  console.log("🚀 ~ App ~ state:", state);
  return !currentRover?.latest_photos?.length
    ? 
    `
      <h1 class="list-car">true </h1>
    `
    : `
   <h1 class="list-car"> false </h1>
 `;

  // return `
  //      <div class="list-car">
  //       <button class="btn" onclick="handleClickRover('${rovers[0]}')">Curiosity</button>
  //       <button class="btn" onclick="handleClickRover('${rovers[1]}')">Opportunity</button>
  //       <button class="btn" onclick="handleClickRover('${rovers[2]}')">Spirit </button>
  //     </div>

  // `;
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
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
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
