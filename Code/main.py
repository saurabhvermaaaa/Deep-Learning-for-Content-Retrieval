import gensim
import codecs
import os
import os.path
import pickle
import numpy
from time_logging import start, finish
from representation import getVector
from clustering import dbscanClustering, kMeansClustering, agglomerativeClustering, scoringClusters, agglomerativeCosineClustering, dbscanCosineClustering
from representative import coreRepresentative, tfidfRepresentative, featureRepresentative, randomRepresentative
from textblob import TextBlob
from SVM import svmRepresentative

#Load Pre-Trained Doc2Vec Model
path = "./apnews_dbow/doc2vec.bin"
dataset = "../Dataset/Data/"
n_clusters = 30
pickledump = "../Dataset/data.dump"
modeldump = "../Dataset/model.dump"

start("Loading Doc2Vec model")
if not os.path.isfile(modeldump):
    model = gensim.models.Doc2Vec.load(path)
    dump = open(modeldump, "w")
    pickle.dump(model, dump)
    dump.close()
else:
    dump = open(modeldump, "r")
    model = pickle.load(dump)
    dump.close()
finish("Doc2Vec model loaded.")

start("gathering data")
documents, trueLabels, topArticle = [], [], []

for topic in os.listdir(dataset):
    for file in os.listdir(dataset + topic):
        f = open(dataset + topic + '/' + file, 'r')
        text = f.read()
        f.close()
        
        documents.append(TextBlob(text))
        trueLabels.append(topic)
        topArticle.append(file == "1.txt")
finish("data loaded")

if not os.path.isfile(pickledump):
    start("Feature Extraction")
    data = [getVector(model, x) for x in documents]
    finish("Features extracted")

    dump = open(pickledump, "w")
    pickle.dump(data, dump)
    dump.close()
else:
    dump = open(pickledump, "r")
    data = pickle.load(dump)
    dump.close()


print numpy.linalg.norm(data[0] - data[3]), numpy.linalg.norm(data[0]), numpy.linalg.norm(data[3])
print numpy.linalg.norm(data[0] - data[2]), numpy.linalg.norm(data[0] - data[1]), numpy.linalg.norm(data[1] - data[2])

start("Events Clustering data")
coreLabels, coreSamples = dbscanClustering(data)
coreSamples = set(coreSamples)
finish("Events Clustering done.")

start("Representative Election")
clusters = set(coreLabels)
clustersCount = len(clusters) - (1 if -1 in coreLabels else 0)
print "coreLabels : ", coreLabels
print "Clusters : ", clusters
print "Number of Clusters formed : ", clustersCount

articles = [[] for i in xrange(clustersCount)]

for i in xrange(len(documents)):
    if(coreLabels[i] >= 0):
        articles[coreLabels[i]].append(i)

coreBest = [coreRepresentative(articles[i], coreSamples) for i in xrange(clustersCount)]
print coreBest
finish("Representative Election done.")

start("K Means Clustering")
kMeansLabels = kMeansClustering(data, n_clusters)
finish("K Means Clustering done.")

start("Agglomerative Clustering")
agglomerativeLabels = agglomerativeClustering(data, n_clusters)
finish("Agglomerative Clustering done.")

start("DBSCAN Cosine Clustering")
dbscanCosineLabels = dbscanCosineClustering(data)
print "dbscanCosineLabels", dbscanCosineLabels
finish("DBSCAN Cosine Clustering done.")

start("Agglomerative Cosine Clustering")
agglomerativeCosineLabels = agglomerativeCosineClustering(data, n_clusters)
finish("Agglomerative Cosine Clustering done.")

start("Compare Clustering algorithms.")
print scoringClusters(trueLabels, coreLabels, data)
print scoringClusters(trueLabels, kMeansLabels, data)
print scoringClusters(trueLabels, agglomerativeLabels, data)
#print scoringClusters(trueLabels, dbscanCosineLabels, data)
print scoringClusters(trueLabels, agglomerativeCosineLabels, data)
#TODO : Plot graphs
finish("Clustering comparison done.")

start("TF-IDF Election")
tfidfBest = [tfidfRepresentative(articles[i], documents) for i in xrange(clustersCount)]
print tfidfBest
finish("TF-IDF Election done.")

start("Random Election")
randomBest = [randomRepresentative(articles[i]) for i in xrange(clustersCount)]
print randomBest
finish("Random Election done.")

start("Bandari Election")
svmBest = [svmRepresentative(articles[i], documents) for i in xrange(clustersCount)]
print svmBest                                                                                                                                                                                                                                                                
finish("Bandari Election done")

start("Compare Representative Election")
print coreBest, tfidfBest, randomBest, svmBest
# rank from AG corpus
# factual density
# TODO
finish("Representative Election comparison done.")

