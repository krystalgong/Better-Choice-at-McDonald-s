from flask import Flask, render_template, request, url_for, redirect

app = Flask(__name__,static_url_path='')

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/recommendationforyou', methods=['POST']) 
def recommendationforyou():
    return render_template('recommendation.html', show=False)

@app.route('/recommendationresult', methods=['POST']) 
def recommendationresult():
    
    return render_template('recommendation.html', show=True)

if __name__ == "__main__":
	app.run(debug = False) #关键步骤，改成False后正常，修改html路径，无static前缀