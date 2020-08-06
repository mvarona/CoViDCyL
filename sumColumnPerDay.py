import csv

# Constants and global variables:

# Functions:

def getColumnNumAndColumnDate():
	column = ""
	columnDate = ""

	print("Bienvenido a un sumador de columnas por día para un archivo CSV")
	column = int(input("Introduce el número de columna que quieres sumar (empezando a contar por 1): "))

	column = column - 1

	columnDate = int(input("Introduce el número de columna donde está la fecha (empezando a contar por 1): "))

	columnDate = columnDate - 1

	with open('tasa-enfermos-acumulados-por-areas-de-salud.csv') as csv_file:
		csv_reader = csv.reader(csv_file, delimiter=';')
		line_count = 0
		for row in csv_reader:
			if line_count == 0:
				print("La columna a sumar se llama: " + row[column])
				print("La columna donde está la fecha se llama: " + row[columnDate])
				return column, columnDate

def getSumPerDayForColumn(columnNum, columnDate):
	
	with open('tasa-enfermos-acumulados-por-areas-de-salud.csv') as csv_file:
		csv_reader = csv.reader(csv_file, delimiter=';')
		dates = [];
		total = [];
		i = 0
		print("FECHA,ACUMULADO")
		for row in csv_reader:
			if i == 0:
				i = i + 1
			else:
				date = row[columnDate]
				if (date not in dates):
					dates.append(date)
					if len(str(row[columnNum])) > 0:
						total.append(int(row[columnNum]))
					else:
						total.append(0)
				else:
					if len(str(row[columnNum])) > 0:
						total[dates.index(date)] = total[dates.index(date)] + int(row[columnNum])
					else:
						total[dates.index(date)] = total[dates.index(date)] + 0
					

				i = i + 1

		i = 0
		for date in dates:
			print(date + "," + str(total[i]))
			i = i + 1

# Entry point:

columnNum, columnDate = getColumnNumAndColumnDate()
getSumPerDayForColumn(columnNum, columnDate)