import numpy as np
import tensorflow as tf

img = tf.keras.preprocessing.image.load_img('cachorro.jpg', target_size=(224, 224))

img_array = tf.keras.preprocessing.image.img_to_array(img)

img_array = np.expand_dims(img_array, axis=0)

img_array /= 255.0

model = tf.keras.models.load_model('modelo_cachorro.h5')
prediction = model.predict(img_array)

prediction = prediction.flatten()

maior = 0
nome = ''

with open('classes.txt', 'r') as f:
    classes = [line.strip() for line in f.readlines()]

for i in range(len(prediction)):
    if prediction[i] > maior:
        nome = classes[i]
        maior = prediction[i]

print('Este é um(a):', nome)
print('Com probabilidade de: ±{:.2f}%'.format(maior * 100))
