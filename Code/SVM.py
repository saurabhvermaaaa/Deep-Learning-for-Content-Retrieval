import os
import codecs
from sklearn import svm
from textblob import TextBlob

#Source Score
#Named Entities

def categoryScore(text, category='DEFAULT'):
    category = category.upper()
    tdensity = {"BLOGS":0.4, "WORLD NEWS":0.2, "TOP NEWS":0.2, "TECHNOLOGY":1, "BUSINESS":0.2, "SPORTS":0.05, "USA":0.05, "INDUSTRY":0.05, "POLITICS":0.1, "ENTERTAINMENT":0.1, "LIFE STYLE":0.2, "UNIVERSITIES":0.02, "JOBS":0.01, "SCIENCE":0.3, "MUSIC":0.3, "CELEBRITIES":0.2, "SOCIETY":0.15, "ART":0.35, "HEALTH":0.5, "HOBBIES":0.2, "VIDEO GAMES":0.1, "VIDEO":0.1, "EVENTS":0.05, "FUN STUFF":0.5, "PRODUCTS":0.15, "TRAVEL":0.18, "SHOPPING":0.1, "RELIGION":0.2, "PROGRAMMING":0.4, "COLUMNISTS":0.18, "DEFAULT":0.1}
    if category in tdensity:
        return tdensity[category]
    else:
        return tdensity["DEFAULT"]

def sourceScore(text):
    return 0.5

def subjectivity(text): 
    return text.sentiment.subjectivity

def namedEntities(text):
    return 0.5


dataset = "../Dataset/Data/"
X, Y = [], []

for topic in os.listdir(dataset):
    for file in os.listdir(dataset + topic):
        f = codecs.open(dataset + topic + '/' + file, 'r', 'utf-8')
        text = f.read()
        f.close()

        text = TextBlob(text)
        X.append([categoryScore(text), sourceScore(text), subjectivity(text), namedEntities(text)])
        Y.append(file == "1.txt")

clf = svm.SVC(C=1.0, cache_size=200, class_weight=None, coef0=0.0,
    decision_function_shape=None, degree=3, gamma='auto', kernel='rbf',
    max_iter=-1, probability=False, random_state=None, shrinking=True,
    tol=0.001, verbose=False)

clf.fit(X, Y) 

def svmRepresentative(articles, documents):
    importants = [article for article in articles if clf.predict([categoryScore(documents[article]), sourceScore(documents[article]), subjectivity(documents[article]), namedEntities(documents[article])]) > 0]
    if(importants):
        return randomRepresentative(importants)
    else:
        return randomRepresentative(articles)
