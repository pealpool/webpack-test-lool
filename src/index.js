import helloWord from "./hello-word";
import imageSrc from "./assets/vuex.png";
import svgSrc from "./assets/BBQ.svg";
import exampleTxt from "./assets/example.txt";
import jpgMap from "./assets/v2-9d70674f9a56e6a2954f1d003cd93f21_720w.jpg";
import './style.css';
import './style.less';
import _ from "lodash";
import './async-module.js';

helloWord();

const img = document.createElement("img");
img.src = imageSrc;
document.body.appendChild(img);

const img2 = document.createElement("img");
img2.style.cssText = "width:600px;height:200px";
img2.src = svgSrc;
document.body.appendChild(img2);

const block = document.createElement("div");
block.textContent = exampleTxt;
document.body.appendChild(block);

const img3 = document.createElement("img");
img3.src = jpgMap;
document.body.appendChild(img3);

const span = document.createElement('span');
span.classList.add('icon');
span.innerHTML = '&#xe61e;';
document.body.appendChild(span);

console.log(_.join(['index','module','loaded!'],' '))