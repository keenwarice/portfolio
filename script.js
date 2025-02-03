const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const starCount = 500;
const desktop = document.querySelector('.desktop');

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};


const createStars = () => {
    stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
    }));
};


const drawStars = (mouseX, mouseY) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';


    stars.forEach(star => {
        const perspective = canvas.width / star.z;
        const sx = (star.x - canvas.width / 2) * perspective + canvas.width / 2;
        const sy = (star.y - canvas.height / 2) * perspective + canvas.height / 2;
        const size = (1 - star.z / canvas.width) * 2;

  ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
    });
};


const updateStars = (mouseX, mouseY) => {
    stars.forEach(star => {
        star.z -= 2;


        if (star.z <= 0) {
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.z = canvas.width;
        }

  if (mouseX !== null && mouseY !== null) {
            star.x += (mouseX - canvas.width / 2) * 0.001;
            star.y += (mouseY - canvas.height / 2) * 0.001;
        }
    });
};


let mouseX = null, mouseY = null;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});


window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
});
resizeCanvas();
createStars();


const animate = () => {
    updateStars(mouseX, mouseY);
    drawStars(mouseX, mouseY);
    requestAnimationFrame(animate);
};


animate();


const windowsContainer = document.querySelector('.windows-container');
const taskbar = document.querySelector('.taskbar');



const createWindow = ({ content = "", url = null, icon = "🔲", title = "Window", x = 50, y = 50, width = 400, height = 300, center = false } = {}) => {
    const windowElement = document.createElement('div');
    if (center) {
        x = (window.innerWidth - width) / 2;
        y = (window.innerHeight - height) / 2;
    }
    windowElement.style.left = `${x}px`;
    windowElement.style.top = `${y}px`;
    windowElement.style.width = `${width}px`;
    windowElement.style.height = `${height}px`;
    const windowBar = document.createElement('div');
    const windowContent = document.createElement('div');
    windowElement.classList.add('window');
    windowBar.classList.add('window-bar');
    windowContent.classList.add('window-content');
    const buttons = document.createElement('div');
    buttons.classList.add('window-bar-buttons');
    const redButton = document.createElement('div');
    const yellowButton = document.createElement('div');
    const greenButton = document.createElement('div');
    redButton.classList.add('button', 'red');
    yellowButton.classList.add('button', 'yellow');
    greenButton.classList.add('button', 'green');
    buttons.appendChild(redButton);
    buttons.appendChild(yellowButton);
    buttons.appendChild(greenButton);
    const titleElement = document.createElement('span');
    titleElement.classList.add('window-title');
    titleElement.textContent = title;
    windowBar.appendChild(buttons);
    windowBar.appendChild(titleElement);
    windowElement.appendChild(windowBar);
    windowElement.appendChild(windowContent);
    if (url) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        windowContent.appendChild(iframe);
    } else {
        windowContent.innerHTML = content;
    }

    let isDragging = false;
    let offsetX, offsetY;
    const bringToFront = () => {
        const allWindows = document.querySelectorAll('.window');
        allWindows.forEach(win => win.style.zIndex = '');
        windowElement.style.zIndex = Date.now();
    };
    windowBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
        bringToFront();
    });
    windowElement.addEventListener('mousedown', bringToFront);
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        windowElement.style.left = `${e.clientX - offsetX}px`;
        windowElement.style.top = `${e.clientY - offsetY}px`;
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    greenButton.addEventListener('click', () => {
        if (windowElement.classList.contains('maximized')) {
            windowElement.style.width = `${width}px`;
            windowElement.style.height = `${height}px`;
            windowElement.style.left = `${x}px`;
            windowElement.style.top = `${y}px`;
        } else {
            windowElement.style.width = '100vw';
            windowElement.style.height = '100vh';
            windowElement.style.left = '0';
            windowElement.style.top = '0';
        }
        windowElement.classList.toggle('maximized');
    });
    yellowButton.addEventListener('click', () => {
        windowElement.style.display = 'none';
        const taskbarIcon = document.createElement('div');
        taskbarIcon.classList.add('taskbar-icon');
        taskbarIcon.textContent = icon;
        taskbarIcon.addEventListener('click', () => {
            windowElement.style.display = '';
            bringToFront();
            taskbar.removeChild(taskbarIcon);
        });
        taskbar.appendChild(taskbarIcon);
    });
    redButton.addEventListener('click', () => {
        windowsContainer.removeChild(windowElement);
    });
    windowElement.style.left = `${x}px`;
    windowElement.style.top = `${y}px`;
    windowElement.style.width = `${width}px`;
    windowElement.style.height = `${height}px`;
    windowsContainer.appendChild(windowElement);
};

const createDesktopApp = ({ icon, name, onOpen }) => {
    const app = document.createElement('div');
    app.classList.add('desktop-app');

    const appIcon = document.createElement('img');
    appIcon.src = icon;

    const appLabel = document.createElement('span');
    appLabel.textContent = name;

    app.appendChild(appIcon);
    app.appendChild(appLabel);

    app.addEventListener('dblclick', onOpen);
    desktop.appendChild(app);
};

createDesktopApp({
    icon: 'burger.png',
    name: 'RiceOS Lite',
    onOpen: () => {
        createWindow({
            content: `
    <style>
    /*
    body {
    background-image: url('wallpaper.png');
    }*/
      riceosContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 30vh;
        margin: 0;
        background-color: #f8f9fa;
        font-family: VT323;
      }

      .riceos {
        font-size: 50px;
        margin-bottom: 10px;
      }

      .riceos div {
        display: inline-block;
        margin-right: 5px;
      }

      .bar {
        margin: 0 auto;
        width: 575px;
        border-radius: 30px;
        border: 1px solid #dcdcdc;
      }

      .bar:hover,
      .bar:focus-within {
        box-shadow: 1px 1px 8px 1px #dcdcdc;
        outline: none;
      }

      .searchbar {
        height: 45px;
        border: none;
        border-radius: 30px;
        width: 500px;
        font-size: 16px;
        outline: none;
        padding-left: 20px;
      }

      .pfp {
        height: 20px;
        position: relative;
        top: 5px;
        left: 10px;
        transition: transform 0.5s;
      }

      .pfp:hover {
        transform: rotate(360deg);
      }

      .buttons {
        margin-top: 30px;
      }



      .button1:hover {
        border: 1px solid #c8c8c8;
        padding: 9px 19px;
        color: #808080;
      }

      .button1:focus {
        border: 1px solid #4885ed;
        padding: 9px 19px;
      }

      .blueText {
        color: #4285F4;
      }

      .redText {
        color: #EA4335;
      }

      .yellowText {
        color: #FBBC04;
      }

      .greenText {
        color: #34A853;
      }

      .purpleText {
        color: #A020F0;
      }
    </style>

<riceosContainer>
    <div class="riceos">
        <div class="blueText">R</div>
        <div class="redText">i</div>
        <div class="yellowText">c</div>
        <div class="blueText">e</div>
        <div class="greenText">O</div>
        <div class="redText">S</div>


    </div>

    <div class="bar">
        <input class="searchbar" type="text" title="Search" placeholder="Search or type a URL">
        <a href="https://keenwa.x10.mx">
            <img class="pfp" src="burger.png" title="RiceOS"></a>
    </div>

    <div class="buttons">
        <button class="button1" style="background-color: #f5f5f5;border: none;color: #707070;font-size: 15px;padding:10px 20px;margin: 5px;border-radius: 4px;outline: none;cursor: pointer;" type="button" onclick="performSearch()">RiceOS Search</button>
        <button class="button1" style="background-color: #f5f5f5;border: none;color: #707070;font-size: 15px;padding:10px 20px;margin: 5px;border-radius: 4px;outline: none;cursor: pointer;" type="button" onclick="redTextirectToYouTube()">I'm Feeling Lucky</button>
    </div>


</riceosContainer>

`,
            icon: "®️",// sorry lol could not find anything that looked like my icon
            title: "Portfolio",
            width: 750,
            height: 325,
            x:0,
            y:100
        });
        addTheEventListener();// there was no better way to do this...
    }
});

createDesktopApp({
    icon: 'notepad.png',
    name: 'notepad',
    onOpen: () => {
        createWindow({
            content: `
<style>
    textarea {
        width: 80%;
        height: 80%;
        border: none;
        padding: 20px;
        font-size: 18px;
        resize: none;
        background-color: transparent;
        outline: none;
        color: white;
    }
</style>
<textarea id="input" placeholder="type here!"></textarea>
`,
            icon: "📓",
            title: "notepad",
            width: 500,
            height: 500,
            x:100,
            y:100
        });
        notepadIsOpenedNow();
    }
});
createDesktopApp({
    icon: 'minecraft.png',
    name: 'Minecraft Java Edition (cracked)',
    onOpen: () => {
        createWindow({
            url: "eaglercraft",//this is only going to work on my website, where i have a local version of eaglercraft.
            icon: "®️",
            title: "Minecraft",
            width: 750,
            height: 325,
            x: 100,
            y: 100
        });
        createWindow({
            content: `
            <style>
                textarea {
                    width: 80%;
                    height: 80%;
                    border: none;
                    padding: 20px;
                    font-size: 18px;
                    resize: none;
                    background-color: transparent;
                    outline: none;
                    color: white;
                }
            </style>
            <textarea id="input" placeholder="type here!">tip: press the green circle to fullscreen! (you can close this with the red circle)</textarea>
            `,
            icon: "📓",
            title: "tip.txt",
            width: 500,
            height: 150,
            x: 100,
            y: 300
        });
    }
});


createWindow({ content: "<img src='https://keenwa.x10.mx/burger.png' alt='my pfp is supposed to be here, your browser is having a problem.'id='pfp'><h1 style='text-align:center;'>rice</h1><p style='text-align:center;'>Hi, I’m Rice, also known as Keen or KeenWa.</p><div id='button-container'><button id='rgbbtn' onclick='makeProjects();'>Projects</button><button id='rgbbtn' onclick='moreAboutMe();'>A little more about me</button></div><p style='text-align:center;'>psst- you dont need to just snoop around this window, there are things on the desktop too! (double click the apps)</p>", icon: "🍔", title: "the beginning", center:true, width: 500, height: 600 });

function makeProjects(){
    createWindow({ content: `<style>
    .profile-details {
        margin-left: 20px;
    }

    #projects {
        padding: 20px;
    }

    .project {
        background-color: #333;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 0 20px #333;
    }

    .project h3 {
        color: #19ff19;
    }

    .project p {
        color: #e0e0e0;
    }

    .btn {
        color: #19ff19;
        text-decoration: none;
        background-color: #333333;
        padding: 10px 20px;
        border: 1px solid #19ff19;
        border-radius: 5px;
        display: inline-block;
        margin-top: 10px;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    .btn:hover {
        color: #333333;
        background-color: #19ff19;
    }

    a {
        color: #7289da;
    }

    a:hover {
        color: #4f9eb0;
    }
</style>
    <section id="projects">
        <h2>Projects:</h2>
        <div class="project">
            <h3>Burgerify</h3>
            <p>A bookmarklet that makes <strong>everything</strong> about a page better!</p>
            <p>Drag the button below into your bookmarks bar, then click it whenever you visit a page!</p>
            <a href="javascript:(function(){var audio=new Audio('https://keenwa.x10.mx/nomnomnom.mp3');audio.play();var imgs=document.getElementsByTagName('img');for(var i=0;i<imgs.length;i++){imgs[i].src='https://keenwa.x10.mx/burger.png';imgs[i].setAttribute('draggable','false');}})();" class="btn styles-animation-text" draggable="true">Burgerify</a>
        </div>
        <div class="project">
        <h3>About:Blank Cloaker</h3>
            <p>A tool that can cloak most websites into an About:Blank tab.</p>
            <a href="aboutblankcloaker" class="btn" style="color:red;">Open</a>
        </div>
        <div class="project">
        <h3>PageFlood+</h3>
            <p>A history flooder that fills your history with different websites.</p>
            <a href="https://github.com/keenwarice/history-flooder" class="btn" style="color:blue;">Open with GitHub</a>
            <a href="pagefloodplus" class="btn" style="color:red;">Open directly</a>
        </div>
        <div class="project">
            <h3>Notif Emulator</h3>
            <p>Me experimenting with notifications on ChromeOS. Probably wont work on other platforms.</p>
            <a href="notifemulator" class="btn" style="color:red;">Open</a>
        </div>
        <div class="project">
            <h3>RiceBreakout</h3>
            <p>A work-in progress game to help me learn the canvas API. Inspired by <!-- (nuclearnatocat seems to have dissapeared online ;( ) <a href="https://nuclear-nc.x10.mx">-->NuclearNatoCat.<!--</a>--></p>
            <a href="breakout" class="btn" style="color:red;">Play Now!</a>
        </div>
        <div class="project">
            <h3>RiceOS Skiovox Edition</h3>
            <p>RiceOS for Skiovox, replacing the Skiovox helper, but with many RiceOS exclusive features removed.</p>
            <a href="https://github.com/keenwarice/riceskiovoxhelper" class="btn" style="color:blue;">Open with GitHub</a>
            <a href="riceskiovoxhelper" class="btn" style="color:red;">Open directly</a>
        </div>

        <p style="color:lightgreen;">More to come!</p>
    </section>
`, icon: "💻", title: "projects", x:"50", y:"50", width: 500, height: 600 });
}
function moreAboutMe(){
    createWindow({ content: "<center><h1>A little more about me</h1> <p>I'm a (mostly) full-stack developer, although I usually do front-end development.</p> <p>That means I know HTML, CSS, and Javascript (probably my best language).</p> <p>I'm not the best, but I also know bits of other languages, including:</p> <ul> <li><p>Python - The classic. My first language learned.</p></li> <li><p>Java - The language I leant second. I forgor most of it though.</p></li> <li><p>Bash - This is my most recent learned &quotlanguage&quot (idk if this is considered a language), but im pretty good at it because its easy.</p></li> <li><p>PHP - Stands for &quotHypertext Preprocessor&quot, I breifly used it, but I dont use it that much anymore. Probably my worst language. <!--i used &quot to not break the createwindow fucntion.--></p></li> </ul>", icon: "💬", title: "about me", x:"50", y:"50", width: 500, height: 400 });
    setTimeout(
        function(){
            createWindow({ content: `<p align="center">Contact me</p><div style="text-align:center;padding:3px;background-color: #36393e;"><img src="gmail.png" alt="gmail:" style="margin-left:1px;margin-right:1px;width:12px;display:inline-block;"><a href="mailto:keenwarice@gmail.com" style="color: #7289da;">keenwarice@gmail.com</a><p style="color:red;">PLEASE STOP EMAILING ME ABOUT INSECURLY! ITS PATCHED!</p><img src="discord.png" alt="discord:" style="margin-left:1px;margin-right:1px;width:12px;display:inline-block;"> keen_wa</div>`, icon: "💬", title: "contact me", x:"1300", y:"50", width: 400, height: 200 });
        }
    ,500)
}

// app functions (because i didnt know how i would make this work otherwise):
function addTheEventListener(){
document.querySelector('.searchbar').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});
}
function performSearch() {
    let inputValue = document.querySelector('.searchbar').value.trim();
    if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(inputValue)) {
        window.location=inputValue;
    } else {
        redTextirectToGoogle(inputValue);
    }
}


function redTextirectToGoogle(query) {
    window.location.href = 'https://google.com/search?q=' + query;
}

function redTextirectToYouTube() {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
}

function notepadIsOpenedNow(){
    const textarea = document.getElementById('input');
    const savedText = localStorage.getItem('userText');

    if (savedText) {
        textarea.value = savedText;
    }
    textarea.addEventListener('input', () => {
        localStorage.setItem('userText', textarea.value);
    });
}
