// Genera los efectos de sonido (sintetizados, sin derechos de autor) en public/sfx/.
// Puedes reemplazar cualquiera por uno real (p. ej., de Pixabay) con el mismo nombre.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

mkdirSync("public/sfx", { recursive: true });
const SR = 48000;
const gen = (nombre, dur, expr, filtros = "") =>
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", `aevalsrc='${expr}':s=${SR}:d=${dur}`, ...(filtros ? ["-af", filtros] : []), "-ac", "2", "-b:a", "160k", `public/sfx/${nombre}.mp3`]);

// tic suave (aparición de tarjetas)
gen("tic", 0.12, "0.6*sin(2*PI*1500*t)*exp(-t*55)+0.25*(random(0)*2-1)*exp(-t*300)", "highpass=f=400,lowpass=f=6000");
// tic grave (tarjeta que se enciende)
gen("tic-grave", 0.18, "0.7*sin(2*PI*620*t)*exp(-t*35)+0.2*(random(0)*2-1)*exp(-t*250)", "lowpass=f=4000");
// papel deslizándose (cambio de escena)
gen("papel", 0.5, "(random(0)*2-1)*sin(PI*t/0.5)^2", "bandpass=f=3200:width_type=o:w=1.6,volume=0.9");
// sello de goma: golpe grave + chasquido
gen("sello", 0.55, "0.9*sin(2*PI*(70-30*t)*t)*exp(-t*9)+0.5*(random(0)*2-1)*exp(-t*90)", "lowpass=f=2500");
// grieta: chasquidos irregulares
gen("grieta", 0.35, "(random(0)*2-1)*(exp(-t*60)+0.8*exp(-abs(t-0.07)*90)+0.6*exp(-abs(t-0.16)*80)+0.4*exp(-abs(t-0.24)*80))", "bandpass=f=2500:width_type=o:w=2");
// rebobinado: barrido descendente con trémolo
gen("rebobinar", 0.8, "0.35*sin(2*PI*(900*t-450*t*t))*(0.6+0.4*sin(2*PI*22*t))*sin(PI*t/0.8)", "lowpass=f=3000");
// golpe grave (título, «No.»)
gen("golpe", 1.4, "0.9*sin(2*PI*(52-12*t)*t)*exp(-t*3.2)+0.15*(random(0)*2-1)*exp(-t*20)", "lowpass=f=900");
// ficha de dominó
gen("domino", 0.15, "0.7*(random(0)*2-1)*exp(-t*120)+0.4*sin(2*PI*900*t)*exp(-t*60)", "bandpass=f=1600:width_type=o:w=1.5");
console.log("Efectos generados en public/sfx/");
