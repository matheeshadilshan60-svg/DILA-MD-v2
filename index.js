// DILA-MD v2 - Built by 17 y/o Dilshan for Samsung Dream 🇰🇷
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')

async function startDilaMD() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    console.log('🚀 DILA-MD v2 Starting...')

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['DILA-MD v2 by Dilshan', 'Chrome', '2.0.0']
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('Connection closed. Reconnect කරන්නද:', shouldReconnect)
            if(shouldReconnect) startDilaMD()
        }
        else if(connection === 'open') {
            console.log('✅ DILA-MD v2 Connected! Bot by Dilshan 🇱🇰')
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message || m.key.fromMe) return

        const messageText = m.message.conversation || m.message.extendedTextMessage?.text || ''
        const from = m.key.remoteJid

        if (messageText === '.alive') {
            await sock.sendMessage(from, { text: '🤖 *DILA-MD v2 is Alive!*\n\n👑 Owner: Dilshan\n🇱🇰 Age: 17\n💙 Version: 2.0.0\n\n화이팅!' })
        }

        if (messageText === '.owner') {
            await sock.sendMessage(from, { text: '👑 *DILA-MD v2 Owner*\n\nName: Matheesha Dilshan\nAge: 17 Years Old\nFrom: Sri Lanka 🇱🇰\nGoal: Samsung Korea Engineer 🇰🇷\n\n*I Understand Every Line* 💯' })
        }

        if (messageText === '.menu') {
            await sock.sendMessage(from, { text: `🤖 *DILA-MD v2 Menu* 🤖\n\n.alive - Check Bot Status\n.owner - Owner Info\n.menu - Show This Menu\n\n*Built by 17 y/o for Samsung Dream* ❤️` })
        }
    })
}

startDilaMD()
