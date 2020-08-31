import json

def checkIfNameHasArticle(name):
	if "(" in name:
		return True
	return False

def moveArticle(name):
	mainName = name.split(' (')[0]
	article = (name.split(' (')[1]).split(')')[0]
	return article + " " + mainName

def checkIfNameIsACapitalCity(name):
	capitalCities = ["LEON", "PALENCIA", "BURGOS", "SORIA", "SEGOVIA", "AVILA", "SALAMANCA", "ZAMORA", "VALLADOLID"];
	if name in capitalCities:
		return True
	return False

def saveJSONFromJSON():

	result = {}
	
	with open('tasa-enfermos-acumulados-por-areas-de-salud.json') as f:
		data = json.load(f)
	
	for item in data:

		if "/" in item["fields"]["municipio"]:

			municipios = item["fields"]["municipio"].split("/")

			for municipio in municipios:

				if (checkIfNameHasArticle(municipio)):
					municipio = moveArticle(municipio)

				if (checkIfNameIsACapitalCity(municipio)):
					municipio = item["fields"]["zbs_geo"]

				result[municipio] = {}
				result[municipio]["centro"] = item["fields"]["centro"]
				result[municipio]["gerencia"] = item["fields"]["gerencia"]
				result[municipio]["cs"] = item["fields"]["cs"]
				result[municipio]["zbs_geo"] = item["fields"]["zbs_geo"]

		else:

			municipio = item["fields"]["municipio"]

			if (checkIfNameHasArticle(municipio)):
					municipio = moveArticle(municipio)

			if (checkIfNameIsACapitalCity(municipio)):
					municipio = item["fields"]["zbs_geo"]

			result[municipio] = {}
			result[municipio]["centro"] = item["fields"]["centro"]
			result[municipio]["gerencia"] = item["fields"]["gerencia"]
			result[municipio]["cs"] = item["fields"]["cs"]
			result[municipio]["zbs_geo"] = item["fields"]["zbs_geo"]

	#with open('municipios.json', 'w') as fp:
	#	json.dump(result, fp)

def printFieldFromJSON():
	result = []
	
	with open('municipios.json') as f:
		data = json.load(f)
	
	for item in data:
		result.append(item)

	print(result)
	print(len(result))

#saveJSONFromJSON()

printFieldFromJSON()