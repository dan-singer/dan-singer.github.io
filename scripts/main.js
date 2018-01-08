let viewingNav = false;
let splash;
const xmlns = "http://www.w3.org/2000/svg";

/**
 * Set the children's background color based on the css variable provided
 * @param {Element} parent 
 * @param {String} colorVar 
 */
function setChildrenBGColor(parent, colorVar){
    for (let i=0; i<parent.children.length; i++){
        parent.children[i].style.backgroundColor = getComputedStyle(parent).getPropertyValue(colorVar);
    }
}

window.onload = function(e){

    splash = document.querySelector("#splash");
    setupNav();
    generateSplash();
    generateSkills();

};


function setupNav(){
    const burger = document.querySelector(".hamburger");
    const navWindow = document.querySelector("nav > div:nth-child(2)");

    //Hamburger menu hover style
    burger.onpointerover = function(e){ setChildrenBGColor(this, "--tertiary-color");};
    burger.onpointerleave = function(e){ setChildrenBGColor(this, "--primary-color");};
    //Activate nav menu when clicked
    burger.onclick = (e)=>{
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
}


function generateSplash(){
    let app = new PIXI.Application({width: splash.clientWidth, height:splash.clientHeight, transparent:true});
    splash.appendChild(app.view);

    const CIRCLE_COUNT = 100;
    const SPEED = 50;
    let docStyle = getComputedStyle(document.documentElement);
    const rawColors = [docStyle.getPropertyValue("--primary-color"), docStyle.getPropertyValue("--secondary-color"), docStyle.getPropertyValue("--tertiary-color")];
    const hexColors = rawColors.map((color)=>{
        return color.replace("#", "0x");
    });
    let radiusRange = {min: 1, max: 5};

    for (let i=0; i<CIRCLE_COUNT; i++){
        let circle = new PIXI.Graphics();
        let color = hexColors[parseInt(Math.random() * hexColors.length)];
        circle.beginFill(color);
        circle.drawCircle(0, 0, radiusRange.min + Math.random() * (radiusRange.max - radiusRange.min));
        circle.position = {
            x: Math.random() * splash.clientWidth,
            y: Math.random() * splash.clientHeight
        };
        circle.endFill();
        circle.startY = circle.y;
        circle.seed = Math.random() * 1000;
        app.stage.addChild(circle);
    }

    app.ticker.add(function(){
        let timestamp = app.ticker.lastTime;
        let dt = 1 / app.ticker.FPS;
        for (let child of app.stage.children){
            child.x += SPEED * dt;
            child.y = child.startY + Math.sin(child.seed + timestamp / 1000) * SPEED/2;
            let r = child.width/2;
            if (child.x > app.renderer.width + r){
                child.x = -r;
            }
        }
    });

    //Handle window resizing
    window.addEventListener("resize", function(e){
        app.renderer.resize(splash.clientWidth, splash.clientHeight);
        for (let child of app.stage.children){
            child.position = {
                x: Math.random() * splash.clientWidth,
                y: Math.random() * splash.clientHeight
            };
        }
    });

    //Blur filter
    let blur = new PIXI.filters.BlurFilter(2);
    app.stage.filters = [blur];
}

/**
 * Generate the skills markup using the skills json file
 */
function generateSkills(){
    //Get the json file
    let skillRequest = new XMLHttpRequest();
    skillRequest.onreadystatechange = function(){


        //Convert the abbrieviated icon class name to its full one. 
        //For example, "b html5" ---> "fab fa-html5"
        let parseIcon = (input) => {
            input = "fa" + input;
            input = input.replace(" ", " fa-");
            return input;
        };

        //If the request is done
        if (this.readyState == XMLHttpRequest.DONE){
            let skillInfo = JSON.parse(this.responseText);
            let skillHolder = document.querySelector(skillInfo.containerQuery);
            //Header h2
            skillHolder.innerHTML = `<h2>${skillInfo.header}</h2>`;
            //Generate each skill
            for (let skill of skillInfo.skills){
                let div = document.createElement("div");
                div.className = skillInfo.skillClass;
                    let h3 = document.createElement("h3");
                    h3.innerText = skill.name;
                    let mainIcon = document.createElement("i");
                    mainIcon.className = parseIcon(skill.icons.main) + " fa-4x";
                    for (let i=0; i<skill.icons.inline.length; i++)
                    {
                        let icon = `<i class="${parseIcon(skill.icons.inline[i])}"></i>`;
                        skill.description = skill.description.replace(`{${i}}`, icon);
                    }
                    let description = document.createElement("p");
                    description.innerHTML = skill.description;
                    div.appendChild(h3); div.appendChild(mainIcon); div.appendChild(description);
                skillHolder.appendChild(div);
                    
            }
        }
    }
    skillRequest.open('GET', "docs/skills.json");
    skillRequest.send();
}

function chartTest(){
    let width = 300, height = 300;

    let x = d3.scaleBand().range([0, width], .1);
    let y = d3.scaleLinear().range([height, 0]);

    let chart = d3.select(".chart")
                .attr("width", width)
                .attr("height", height);
    
    d3.tsv("data.tsv", d=>{d.value = +d.value; return d;}, function(error, data){
        x.domain(data.map(d=>d.name));
        y.domain([0, d3.max(data, d=>d.value)]);
        let bars = chart.selectAll("g")
                    .data(data)
                    .enter().append("g")
                        .attr("transform", (d,i)=>`translate(${x(d.name)}, 0)`);
        bars.append("rect")
            .attr("y", d=>y(d.value))
            .attr("height", d=>height-y(d.value))
            .attr("width", x.range());
        bars.append("text")
            .attr("x", x.range()/2)
            .attr("y", d=>y(d.value)+3)
            .attr("dy", ".75em")
            .text(d=>d.value);
    });


}

/**
 * __DEPRECATED
 * Generates an SVG particle effect for the splash screen
 */
function __generateSplashSVG(){
    //Create splash animation
    const CIRCLE_COUNT = 100;
    const SPEED = 1;
    const colors = [getComputedStyle(document.documentElement).getPropertyValue("--primary-color"), getComputedStyle(document.documentElement).getPropertyValue("--secondary-color"), getComputedStyle(document.documentElement).getPropertyValue("--tertiary-color")];
    let radiusRange = {min: 1, max: 5};
    for (let i=0; i<CIRCLE_COUNT; i++){
        let circle = document.createElementNS(xmlns, "circle");
        circle.setAttribute("cx", Math.random() * splash.clientWidth);
        circle.setAttribute("cy", Math.random() * splash.clientHeight);
        circle.setAttribute("r", radiusRange.min + Math.random() * (radiusRange.max - radiusRange.min));
        circle.startY = parseFloat(circle.getAttribute("cy"));
        circle.seed = Math.random() * 1000;
        let color = colors[parseInt(Math.random() * colors.length)];
        circle.style.fill = color;
        circle.style.transition = "fill 1s";    

        splash.appendChild(circle);
    }
    requestAnimationFrame(step);
    
    /**
     * Called each animation frame to animate the svg circles
     * @param {Number} timestamp 
     */
    function step(timestamp){
        for (let i=0; i<splash.children.length; i++){
            let child = splash.children[i];
            child.setAttribute("cx", parseFloat(child.getAttribute("cx")) + SPEED);
            let yOff = Math.sin(child.seed + timestamp / 1000) * 50;
            child.setAttribute("cy", child.startY + yOff);
            if (child.getAttribute("cx") > splash.clientWidth + parseFloat(child.getAttribute("r"))){
                child.setAttribute("cx",  -child.getAttribute("r"));
            }
        }
        requestAnimationFrame(step);
    }   

    //Handle window resizing
    window.addEventListener("resize", function(e){
        for (let i=0; i<splash.children.length; i++){
            let child = splash.children[i];
            child.setAttribute("cx", Math.random() * splash.clientWidth);
            child.setAttribute("cy", Math.random() * splash.clientWidth);
        }
    });
}
