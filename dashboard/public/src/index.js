const socket = io("wss://ws.inimicalpart.com", {
  withCredentials: false,
});
let infoAlreadySet = false;
let connectedBots = {};
let activeSocketId = null;
let switchReason = "";
let showSwitched = true;
let paused = false;
let iconSize = 36;
let categoryIds = [];
let userInfo = {};
let frameDocument = null;
const dropdown = new Dropdown(
  document.getElementById("botChangeDropdown"),
  document.getElementById("botInformation"),
  {
    placement: "top",
    onShow: () => {
      console.log(Object.keys(connectedBots).length);
      if (Object.keys(connectedBots).length < 1) {
        dropdown.hide();
      }
    },
  }
);
console.log(`Attempting to connect as web`);
socket.on("connect", () => {
  console.log("Connected to server");
});
socket.on("disconnect", () => {
  console.log("Disconnected from server");
  connectedBots = {};
});
socket.on("HPI", (message) => {
  socket.emit("HPIResponse", "web");
});
socket.on("CNT", (message) => {
  //if msg CONNECTED, then both web & worker are connected
  if (message == "CONNECTED") {
    console.log("Both web and worker connected");
    ready();
  }
});
socket.on("LCNT", (message) => {
  let disconnectedSocketId = message.socketId;
  let remainingConnectedBots = message.remaining;
  console.log(`Bot ${connectedBots[disconnectedSocketId].tag} disconnected.`);
  if (remainingConnectedBots == 0) {
    console.log("No bots connected. Pausing all messages and alerting user");
    paused = true;
    Swal.fire({
      title: "No other bots available",
      text: "The connected bot got disconnected and no other bots are connected. All functions have been disabled until a bot is connected.",
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#00bcd4",
      showCancelButton: false,
      showConfirmButton: true,
      allowOutsideClick: false,
    });
    infoAlreadySet = false;
    document.getElementById("bottag").innerText = "[NO BOT CONNECTED]";
    document.getElementById("botimg").src = "./assets/nobots.png";
    document.getElementById("botImgSidebarIcon").src = "./assets/nobots.png";
    document.getElementById("sidebarBotTagIcon").innerHTML = document
      .getElementById("sidebarBotTagIcon")
      .innerHTML.replace(/([a-zA-Z\]\[ ]{2,32}#[0-9]{4})|(N\/A)/gm, "N/A");
    if (document.getElementById("botimg").classList.contains("border-2"))
      document.getElementById("botimg").classList.remove("border-2");
    if (
      document
        .getElementById("botImgSidebarIcon")
        .classList.contains("border-2")
    )
      document.getElementById("botImgSidebarIcon").classList.remove("border-2");
  } else {
    let disconnectedSwal = Swal.mixin({
      title: connectedBots[disconnectedSocketId].tag + " disconnected.",
      toast: true,
      icon: "error",
      position: "bottom",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    if (activeSocketId == disconnectedSocketId)
      disconnectedSwal.fire({
        text: "Switched automatically due to active bot disconnection.",
      });
    else disconnectedSwal.fire();
  }
  removeBot(
    connectedBots[disconnectedSocketId],
    document.getElementById("botChange")
  );
  delete connectedBots[disconnectedSocketId];
});
socket.on("IACK", (message) => {
  //Server acknowledges our HPI response
  if (message == "WLCWEB") {
    console.log("Server acknowledged our HPI response");
  }
});

socket.on("message", (message) => {});
socket.on("allBotsIdentResponse", (message) => {
  console.log(
    "allBotsIdent Responded by",
    message.message.tag,
    message.message
  );
  if (!connectedBots[message.message.socketId])
    connectedBots[message.message.socketId] = message.message;
  if (!infoAlreadySet) {
    activeSocketId = message.message.socketId;
    document.getElementById("bottag").innerText = message.message.tag;
    document.getElementById("sidebarBotTagIcon").innerHTML = document
      .getElementById("sidebarBotTagIcon")
      .innerHTML.replace("N/A", message.message.tag);
    // document.getElementById("bot1text").innerHTML = document
    //   .getElementById("bot1text")
    //   .innerHTML.replace("Sign out", message.message.tag);
    document.getElementById("botimg").src = message.message.avatarURL;
    // document.getElementById("bot1").src = message.message.avatarURL;
    document.getElementById("botImgSidebarIcon").src =
      message.message.avatarURL;
    infoAlreadySet = true;
    if (!document.getElementById("botimg").classList.contains("border-2"))
      document.getElementById("botimg").classList.add("border-2");
    if (
      !document
        .getElementById("botImgSidebarIcon")
        .classList.contains("border-2")
    )
      document.getElementById("botImgSidebarIcon").classList.add("border-2");
  }
  if (Swal.getTitle()?.textContent === "No other bots available") Swal.close();
  if (paused) paused = false;

  if (!document.getElementById("bot" + message.message.id)) {
    if (Swal.isVisible()) {
      if (
        Swal.getTitle()?.textContent ===
        "You're not logged in, do you want to log in?"
      ) {
        addBot(message.message, document.getElementById("botChange"));
        return;
      }
    }

    Swal.mixin({
      title: message.message.tag + " connected.",
      toast: true,
      icon: "success",
      position: "bottom",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    }).fire();
    addBot(message.message, document.getElementById("botChange"));
  }
});
function ready() {
  console.log("Ready to send messages");
  //Tell all bots to identify themselves
  socket.emit("allBotsIdent", {
    iam: socket.id,
  });
}
function expandSidebar() {
  // get index of item in classList
  let index = [...document.getElementById("sidebar").classList].indexOf(
    "-left-64"
  );
  if (index > -1) {
    console.log("Expanding sidebar");
    document.getElementById("sidebar").classList.remove("-left-64");
    document.getElementById("sidebar").classList.add("left-0");
    $(".sidebarIcon").fadeOut(50);
    // changeCSS(".sidebarIcon", "visibility", "hidden");
  } else {
    index = [...document.getElementById("sidebar").classList].indexOf("w-80");
    if (index > -1) {
      console.log("Collapsing sidebar");
      document.getElementById("sidebar").classList.remove("left-0");
      document.getElementById("sidebar").classList.add("-left-64");
      $(".sidebarIcon").fadeIn(90);
    }
  }
}
function changeCSS(typeAndClass, newRule, newValue) {
  let elements = document.querySelectorAll(typeAndClass);
  elements.forEach((element) => {
    element.style[newRule] = newValue;
  });
}
function sendMessageToBot(identifier, channel, message) {
  console.log("Sending message to bot", identifier, channel, message);
  let socketId = null;
  for (let key in connectedBots) {
    if (connectedBots[key].tag == identifier) {
      socketId = key;
      break;
    } else if (key == identifier) {
      socketId = key;
    }
  }
  if (!socketId) {
    console.log("Unable to resolve identifier");
    return;
  }
  socket.emit(channel, {
    socketId: socketId,
    message: message,
  });
}
function addBot(botObj, parentElement) {
  /*
    <li id="bot1container">
        <a id="bot1text" href="#" class="flex items-center content-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"> <img id="bot1"src="./assets/loading.gif" class="w-8 h-8 mr-2"/>Sign out</a>
    </li>
    */
  console.log("Adding bot", botObj.tag, "to botChange dropdown");
  let liContainer = document.createElement("li");
  liContainer.id = `bot${botObj.id}`;
  let aText = document.createElement("a");
  aText.innerHTML =
    `<img src="${botObj.avatarURL}" class="rounded-full w-8 h-8 mr-2"></img>` +
    botObj.tag;
  aText.classList.add(
    "flex",
    "items-center",
    "content-center",
    "px-4",
    "py-2",
    "hover:bg-gray-100",
    "dark:hover:bg-gray-600",
    "dark:hover:text-white"
  );
  aText.href = "#";
  aText.addEventListener("click", () => {
    dropdown.hide();
    if (activeSocketId === botObj.socketId) return;
    console.log("Switiching to bot:", botObj.tag);
    activeSocketId = botObj.socketId;
    if (showSwitched)
      Swal.mixin({
        title: "Switched to " + botObj.tag,
        text: switchReason || "",
        toast: true,
        icon: "success",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      }).fire();
    if (!showSwitched) showSwitched = true;
    if (switchReason) switchReason = null;
    document.getElementById("bottag").innerText = botObj.tag;
    document.getElementById("botimg").src = botObj.avatarURL;
    document.getElementById("botImgSidebarIcon").src = botObj.avatarURL;
    document.getElementById("sidebarBotTagIcon").innerHTML = document
      .getElementById("sidebarBotTagIcon")
      .innerHTML.replace(/([a-zA-Z\]\[ ]{2,32}#[0-9]{4})|(N\/A)/gm, botObj.tag);
    if (!document.getElementById("botimg").classList.contains("border-2"))
      document.getElementById("botimg").classList.add("border-2");
    if (
      !document
        .getElementById("botImgSidebarIcon")
        .classList.contains("border-2")
    )
      document.getElementById("botImgSidebarIcon").classList.add("border-2");
  });
  liContainer.appendChild(aText);
  parentElement.appendChild(liContainer);
  askBotConfig(botObj.socketId);
  console.log("Added bot", botObj.tag);
}
function removeBot(botObj, parentElement) {
  console.log("Removing bot", botObj.tag, "from botChange dropdown");

  let botContainer = document.getElementById(`bot${botObj.id}`);
  if (botContainer) {
    parentElement.removeChild(botContainer);
    console.log("Removed bot", botObj.tag);
    if (botObj.socketId == activeSocketId) {
      console.log("Was active bot, checking for other bots");
      //get children of parentElement
      let children = [...parentElement.children];
      if (children.length > 0) {
        console.log("Found other bots, switching to first one");
        //get first child
        let firstChild = children[0];
        //simulate a click on the first child
        showSwitched = false;
        firstChild.children[0].click();
      }
    }
    return true;
  }
  console.log("Unable to remove bot", botObj.tag);
  return false;
}
function createCategory(text, id, imgLoc, iconSize, onClick) {
  const category = document.createElement("div");
  category.classList.add(
    "flex",
    "items-center",
    "content-center",
    "h-12",
    "w-auto",
    "pl-8",
    "hover:bg-zinc-800",
    "cursor-pointer"
  );
  category.id = "category" + id[0].toUpperCase() + id.slice(1);
  category.dataset.id = id;
  category.addEventListener("click", onClick);
  let img = document.createElement("img");
  if (document.getElementsByTagName("html")[0].classList.contains("dark"))
    imgLoc = imgLoc.replace(/(-black-)|(-white-)/g, "-white-");
  else imgLoc = imgLoc.replace(/(-black-)|(-white-)/g, "-black-");
  img.src = imgLoc;
  img.setAttribute("width", iconSize);
  img.setAttribute("height", iconSize);
  // svg.classList.add("fill-black", "dark:fill-white");
  let imgCopy = img.cloneNode(true);
  img.classList.add("relative");
  imgCopy.classList.add("absolute", "z-30", "right-3.5", "sidebarIcon");
  img.id = "category" + id[0].toUpperCase() + id.slice(1) + "Icon";
  imgCopy.id = id + "SidebarIcon";
  category.appendChild(img);
  let span = document.createElement("span");
  span.classList.add("relative", "left-3", "text-black", "dark:text-white");
  span.innerText = text;
  category.appendChild(span);
  category.appendChild(imgCopy);
  if (!categoryIds.includes(id)) categoryIds.push(id);
  return category;
}
function categoryClickHandler(category) {
  let id = category.target.dataset.id;
  if (!id) id = category.target.parentElement.dataset.id;
  if (!id) {
    console.error("Error: Unable to get category ID");
    return false;
  }
  location.href = "#" + id;
  checkActiveCategory();
}
function checkActiveCategory() {
  //if url has a hashtag
  if (location.hash) {
    //get the category id from the url
    let id = location.hash.slice(1);
    //get the category element
    if (categoryIds.includes(id)) {
      console.log("The active category is " + id);
      //TODO: Make the category tab active by highlighting it
      loadCategory(id);
      try {
        document.getElementById("currentCategory").innerText =
          "'" + id.toUpperCase() + "'";
      } catch (e) {}
    }
  } else {
    let newId = categoryIds[0];
    location.href = "#" + newId;
    checkActiveCategory();
    try {
      document.getElementById("currentCategory").innerText = "NONE";
    } catch (e) {}
  }
}
function loadCategory(id) {
  console.log("Loading category " + id);
  let iframe = document.getElementById("mainFrame");
  iframe.src = "./assets/" + id + ".html";
  iframe.onload = () => {
    console.log("Loaded category " + id);
    frameDocument = iframe.contentWindow.document;
  };
}
function askBotConfig(socketId) {
  console.log("Asking bot config for socketId " + socketId);
  socket.emit("askBotConfig", {
    socketId: socketId,
    iam: socket.id,
  });
}
checkDiscordCode();
document
  .getElementById("categories")
  .appendChild(
    createCategory(
      "Dashboard",
      "dashboard",
      "./assets/dashboard-black-96.png",
      iconSize,
      categoryClickHandler
    )
  );
document
  .getElementById("categories")
  .appendChild(
    createCategory(
      "Command Handler",
      "commands",
      "./assets/code-black-64.png",
      iconSize,
      categoryClickHandler
    )
  );
checkActiveCategory();
setup();
async function setup() {
  console.log("Setting up");
  let dashboardName = null;
  await fetch(location.origin + "/api/dashboard/name")
    .then((res) => res.json())
    .then((res) => {
      dashboardName = res.name;
    })
    .catch((err) => {
      console.error(err);
    });
  if (dashboardName) {
    document.getElementById("dashboardName").innerText = dashboardName;
  }
}

async function loginDiscord() {
  console.log("Logging in to discord");
  let uri = null;
  await fetch(location.origin + "/api/discord/getoauth")
    .then((res) => res.json())
    .then((a) => {
      a.uri = a.uri.replace("[REPLACE]", encodeURIComponent(location.origin));
      uri = a.uri;
    });
  if (uri) {
    location.href = uri;
  } else {
    console.error("Error: Unable to get discord login uri");
  }
}
function checkDiscordCode() {
  //
  let code = location.search.split("code=")[1];
  if (code) return getToken(code);
  console.log("No code found, checking if logged in");
  let loginCookie = getCookie("discordlogin");
  if (loginCookie) {
    console.log("Found login cookie, checking if active");
    checkValidLogin(JSON.parse(atob(loginCookie)));
  } else {
    console.log("No login cookie found, not logged in, asking for login");
    Swal.fire({
      title: `You're not logged in, do you want to log in?`,
      text: "Logging in enables more features.",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log("User confirmed login");
        loginDiscord();
      } else if (result.isDenied) {
        console.log("User denied login");
      }
    });
  }
}
function checkValidLogin(loginObj) {
  console.log("Checking if valid login");
  fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: loginObj.token_type + " " + loginObj.access_token,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.id) {
        console.log("Valid login found, Welcome " + res.username);
        userInfo = res;
      } else {
        console.log("Invalid login found");
        refreshLogin();
      }
    });
}
function logOut() {
  //remove the cookie
  document.cookie =
    "discordlogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //if there is a ?code=, remove it too
  if (location.search.split("code=")[1]) {
    location.href = location.origin;
  }
  connectedBots = [];
  userInfo = null;

  window.location.reload();
}
function refreshToken() {
  console.log("Refreshing discord token");
  //get discordlogin from cookies
  let discordlogin = getCookie("discordlogin");
  if (!discordlogin) {
    loginDiscord();
  } else {
    fetch(location.origin + "/api/discord/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discordlogin: JSON.parse(atob(discordlogin)),
      }),
    })
      .then((res) => res.json())
      .then((a) => {
        if (a.success) {
          console.log("Successfully refreshed discord token");
          setCookie("discordlogin", btoa(JSON.stringify(a.discordlogin)));
          window.location.reload();
        } else {
          console.error("Error: Unable to refresh discord token");
        }
      });
  }
}
function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue;
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function getToken(code) {
  console.log("Getting token for code " + code);
  let start = location.origin + "/";
  let url = start + "api/discord/gettoken";
  let data = {
    code: code,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Got token", data);
      if (data.access_token) {
        //encode it as base64 and store it in a cookie
        let token = btoa(JSON.stringify(data));
        setCookie("discordlogin", token);
        location.href = start;
      }
    });
}

socket.on("botConfig", function (data) {
  console.log("Received bot config", data);
  console.log("Checking if user is one of the bot owners");
  let isOwner = false;
  for (let i = 0; i < data.config.botOwners.length; i++) {
    if (data.config.botOwners[i] == userInfo.id) {
      isOwner = true;
    }
  }
  if (isOwner) {
    console.log("User is one of the bot owners");
  } else {
    console.log("User is not one of the bot owners");
  }
  connectedBots[data.iam].config = data.config;
  connectedBots[data.iam].isOwner = isOwner;
  console.log(
    "Config received for bot:",
    connectedBots[data.iam].tag,
    "Updated bot config"
  );
});
function hasPermissionToControl(connectedBot) {
  if (connectedBot.isOwner) return true;
}
