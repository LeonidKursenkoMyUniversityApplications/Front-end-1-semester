let arrayOfStrings = ["hello", "help", "exit"];
//let str = "hello";
//console.log(str);

function task(item)
{
	let letters =  item.split('');
	
	for(let i = 0; i < letters.length; i++)
	{
	   if(i % 2 == 0)
	   {
		   letters[i] = letters[i].toUpperCase();
	   }
    }
	item = letters.join('');
	console.log(item);
	return item;
}

arrayOfStrings =  arrayOfStrings.map(task);

console.log(arrayOfStrings);
