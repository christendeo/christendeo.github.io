var menuList = document.getElementById("menuList");
menuList.style.maxHeight = "0px";
function togglemenu() {
    if (menuList.style.maxHeight === "0px") {
        menuList.style.maxHeight = "130px";
    } else {
        menuList.style.maxHeight = "0px";
    }
}

var fullImgBox = document.getElementById("fullImgBox")
var fullImg = document.getElementById("fullImg")
function openFullImg(picture) {
    fullImgBox.style.display = "flex";
    fullImg.src = picture;
}

function closeFullImg() {
    fullImgBox.style.display = "none";
}