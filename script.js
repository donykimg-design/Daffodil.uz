const canvas = document.getElementById('nature-canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Butterfly {
    constructor() {
        this.resetPosition();
        this.size = Math.random() * 8 + 8; // Haqiqiy kapalak hajmi
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 1.5 + 0.5;
        this.flapSpeed = Math.random() * 0.4 + 0.2;
        this.flapPhase = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.5 + 0.5;

        // Qo'nish holati (maysalarga xos dam olish)
        this.isLanding = false;
        this.landTimer = 0;
    }

    resetPosition() {
        this.x = Math.random() * width;
        // Asosan pastki qism (0.4 dan pastda, romashkalarga yaqin)
        this.y = height * 0.45 + Math.random() * (height * 0.55);
    }

    update() {
        if (this.isLanding) {
            this.landTimer--;
            this.flapPhase += this.flapSpeed * 0.2; // Sekinlashtirilgan qoqish
            if (this.landTimer <= 0) {
                this.isLanding = false; // Yana uchadi
                this.angle = (Math.random() - 0.5) * Math.PI; // Tepa-past
            }
        } else {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.flapPhase += this.flapSpeed;

            // Silliq yo'nalish o'zgarishi
            this.angle += (Math.random() - 0.5) * 0.2;

            // Agar osmonga chiqa boshlasa, maysaga (pastga) qaytarish
            if (this.y < height * 0.4) {
                this.angle += 0.5;
            }

            // Tasodifan qo'nib olishi
            if (Math.random() < 0.005) {
                this.isLanding = true;
                this.landTimer = Math.random() * 100 + 50;
            }

            // Ekrandan chiqsa, ro'parasidan kiradi
            if (this.x > width + 50) this.x = -50;
            else if (this.x < -50) this.x = width + 50;

            if (this.y > height + 50) this.y = height * 0.45;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);

        let flapValue = Math.cos(this.flapPhase);
        let w = this.size * Math.max(0.1, Math.abs(flapValue));
        let h = this.size;

        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;

        // O'NG QANOT 
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.2);
        ctx.bezierCurveTo(w * 0.5, -h * 1.4, w * 2.0, -h * 1.4, w * 1.7, -h * 0.1);
        ctx.bezierCurveTo(w * 1.4, h * 0.3, w * 0.9, h * 0.3, w * 0.5, h * 0.3);
        ctx.bezierCurveTo(w * 1.1, h * 0.5, w * 1.1, h * 1.5, w * 0.6, h * 1.7);
        ctx.bezierCurveTo(w * 0.2, h * 1.6, w * 0.1, h * 1.0, 0, h * 0.6);
        ctx.fill();

        // CHAP QANOT
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.2);
        ctx.bezierCurveTo(-w * 0.5, -h * 1.4, -w * 2.0, -h * 1.4, -w * 1.7, -h * 0.1);
        ctx.bezierCurveTo(-w * 1.4, h * 0.3, -w * 0.9, h * 0.3, -w * 0.5, h * 0.3);
        ctx.bezierCurveTo(-w * 1.1, h * 0.5, -w * 1.1, h * 1.5, -w * 0.6, h * 1.7);
        ctx.bezierCurveTo(-w * 0.2, h * 1.6, -w * 0.1, h * 1.0, 0, h * 0.6);
        ctx.fill();

        // TANA
        ctx.beginPath();
        ctx.ellipse(0, h * 0.3, h * 0.15, h * 0.75, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 240, 255, ${this.opacity + 0.2})`;
        ctx.fill();

        // MO'YLOVLAR
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.4);
        ctx.quadraticCurveTo(h * 0.3, -h * 1.2, h * 0.6, -h * 1.0);
        ctx.moveTo(0, -h * 0.4);
        ctx.quadraticCurveTo(-h * 0.3, -h * 1.2, -h * 0.6, -h * 1.0);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
    }
}

let butterflies = [];

function initButterflies() {
    butterflies = [];
    const butterflyCount = (width * height) / 100000;
    for (let i = 0; i < butterflyCount; i++) {
        butterflies.push(new Butterfly());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < butterflies.length; i++) {
        butterflies[i].update();
        butterflies[i].draw();
    }
    requestAnimationFrame(animate);
}

initButterflies();
animate();
