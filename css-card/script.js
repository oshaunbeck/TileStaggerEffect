let countText = document.getElementsByClassName('counter-text')[0];

const header = anime.timeline({
    targets: '.counter-text',
    easing: 'easeOutExpo',
  })
    .add({opacity: [1, 0], duration: 500, scale: 0})
    .add({opacity: [0, 1], duration: 500, scale: 1})


// Wrapper for tiles

const wrapper = document.getElementById("tiles");

let columns = 0,
    rows = 0;

const colors = [
    "rgb(229, 57, 53)",
    "rgb(253, 216, 53)",
    "rgb(0, 150, 136)",
    "rgb(0, 188, 212)",
    "rgb(63, 81, 181)",
    "rgb(156, 39, 176)",
    "rgb(233, 30, 99)",
]

function animateEl(el, scale, duration, elasticity) {
    anime.remove(el);
    anime({
      targets: el,
      scale: scale,
      duration: duration,
      elasticity: elasticity
    });
  }

function enterEl(el, scale=0.85, duration=800, elasticity=0) {
    if (el.classList.contains('tile') && (count === -1)) {
        return
    }
    animateEl(el, scale, duration, elasticity);
}

function leaveEl(el, scale=0.95, duration=600, elasticity=0) {
    if (el.classList.contains('tile') && (count === -1)) {
        return
    }
    animateEl(el, scale, duration, elasticity);
}

let count = -1;
const handleOnClick = index => {
    if (count === -1){
        bg_delay = (columns * rows) * 5;
        bg_duration = (columns * rows) * 100;
    }
    else{
        bg_delay = (columns * rows);
        bg_duration = (columns * rows) * 50;
    }
    count = count + 1;
    anime({
        targets: ".tile",
        backgroundColor: colors[count % colors.length],
        keyframes: [
            {scale: 0.75},
            {scale: 0.95}   
        ],
        delay: anime.stagger(100, {
            grid: [columns, rows],
            from: index
        })
    });
}

// func to create single tile
const createTile = index => {
    const tile = document.createElement('div');

    tile.classList.add('tile');

    tile.onclick = e => handleOnClick(index);
    tile.addEventListener('mouseenter', function(e) {
        enterEl(e.currentTarget);
    });
    tile.addEventListener('mouseleave', function(e) {
        leaveEl(e.currentTarget);
    });

    return tile;
}

// Create multiple tiles using createTile()
const createTiles = quanity => {
    Array.from(Array(quanity)).map((tile, index) =>{
        wrapper.appendChild(createTile(index));
    });
}

createTiles(columns * rows);

// Resize function to recalc the columns and rows

const createGrid = () => {
    wrapper.innerHTML = '';

    columns = Math.floor(document.body.clientWidth / 100);
    rows = Math.floor(document.body.clientHeight / 100);

    wrapper.style.setProperty('--columns', columns);
    wrapper.style.setProperty('--rows', rows);

    createTiles(columns * rows);
}

// event listener for resize function


createGrid();
window.onresize = () => createGrid();

// Card animation

const waitForClick = (el) => anime({
      targets: el,
      scale: 1.25,
      duration: 5000,
        easing: 'cubicBezier(0.72,0,0.35,1.02)',
      direction: "alternate",
      loop: true
    });

let hue = 0;
function hueRotate(el, step){
    hue = (hue + step) % 360;
    anime({
        targets: el,
        filter: `hue-rotate(${hue}deg)`,
        duration:500,
        easing: 'cubicBezier(0.72,0,0.35,1.02)',
      });
}

let cardClickCount = 0;
let card = document.getElementById('circle');

waitForClick(card);

if (/Android|iPhone/i.test(navigator.userAgent)){

    card.addEventListener('touchstart', function(e) {
        animateEl(e.currentTarget, 0.75, 1000, 200);
        handleOnClick(Math.floor(((columns * rows) / 2)));
        cardClickCount += 1;
        countText.textContent = cardClickCount;
        header.restart();
        setTimeout(() => {
            countText.textContent = `${cardClickCount}`;
        }, 500);
        waitForClick.pause()

    });

    
    card.addEventListener('touchend', function(e) {
    
        animateEl(e.currentTarget, 1, 1000, 200);
    });
    
}

else{
    card.addEventListener('mouseenter', function(e) {
        enterEl(e.currentTarget, 2, 2000, 1000);
        waitForClick.pause()
    });
    card.addEventListener('mouseleave', function(e) {
        leaveEl(e.currentTarget, 1, 2000, 1000);
    });
    
    card.addEventListener('mousedown', function(e) {

        // animate the click to scale down
        animateEl(e.currentTarget, 1, 1000, 200);

        // animate the background
        handleOnClick('center');

        hueRotate(card, 30);
        cardClickCount += 1;
        header.restart();
        setTimeout(() => {
            countText.textContent = `${cardClickCount}`;
        }, 500);
        
        
    
        waitForClick.pause()
        
    });
    
    card.addEventListener('mouseup', function(e) {
    
        animateEl(e.currentTarget, 2, 1000, 200);
    });
}

