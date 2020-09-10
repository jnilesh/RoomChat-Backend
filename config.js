const pusher = new Pusher({
    appId: '1069706',
    key: '2dc823cb13284cd07f68',
    secret: 'aee7cf57ebe848b042c0',
    cluster: 'ap2',
    encrypted: true
  });

module.exports = pusher