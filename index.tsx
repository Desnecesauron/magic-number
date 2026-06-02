import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';

// Required for Expo Router on SDK 54 with custom entry point.
// Using require.context instead of expo-router/entry avoids
// the @expo/metro-runtime 4.0.1 initialization crash on SDK 54.
// @ts-ignore
const ctx = require.context('./app');

function App() {
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
