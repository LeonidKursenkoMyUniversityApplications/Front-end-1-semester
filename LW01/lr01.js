let matrixSizeRow = 9;
let matrixSizeColumn = 5;
let matrix = new Array(matrixSizeRow);
for(let i = 0; i < matrixSizeRow; i++)
{
	matrix[i] = new Array(matrixSizeColumn).fill(0);
}
let counter = 1;

let iterations = (matrixSizeColumn > matrixSizeRow) ? matrixSizeColumn : matrixSizeRow;

for(let j = 0; j < 2 * iterations; j++)
{	
    for(let i = 0; (matrixSizeRow - 1 - i >= 0) && (j - i >= 0); i++)
    {
    	if(j - i < matrixSizeColumn)
    	{
            matrix[matrixSizeRow - 1 - i][j - i] = counter++;
    	}
        
    }
    
}
console.log(matrix);
