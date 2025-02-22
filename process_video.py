from flask import Flask, request, jsonify
import cv2
import mediapipe as mp
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Folder to store screenshots
screenshot_folder = "screenshots"
os.makedirs(screenshot_folder, exist_ok=True)

def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)
    analysis_result = {"movements": [], "shots": [], "suggestions": []}
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            # Save screenshot for movement detection
            screenshot_path = os.path.join(screenshot_folder, f"frame_{frame_count}.jpg")
            cv2.imwrite(screenshot_path, frame)

            # Example: Detect jump (simple logic for now)
            analysis_result["movements"].append({
                "frame": frame_count,
                "movement": "Jump detected",
                "screenshot": f"http://localhost:5001/screenshots/{screenshot_filename}"
            })

            # Example: Classify shots (stub logic)
            if frame_count % 30 == 0:  # Every 30 frames (for demo)
                shot_type = np.random.choice(["Smash", "Drop", "Clear"])
                analysis_result["shots"].append({
                    "frame": frame_count,
                    "shot": shot_type,
                    "screenshot": screenshot_path
                })

                # Provide improvement suggestions
                if shot_type == "Smash":
                    analysis_result["suggestions"].append("Improve footwork before smashing.")
                elif shot_type == "Drop":
                    analysis_result["suggestions"].append("Follow through with wrist movement.")
                else:
                    analysis_result["suggestions"].append("Maintain a stable stance for better control.")

    cap.release()
    return analysis_result

@app.route("/process", methods=["POST"])
def process_video():
    data = request.json
    video_path = data.get("videoPath")
    
    if not video_path or not os.path.exists(video_path):
        return jsonify({"error": "Invalid video path"}), 400

    analysis = analyze_video(video_path)
    return jsonify(analysis)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
