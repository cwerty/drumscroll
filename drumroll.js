//変数定義
let getDrumroll = document.getElementById("drumroll");
let getUl = getDrumroll.getElementsByTagName("ul")[0];
let getList = getUl.getElementsByTagName("li");
let itemMax = 48;
let itemMin = 35;
let itemStart = 37;
let listNum = itemMax - itemMin;
let itemStartID;
let touchStartY;
let touchMoveY;
let drumrollTop = getDrumroll.offsetTop;
let showAreaTop = document.getElementById("selectBox").offsetTop;
let showAreaHeight = document.getElementById("selectBox").offsetHeight;
let nowY = 0;
let listAreaTop;
let itemNow;
let itemIndex;
let listArray;
let indexID;
let clipIndex;
let tranY;

window.addEventListener("load", createList);
getDrumroll.addEventListener("touchstart", handleStart, { passive: false });
getDrumroll.addEventListener("touchmove", handleMove, { passive: false });
getDrumroll.addEventListener("touchend", handleEnd, { passive: false });

//最小値と最大値に合わせてリストを生成する
function createList() {
    listArray = [];
    let iMax = itemMax;
    for (i = 0; i <= listNum; i++) {
        listArray[i] = iMax--;
        let element = document.createElement("li");
        element.innerHTML = "<span>" + listArray[i] + "</span>";
        getUl.appendChild(element);
    }
    //デフォルト位置を決める
    itemStartID = itemMax - itemStart;
    itemNow = itemStart;
    let itemStartPosition = showAreaHeight * itemStartID;
    nowY = showAreaTop - itemStartPosition;
    listAreaTop = getList[1].offsetTop;

    getUl.style.transform = "translateY(" + nowY + "px)";
    document.getElementById("result").textContent = itemNow;

    rollAnimate();
}

//画面タッチ、移動をドラムロールのように制御する

function handleStart(event) {
    event.preventDefault();
    touchStartY = event.touches[0].pageY;
    console.log(touchStartY);
    getUl.style.transition = "";
    let style = getUl.style.transform;
    let styleY = style.replace(/[^-^0-9^\.]/g, "");
    tranY = Number(styleY);
}

function handleMove(event) {
    event.preventDefault();
    touchMoveY = event.changedTouches[0].pageY;
    console.log(event.changedTouches[0].pageY);
    let touchScroll = touchMoveY - touchStartY;
    nowY = tranY + touchScroll;

    //範囲制限
    let top = -(getList[0].offsetTop - showAreaTop);
    let bottom = -(getList[listNum].offsetTop - showAreaTop);

    if (nowY > top + showAreaHeight) {
        nowY = top + showAreaHeight;
    } else if (nowY < bottom - showAreaHeight) {
        nowY = bottom - showAreaHeight;
    }

    getUl.style.transform = "translateY(" + nowY + "px)";
    itemIndex = Math.round((nowY - showAreaTop) / listAreaTop);

    clipIndex = itemIndex;
    if (clipIndex > 0) {
        clipIndex = 0;
    } else if (clipIndex < -listNum) {
        itemIndex = -listNum;
        clipIndex = itemIndex;
    }

    itemNow = itemMax + clipIndex;

    document.getElementById("result").textContent = itemNow;

    rollAnimate();
}

function handleEnd(event) {
    itemCilp();
}
//アニメーション

function rollAnimate() {
    if (clipIndex === undefined) {
        clipIndex = itemStartID;
    }
    indexID = Math.abs(clipIndex);

    let Now = getList[indexID];

    Now.classList.add("now");

    for (i = 0; i <= listNum; i++) {
        (function(i) {
            if (i === indexID) {
                getList[i].classList.add("now");
            } else {
                getList[i].classList.remove("now");
            }
        })(i);
    }
}

//クリップ機能
function itemCilp() {
    let clipY = -Math.abs(listAreaTop * clipIndex) + showAreaTop;
    getUl.style.transform = "translateY(" + clipY + "px)";
    getUl.style.transition = "all 0.3s";
}