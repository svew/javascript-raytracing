
class MoveHandler {
	constructor() {
		this.move = {
			UP_SPEED: 0.01,
			RIGHT_SPEED: 0.03,
			FORWARD_SPEED: 0.03,
			up: 0,
			down: 0,
			left: 0,
			right: 0,
			forward: 0,
			back: 0
		}

		this.look = {
			UP_SPEED: 0.2,
			RIGHT_SPEED: 0.3,
			up: 0,
			down: 0,
			left: 0,
			right: 0,
		}
	}

	handleKeyDown(event) 
	{
		var ch = event.keyCode
		console.log("Key down: " + ch)
		switch(ch)
		{
			case 87: this.move.forward = 1;	break //w
			case 83: this.move.back = 1;	break //s
			case 65: this.move.right = 1;	break //a
			case 68: this.move.left = 1;	break //d
			case 69: this.move.up = 1;		break //e
			case 81: this.move.down = 1;	break //q

			case 38: this.look.up = 1;		break //up arrow
			case 40: this.look.down = 1;	break //down arrow
			case 37: this.look.right = 1;	break //left arrow
			case 39: this.look.left = 1;	break //right arrow

			default: return
		}
	}

	handleKeyUp(event) 
	{
		var ch = event.keyCode
		console.log("Key up: " + ch)
		switch(ch)
		{
			case 87: this.move.forward = 0;	break //w
			case 83: this.move.back = 0;	break //s
			case 65: this.move.right = 0;	break //a
			case 68: this.move.left = 0;	break //d
			case 69: this.move.up = 0;		break //e
			case 81: this.move.down = 0;	break //q

			case 38: this.look.up = 0;		break //up arrow
			case 40: this.look.down = 0;	break //down arrow
			case 37: this.look.right = 0;	break //left arrow
			case 39: this.look.left = 0;	break //right arrow

			default: return
		}
	}

	moveMatrix(matrix)
	{
		let moveUp = this.move.down - this.move.up
		let moveRight = this.move.right - this.move.left
		let moveForward = this.move.forward - this.move.back
		let lookUp = this.look.down - this.look.up
		let lookRight = this.look.left - this.look.right

		let move = new Matrix4().translate(
			moveRight * this.move.RIGHT_SPEED, 
			moveUp * this.move.UP_SPEED, 
			moveForward * this.move.FORWARD_SPEED)
		let look = new Matrix4()
		if(lookUp != 0)
			look = look.rotate(this.look.UP_SPEED, lookUp, 0, 0)
		if(lookRight != 0)
			look = look.rotate(this.look.RIGHT_SPEED, 0, lookRight, 0)

		return move.multiply(look).multiply(matrix)
	}
}