let gameStartBtn = document.querySelector("#gameStartBtn");//遊戲開始按鈕
let _ground = document.getElementById("_ground");
let gameStopAlert = $(".gameStopAlert");//遊戲結束時分數
let returnMenuBtn = document.querySelector("#returnMenuBtn");//返回主菜單按鈕
let countdown = document.querySelector("#countdown");//倒计时
let gameEnd;
let gameClose;
let Mask;// 存储mask遮罩
let Mouse;// 存储病毒
let score;//个数
let clock;//倒數
let gameTimer;
let clockTimer;
let currentMouse;//目前病毒數目
let timer;
let maxMouseCount;//病毒最大數目
let epidemic;
let coordinate = [];
let clonedNode;

function epidemicNull() {
    epidemic = document.querySelectorAll(".epidemic");
    var x, y;
    for (var i = 1; i <= epidemic.length; i++) {
        x = document.getElementById("epidemic" + i).offsetLeft;
        y = document.getElementById("epidemic" + i).offsetTop;
        coordinate.push({x: x, y: y})
    }
}

epidemicNull();

//隱藏按鈕
returnMenuBtn.style.display = "none";  //返回主菜单

// 1:触摸坐标
$("#game").click(function () {
    var e = event || window.event, hammer = $("#hammer");
    hammer.css({"left": (e.clientX - 40) + 'px', "top": (e.clientY - 35) + 'px'})
    hammer.show();
})
setInterval(function () {
    $("#hammer").hide()
}, 250);

//2.創建洞穴
function createMask() {
    let maskimg;
    for (let i = 0; i < coordinate.length; i++) {
        maskimg = document.getElementById("epidemic" + (i + 1));
        Mask[i] = maskimg;
        $("#epidemic" + (i + 1)).click(function () {
            disappear(i, true)
        })
    }
}

//3.創建病毒
function createMouse(i) {
    for (var j = 0; j < epidemic.length; j++) {
        document.querySelectorAll(".epidemic")[j].style.visibility = "hidden";
    }
    document.getElementById("epidemic" + (i + 1)).style.visibility = "visible";
    Mouse[i] = document.getElementById("epidemic" + (i + 1));//數組添加老鼠
    //每個病毒都有一個定時器
    timer = setTimeout(function () {
        disappear(i, false)
    }, 2000);
    document.getElementById("epidemic" + (i + 1)).timer = timer
}

//4.病毒出現
function genarateMouse() {
    currentMouse = Mouse.filter(function (item) {
        return item
    });
    let num = Math.floor(Math.random() * coordinate.length);//隨機產生一個ˊ洞穴位置
    if (currentMouse.length < maxMouseCount && Mouse[num] == null) {
        createMouse(num)
    }
}

//5.病毒消失=>1.病毒自動消失 2.病毒被敲打後消失
function disappear(index, isHit) {//isHit是否被敲打,布林直
    var indx = (index + 1) + "" + (index + 1), hammer = $("#hammer");
    if (Mouse[index] != null && Mouse[index] != "" && typeof Mouse[index] !== "undefined") {
        Mouse[index].style.visibility = "hidden";//病毒消失
        if (isHit) {//如果被敲打
            clearInterval(Mouse[index].timer);
            $("#epidemic" + (index + 1)).addClass("epidemic" + indx);
            $(".epidemic" + indx).css("visibility", "visible");
            hammer.addClass("hit");
            score += 1;
        } else hammer.removeClass("hit");
        setTimeout(function () {
            if (Mouse[index]) {
                Mask[index].style.visibility = "hidden";//從陣列中移除病毒
                $("#epidemic" + (index + 1)).removeClass("epidemic" + indx);
            }
            Mouse[index] = null
        }, 500)
    }
}

//7.遊戲開始
gameStartBtn.onclick = function () {
    init()
};

//8.退出游戏
function exitGame(type) {
    gameClose = true;
    $(".epidemic").css("visibility", "hidden");
    returnMenuBtn.style.display = "none";
    gameStartBtn.style.display = "block";
    gameStopAlert.empty().text(0);
    countdown.innerHTML = "30s";
    clearInterval(gameTimer);
    clearInterval(clockTimer);
    $(".game").empty();
    $(".tc-game").hide();
    if (type == 1) {
        $.initList();
        $('.tc-hide').hide();
    }
}

exitGame();

//9.回到主選單
returnMenuBtn.onclick = function () {
    init()
};

//初始化
function init() {
    gameEnd = false;
    Mask = [];// 儲存MASK
    Mouse = [];// 儲存病毒
    score = 0;
    clock = 30;
    gameTimer = null;
    maxMouseCount = 2;//一開始病毒出現不超過2個
    animation(score, clock)
}

/*动画*/
function animation() {
    clockTimer = setInterval(function () {
        clock -= 1;
    }, 1000);
    createMask();
    gameTimer = setInterval(function () {
        genarateMouse();
        gameStopAlert.empty().text(score);
        countdown.innerHTML = clock + "s";
        if (clock <= 0) {
            clearInterval(gameTimer);
            clearInterval(clockTimer);
            returnMenuBtn.style.display = "block";
            gameStartBtn.style.display = "none";
            gameStopAlert.empty().text(score);
            $("#epidemicNum").css("display", "flex");
            $.pop("#epidemicNum", ".m-popCon");
            $.clickOpenRed();
            $.disassembled();
        }
        // maxMouseCount = score / 5 + 1;// 每十只病毒，病毒最大上限增加一隻
    }, 50);
}

/*游戏出现*/
function gameStart(type) {
    $(".tc-game").show();
    clonedNode = _ground.cloneNode(true); // 克隆节点
    if (gameClose == true) {
        $(".game").append(clonedNode)
    }
    if (type == 1) $("#goGame").hide();
}