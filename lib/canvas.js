const {
    createCanvas,
    loadImage,
    registerFont
} = require('canvas');
const Discord = require("discord.js");

/*registerFont('Ubuntu-Bold.tff', {
  family: 'Ubuntu'
});*/

function makeCanvas(w, h) {
    let canvas = createCanvas(w, h);
    let context = canvas.getContext("2d");
    return {
        canvas,
        context
    };
};

// A function that can mix two colors together.
let mixColors = function(colorA, colorB, amount) {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
    return '#' + r + g + b;
}

const drawings = (function() {
    // Draw a circle. Uses two circles instead of fill/stroke.
    function circle(ctx, x, y, rad, fill, stroke) {
        ctx.beginPath();
        ctx.arc(x, y, rad * 1.15, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = stroke;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
    };

    // The pretty text drawing function.
    function text(canvas, ctx, text, x, y, size, align, fill, stroke) {
        ctx.save();
        ctx.font = "bold " + size + "px Arial";
        let offX = align === "center" ? ctx.measureText(text).width / 2 : 0;
        let offY = ctx.measureText("M").width / 2;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = size / 10;
        ctx.strokeText(text, x - offX, y + offY);
        ctx.fillText(text, x - offX, y + offY);
        ctx.restore();
    };
    return {
        circle,
        text
    };
})();

function replaceAll(string, replace, replaceWith) {
    let output = "";
    for (let i = 0; i < string.length; i ++) {
        let char = string[i];
        if (char === replace) char = replaceWith;
        output += char;
    }
    return output;
}

const chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
function createCaptcha() {
    const {
        canvas,
        context
    } = makeCanvas(750, 100);
    const text = (() => {
        let characters = [];
        for (let i = 0; i < 5 + (Math.random() * 6 | 0); i ++) characters.push(chars[Math.random() * chars.length | 0]);
        let output = "";
        for (let character of characters) {
            output += character;
            for (let i = 0; i < Math.random() * 3; i ++) output += " ";
        }
        return output;
    })();
    const textWidth = context.measureText(text).width;
    context.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawings.text(canvas, context, text, canvas.width / 2, canvas.height / 2, 55, "center", "#FFFFFF", "#000000");
    for (let i = 0; i < Math.random() * 3 + 3; i ++) {
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(Math.random() * Math.PI * 2);
        context.beginPath();
        switch (Math.random() * 2 | 0) {
            case 0: {
                context.moveTo(-canvas.width / 2, 0);
                context.lineTo(canvas.width / 2, 0);
            } break;
            case 1: {
                context.moveTo(-canvas.width / 2, 0);
                for (let i = 0; i < canvas.width; i ++) {
                    context.lineTo(i, Math.cos(i) * (canvas.height / 3));
                }
            } break;
        }
        context.strokeStyle = Math.random() > 0.5 ? "#FFFFFF" : "#000000";
        context.stroke();
        context.closePath();
        context.restore();
    }
    return {
        text: replaceAll(text, " ", ""),
        image: new Discord.MessageAttachment(canvas.toBuffer(), "captcha.png")
    }
}

module.exports = {
  createCanvas: makeCanvas,
  drawings,
  createCaptcha,
  loadImage
};
