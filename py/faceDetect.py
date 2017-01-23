import cognitive_face as CF

KEY = '1721a8ea52674e3781a6e7602bb4648d'  # Replace with a valid Subscription Key here.
CF.Key.set(KEY)

img_url = 'http://animal-dream.com/data_images/face/face6.jpg'
result = CF.face.detect(img_url)
print result