from random import randint
from operator import itemgetter

def randomRepresentative(articles):
    return articles[randint(0, len(articles) - 1)]

def coreRepresentative(articles, coreSamples):
    coreClusterSamples = [i for i in articles if i in coreSamples ]
    return randomRepresentative(coreClusterSamples)

def combination(age, source, subjectivity, entities, facts):
    return age + source + subjectivity + entities + facts

#TODO
def featureScore(article):
    age = 11
    source = 0
    subjectivity = article.sentiment.subjectivity
    namedEntities = article.noun_phrases
    entities = 0.5
    facts = 0.5
    return combination(age, source, subjectivity, entities, facts)

def featureRepresentative(articles, documents):
    scores = {i: featureScore(documents[i]) for i in articles}
    return max(scores.iteritems(), key=itemgetter(1))[0] 

def tf(word, blob):
    return blob.words.count(word) / len(blob.words)

def n_containing(word, bloblist):
    return sum(1 for blob in bloblist if word in blob.words)

def idf(word, bloblist):
    return math.log(len(bloblist) / (1 + n_containing(word, bloblist)))

def tfidf(word, blob, bloblist):
    return tf(word, blob) * idf(word, bloblist)

def tfidfRepresentative(articles, documents):
    sums = {i: sum(list([tfidf(word, documents[i], documents) for word in documents[i].words])) for i in articles}
    return max(sums.iteritems(), key=itemgetter(1))[0]

