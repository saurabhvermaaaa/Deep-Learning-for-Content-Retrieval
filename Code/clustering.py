import matplotlib.pyplot as plt
import numpy
from sklearn.cluster import DBSCAN
from sklearn.cluster import AgglomerativeClustering
from sklearn.cluster import KMeans
from cluster import HierarchicalClustering
from sklearn import metrics
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import pairwise_distances
from sklearn.metrics.pairwise import cosine_similarity


def scoringClusters(labels_true, labels, data):
    # print("Homogeneity: %0.3f" % metrics.homogeneity_score(labels_true, labels))
    # print("Completeness: %0.3f" % metrics.completeness_score(labels_true, labels))
    # print("V-measure: %0.3f" % metrics.v_measure_score(labels_true, labels))
    # print("Adjusted Rand Index: %0.3f" % metrics.adjusted_rand_score(labels_true, labels))
    # print("Adjusted Mutual Information: %0.3f" % metrics.adjusted_mutual_info_score(labels_true, labels))
    # print("Silhouette Coefficient: %0.3f" % metrics.silhouette_score(X, labels))
    # print("Fowlkes-Mallows score: %0.3f" % metrics.fowlkes_mallows_score(labels_true, labels_pred))
    # print("Calinski-Harabaz index: %0.3f" % metrics.calinski_harabaz_score(X, labels))

    return [metrics.homogeneity_score(labels_true, labels), metrics.completeness_score(labels_true, labels),
            metrics.v_measure_score(labels_true, labels), metrics.adjusted_rand_score(labels_true, labels),
            metrics.adjusted_mutual_info_score(labels_true, labels), metrics.silhouette_score(data, labels),
            metrics.fowlkes_mallows_score(labels_true, labels), metrics.calinski_harabaz_score(data, labels)]

def dbscanClustering(data):
    model = DBSCAN(eps=1, min_samples=2, n_jobs=2)
    db = model.fit(data)
    return db.labels_, db.core_sample_indices_

def kMeansClustering(data, n_clusters):
    model = KMeans(init='k-means++', n_clusters=n_clusters, n_init=5)
    kmeans = model.fit(data)
    return kmeans.labels_

def agglomerativeCosineClustering(data, n_clusters):
    model = AgglomerativeClustering(n_clusters=n_clusters, linkage='average', connectivity=cosine_similarity)
    agglo = model.fit(data)
    return agglo.labels_

def dbscanCosineClustering(data):
    model = DBSCAN(eps=1, min_samples=2, n_jobs=2, metric=cosine_similarity)
    db = model.fit(data)
    return db.labels_, db.core_sample_indices_

def agglomerativeClustering(data, n_clusters):
    model = AgglomerativeClustering(n_clusters=n_clusters, linkage='average')
    agglo = model.fit(data)
    return agglo.labels_
