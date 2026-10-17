// Made for Terra! (https://terra.hackclub.com/)

// VARIABLES //

const maxTrashSize = 12
const minTrashSize = 6
const maxTrashImgSize = 70
const minTrashImgSize = 40
let KKoutOf = 20 //1 out of KKoutOf (ex. 1 out of 10 [10%])
let trashAmount = 5

let cps = 0
const trashPool = ["waterBottle", "sodaCan", "paper2", "paper1", "banana", "bag", "badApple", "scroll"]
const shopItems = {
  "moreTrash": {"title": "Increased Trash Spawn", "desc": "Spawns one more piece of trash!", "price": 5, "onBuy": () => {trashAmount += 1; spawnTrash()}, "limit": 20},
  "moreKK": {"title": "More Knickknacks", "desc": "Increases the chance of knickknacks spawning!", "price": 10, "onBuy": () => {KKoutOf -= 1}, "limit": 5},
  "autoMoney": {"title": "Automatic Money", "desc": "Gives you $1 every 5 seconds!", "price": 25, "onBuy": () => {cps++}, "limit": 5},
  "empty": {"title": "n/a", "desc": "n/a", "price": 0, "onBuy": () => {console.log("no! line18")}, "limit": 1},
  "empty2": {"title": "n/a", "desc": "n/a", "price": 0, "onBuy": () => {console.log("no! line19")}, "limit": 1},
  "empty3": {"title": "n/a", "desc": "n/a", "price": 0, "onBuy": () => {console.log("no! line20")}, "limit": 1},
  "empty4": {"title": "n/a", "desc": "n/a", "price": 0, "onBuy": () => {console.log("no! line21")}, "limit": 1},
}
let currency = 0

function updateCurrency() {
  document.getElementById("currency").textContent = "$" + currency
}
const mouse = {};
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})
const trashContainer = document.getElementById("trashContainer").getBoundingClientRect()
function inBin(movedElement) {
  const bin = document.getElementById("bin").getBoundingClientRect()
  const elementBB = movedElement.getBoundingClientRect()
  if (
    elementBB.x + elementBB.width >= bin.x &&
    elementBB.x <= bin.x + bin.width &&
    elementBB.y + elementBB.height >= bin.y &&
    elementBB.y <= bin.y + bin.height
  ) {
    movedElement.remove()
    currency++
    updateCurrency()
    spawnTrash()
    new Audio("assets/snd/bin/crumple" + (Math.floor(Math.random() * 6) + 1) + ".mp3").play()
  }
}
function moveTrash(toMove) {
  const element = toMove.getBoundingClientRect()
  //find center points
  const disX = element.x + element.width / 2 - mouse.x
  const disY = element.y + element.height / 2 - mouse.y
  const length = Math.sqrt(disX * disX + disY * disY)
  let moveX = (disX / length) *200
  let moveY = (disY / length) * 200
  moveX = Math.max(trashContainer.left, Math.min(element.left + moveX, trashContainer.right - element.width)) - element.left
  moveY = Math.max(trashContainer.top, Math.min(element.top + moveY, trashContainer.bottom - element.height)) - element.top
  if (toMove.totalX || toMove.totalY) {
    toMove.totalX = toMove.totalX + moveX
    toMove.totalY = toMove.totalY + moveY
  } else {
    toMove.totalX = moveX
    toMove.totalY = moveY
  }
  new Audio("assets/snd/trash/sweep" + (Math.floor(Math.random() * 6) + 1) + ".mp3").play()
  toMove.style.transform = "translate(" + toMove.totalX + "px, " + toMove.totalY + "px)"
  inBin(toMove)
  checkAgain = setTimeout(() => inBin(toMove), 200);
}
function spawnCheck(toCheck, cHeight) {
  const bin = document.getElementById("bin").getBoundingClientRect()
  const elementBB = toCheck.getBoundingClientRect()
  if (
    elementBB.x + elementBB.width >= bin.x &&
    elementBB.x <= bin.x + bin.width &&
    elementBB.y + elementBB.height >= bin.y &&
    elementBB.y <= bin.y + bin.height
  ) {
    toCheck.style.left = Math.floor(Math.random() * (100 - parseFloat(toCheck.style.width))) + "%"
    toCheck.style.top = Math.floor(Math.random() * (100 - cHeight)) + "%"
    return false
  } else {
    toCheck.style.visibility = "visible"
    return true
  }
}

let kkOwned = []
const knickknacks = {
  "Nickel": {"desc": "It could be a rare one....", "rarity": "Common", "file": "nickel"},
  "String": {"desc": "Useful for when you need to trip people over... IF you need to trip people over", "rarity": "Common", "file": "string"},
  "Staple": {"desc": "Didn't they make a store about this guy?", "rarity": "Common", "file": "staple"},
  "Old Boot": {"desc": "I swear it's still good!", "rarity": "Common", "file": "oldBoot"},
  "Empty Can": {"desc": "Worth at least one empty can!", "rarity": "Common", "file": "emptyCan"},
  "Stapler": {"desc": "Staple's big sister", "rarity": "Uncommon", "file": "stapler"},
  "Bone": {"desc": "ethically sourced.. trust me", "rarity": "Uncommon", "file": "bone"},
}
const normalPool = ["Nickel", "String", "Staple", "Old Boot", "Empty Can", "rare"]
const rarePool = ["Stapler", "Bone"]

function spawnTrash() {
  const clonedTrash = document.getElementById("templateTrash").cloneNode(true)
  const trashImg = clonedTrash.querySelector(".trashImg")
  //scale trash hitbox
  clonedTrash.style.width = Math.floor(Math.random() * (maxTrashSize - minTrashSize)) + minTrashSize + "vw"
  clonedTrash.style.visibility = "hidden"
  //rotate & scale inner trash image
  trashImg.style.transform = "rotate(" + Math.floor(Math.random() * 361) + "deg)"
  trashImg.style.width = Math.floor(Math.random() * (maxTrashImgSize - minTrashImgSize)) + minTrashImgSize + "%"
  trashImg.style.height = trashImg.style.width
  trashImg.src = "assets/img/trash/" + trashPool[Math.floor(Math.random() * trashPool.length)] + ".png"
  if (Math.floor(Math.random() * KKoutOf) + 1 == 1) {
    let type = normalPool[Math.floor(Math.random() * normalPool.length)]
    if (type == "rare") {
      type = rarePool[Math.floor(Math.random() * rarePool.length)]
    }
    trashImg.src = "assets/img/knickknacks/" + knickknacks[type].file + ".png"
    clonedTrash.querySelector(".glow").style.visibility = "visible"
    clonedTrash.onclick = () => KKclick(type, clonedTrash)
    clonedTrash.style.width = parseFloat(clonedTrash.style.width) / 2 + "vw"
  }
  clonedTrash.style.height = clonedTrash.style.width
  const convertedHeight = (parseFloat(clonedTrash.style.width) / 100 * innerWidth) / trashContainer.height * 100
  clonedTrash.style.left = Math.floor(Math.random() * (100 - parseFloat(clonedTrash.style.width))) + "%"
  clonedTrash.style.top = Math.floor(Math.random() * (100 - convertedHeight)) + "%"
  document.getElementById("trashContainer").appendChild(clonedTrash)
  let isCheckDone = false
  while (isCheckDone == false) {
    isCheckDone = spawnCheck(clonedTrash, convertedHeight)
  }
}
for (let i = 0; i < trashAmount; i++) {
  spawnTrash()
}
shineQueue = []
let removeShine
const shine = document.getElementById("shine")
function shinePopup() {
  const KKtype = shineQueue[0]
  shine.style.transform = "scale(100%)"
  new Audio("assets/snd/collect.mp3").play()
  shine.querySelector("#KKText").textContent = KKtype
  shine.querySelector("#KKdescription").textContent = knickknacks[KKtype].desc
  shine.querySelector("#KKImg").src = "assets/img/knickknacks/" + knickknacks[KKtype].file + ".png"
  removeShine = setTimeout(function () {
    shine.style.transform = "scale(0%)"
    shineQueue.shift()
    if (shineQueue.length > 0) {
      removeShine = setTimeout(shinePopup, 2000);
    }
  }, 3500);
}
function KKclick(KKtype, toRemove) {
  toRemove.remove()
  spawnTrash()
  currency += 2
  updateCurrency()
  if (!kkOwned.includes(KKtype)) {
    document.getElementById(KKtype).querySelector("img").style.visibility = ""
    document.getElementById(KKtype).querySelector(".collectionLocked").remove()
    kkOwned.push(KKtype)
    shineQueue.push(KKtype)
    if (shineQueue.length == 1) {
      shinePopup()
    }
  }
}
let shineImgRotation = 0
const shineImgRotate = setInterval(function () {
  shineImgRotation++;
  shine.querySelector("#shineImg").style.transform = "rotate(" + shineImgRotation + "deg)"
}, 20);

function makeHover(shopItem) {
  const clone = document.getElementById("hoverTemplate").cloneNode(true)
  clone.id = shopItem + "Hover"
  clone.querySelector("#price").textContent = "$" + shopItems[shopItem].price
  clone.querySelector("#title").textContent = shopItems[shopItem].title
  clone.querySelector("#desc").textContent = shopItems[shopItem].desc
  clone.querySelector("#amountLeft").textContent = shopItems[shopItem].limit + " left"
  clone.style.top = (12 * Number(Object.keys(shopItems).indexOf(shopItem) + 1)) + "%"
  clone.style.visibility = "visible"
  document.body.appendChild(clone)
}
function buy(item) {
  if (currency >= shopItems[item].price) {
    if (shopItems[item].limit != 0) {
      currency -= shopItems[item].price
      updateCurrency()
      shopItems[item].price = Math.round(shopItems[item].price * 1.15)
      if (shopItems[item].limit) {
        shopItems[item].limit -= 1
      }
    }
    if (shopItems[item].limit == 0) {
      document.getElementById(item).querySelector(".soldSticker").style.visibility = "visible"
      document.getElementById(item).onclick = () => new Audio("assets/snd/fail.mp3").play()
    }
    document.getElementById(item).querySelector("#price").textContent = "$"+shopItems[item].price
    shopItems[item].onBuy()
    if (document.getElementById(item + "Hover")) {
      const hover = document.getElementById(item + "Hover")
      hover.querySelector("#price").textContent = "$" + shopItems[item].price
      hover.querySelector("#amountLeft").textContent = shopItems[item].limit + " left"
    }
  }
}
for (const key of Object.keys(shopItems)) {
  const clone = document.getElementById("shopTemplate").cloneNode(true)
  clone.id = key
  clone.style.visibility = "visible"
  clone.onmouseenter = () => makeHover(key)
  clone.onmouseleave = () => { if (document.getElementById(key + "Hover")) { document.getElementById(key + "Hover").remove() } }
  clone.onclick = () => buy(key)
  clone.querySelector("#desc").textContent = shopItems[key].desc
  clone.querySelector("#title").textContent = shopItems[key].title
  clone.querySelector("#price").textContent = "$"+shopItems[key].price
  document.getElementById("shopContainer").appendChild(clone)
}
for (const key of Object.keys(knickknacks)) {
  const clone = document.getElementById("collectionTemplate").cloneNode(true)
  clone.id = key
  clone.style.visibility = ""
  clone.querySelector("img").src = "assets/img/knickknacks/" + knickknacks[key].file + ".png"
  document.getElementById("collectionHolder").appendChild(clone)
}
const giveMoney = setInterval(function () {
  currency += cps
  updateCurrency()
}, 5000);
