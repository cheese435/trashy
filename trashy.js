// Made for Terra! (https://terra.hackclub.com/)
//
// VARIABLES //
//
const maxTrashSize = 12
const minTrashSize = 6
const maxTrashImgSize = 70
const minTrashImgSize = 40
const KKoutOf = 10 //1 out of KKoutOf (ex. 1 out of 10 [10%])
const trashAmount = 5

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
    spawnTrash()
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
  toMove.style.transform = "translate(" + toMove.totalX + "px, " + toMove.totalY + "px)"
  inBin(toMove)
}
let kkOwned = []
const KKPool = ["nickle", "string", "staple"]
function spawnTrash() {
  const clonedTrash = document.getElementById("templateTrash").cloneNode(true)
  const trashImg = clonedTrash.querySelector(".trashImg")
  //scale trash hitbox
  clonedTrash.style.width = Math.floor(Math.random() * (maxTrashSize - minTrashSize)) + minTrashSize + "vw"
  clonedTrash.style.visibility = "visible"
  //rotate & scale inner trash image
  trashImg.style.transform = "rotate(" + Math.floor(Math.random() * 361) + "deg)"
  trashImg.style.width = Math.floor(Math.random() * (maxTrashImgSize - minTrashImgSize)) + minTrashImgSize + "%"
  trashImg.style.height = trashImg.style.width
  if (Math.floor(Math.random() * KKoutOf) + 1 == 1) {
    clonedTrash.onclick = () => KKclick(KKPool[Math.floor(Math.random() * KKPool.length)], clonedTrash)
    clonedTrash.style.width = parseFloat(clonedTrash.style.width) / 2 + "vw"
  }
  clonedTrash.style.height = clonedTrash.style.width
  const convertedHeight = (parseFloat(clonedTrash.style.width) / 100 * innerWidth) / trashContainer.height * 100
  clonedTrash.style.left = Math.floor(Math.random() * (100 - parseFloat(clonedTrash.style.width))) + "%"
  clonedTrash.style.top = Math.floor(Math.random() * (100 - convertedHeight)) + "%"
  document.getElementById("trashContainer").appendChild(clonedTrash)
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
