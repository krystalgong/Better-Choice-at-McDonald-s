from flask import Flask, render_template, request, url_for, redirect
import pandas as pd
from pulp import *

app = Flask(__name__,static_url_path='')

@app.route('/')
def hello():
    return render_template('index_v3.html')

values = {'Fat': None,'Sodium': None,'Sugars': None,'Protein': None,'Carbohydrates': None}

@app.route('/recommendationforyou', methods=['POST']) 
def recommendationforyou():
    if request.form['Fat']:
        values['Fat'] = int(request.form['Fat'])
    else:
        values['Fat'] = 30
    if request.form['Sodium']:
        values['Sodium'] = int(request.form['Sodium'])
    else:
        values['Sodium'] = 495
    if request.form['Sugars']:
        values['Sugars'] = int(request.form['Sugars'])
    else:
        values['Sugars'] = 30
    if request.form['Protein']:
        values['Protein'] = int(request.form['Protein'])
    else:
        values['Protein'] = 13
    if request.form['Carbohydrates']:
        values['Carbohydrates'] = int(request.form['Carbohydrates'])
    else:
        values['Carbohydrates'] = 47

    return render_template('recommendation_v4.html', show=False)

@app.route('/recommendationresult', methods=['POST']) 
def recommendationresult():
    print(values)
    Breakfast = request.form.get('switch1')
    Beef_Pork = request.form.get('switch2')
    Chicken_Fish = request.form.get('switch3')
    Salads = request.form.get('switch4')
    Snacks_Sides = request.form.get('switch5')
    Desserts = request.form.get('switch6')
    Beverages = request.form.get('switch7')
    Coffee_Tea = request.form.get('switch8')
    SmoothiesShakes = request.form.get('switch9')

    category = {'Breakfast': Breakfast, 'Beef & Pork': Beef_Pork, 'Chicken & Fish': Chicken_Fish, 'Salads': Salads, 'Snacks & Sides': Snacks_Sides, \
            'Desserts': Desserts, 'Beverages': Beverages, 'Coffee & Tea': Coffee_Tea, 'Smoothies & Shakes': SmoothiesShakes}
    C = []
    for k, v in category.items():
        if v:
            C.append(k)
    McData = pd.read_csv("static/menu.csv")
    McData = McData[McData['Category'].isin(C)]

    #print(McData)

    # Convert the item names to a list
    MenuItems = McData.Item.tolist()

    BigCategory = McData.set_index('Item')['Category'].to_dict()

    print(BigCategory, type(BigCategory))

    # Convert all of the macro nutrients fields to be dictionaries of the item names
    Calories = McData.set_index('Item')['Calories'].to_dict()
    Fat = McData.set_index('Item')['Fat'].to_dict()
    Carbohydrates = McData.set_index('Item')['Carbohydrates'].to_dict()
    Sugars = McData.set_index('Item')['Sugars'].to_dict()
    Protein = McData.set_index('Item')['Protein'].to_dict()
    Sodium = McData.set_index('Item')['Sodium'].to_dict()


    # Set it up as a minimization problem
    prob = LpProblem("McOptimization Problem", LpMinimize)

    MenuItems_vars = LpVariable.dicts("MenuItems", MenuItems, lowBound=0, upBound=1, cat='Integer')

    # First entry is the calorie calculation (this is our objective)
    prob += lpSum([Calories[i]*MenuItems_vars[i] for i in MenuItems]), "Calories"
    # Fat must be <= 70 g
    prob += lpSum([Fat[i]*MenuItems_vars[i] for i in MenuItems]) <= (values['Fat']+40), "Fat"
    # Carbohydrates must be more than 260 g
    prob += lpSum([Carbohydrates[i]*MenuItems_vars[i] for i in MenuItems]) >= (values['Carbohydrates']+200), "Carbohydrates_lower"
    # Sugar between 80-100 g
    prob += lpSum([Sugars[i]*MenuItems_vars[i] for i in MenuItems]) >= (values['Sugars']+10), "Sugars_lower"
    prob += lpSum([Sugars[i]*MenuItems_vars[i] for i in MenuItems]) <= (values['Sugars']+30), "Sugars_upper"
    # Protein between 45-55g
    prob += lpSum([Protein[i]*MenuItems_vars[i] for i in MenuItems]) >= (values['Protein']+10), "Protein_lower"
    prob += lpSum([Protein[i]*MenuItems_vars[i] for i in MenuItems]) <= (values['Protein']+30), "Protein_upper"
    # Sodium <= 6000 mg
    prob += lpSum([Sodium[i]*MenuItems_vars[i] for i in MenuItems]) <= (values['Sodium']+4000), "Sodium"

    prob.writeLP("McOptimization.lp")
    prob.solve()
    # print(prob.constraints)
    print("Status:", LpStatus[prob.status])
    total_calories = value(prob.objective)

    # Get the total calories (minimized)
    print("Total Calories = ", total_calories)
    # Loop over the constraint set and get the final solution
    results = {}
    Items = 'name,parent\nMcDonald\'s,\nBreakfast,McDonald\'s\nBeef & Pork,McDonald\'s\nChicken & Fish,McDonald\'s\nSalads,McDonald\'s\nSnacks & Sides,McDonald\'s\nDesserts,McDonald\'s\nBeverages,McDonald\'s\nCoffee & Tea,McDonald\'s\nSmoothies & Shakes,McDonald\'s'
    results2 = []
    for constraint in prob.constraints:
        s = 0
        for var, coefficient in prob.constraints[constraint].items():
            if int(var.varValue) != 0 and constraint == 'Fat':
                r = str(var)[10:].replace('_',' ')
                Items += '\n'+r+','+BigCategory[r]
                results2.append(r)
            # print(var, var.varValue, coefficient)
            s += var.varValue * coefficient
        results[prob.constraints[constraint].name.replace('_lower','')
            .replace('_upper','')] = s
    print(results)
    print(Items)

    return render_template('recommendation_v4.html', show=True, len=len(Items), Items=Items, total_calories=total_calories, results=results,results2=results2)

if __name__ == "__main__":
	app.run(debug = True) #关键步骤，改成False后正常，修改html路径，无static前缀
