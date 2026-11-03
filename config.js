// 公開する前に2つを入れる。どちらも秘密の値ではない（データはログイン確認を通った二人にしか返らない）
window.APP_CONFIG = {
  clientId: '255256101029-psteo07lj0sgva927hdh3c9niigfikea.apps.googleusercontent.com', // Google Cloud のクライアントID。DriveTracker と同じ値
  apiUrl: 'https://script.google.com/macros/s/AKfycbw6OHvvVJ1ohWPQ2kAUvNwTznXUqs3HkYWYRmSBydE7pPvCQskqDHxJjJKlVau4eFj3/exec' // Apps Script ウェブアプリのURL
};
