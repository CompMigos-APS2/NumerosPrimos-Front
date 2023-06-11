import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

const getResponseFromApi = async (value) => {
  try {
    let response = await fetch(
      `http://192.168.1.12:5000?key=${value}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
      }
    ).then((response) => response.json());
    return response;
  } catch (error) {
    console.error(error);
    console.log(error.message);
    if(error.message === 'Failed to fetch' || error.message === 'Network request failed') {
      alert('Failed to connect to the server');
      return null;
    }
    return value;
  }
};

export default function App() {
  const [value, setValue] = useState('');
  const [lastValue, setLastValue] = useState('');
  const [factors, setFactors] = useState(null);
  const [error, setError] = useState(false);
  const [unableToConnect, setUnableToConnect] = useState(false);

  const handlePress = () => {
    let response = getResponseFromApi(value);
    response.then((response) => {
      if(response === null) {
        setUnableToConnect(true);
        return;
      } else {
        setUnableToConnect(false);
      }

      if(response.factor1 && response.factor2) {
        setError(false);
        setLastValue(value);
        setFactors(response);
      } else if(response === value) {
        setLastValue(value);
        setError(true);
      }
    });
  };

  return (
    <View style={styles.background}>
      <Text style={styles.title}>RSA Decryption</Text>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type the number"
            style={[styles.input, { backgroundColor: '#F7E1AE' }]}
            value={value}
            onChangeText={(text) => setValue(text)}
            keyboardType="default"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePress} style={styles.button}>
            <Text style={styles.buttonText}>Find the two prime factors</Text>
          </TouchableOpacity>
        </View>
        {factors && !error && !unableToConnect && (
          <View style={styles.factorsContainer}>
            <Text style={styles.factorsText}>
              {lastValue} factors as {factors.factor1} * {factors.factor2}
            </Text>
          </View>
        )}
        {error && !unableToConnect && (
          <View style={styles.factorsContainer}>
            <Text style={styles.factorsText}>
              {lastValue} can't be factored into two prime numbers
            </Text>
          </View>
        )}
        {unableToConnect && (
          <View style={styles.factorsContainer}>
            <Text style={styles.factorsText}>
              Failed to connect to the server
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: '#617A55',
    textAlign: 'center',
    marginTop: 50,
  },
  background: {
    backgroundColor: '#FFF8D6',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    paddingBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8D6',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#617A55',
    color: 'white',
    fontSize: 20,
    padding: 10,
    paddingHorizontal: 15,
    margin: 10,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  factorsContainer: {
    backgroundColor: '#FFF8D6',
    padding: 10,
    borderRadius: 10,
  },
  factorsText: {
    fontSize: 18,
    borderRadius: 10,
    borderColor: '#ccc',
    color: '#000',
    textAlign: 'center',
  },
});
