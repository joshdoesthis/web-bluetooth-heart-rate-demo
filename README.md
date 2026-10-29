# Web Bluetooth Heart Rate Demo

This is a demo of the Web Bluetooth API that connects to a heart rate monitor and displays the heart rate. It is currently only supported in Chrome on desktop and Android.

## Further Reading

- [MDN - Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Communicating with Bluetooth Devices over JavaScript](https://developer.chrome.com/articles/bluetooth/)

## Requirements

- A heart rate monitor that supports the Bluetooth LE Heart Rate Service
- A browser that supports the Web Bluetooth API (currently only Chrome on desktop and Android)

## Demo

1. Go to [https://web-bluetooth-heart-rate-demo.joshdoesthis.com/](https://web-bluetooth-heart-rate-demo.joshdoesthis.com/)
2. Click the "Connect" button
3. Select your heart rate monitor from the list
4. Click "Pair"
5. Your heart rate will be displayed

## Running Locally

You'll need Node.js 20.19 or later.

1. Clone the repo
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the dev server
4. Open `http://localhost:3000` in your browser

In a browser without Web Bluetooth, the demo shows simulated heart rate data instead.
