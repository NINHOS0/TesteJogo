const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const pPlayer = document.querySelector(".pPos")

canvas.width = innerWidth
canvas.height = innerHeight

const gravity = 0.5

let Collisions = []
class createCollision {
    constructor(x, y, w, h) {
        this.position = {
            x: x,
            y: y
        }

        this.size = {
            width: w,
            height: h
        }
        Collisions.push(this);
        console.log(Collisions);
    }

    draw() {
        c.fillStyle = "#222"
        c.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }

    
}

new createCollision(500, 500, 50, 50)


class Player {
    constructor(x, y) {
        this.position = {
            x: x || 50,
            y: y || 50,
        }

        this.size = {
            width: 60,
            height: 100
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.controller = {
            movementSpeed: 5,
            jumpForce: 15,
            controllerState: {
                up: false,
                down: false,
                left: false,
                right: false
            },
            inGround: false,
            crounchSize: 70,
            isCrouched: false
        }

        this.initial = {
            size: {
                width: 60,
                height: 100
            }
        }
    }

    draw() {
        c.fillStyle = "#222"
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }

    update() {
        const pControl = this.controller //Controlador do jogador
        
        if (this.position.y + this.size.height + this.velocity.y > canvas.height) {
            pControl.inGround = true
        }
            
        
        // SISTEMA DE GRAVIDADE \\
        if (this.position.y + this.size.height > canvas.height) {
            pControl.inGround = true
        } else {
            pControl.inGround = false
        }

        // SISTEMA DE PULAR \\
        if (pControl.controllerState.up && pControl.inGround) {
            this.velocity.y -= pControl.jumpForce
            pControl.inGround = false
        }

        // SISTEMA DE AGACHAR \\
        if (pControl.controllerState.down && !pControl.isCrouched) {
            this.size.height = pControl.crounchSize
            this.position.y += this.initial.size.height - pControl.crounchSize
            pControl.isCrouched = true
        } else if(!pControl.controllerState.down && pControl.isCrouched) {
            this.size.height = this.initial.size.height
            this.position.y -= this.initial.size.height - pControl.crounchSize
            pControl.isCrouched = false
        }
        
        // SISTEMA DE MOVIMENTO HORIZONTAL \\
        if (pControl.controllerState.left && this.position.x + this.velocity.x > 0) {
            this.velocity.x = -pControl.movementSpeed
        } else if (pControl.controllerState.right && this.position.x + this.size.width + this.velocity.x <= canvas.width) {
            this.velocity.x = pControl.movementSpeed
        } else {
            this.velocity.x = 0
        }

        pPlayer.innerText = `
        X: ${this.position.x} / ${this.size.width+this.position.x}
        Y: ${this.position.y} / ${this.size.width+this.position.y}
        vX: ${this.velocity.x}
        vY: ${this.velocity.y}`

        
        
        let i = 0
        while (i <= Collisions.length-1) {
            const col = Collisions[i]
            
            i++
        }

        if (pControl.inGround) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }

        // RESPONSÁVEL PELA MOVIMENTAÇÃO \\
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
    }
}

const player = new Player(20, 50)
animate()

function animate () {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    player.draw()
    Collisions.forEach(col => {
        col.draw()
    });
}

// ESTADO DO CONTROLADOR DO JOGADOR \\
window.addEventListener("keydown", ({ keyCode }) => {
    const playerControl = player.controller.controllerState
    switch (keyCode) {
        case 87: playerControl.up = true
        break;
        case 83: playerControl.down = true
        break;
        case 65: playerControl.left = true
        break;
        case 68: playerControl.right = true
        break;
        default:
        break;
    }
})
window.addEventListener("keyup", ({ keyCode }) => {
    const playerControl = player.controller.controllerState
    // console.log(keyCode);
    switch (keyCode) {
        case 87: playerControl.up = false
        break;
        case 83: playerControl.down = false
        break;
        case 65: playerControl.left = false
        break;
        case 68: playerControl.right = false
        break;
        default:
        break;
    }
})