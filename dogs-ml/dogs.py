import tensorflow as tf
import json
import requests

url = "https://dog.ceo/api/breeds/list/all"

response = requests.get(url)

content = response.json()

json_string = json.dumps(content)

lista = json.loads(json_string)

lista1 = lista['message']
lista2 = []

for key, value in lista1.items():    
        if (value):
                for name_value in value:
                        lista2.append(key+'-'+name_value)
        else:
                lista2.append(key)

train_dir = "cachorros/treino/"
test_dir = "cachorros/teste/"

train_datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)
test_datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        classes=lista2
        )

validation_generator = test_datagen.flow_from_directory(
        test_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        classes=lista2
        )

tf.keras.backend.clear_session()

model = tf.keras.models.Sequential([
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(512, activation='relu'),
    tf.keras.layers.Dense(148, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

history = model.fit(validation_generator, epochs=20)

test_loss, test_acc = model.evaluate(validation_generator, verbose=1)

assetividade = "±{:.0f}%".format(test_acc*100)

print('Assertividade:', assetividade)

model.save("modelo_cachorro.h5")