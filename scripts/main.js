let viewingNav = false;
window.onload = function(e){
    const burger = document.querySelector(".hamburger");
    const navWindow = document.querySelector("nav > div:nth-child(2)");

    burger.onpointerover = function(e){ setChildrenBGColor(this, "--tertiary-color");};
    burger.onpointerleave = function(e){ setChildrenBGColor(this, "--white");};
    burger.onclick = (e)=>{
        navWindow.style.left = "-20%";
        setTimeout(function(){ viewingNav = true; }, 1000);

    };

    document.onclick = function(e){
        if (viewingNav){
            navWindow.style.left = "-100%";
            viewingNav = false;
        }
    };

    document.querySelector("#circle-intro").style.width = "0";
};

function setChildrenBGColor(parent, colorVar){
    for (let child of parent.children){
        child.style.backgroundColor = getComputedStyle(parent).getPropertyValue(colorVar);
    }
}