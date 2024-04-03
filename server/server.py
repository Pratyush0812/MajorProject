import asyncio
import websockets
from scipy.spatial import distance as dist
from imutils.video import VideoStream
from imutils import face_utils
import numpy as np
import argparse
import imutils
import time
import dlib
import cv2

# Define eye aspect ratio, yawning, and eye closed thresholds
EYE_AR_THRESH = 0.35
EYE_AR_CONSEC_FRAMES = 30
YAWN_THRESH = 20
EYE_CLOSED_DURATION_THRESH = 70  # Adjust this threshold as needed

# Initialize variables
alarm_status = False
alarm_status2 = False
alarm_status3 = False
saying = False
duration = 0.008

# Function to trigger alarm
# def alarm(msg):
#     global alarm_status
#     global alarm_status2
#     global alarm_status3
#     global saying
#
#     while alarm_status:
#         print('call')
#         s = 'espeak "' + msg + '"'
#         os.system(s)
#
#     while alarm_status3:
#         print('call')
#         s = 'espeak "' + msg + '"'
#         os.system(s)
#
#     if alarm_status2:
#         print('call')
#         saying = True
#         s = 'espeak "' + msg + '"'
#         os.system(s)
#         saying = False


# Function to calculate eye aspect ratio
def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])

    ear = (A + B) / (2.0 * C)
    return ear


# Function to calculate combined eye aspect ratio
def final_ear(shape):
    (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

    leftEye = shape[lStart:lEnd]
    rightEye = shape[rStart:rEnd]

    leftEAR = eye_aspect_ratio(leftEye)
    rightEAR = eye_aspect_ratio(rightEye)

    ear = (leftEAR + rightEAR) / 2.0
    return (ear, leftEye, rightEye)


# Function to calculate lip distance
def lip_distance(shape):
    top_lip = shape[50:53]
    top_lip = np.concatenate((top_lip, shape[61:64]))

    low_lip = shape[56:59]
    low_lip = np.concatenate((low_lip, shape[65:68]))

    top_mean = np.mean(top_lip, axis=0)
    low_mean = np.mean(low_lip, axis=0)

    distance = abs(top_mean[1] - low_mean[1])
    return distance

# Parse command-line arguments
ap = argparse.ArgumentParser()
ap.add_argument("-w", "--webcam", type=int, default=0,
                help="index of webcam on system")
args = vars(ap.parse_args())

print("-> Loading the predictor and detector...")
detector = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")  # Faster but less accurate
predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')




async def handle_connection(websocket, path):
    print("Client connected.")
    print("-> Starting Video Stream")
    vs = VideoStream(src=args["webcam"]).start()
    counter = 0
    await asyncio.sleep(8)
    print("-> Starting Video Stream2")
    ind = 0
    try:
        while True:
            frame = vs.read()
            frame = imutils.resize(frame, width=450)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            rects = detector.detectMultiScale(gray, scaleFactor=1.1,
                                              minNeighbors=5, minSize=(30, 30),
                                              flags=cv2.CASCADE_SCALE_IMAGE)

            for (x, y, w, h) in rects:
                rect = dlib.rectangle(int(x), int(y), int(x + w), int(y + h))

                shape = predictor(gray, rect)
                shape = face_utils.shape_to_np(shape)

                eye = final_ear(shape)
                ear = eye[0]
                leftEye = eye[1]
                rightEye = eye[2]

                distance = lip_distance(shape)

                leftEyeHull = cv2.convexHull(leftEye)
                rightEyeHull = cv2.convexHull(rightEye)
                cv2.drawContours(frame, [leftEyeHull], -1, (0, 255, 0), 1)
                cv2.drawContours(frame, [rightEyeHull], -1, (0, 255, 0), 1)

                lip = shape[48:60]
                cv2.drawContours(frame, [lip], -1, (0, 255, 0), 1)

                # Check for drowsiness
                if ear < EYE_AR_THRESH:
                    counter += 1

                    # Check if eyes are closed for a prolonged duration
                    if counter >= EYE_CLOSED_DURATION_THRESH:
                        if websocket.open:
                            await websocket.send("warning" + str(21))
                        else:
                            ind = 1
                            break  # Exit the loop if the connection is closed
                        await asyncio.sleep(10)
                        cv2.putText(frame, "Emergency Situation!", (10, 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

                    # Check for consecutive frames below eye aspect ratio threshold
                    # elif counter >= EYE_AR_CONSEC_FRAMES:
                    #     if websocket.open:
                    #         await websocket.send("warning" + str(9))
                    #     else:
                    #         break  # Exit the loop if the connection is closed
                    #
                    #     cv2.putText(frame, "DROWSINESS ALERT!", (10, 30),
                    #                 cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

                else:
                    counter = 0

                # Check for yawning
                if distance > YAWN_THRESH:
                    cv2.putText(frame, "Yawn Alert", (10, 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                    if websocket.open:
                        await websocket.send("warning" + str(9))
                    else:
                        ind = 1
                        break  # Exit the loop if the connection is closed
                    await asyncio.sleep(12)

                cv2.putText(frame, "EAR: {:.2f}".format(ear), (300, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                cv2.putText(frame, "YAWN: {:.2f}".format(distance), (300, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.imshow("Frame", frame)
            if websocket.open:
                continue
            else:
                break





    finally:
        cv2.destroyAllWindows()
        vs.stop()
        print("Client disconnected.")

start_server = websockets.serve(handle_connection, "0.0.0.0", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
