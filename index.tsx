import './lib/sounds'; // start loading sounds immediately at bundle time
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import React from 'react';

// @ts-ignore
const ctx = require.context('./app');

function App() {
  return <ExpoRoot context={ctx} />;
}

renderRootComponent(App);
