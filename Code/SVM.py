import os
from sklearn import svm
from textblob import TextBlob

#Category score
#Subjectivity
#Source Score
#Named Entities
#SVM

def categoryScore(text):
    return 0.5

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
        f = open(dataset + topic + '/' + file, 'r')
        text = f.read().encode('utf-8')
        print text
        text = TextBlob(text)
        f.close()
        X.append([categoryScore(text), sourceScore(text), subjectivity(text), namedEntities(text)])
        Y.append(file == "1.txt")

clf = svm.SVC(C=1.0, cache_size=200, class_weight=None, coef0=0.0,
    decision_function_shape=None, degree=3, gamma='auto', kernel='rbf',
    max_iter=-1, probability=False, random_state=None, shrinking=True,
    tol=0.001, verbose=False)

clf.fit(X, Y) 

def svmRepresentatove(articles, documents):
    importants = [article for article in articles if clf.predict([categoryScore(documents[article]), sourceScore(documents[article]), subjectivity(documents[article]), namedEntities(documents[article])]) > 0]
    if(importants):
        return randomRepresentative(importants)
    else:
        return randomRepresentative(articles)
