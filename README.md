# Web Bluetooth Heart Rate Demo

This is a demo of using the Web Bluetooth API to connect to a heart rate monitor and display the heart rate.

## What is the Web Bluetooth API?

The Web Bluetooth API is a new API that allows web pages to connect to Bluetooth devices. It is currently only supported by Chrome on desktop and Android.

## What is the Bluetooth LE Heart Rate Service?

The Bluetooth LE Heart Rate Service is a standard service that allows a heart rate monitor to send heart rate data to a connected device. It is supported by many heart rate monitors.

## Further Reading

- [Communicating with Bluetooth Devices over JavaScript](https://developer.chrome.com/articles/bluetooth/)
- [MDN - Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Web Bluetooth API](https://webbluetoothcg.github.io/web-bluetooth/)
- [Web Bluetooth Community Group](https://www.w3.org/community/web-bluetooth/)

## Requirements

1. A heart rate monitor that supports the Bluetooth LE Heart Rate Service
2. A browser that supports the Web Bluetooth API
3. A computer that supports Bluetooth LE

## Demo

1. Go to [https://web-bluetooth-heart-rate-demo.netlify.com/](https://web-bluetooth-heart-rate-demo.netlify.com/)
2. Click the "Connect" button
3. Select your heart rate monitor from the list
4. Click "Pair"
5. Your heart rate will be displayed

## Running Locally

1. Clone the repo
2. Run `yarn` to install dependencies
3. Run `yarn dev` to start the dev server
4. Open `http://localhost:3000` in your browser