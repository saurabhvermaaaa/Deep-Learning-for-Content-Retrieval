start_alpha=0.01
infer_epoch=1000

def getVector(model, text):
    return model.infer_vector(text, alpha=start_alpha, steps=infer_epoch)


