let viewingNav = false;
const xmlns = "http://www.w3.org/2000/svg"
window.onload = function(e){
    const burger = document.querySelector(".hamburger");
    const navWindow = document.querySelector("nav > div:nth-child(2)");

    //Hamburger menu hover style
    burger.onpointerover = function(e){ setChildrenBGColor(this, "--tertiary-color");};
    burger.onpointerleave = function(e){ setChildrenBGColor(this, "--white");};
    //Activate nav menu when clicked
    burger.onclick = (e)=>{
        console.log("Burger");
        navWindow.style.left = "-20%";
        setTimeout(function(){ viewingNav = true; }, 1000);

    };
    //Hide nav menu 
    document.onclick = function(e){
        if (viewingNav){
            navWindow.style.left = "-100%";
            viewingNav = false;
        }
    };

    generateSplashSVG();
};

/**
 * Set the children's background color based on the css variable provided
 * @param {Element} parent 
 * @param {String} colorVar 
 */
function setChildrenBGColor(parent, colorVar){
    for (let child of parent.children){
        child.style.backgroundColor = getComputedStyle(parent).getPropertyValue(colorVar);
    }
}

/**
 * Generates an SVG particle effect for the splash screen
 */
function generateSplashSVG(){
        //Create splash animation
        let splash = document.querySelector("#splash-board");
        let size = {x:splash.clientWidth, y:splash.clientHeight};
        const CIRCLE_COUNT = 100;
        const SPEED = 1;
        let colors = [getComputedStyle(document.documentElement).getPropertyValue("--white"), getComputedStyle(document.documentElement).getPropertyValue("--secondary-color"), getComputedStyle(document.documentElement).getPropertyValue("--tertiary-color")];
        console.log(colors);
        let radiusRange = {min: 1, max: 5};
        for (let i=0; i<CIRCLE_COUNT; i++){
            let circle = document.createElementNS(xmlns, "circle");
            circle.setAttribute("cx", Math.random() * size.x);
            circle.setAttribute("cy", Math.random() * size.y);
            circle.setAttribute("r", radiusRange.min + Math.random() * (radiusRange.max - radiusRange.min));
            circle.startY = parseFloat(circle.getAttribute("cy"));
            circle.startTime = Math.random() * 1000;
            let color = colors[parseInt(Math.random() * colors.length)];
            circle.style.fill = color;
            circle.style.transition = "fill 1s";    
    
            splash.appendChild(circle);
        }
        requestAnimationFrame(step);
        
        
        function step(timestamp){
            for (let child of splash.children){
                child.setAttribute("cx", parseFloat(child.getAttribute("cx")) + SPEED);
                let yOff = Math.sin(child.startTime + timestamp / 1000) * 50;
                child.setAttribute("cy", child.startY + yOff);
                if (child.getAttribute("cx") > size.x + parseFloat(child.getAttribute("r"))){
                    child.setAttribute("cx",  -child.getAttribute("r"));
                }
            }
            requestAnimationFrame(step);
        }
    
}