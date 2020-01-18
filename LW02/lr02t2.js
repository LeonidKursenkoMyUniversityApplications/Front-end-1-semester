function getPi(method)
{
	var currentPi;
	// my code
	function information ()
	{
		switch(method)
		{
			case 1 : return "Метод на основі формули Валіса";
			case 2 : return "Метод на основі формули множення 8";
			case 3 : return "Метод на основі метода Монте-Карло";
		}
	}

	// Метод обчислення числа пі
	information.compute = function()
	{
		// Метод на основі формули Валіса
		function valis()
		{
			//let pi = 2;
			setStartPi(2);
			for(let i = 2; i < 1000; i += 2)
			{
				currentPi *= i / (i - 1) * i / (i + 1);
			}
			return currentPi;
		}

		// Метод на основі формули множення 8
		function multiply8()
		{
			//let pi = 1;
			setStartPi(1);
			for(let i = 1; i < 1000; i++)
			{
				currentPi *= (i*i + i) / (i*i + i + 2/9);
			}
			currentPi *= 9/2 * Math.sqrt(3)/2;
			return currentPi;
		}

		// Метод на основі метода Монте-Карло
		function monteKarlo()
		{
			//let pi = 0;
			setStartPi(0);
			let n = 10000000;
			let nIn = 0;
			let x = 0;
			let y = 0;
			let r = 0.5;
			for(let i = 0; i < n; i++)
			{
				x = Math.random(0, 1);
				y = Math.random(0, 1);  
				if(((x-r)*(x-r) + (y-r)*(y-r)) <= r * r)
				{
					nIn++;
				}
			}
			currentPi = 4 * nIn / n;
			return currentPi;
		}

		switch(method)
		{
			case 1 : return valis();
			case 2 : return multiply8();
			case 3 : return monteKarlo();
		}
	}

	// Метод очистки пі
	function clear()
	{
		currentPi = 0;
	}

	// Метод задання початкового пі
	function setStartPi(value)
	{
		currentPi = value;
	}

	return information;
}

method1 = getPi(1);
method2 = getPi(2);
method3 = getPi(3);

print(method1());
print(method2());
print(method3());

print(method1.compute());
print(method2.compute());
print(method3.compute());

function print(data)
{
	console.log(data);
}