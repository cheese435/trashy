// Made for Terra! (https://terra.hackclub.com/)

// VARIABLES //

const maxTrashSize = 12
const minTrashSize = 6
const maxTrashImgSize = 70
const minTrashImgSize = 40
let KKoutOf = 20 //1 out of KKoutOf (ex. 1 out of 10 [10%])
let trashAmount = 5


const trashPool = ["waterBottle", "sodaCan", "paper2", "paper1", "banana"]
const shopItems = {
  "moreTrash": {"title": "Increased Trash Spawn", "desc": "Spawns one more piece of trash!", "price": 20, "onBuy": () => {trashAmount += 1; spawnTrash()}, "limit": 20},
  "moreKK": {"title": "More Knickknacks", "desc": "Increases the chance of knickknacks spawning!", "price": 50, "onBuy": () => {KKoutOf -= 1}, "limit": 5},
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
  console.log("moving " + toMove)
  const element = toMove.getBoundingClientRect()
  //find center points
  const disX = element.x + element.width / 2 - mouse.x
  const disY = element.y + element.height / 2 - mouse.y
  const length = Math.sqrt(disX * disX + disY * disY)
  console.log("length " + length)
  let moveX = (disX / length) *200
  let moveY = (disY / length) * 200
  moveX = Math.max(trashContainer.left, Math.min(element.left + moveX, trashContainer.right - element.width)) - element.left
  moveY = Math.max(trashContainer.top, Math.min(element.top + moveY, trashContainer.bottom - element.height)) - element.top
  console.log("mathing")
  console.log(moveX)
  console.log(moveY)
  if (toMove.totalX || toMove.totalY) {
    toMove.totalX = toMove.totalX + moveX
    toMove.totalY = toMove.totalY + moveY
  } else {
    toMove.totalX = moveX
    toMove.totalY = moveY
  }
  console.log(toMove)
  new Audio("assets/snd/trash/sweep" + (Math.floor(Math.random() * 6) + 1) + ".mp3").play()
  toMove.style.transform = "translate(" + toMove.totalX + "px, " + toMove.totalY + "px)"
  console.log(toMove.style.transform)
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
const normalPool = ["Nickel", "String", "Staple", "Old Boot", "Empty Can", "rare"]
const rarePool = ["Stapler"]
const KKInfo = {
  "Nickel": "It could be a rare one....",
  "String": "Useful for when you need to trip people over... IF you need to trip people over",
  "Staple": "Didn't they make a store about this guy?",
  "Old Boot": "I swear it's still good!",
  "Empty Can": "Worth at least one empty can!",
  "Stapler": "Staple's big sister",
}
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
  shine.querySelector("#KKText").textContent = KKtype
  shine.querySelector("#KKdescription").textContent = KKInfo[KKtype]
  shine.querySelector("#KKImg").src = "assets/img/KK/" + KKtype + ".png"
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
  currency += 2
  updateCurrency()
  if (!kkOwned.includes(KKtype)) {
    kkOwned.push(KKtype)
    shineQueue.push(KKtype)
    toRemove.remove()
    spawnTrash()
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

function buy(item) {
  if (currency >= shopItems[item].price) {
    if (shopItems[item].limit != 0) {
      currency -= shopItems[item].price
      updateCurrency()
      shopItems[item].price = Math.floor(shopItems[item].price * 1.15)
      if (shopItems[item].limit) {
        shopItems[item].limit -= 1
        document.getElementById(item).querySelector("#amountLeft").textContent = shopItems[item].limit
      }
    }
    if (shopItems[item].limit == 0) {
      document.getElementById(item).querySelector(".soldSticker").style.visibility = "visible"
      document.getElementById(item).onclick = () => new Audio("assets/snd/fail.mp3").play()
    }
    shopItems[item].onBuy()
  }
}
for (const key of Object.keys(shopItems)) {
  const clone = document.getElementById("shopTemplate").cloneNode(true)
  clone.id = key
  clone.style.visibility = "visible"
  clone.onclick = () => buy(key)
  clone.querySelector("#desc").textContent = shopItems[key].desc
  clone.querySelector("#title").textContent = shopItems[key].title
  clone.querySelector("#amountLeft").textContent = shopItems[key].limit
  document.getElementById("shopContainer").appendChild(clone)
}
