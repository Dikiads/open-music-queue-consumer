require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');
 
const init = async () => {
    
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  console.log('🔥 Menghubungkan ke RabbitMQ...');
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  console.log('✅ Terhubung ke RabbitMQ!');

  const channel = await connection.createChannel();
  await channel.assertQueue('export:playlist',{
    durable: true,
  });
  console.log('✅ Antrean export:playlist sudah siap!');

  channel.consume('export:playlist', (message) => listener.listen(message), { noAck: true });
  console.log('🔥 Menunggu pesan dari antrean...');
};
 
init();