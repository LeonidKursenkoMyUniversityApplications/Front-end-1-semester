console.log("lr02");

// Конструктор матриці
function Matrix()
{
	this.data = new Array(3);
	for(let i = 0; i < this.data.length; i++)
	{
		this.data[i] = new Array(3).fill(0);
	}
}

// Заповнення матриці
Matrix.prototype.fill = function(matrix)
{
	for(let i = 0; i < this.data.length; i++)
	{
		for(let j = 0; j < this.data.length; j++)
		{
			this.data[i][j] = matrix[i][j];
		}
	}
}

// Множення двох матриць
Matrix.prototype.multiply = function(matrix2)
{
	let result = new Matrix();
	for(let i = 0; i < this.data.length; i++)
	{
		for(let j = 0; j < this.data.length; j++)
		{
			for(let k = 0; k < this.data.length; k++)
			{
				result.data[i][j] += this.data[i][k] * matrix2.data[k][j];
			}
			
		}
	}

	return result;
}

// Траспонування матриці
Matrix.prototype.transp = function()
{
	let result = new Matrix();
	for(let i = 0; i < this.data.length; i++)
	{
		for(let j = 0; j < this.data.length; j++)
		{
		    result.data[j][i] = this.data[i][j];
		}
	}

	return result;
}

// Визначник матриці
Matrix.prototype.det = function()
{
	let result = 0;
	result = this.data[0][0] * this.data[1][1] * this.data[2][2] +
	         this.data[0][1] * this.data[1][2] * this.data[2][0] +
	         this.data[0][2] * this.data[1][0] * this.data[2][1] -
	         this.data[2][0] * this.data[1][1] * this.data[0][2] -
	         this.data[2][1] * this.data[1][2] * this.data[0][0] -
	         this.data[2][2] * this.data[1][0] * this.data[0][1];

	return result;
}

// Знаходження максимального елемента матриці
Matrix.prototype.max = function()
{
	let result = this.data[0][0];
	for(let i = 0; i < this.data.length; i++)
	{
		for(let j = 0; j < this.data.length; j++)
		{
			if(result < this.data[i][j])
			{
				result = this.data[i][j];
			}
		}
	}
	return result;
}

// Форматований вивід матриці
Matrix.prototype.toString = function()
{
	let resultString = "";
	for(let i = 0; i < this.data.length; i++)
	{
		resultString += this.data[i].join(" ") + "\n";
	}
	return resultString;
}

// Перевірка рівності двох матриць
Matrix.prototype.equals = function(matrix2)
{
	for(let i = 0; i < this.data.length; i++)
	{
		for(let j = 0; j < this.data.length; j++)
		{
			if(this.data[i][j] !== matrix2.data[i][j])
			{
				return false;
			}
		}
	}
	return true;
}

// Перевірка ортогональності матриці
Matrix.prototype.isOrthogonality = function()
{
	// Одинична матриця
	let matrixE = new Matrix();
	matrixE.fill([
		[1,0,0],
		[0,1,0],
		[0,0,1]]);

	let result = matrix.multiply(matrix.transp());

	return result.equals(matrixE);
}


let matrix = new Matrix();
matrix.fill([
   [0,0,1],
   [1,0,0],
   [0,1,0]]);

console.log("A=");
console.log(matrix.toString());

console.log("AT=");
let transpMatrix = matrix.transp();
console.log(transpMatrix.toString());

console.log(`det(A)=${matrix.det()}`);

console.log(`max(A)=${matrix.max()}`);

console.log("A*AT=");
console.log(matrix.multiply(transpMatrix).toString());

console.log("A*AT=E");
let result = matrix.isOrthogonality() ? "Матриця ортогональна" : "Матриця неортогональна";
console.log(result);
