let viewingNav = false;
let splash;
let lastTime = 0;
let emitter = null;
const data = {
    skills: 'data/skills.json',
    projects: 'data/projects.json',
};
const xmlns = 'http://www.w3.org/2000/svg';

/**
 * Set the children's background color based on the css variable provided
 * @param {Element} parent
 * @param {String} colorVar
 */
function setChildrenBGColor(parent, colorVar) {
    for (let i = 0; i < parent.children.length; i++) {
        parent.children[i].style.backgroundColor = getComputedStyle(
            parent
        ).getPropertyValue(colorVar);
    }
}

window.onload = function (e) {
    splash = document.querySelector('#splash');
    setupNav();
    generateSplash();
    generateSkills();
    generateProjects();
};

function setupNav() {
    const burger = document.querySelector('.hamburger');
    const navWindow = document.querySelector('nav > div:nth-child(2)');

    //Hamburger menu hover style
    burger.onpointerover = function (e) {
        setChildrenBGColor(this, '--secondary-color');
    };
    burger.onpointerleave = function (e) {
        setChildrenBGColor(this, '--tertiary-color');
    };
    //Activate nav menu when clicked
    burger.onclick = (e) => {
        navWindow.style.left = '-20%';
        setTimeout(function () {
            viewingNav = true;
        }, 1000);
    };
    //Hide nav menu
    window.onclick = function (e) {
        if (viewingNav) {
            navWindow.style.left = '-100%';
            viewingNav = false;
        }
    };
}

/**
 * Generate the splash screen using PIXI
 */
async function generateSplash() {
    const res = await fetch('/data/emitter.json');
    const emitterSettings = await res.json();

    let app = new PIXI.Application({
        width: splash.clientWidth,
        height: splash.clientHeight,
        transparent: true,
    });

    // Adjust colors to match site theme
    const docStyle = getComputedStyle(document.documentElement);
    const rawColors = [
        docStyle.getPropertyValue('--primary-color').trim(),
        docStyle.getPropertyValue('--secondary-color').trim(),
        docStyle.getPropertyValue('--tertiary-color').trim(),
    ];
    emitterSettings.color = {
        list: rawColors.map((rawColor, i) => ({
            value: rawColor,
            time: i / (rawColors.length - 1),
        })),
    };

    // Create particle system for splash section
    emitter = new PIXI.particles.Emitter(
        app.stage,
        [PIXI.Texture.fromImage('/data/particle.png')],
        emitterSettings
    );
    // Fit to screen
    emitter.spawnPos = {
        x: splash.clientWidth / 2,
        y: splash.clientHeight / 2,
    };

    emitter.emit = true;

    splash.appendChild(app.view);

    // Particle Update
    requestAnimationFrame(animate);

    //Handle window resizing
    window.addEventListener('resize', function (e) {
        app.renderer.resize(splash.clientWidth, splash.clientHeight);
        emitter.spawnPos = {
            x: splash.clientWidth / 2,
            y: splash.clientHeight / 2,
        };
    });
}

function animate(timestamp) {
    let dt = 0;
    if (lastTime) {
        dt = timestamp - lastTime;
    }
    emitter.update(dt / 1000);

    lastTime = timestamp;
    requestAnimationFrame(animate);
}

/**
 * Generate the skills markup using the skill info from the data object
 */
function generateSkills() {
    //Get the json file
    let skillRequest = new XMLHttpRequest();
    skillRequest.onreadystatechange = function () {
        //If the request is done
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let skillInfo = JSON.parse(this.responseText);
            let skillHolder = document.querySelector(skillInfo.containerQuery);
            //Header h2
            skillHolder.innerHTML = `<h2>${skillInfo.header}</h2>`;
            //Generate each skill
            for (let skill of skillInfo.skills) {
                let div = document.createElement('div');
                div.className = skillInfo.skillClass;
                let h3 = document.createElement('h3');
                h3.innerText = skill.name;
                let mainIcon = document.createElement('i');
                mainIcon.className = parseIcon(skill.icons.main) + ' fa-4x';
                for (let i = 0; i < skill.icons.inline.length; i++) {
                    let icon = `<i class="${parseIcon(
                        skill.icons.inline[i]
                    )}"></i>`;
                    skill.description = skill.description.replace(
                        `{${i}}`,
                        icon
                    );
                }
                let description = document.createElement('p');
                description.innerHTML = skill.description;
                div.appendChild(h3);
                div.appendChild(mainIcon);
                div.appendChild(description);
                skillHolder.appendChild(div);
            }
        }
    };
    skillRequest.open('GET', data.skills);
    skillRequest.send();
}

/**
 * Generate the project markup using the data from the data object
 */
function generateProjects() {
    let pReq = new XMLHttpRequest();
    pReq.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            const projectInfo = JSON.parse(this.responseText);
            //Convert abbreviated icon classes to full ones
            for (let iconName in projectInfo.icon) {
                projectInfo.icon[iconName] = parseIcon(
                    projectInfo.icon[iconName]
                );
            }
            let container = document.querySelector(projectInfo.containerQuery);

            let toProjectSectionMarkup = (iconClass, iconName, items) => {
                return `<div>
                    <h3>${iconName} <i class="${iconClass} ${
                    projectInfo.iconSize
                }"></i></h3>
                    <div>
                        ${items.map((item) => `<p>${item}</p>`).join('')}
                    </div>
                </div>
                `;
            };

            projectInfo.iconSize = parseIconSize(projectInfo.iconSize);
            let header = `<h2>${projectInfo.header}</h2>`;
            let pDiv = '';
            for (let project of projectInfo.projects) {
                pDiv += `<div class="${projectInfo.class} ${
                    project.className
                } fade-in hidden">
                    <div>
                        <h3>${project.name}</h3>
                        <p>${project.platforms}</p>
                        <p>${project.description}</p>
                    </div>
                    ${Object.keys(projectInfo.icon)
                        .map((key) =>
                            toProjectSectionMarkup(
                                projectInfo.icon[key],
                                key[0].toUpperCase() + key.substring(1),
                                project[key]
                            )
                        )
                        .join('')}
                    ${
                        project.link.content != ''
                            ? `
                    <div class="learn-more">
                        <a href="${project.link.href}">${project.link.content}</a> 
                    </div>`
                            : ''
                    }                   
                </div>
                `;
            }
            let markup = header + pDiv;
            container.innerHTML = markup;
            setupAnimations(); // We set up animations after projects have loaded into the dom
        }
    };
    pReq.open('GET', data.projects);
    pReq.send();
}

/**
 * Sets up the animations that should occur when they are scrolled into view
 */
function setupAnimations() {
    let animatedElems = document.querySelectorAll('.fade-in');

    let scrollHandler = function (e) {
        for (let animatedElem of animatedElems) {
            if (animatedElem.className.includes('active')) continue;
            let rect = animatedElem.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                animatedElem.className = animatedElem.className.replace(
                    'hidden',
                    'active'
                );
            }
        }
    };
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', scrollHandler);
}

/**
 * Convert the abbrieviated icon class name to its full one
 * @param {String} input abbreviated class name in form of "t icon", where t is the type of icon and icon is the name of the icon, with no fa prefix
 * @return {String} full icon class name
 * @example let fullIcon = parseIcon("b html5");//fullIcon equals "fab fa-html5"
 */
function parseIcon(input) {
    input = 'fa' + input;
    input = input.replace(' ', ' fa-');
    return input;
}

/**
 * Convert the abbreivated icon class size to the full one
 * @param {String} input
 * @example let size = parseIconSize("4x"); //size equals "fa-4x"
 */
function parseIconSize(input) {
    return 'fa-' + input;
}
