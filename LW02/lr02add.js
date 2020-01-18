function Triangle(x1, y1, x2, y2, x3, y3)
{
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.x3 = x3;
	this.y3 = y3;
}

Triangle.prototype.area = function()
{
	let a = this.line(this.x1, this.y1, this.x2, this.y2);
	let b = this.line(this.x1, this.y1, this.x3, this.y3);
	let c = this.line(this.x3, this.y3, this.x2, this.y2);

	let p = (a + b + c) / 2;
	let s = Math.sqrt(p * (p - a) * (p - b) * (p - c));
	return s;
}

Triangle.prototype.line =  function(x1, y1, x2, y2)
{
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

let tr = new Triangle(0, 0 , 5, 0, 0, 5);
console.log(tr.area());


