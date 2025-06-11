import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { BottomBar } from '../components/BottomBar';

const { width, height } = Dimensions.get('window');


export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc);
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      );

      return () => {
        subscription.remove();
      };
    })();
  }, []);

  return (
    <>
      <View style={styles.container}>
        {region ? (
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation
            followsUserLocation
          >
            <Marker
              coordinate={{
                latitude: location!.coords.latitude,
                longitude: location!.coords.longitude,
              }}
              title="You are here"
              pinColor="blue"
            />
          </MapView>
        ) : errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : (
          <ActivityIndicator size="large" color="#1e90ff" />
        )}
      </View>
      <BottomBar active="location" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height - 100,
  },
  error: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});
