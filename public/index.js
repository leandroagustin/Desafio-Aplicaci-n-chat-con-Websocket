const socket = io();

// Chat
socket.on("message_msn", (data) => {
  console.log(data);
  render(data);
});

// Chat Render
const render = (data) => {
  let html = data
    .map((x) => {
      return `<p>
                <b class="text-primary">${x.email}:</b> 
                <span class="text-success"><i>${x.text}</i></span>
              </p>`;
    })
    .join(" ");
  document.querySelector("#contenedor").innerHTML = html;
};

// Chat Server
const fechaYHora = () => {
  const fecha = new Date(); //Permite trabajar con fechas y horas.
  let Fecha = `${fecha.getDate()}-${fecha.getMonth()}-${fecha.getFullYear()}`;
  let Hora = `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
  let dateAndHour = `${Fecha} ${Hora}`;
  return dateAndHour;
};

const addMessage = () => {
  let dataObj = {
    email:
      document.querySelector("#email").value +
      `<span class="text-danger h6">[${fechaYHora()}]</span>`,
    text: document.querySelector("#text").value,
  };
  socket.emit("dataText", dataObj);
  document.querySelector("#text").value = "";

  return false;
};

// Products
socket.on("message_pr", (dataObj) => {
  updateTable(dataObj);
  socket.emit("Confirm", "Productos actualizados!");
});

// Products Render
const updateTable = (data) => {
  let html = data
    .map((x) => {
      return `<tr>
                    <td>${x.title}</td>
                    <td>${x.price}</td>
                    <td>
                        <img src=${x.thumbnail} alt="foto del prod" class="ml-0" height="60px"/>
                    </td>
                </tr>`;
    })
    .join(" ");
  document.querySelector("#tableProds").innerHTML = html;
};

// Products Server
const addPr = () => {
  let dataObj = {
    title: document.querySelector("#title").value,
    price: document.querySelector("#price").value,
    thumbnail: document.querySelector("#thumbnail").value,
  };
  socket.emit("newProd", dataObj);
  document.querySelector("#title").value = "";
  document.querySelector("#price").value = "";
  document.querySelector("#thumbnail").value = "";

  return false;
};
