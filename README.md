# Web Bluetooth Heart Rate Demo

This is a demo of using the Web Bluetooth API to connect to a heart rate monitor and display the heart rate.

## Further Reading

- [MDN - Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Communicating with Bluetooth Devices over JavaScript](https://developer.chrome.com/articles/bluetooth/)

## Requirements

- A heart rate monitor that supports the Bluetooth LE Heart Rate Service
- A browser that supports the Web Bluetooth API (currently only Chrome on desktop and Android)

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
