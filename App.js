import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [smilingData, setSmilingData] = useState([]);
  const [rightEyeOpenData, setRightEyeOpenData] = useState([]);
  const [leftEyeOpenData, setLeftEyeOpenData] = useState([]);

  const handleFacesDetected = ({ faces }) => {
    faces.map((face) => {
      const smiling = face.smilingProbability > 0.7;
      const rightEyeOpen = face.rightEyeOpenProbability > 0.4;
      const leftEyeOpen = face.leftEyeOpenProbability > 0.4;
      setSmilingData(smiling);
      setRightEyeOpenData(rightEyeOpen);
      setLeftEyeOpenData(leftEyeOpen);
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: false,
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.textInfo}>Smile {smilingData.toString()}</Text>
          <Text style={styles.textInfo}>
            Left eye open {leftEyeOpenData.toString()}
          </Text>
          <Text style={styles.textInfo}>
            Right eye open {rightEyeOpenData.toString()}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.text}>
              <MaterialIcons
                name="flip-camera-android"
                size={40}
                color="#FFF"
              />
            </Text>
            <Text style={styles.text}>Flip camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  textContainer: {
    marginTop: 30,
    marginLeft: 20,
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  textInfo: {
    fontSize: 18,
    color: "#00C897",
  },
});
