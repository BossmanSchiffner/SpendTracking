import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBTZULlGjXGx1vNYWuFrQDPicD_ly5IM5k',
  authDomain: 'money-25974.firebaseapp.com',
  projectId: 'money-25974',
  storageBucket: 'money-25974.firebasestorage.app',
  messagingSenderId: '140445094035',
  appId: '1:140445094035:web:5bedbc04f80dc37022fd66'
};

export { firebaseConfig };
export const firebaseApp = initializeApp(firebaseConfig);
